import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

async function rotateFlashDeals() {
  const now = new Date();

  // Clear expired auto flash deals only (admin-set ones are kept)
  await prisma.product.updateMany({
    where: { isFlashDeal: true, flashDealAuto: true, flashDealEndsAt: { lte: now } },
    data: { isFlashDeal: false, flashDealDiscount: 0, flashDealEndsAt: null, flashDealAuto: false },
  });

  // Count current non-expired auto deals
  const autoCount = await prisma.product.count({
    where: { isFlashDeal: true, flashDealAuto: true, flashDealEndsAt: { gt: now } },
  });

  const needed = 5 - autoCount;
  if (needed <= 0) return;

  // Pick random products not already flash deals
  const candidates = await prisma.product.findMany({
    where: { isActive: true, stock: { gt: 0 }, isFlashDeal: false },
    select: { id: true },
  });

  if (candidates.length === 0) return;

  const shuffled = [...candidates].sort(() => Math.random() - 0.5);
  const picked = shuffled.slice(0, Math.min(needed, shuffled.length));

  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  await Promise.all(
    picked.map((p) =>
      prisma.product.update({
        where: { id: p.id },
        data: { isFlashDeal: true, flashDealDiscount: 10, flashDealEndsAt: endOfDay, flashDealAuto: true },
      })
    )
  );
}

export async function GET() {
  try {
    // Auto-rotate flash deals if expired
    await rotateFlashDeals();

    const [flashDealProducts, cheapestProducts, newArrivals, memberProducts, categories, memberSettings] =
      await Promise.all([
        // Flash deals
        prisma.product.findMany({
          where: { isActive: true, stock: { gt: 0 }, isFlashDeal: true },
          include: { category: true },
          orderBy: { createdAt: "desc" },
          take: 6,
        }),
        // Fallback: cheapest if no flash deals
        prisma.product.findMany({
          where: { isActive: true, stock: { gt: 0 }, isFlashDeal: false },
          include: { category: true },
          orderBy: { price: "asc" },
          take: 6,
        }),
        // New arrivals: latest 8 items
        prisma.product.findMany({
          where: { isActive: true },
          include: { category: true },
          orderBy: { createdAt: "desc" },
          take: 8,
        }),
        // Member exclusive
        prisma.product.findMany({
          where: { isActive: true, isMemberExclusive: true },
          include: { category: true },
          orderBy: { createdAt: "desc" },
          take: 4,
        }),
        // Top 4 categories
        prisma.category.findMany({
          orderBy: { name: "asc" },
          take: 4,
        }),
        // Member settings
        prisma.memberSettings.findUnique({ where: { id: "singleton" } }),
      ]);

    const flashDeals =
      flashDealProducts.length > 0 ? flashDealProducts : cheapestProducts;

    const categoryRows = await Promise.all(
      categories.map(async (cat) => {
        const products = await prisma.product.findMany({
          where: { isActive: true, categoryId: cat.id },
          include: { category: true },
          orderBy: { createdAt: "desc" },
          take: 4,
        });
        return { category: cat, products };
      })
    );

    return NextResponse.json({
      data: {
        flashDeals,
        newArrivals,
        memberProducts,
        categoryRows,
        minTierForExclusive: memberSettings?.minTierForExclusive ?? "GOLD",
      },
    });
  } catch {
    return NextResponse.json(
      { error: "获取首页数据失败" },
      { status: 500 }
    );
  }
}
