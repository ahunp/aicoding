"use client";

import { useEffect, useState } from "react";
import Card from "@/components/ui/Card";
import { formatPrice } from "@/lib/utils";

interface DashboardData {
  todayRevenue: number;
  weekRevenue: number;
  monthRevenue: number;
  todayOrders: number;
  dailyRevenue: { date: string; revenue: number }[];
  topProducts: { name: string; sold: number }[];
  statusDistribution: { status: string; count: number }[];
  categorySales: { name: string; total: number }[];
  revenue: number;
  productCount: number;
  orderCount: number;
  userCount: number;
}

const STATUS_LABELS: Record<string, string> = {
  PENDING: "待付款", PAID: "已付款", SHIPPED: "已发货", DELIVERED: "已送达", CANCELLED: "已取消",
};
const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-warning-500", PAID: "bg-info-500", SHIPPED: "bg-primary-500", DELIVERED: "bg-success-500", CANCELLED: "bg-danger-500",
};

export default function DashboardCharts() {
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    fetch("/api/admin/dashboard")
      .then((r) => r.json())
      .then((d) => { if (d.data) setData(d.data); })
      .catch(() => {});
  }, []);

  if (!data) return null;

  const maxRevenue = Math.max(...data.dailyRevenue.map((d) => d.revenue), 1);
  const maxSales = Math.max(...(data.categorySales?.map((c: any) => c.total) || [1]), 1);

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Daily revenue bar chart */}
      <Card className="p-4">
        <h2 className="mb-3 text-sm font-medium text-foreground">近 7 天销售趋势</h2>
        <div className="flex items-end justify-between gap-1" style={{ height: 120 }}>
          {data.dailyRevenue.map((d) => (
            <div key={d.date} className="flex flex-1 flex-col items-center gap-1">
              <div className="w-full rounded-t bg-gradient-to-t from-primary-500 to-accent-400 transition-all"
                style={{ height: `${(d.revenue / maxRevenue) * 100}%`, minHeight: d.revenue > 0 ? 4 : 0 }}
              />
              <span className="text-[10px] text-muted-foreground">{d.date.slice(5)}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Top products */}
      <Card className="p-4">
        <h2 className="mb-3 text-sm font-medium text-foreground">热销商品 Top 5</h2>
        <div className="space-y-2">
          {data.topProducts?.map((p, i) => (
            <div key={p.name} className="flex items-center gap-2 text-sm">
              <span className="w-5 text-center text-xs font-bold text-muted-foreground">{i + 1}</span>
              <span className="flex-1 truncate text-foreground">{p.name}</span>
              <span className="font-medium text-price">{p.sold} 件</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Status distribution */}
      <Card className="p-4">
        <h2 className="mb-3 text-sm font-medium text-foreground">订单状态分布</h2>
        <div className="space-y-2">
          {data.statusDistribution?.map((s) => {
            const total = data.statusDistribution.reduce((a, b) => a + b.count, 0) || 1;
            return (
              <div key={s.status} className="flex items-center gap-2 text-sm">
                <span className="w-16 text-muted-foreground">{STATUS_LABELS[s.status] || s.status}</span>
                <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                  <div className={`h-full rounded-full ${STATUS_COLORS[s.status] || "bg-muted"}`}
                    style={{ width: `${(s.count / total) * 100}%` }} />
                </div>
                <span className="w-8 text-right text-foreground">{s.count}</span>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Category sales */}
      <Card className="p-4">
        <h2 className="mb-3 text-sm font-medium text-foreground">分类销售占比</h2>
        <div className="space-y-2">
          {(data.categorySales as any[])?.map((c: any) => (
            <div key={c.name} className="flex items-center gap-2 text-sm">
              <span className="w-20 truncate text-muted-foreground">{c.name}</span>
              <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                <div className="h-full rounded-full bg-gradient-to-r from-accent-400 to-accent-500"
                  style={{ width: `${(c.total / maxSales) * 100}%` }} />
              </div>
              <span className="text-right text-foreground">{formatPrice(c.total)}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
