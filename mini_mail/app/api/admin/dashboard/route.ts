import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "无权限" }, { status: 403 });
  }

  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekStart = new Date(todayStart);
  weekStart.setDate(weekStart.getDate() - weekStart.getDay());
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const paidStatuses = ["PAID", "SHIPPED", "DELIVERED"];

  const [productCount, orderCount, userCount, revenueResult, todayOrders, weekOrders, monthOrders,
    statusDist, topProducts, dailyRevenue, categorySales] = await Promise.all([
    prisma.product.count(),
    prisma.order.count(),
    prisma.user.count(),
    prisma.order.aggregate({ _sum: { finalAmount: true }, where: { status: { in: paidStatuses } } }),
    prisma.order.aggregate({ _sum: { finalAmount: true }, where: { status: { in: paidStatuses }, createdAt: { gte: todayStart } } }),
    prisma.order.aggregate({ _sum: { finalAmount: true }, where: { status: { in: paidStatuses }, createdAt: { gte: weekStart } } }),
    prisma.order.aggregate({ _sum: { finalAmount: true }, where: { status: { in: paidStatuses }, createdAt: { gte: monthStart } } }),
    prisma.order.groupBy({ by: ["status"], _count: true, where: {} }),
    prisma.orderItem.groupBy({ by: ["productId", "productName"], _sum: { quantity: true }, orderBy: { _sum: { quantity: "desc" } }, take: 5 }),
    Promise.all(Array.from({ length: 7 }, (_, i) => {
      const d = new Date(todayStart);
      d.setDate(d.getDate() - 6 + i);
      const next = new Date(d);
      next.setDate(next.getDate() + 1);
      return prisma.order.aggregate({
        _sum: { finalAmount: true },
        where: { status: { in: paidStatuses }, createdAt: { gte: d, lt: next } },
      }).then(r => ({ date: d.toISOString().slice(0, 10), revenue: r._sum.finalAmount ?? 0 }));
    })),
    prisma.$queryRawUnsafe(`SELECT c.name, CAST(SUM(oi.subtotal) AS REAL) as total FROM OrderItem oi JOIN Product p ON oi.productId = p.id JOIN Category c ON p.categoryId = c.id GROUP BY c.id ORDER BY total DESC`),
  ]);

  return NextResponse.json({
    data: {
      productCount, orderCount, userCount,
      revenue: revenueResult._sum.finalAmount ?? 0,
      todayRevenue: todayOrders._sum.finalAmount ?? 0,
      weekRevenue: weekOrders._sum.finalAmount ?? 0,
      monthRevenue: monthOrders._sum.finalAmount ?? 0,
      todayOrders: (await prisma.order.count({ where: { createdAt: { gte: todayStart } } })),
      statusDistribution: statusDist.map((s: any) => ({ status: s.status, count: s._count })),
      topProducts: topProducts.map((p: any) => ({ name: p.productName, sold: p._sum.quantity })),
      dailyRevenue,
      categorySales: (categorySales as any[]) || [],
    },
  });
}
