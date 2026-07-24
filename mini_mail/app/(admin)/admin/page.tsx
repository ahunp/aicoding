import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import Card from "@/components/ui/Card";
import DashboardCharts from "./DashboardCharts";

async function getDashboard() {
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const [
    productCount,
    orderCount,
    userCount,
    revenueResult,
    todayOrders,
    todayRevenueResult,
    pendingCount,
    paidCount,
    shippedCount,
    deliveredCount,
    cancelledCount,
    outOfStockCount,
  ] = await Promise.all([
    prisma.product.count(),
    prisma.order.count(),
    prisma.user.count(),
    prisma.order.aggregate({
      _sum: { finalAmount: true },
      where: { status: { in: ["PAID", "SHIPPED", "DELIVERED"] } },
    }),
    prisma.order.count({
      where: { createdAt: { gte: todayStart } },
    }),
    prisma.order.aggregate({
      _sum: { finalAmount: true },
      where: {
        createdAt: { gte: todayStart },
        status: { in: ["PAID", "SHIPPED", "DELIVERED"] },
      },
    }),
    prisma.order.count({ where: { status: "PENDING" } }),
    prisma.order.count({ where: { status: "PAID" } }),
    prisma.order.count({ where: { status: "SHIPPED" } }),
    prisma.order.count({ where: { status: "DELIVERED" } }),
    prisma.order.count({ where: { status: "CANCELLED" } }),
    prisma.product.count({ where: { stock: 0 } }),
  ]);

  return {
    productCount,
    orderCount,
    userCount,
    revenue: revenueResult._sum.finalAmount ?? 0,
    todayOrders,
    todayRevenue: todayRevenueResult._sum.finalAmount ?? 0,
    pendingCount,
    paidCount,
    shippedCount,
    deliveredCount,
    cancelledCount,
    outOfStockCount,
  };
}

export default async function AdminDashboard() {
  const d = await getDashboard();

  const topCards = [
    { label: "商品总数", value: d.productCount, sub: `缺货 ${d.outOfStockCount}`, color: "bg-primary-500" },
    { label: "订单总数", value: d.orderCount, sub: `待处理 ${d.pendingCount}`, color: "bg-success-500" },
    { label: "用户总数", value: d.userCount, sub: "", color: "bg-accent-500" },
    { label: "总收入", value: `¥${d.revenue.toFixed(2)}`, sub: "", color: "bg-danger-500" },
  ];

  const statusItems = [
    { label: "待付款", count: d.pendingCount, color: "text-warning-500", barColor: "bg-warning-500" },
    { label: "已付款", count: d.paidCount, color: "text-info-500", barColor: "bg-info-500" },
    { label: "已发货", count: d.shippedCount, color: "text-primary-500", barColor: "bg-primary-500" },
    { label: "已送达", count: d.deliveredCount, color: "text-success-500", barColor: "bg-success-500" },
    { label: "已取消", count: d.cancelledCount, color: "text-danger-500", barColor: "bg-danger-500" },
  ];
  const totalCount = d.orderCount || 1;

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-foreground">仪表盘</h1>

      {/* Top stat cards */}
      <div className="mb-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {topCards.map((card) => (
          <Card key={card.label} className="p-6">
            <div className="flex items-center gap-4">
              <div
                className={`h-12 w-12 rounded-lg ${card.color} flex items-center justify-center text-lg text-white`}
              >
                {card.label[0]}
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{card.label}</p>
                <p className="text-2xl font-bold text-foreground">
                  {card.value}
                </p>
                {card.sub && <p className="text-xs text-muted-foreground">{card.sub}</p>}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Today's stats + order breakdown */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Today */}
        <Card className="p-6">
          <h2 className="mb-4 font-medium text-foreground">今日数据</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">今日订单</p>
              <p className="text-xl font-bold text-foreground">{d.todayOrders}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">今日收入</p>
              <p className="text-xl font-bold text-foreground">¥{d.todayRevenue.toFixed(2)}</p>
            </div>
          </div>
        </Card>

        {/* Order status distribution */}
        <Card className="p-6">
          <h2 className="mb-4 font-medium text-foreground">订单状态分布</h2>
          <div className="space-y-3">
            {statusItems.map((item) => (
              <div key={item.label}>
                <div className="flex items-center justify-between text-sm">
                  <span className={item.color}>{item.label}</span>
                  <span className="text-foreground">{item.count}</span>
                </div>
                <div className="mt-1 h-1.5 rounded-full bg-muted">
                  <div
                    className={`h-1.5 rounded-full ${item.barColor} transition-all`}
                    style={{ width: `${(item.count / totalCount) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="mt-6">
        <DashboardCharts />
      </div>
    </div>
  );
}
