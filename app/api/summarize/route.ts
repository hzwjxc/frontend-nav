import { NextResponse } from "next/server"
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3"

import { extractWebsiteInfo, isValidUrl } from "../screenshot/route"

const slugify = require("slugify")

// 使用AWS SDK配置R2客户端
const r2 = new S3Client({
  region: "auto", // R2使用"auto"区域
  endpoint: process.env.R2_ENDPOINT!, // Cloudflare R2端点
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
})

export const maxDuration = 60

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const url = searchParams.get("url")
  if (!url || !isValidUrl(url)) {
    return NextResponse.json(
      { error: "Missing url parameter or url is invalid format" },
      { status: 400 }
    )
  }

  const [response, urlRes] = await Promise.all([
    fetch("https://api.coze.cn/v1/workflow/run", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.COZE_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        workflow_id: process.env.COZE_BOT_ID,
        parameters: {
          url: url,
        },
      }),
    }),
    extractWebsiteInfo(url),
  ])

  if (!response.ok) {
    console.error("Coze API error:", response.status, response.statusText)
    return NextResponse.json(
      { error: "Failed to fetch website summary from Coze API" },
      { status: 400 }
    )
  }

  const response1 = await response.json()
  const data = JSON.parse(response1.data)
  const result = {
    messages: [
      {
        type: "answer",
        content: JSON.stringify({
          title: data.output.title,
          description: data.output.description,
          keywords: ["模拟", "示例", "演示", "网站"],
          category: "工具",
        }),
      },
    ],
  }

  const answerChoice = result.messages.find((m: any) => m.type === "answer")
  const content = answerChoice!.content.replace(/\```(json)?/g, "")
  let res: any = {}
  try {
    res = JSON.parse(content)
    const { screenshot, meta } = urlRes!
    const filename = `${slugify(url)}.png`

    // 验证必要的环境变量是否存在
    if (!process.env.R2_BUCKET_NAME) {
      throw new Error("Missing R2_BUCKET_NAME environment variable")
    }

    const uploadParams = {
      Bucket: process.env.R2_BUCKET_NAME,
      Key: filename,
      Body: screenshot,
      ContentType: "image/png",
      CacheControl: "max-age=31536000", // 设置缓存一年
    }

    // 使用R2上传
    await r2.send(new PutObjectCommand(uploadParams))

    res.screenshot_url = `${process.env.R2_PUBLIC_DOMAIN}/${filename}`
    res.icon = meta.icon
    return NextResponse.json(res)
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json(
      { error: "Failed to process website information" },
      { status: 400 }
    )
  }
}
