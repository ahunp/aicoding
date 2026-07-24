import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 开始安全播种（仅插入缺失数据，不删除已有数据）...\n");

  // ---- 用户：检查并创建 ----
  const adminPw = await hash("admin123", 12);
  const existingAdmin = await prisma.user.findUnique({ where: { email: "admin@minimall.com" } });
  if (!existingAdmin) {
    await prisma.user.create({
      data: { name: "管理员", email: "admin@minimall.com", password: adminPw, role: "ADMIN" },
    });
    console.log("✅ 管理员账号已创建");
  } else {
    console.log("⏭️  管理员账号已存在，跳过");
  }

  const userPw = await hash("123456", 12);
  const existingUser = await prisma.user.findUnique({ where: { email: "user@test.com" } });
  if (!existingUser) {
    await prisma.user.create({
      data: { name: "测试用户", email: "user@test.com", password: userPw },
    });
    console.log("✅ 测试用户已创建");
  } else {
    console.log("⏭️  测试用户已存在，跳过");
  }

  // ---- 分类：检查并创建 ----
  const categoryNames = ["电子产品", "服装鞋帽", "家居生活", "食品饮料", "图书文具"];
  const categories: Record<string, string> = {};

  for (const name of categoryNames) {
    const existing = await prisma.category.findFirst({ where: { name } });
    if (existing) {
      categories[name] = existing.id;
      console.log(`⏭️  分类「${name}」已存在，跳过`);
    } else {
      const created = await prisma.category.create({
        data: { name, description: `${name}相关商品` },
      });
      categories[name] = created.id;
      console.log(`✅ 分类「${name}」已创建`);
    }
  }

  // ---- 商品：检查并创建 ----
  const products = [
    { name: "无线蓝牙耳机", price: 299, stock: 50, cat: "电子产品" },
    { name: "手机充电宝 20000mAh", price: 129, stock: 100, cat: "电子产品" },
    { name: "机械键盘 青轴", price: 399, stock: 30, cat: "电子产品" },
    { name: "简约纯棉T恤", price: 79, stock: 200, cat: "服装鞋帽" },
    { name: "休闲运动鞋", price: 259, stock: 80, cat: "服装鞋帽" },
    { name: "羊毛围巾", price: 159, stock: 60, cat: "服装鞋帽" },
    { name: "北欧风台灯", price: 189, stock: 40, cat: "家居生活" },
    { name: "陶瓷咖啡杯套装", price: 99, stock: 120, cat: "家居生活" },
    { name: "收纳盒三件套", price: 49, stock: 150, cat: "家居生活" },
    { name: "坚果礼盒 500g", price: 69, stock: 90, cat: "食品饮料" },
    { name: "有机绿茶 200g", price: 89, stock: 70, cat: "食品饮料" },
    { name: "黑巧克力 72%", price: 39, stock: 180, cat: "食品饮料" },
    { name: "深入理解计算机系统", price: 139, stock: 45, cat: "图书文具" },
    { name: "精装笔记本 A5", price: 29, stock: 300, cat: "图书文具" },
    { name: "简约桌面收纳笔筒", price: 25, stock: 200, cat: "图书文具" },
  ];

  const memberExclusiveNames = new Set(["机械键盘 青轴", "休闲运动鞋", "北欧风台灯"]);

  let createdCount = 0;
  for (const p of products) {
    const slug = p.name
      .toLowerCase()
      .replace(/[^a-z0-9一-鿿]+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");

    const existing = await prisma.product.findFirst({ where: { slug } });
    if (existing) {
      continue; // 静默跳过
    }

    const baseName = encodeURIComponent(p.name);
    await prisma.product.create({
      data: {
        name: p.name,
        slug,
        price: p.price,
        stock: p.stock,
        imageUrl: `https://picsum.photos/seed/${baseName}/400/400`,
        description: `这是"${p.name}"，精选优质材料，品质保证。`,
        categoryId: categories[p.cat],
        isMemberExclusive: memberExclusiveNames.has(p.name),
        images: {
          create: [
            { url: `https://picsum.photos/seed/${baseName}-view1/400/400`, sort: 1 },
            { url: `https://picsum.photos/seed/${baseName}-view2/400/400`, sort: 2 },
            { url: `https://picsum.photos/seed/${baseName}-view3/400/400`, sort: 3 },
          ],
        },
      },
    });
    createdCount++;
  }
  if (createdCount > 0) {
    console.log(`✅ ${createdCount} 个新商品已创建`);
  } else {
    console.log("⏭️  所有商品已存在，跳过");
  }

  console.log("\n🎉 安全播种完成（已有数据全部保留）");
  console.log("管理员: admin@minimall.com / admin123");
  console.log("测试用户: user@test.com / 123456");
  console.log("\n⚠️  如需重置数据库，请运行: npm run reset-db");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
