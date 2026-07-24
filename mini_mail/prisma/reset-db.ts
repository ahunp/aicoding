import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";
import * as readline from "readline";

const prisma = new PrismaClient();

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

async function main() {
  console.log("⚠️  危险操作：此脚本将清空所有用户、订单、商品、分类数据！\n");

  const answer = await new Promise<string>((resolve) => {
    rl.question('请输入 yes 确认清空数据库（输入其他任意内容取消）: ', resolve);
  });
  rl.close();

  if (answer !== "yes") {
    console.log("❌ 已取消，数据库未做任何更改。");
    return;
  }

  console.log("\n⏳ 开始清空数据库...\n");

  // Clean existing data
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  // Admin user
  const adminPw = await hash("admin123", 12);
  await prisma.user.create({
    data: { name: "管理员", email: "admin@minimall.com", password: adminPw, role: "ADMIN" },
  });

  // Test user
  const userPw = await hash("123456", 12);
  await prisma.user.create({
    data: { name: "测试用户", email: "user@test.com", password: userPw },
  });

  // Categories
  const categories = await Promise.all([
    prisma.category.create({ data: { name: "电子产品", description: "数码产品、配件等" } }),
    prisma.category.create({ data: { name: "服装鞋帽", description: "衣服、鞋子、配饰" } }),
    prisma.category.create({ data: { name: "家居生活", description: "家居日用、收纳" } }),
    prisma.category.create({ data: { name: "食品饮料", description: "零食、饮品、特产" } }),
    prisma.category.create({ data: { name: "图书文具", description: "书籍、文具、办公" } }),
  ]);

  // Products with real Unsplash image URLs
  const products = [
    { name: "无线蓝牙耳机", price: 299, stock: 50, cat: 0 },
    { name: "手机充电宝 20000mAh", price: 129, stock: 100, cat: 0 },
    { name: "机械键盘 青轴", price: 399, stock: 30, cat: 0 },
    { name: "简约纯棉T恤", price: 79, stock: 200, cat: 1 },
    { name: "休闲运动鞋", price: 259, stock: 80, cat: 1 },
    { name: "羊毛围巾", price: 159, stock: 60, cat: 1 },
    { name: "北欧风台灯", price: 189, stock: 40, cat: 2 },
    { name: "陶瓷咖啡杯套装", price: 99, stock: 120, cat: 2 },
    { name: "收纳盒三件套", price: 49, stock: 150, cat: 2 },
    { name: "坚果礼盒 500g", price: 69, stock: 90, cat: 3 },
    { name: "有机绿茶 200g", price: 89, stock: 70, cat: 3 },
    { name: "黑巧克力 72%", price: 39, stock: 180, cat: 3 },
    { name: "深入理解计算机系统", price: 139, stock: 45, cat: 4 },
    { name: "精装笔记本 A5", price: 29, stock: 300, cat: 4 },
    { name: "简约桌面收纳笔筒", price: 25, stock: 200, cat: 4 },
  ];

  // 会员专享商品索引（高价商品）
  const memberExclusiveIndices = new Set([2, 4, 6]); // 机械键盘、运动鞋、台灯

  for (let i = 0; i < products.length; i++) {
    const p = products[i];
    await prisma.product.create({
      data: {
        name: p.name,
        slug: p.name
          .toLowerCase()
          .replace(/[^a-z0-9一-鿿]+/g, "-")
          .replace(/-+/g, "-")
          .replace(/^-|-$/g, ""),
        price: p.price,
        stock: p.stock,
        imageUrl: `https://picsum.photos/seed/${encodeURIComponent(p.name)}/400/400`,
        description: `这是"${p.name}"，精选优质材料，品质保证。`,
        categoryId: categories[p.cat].id,
        isMemberExclusive: memberExclusiveIndices.has(i),
      },
    });
  }

  console.log("Seed complete!");
  console.log("Admin: admin@minimall.com / admin123");
  console.log("User:  user@test.com / 123456");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
