import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatPrice, formatDate, ORDER_STATUS_LABELS } from "@/lib/utils";
import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; status?: string }>;
}) {
  const sp = await searchParams;
  const page = Math.max(1, Number(sp.page) || 1);
  const status = sp.status || "";
  const limit = 20;

  const where = status ? { status } : {};

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      include: { user: { select: { name: true, email: true } } },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.order.count({ where }),
  ]);

  const totalPages = Math.ceil(total / limit);
  const statuses = ["", "PENDING", "PAID", "SHIPPED", "DELIVERED", "CANCELLED"];
  const statusLabels: Record<string, string> = { "": "全部", ...ORDER_STATUS_LABELS };

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-foreground">订单管理</h1>

      <div className="mb-4 flex flex-wrap gap-2">
        {statuses.map((s) => (
          <Link
            key={s}
            href={`/admin/orders${s ? `?status=${s}` : ""}`}
            className="inline-block"
          >
            <Badge variant={s === status ? "paid" : "default"}>
              {statusLabels[s]}
            </Badge>
          </Link>
        ))}
      </div>

      <Card className="overflow-x-auto" padding={false}>
        <table className="w-full text-sm">
          <thead className="border-b bg-muted text-left">
            <tr>
              <th className="px-4 py-3 font-medium text-muted-foreground">订单号</th>
              <th className="px-4 py-3 font-medium text-muted-foreground">用户</th>
              <th className="px-4 py-3 font-medium text-muted-foreground">金额</th>
              <th className="px-4 py-3 font-medium text-muted-foreground">状态</th>
              <th className="px-4 py-3 font-medium text-muted-foreground">时间</th>
              <th className="px-4 py-3 font-medium text-muted-foreground">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {orders.map((o) => (
              <tr key={o.id} className="hover:bg-muted">
                <td className="px-4 py-3 font-mono text-xs text-foreground">
                  {o.id.slice(0, 8)}...
                </td>
                <td className="px-4 py-3 text-foreground">
                  {o.user?.name || o.user?.email}
                </td>
                <td className="px-4 py-3 text-foreground">
                  {formatPrice(o.finalAmount)}
                </td>
                <td className="px-4 py-3">
                  <Badge variant={o.status.toLowerCase() as any}>
                    {ORDER_STATUS_LABELS[o.status]}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {formatDate(o.createdAt)}
                </td>
                <td className="px-4 py-3">
                  <Link href={`/admin/orders/${o.id}`} className="text-primary-600 hover:text-primary-700">
                    详情
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Link
              key={p}
              href={`/admin/orders?page=${p}${status ? `&status=${status}` : ""}`}
              className={`rounded px-3 py-1 text-sm ${
                p === page ? "bg-primary-600 text-white" : "bg-muted text-foreground hover:bg-muted-foreground/20"
              }`}
            >
              {p}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
