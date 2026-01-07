const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()
const sample = require("./sample.json")

async function main() {
  // 清空现有数据以避免唯一约束冲突
  await prisma.link.deleteMany({});
  await prisma.category.deleteMany({});

  for (const category of sample) {
    const { id, icon, title, description, rank, links = [] } = category
    const data = {
      // 移除手动提供的 id，让 Prisma 自动生成
      icon,
      title,
      description,
      rank,
      links: {
        create: links.map(link => ({
          ...link,
          is_crawled: true
          // cid 会通过关系自动设置
        })),
      },
    }
    
    await prisma.category.create({
      data,
    })
  }
  
  console.log("Seed data inserted successfully!")
}

main().catch((err) => {
  console.warn("Error While generating Seed: \n", err)
})