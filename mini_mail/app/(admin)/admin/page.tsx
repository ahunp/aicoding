import { prisma } from "@/lib/prisma";

async function getStats() {
  const [productCount, orderCount, userCount, revenueResult] =
    await Promise.all([
      prisma.product.count(),
      prisma.order.count(),
      prisma.user.count(),
      prisma.order.aggregate({
        _sum: { finalAmount: true },
        where: { status: { in: ["PAID", "SHIPPED", "DELIVERED"] } },
      }),
    ]);

  return {
    productCount,
    orderCount,
    userCount,
    revenue: revenueResult._sum.finalAmount ?? 0,
  };
}

export default async function AdminDashboard() {
  const stats = await getStats();

  const cards = [
    { label: "商品总数", value: stats.productCount, color: "bg-blue-500" },
    { label: "订单总数", value: stats.orderCount, color: "bg-green-500" },
    { label: "用户总数", value: stats.userCount, color: "bg-purple-500" },
    {
      label: "总收入",
      value: `¥${stats.revenue.toFixed(2)}`,
      color: "bg-orange-500",
    },
  ];

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">仪表盘</h1>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <div
            key={card.label}
            className="rounded-lg bg-white p-6 shadow-sm"
          >
            <div className="flex items-center gap-4">
              <div
                className={`h-12 w-12 rounded-lg ${card.color} flex items-center justify-center text-lg text-white`}
              >
                {card.label[0]}
              </div>
              <div>
                <p className="text-sm text-gray-500">{card.label}</p>
                <p className="text-2xl font-bold text-gray-900">
                  {card.value}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
