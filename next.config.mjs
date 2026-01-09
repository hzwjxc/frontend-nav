/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    appDir: true,
    serverComponentsExternalPackages: [
      "puppeteer-core",
      "chrome-aws-lambda",
    ],
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.ignoreWarnings = [
        ...(config.ignoreWarnings || []),
        { module: /chrome-aws-lambda/ },
      ]
    }
    config.module.rules.push({
      test: /\.map$/,
      use: "ignore-loader",
    })
    return config
  },
  images: {
    domains: [
      "cos.codefe.top",
      "webnav-cdn.codefe.top",
      "frontend-nav-umber.vercel.app",
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.github.com",
      },
      {
        protocol: "https",
        hostname: "*.google.com",
      },
      {
        protocol: "https",
        hostname: "*.bing.com",
      },
      {
        protocol: "https",
        hostname: "*.sogou.com",
      },
      {
        protocol: "https",
        hostname: "*.360.cn",
      },
      {
        protocol: "https",
        hostname: "*.zhihu.com",
      },
      {
        protocol: "https",
        hostname: "*.weibo.com",
      },
      {
        protocol: "https",
        hostname: "*.qq.com",
      },
      {
        protocol: "https",
        hostname: "*.baidu.com",
      },
      {
        protocol: "https",
        hostname: "*.taobao.com",
      },
      {
        protocol: "https",
        hostname: "*.jd.com",
      },
      {
        protocol: "https",
        hostname: "*.alipay.com",
      },
      {
        protocol: "https",
        hostname: "*.alicdn.com",
      },
      {
        protocol: "https",
        hostname: "*.aliyun.com",
      },
      {
        protocol: "https",
        hostname: "*.toutiao.com",
      },
      {
        protocol: "https",
        hostname: "*.bytedance.com",
      },
      {
        protocol: "https",
        hostname: "*.tencent.com",
      },
      {
        protocol: "https",
        hostname: "*.wechat.com",
      },
      {
        protocol: "https",
        hostname: "*.x.com",
      },
      {
        protocol: "https",
        hostname: "*.twitter.com",
      },
      {
        protocol: "https",
        hostname: "*.facebook.com",
      },
      {
        protocol: "https",
        hostname: "*.instagram.com",
      },
      {
        protocol: "https",
        hostname: "*.linkedin.com",
      },
      {
        protocol: "https",
        hostname: "*.youtube.com",
      },
      {
        protocol: "https",
        hostname: "*.amazon.com",
      },
      {
        protocol: "https",
        hostname: "*.apple.com",
      },
      {
        protocol: "https",
        hostname: "*.microsoft.com",
      },
      {
        protocol: "https",
        hostname: "*.adobe.com",
      },
      {
        protocol: "https",
        hostname: "*.stackoverflow.com",
      },
      {
        protocol: "https",
        hostname: "*.wikipedia.org",
      },
      {
        protocol: "https",
        hostname: "*.reddit.com",
      },
      {
        protocol: "https",
        hostname: "*.netflix.com",
      },
      {
        protocol: "https",
        hostname: "*.openai.com",
      },
      {
        protocol: "https",
        hostname: "cos.codefe.top",
      },
      {
        protocol: "https",
        hostname: "webnav-cdn.codefe.top",
      },
      {
        protocol: "https",
        hostname: "frontend-nav-umber.vercel.app",
      },
      {
        protocol: "https",
        hostname: "*.r2.dev",
      },
    ],
    unoptimized: true,
  },
}

export default nextConfig
