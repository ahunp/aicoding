import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { formatPrice, formatDate, ORDER_STATUS_LABELS } from "@/lib/utils";
import { getTierLabel } from "@/lib/membership";
import OrderStatusActions from "./OrderStatusActions";
import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      items: true,
      user: { select: { name: true, email: true, totalSpent: true, membershipTier: true } },
    },
  });

  if (!order) notFound();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">订单详情</h1>
        <p className="mt-1 text-sm text-muted-foreground">ID: {order.id}</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <Badge variant={order.status.toLowerCase() as any}>
                  {ORDER_STATUS_LABELS[order.status]}
                </Badge>
                <p className="mt-2 text-xs text-muted-foreground">创建时间: {formatDate(order.createdAt)}</p>
              </div>
              <OrderStatusActions orderId={order.id} currentStatus={order.status} />
            </div>
          </Card>

          <Card padding={false}>
            <div className="border-b border-border px-6 py-3">
              <h2 className="font-medium text-foreground">商品明细</h2>
            </div>
            <table className="w-full text-sm">
              <thead className="bg-muted text-left">
                <tr>
                  <th className="px-6 py-2 font-medium text-muted-foreground">商品</th>
                  <th className="px-6 py-2 font-medium text-muted-foreground">单价</th>
                  <th className="px-6 py-2 font-medium text-muted-foreground">数量</th>
                  <th className="px-6 py-2 font-medium text-muted-foreground">小计</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {order.items.map((item) => (
                  <tr key={item.id}>
                    <td className="px-6 py-3 text-foreground">{item.productName}</td>
                    <td className="px-6 py-3 text-muted-foreground">{formatPrice(item.productPrice)}</td>
                    <td className="px-6 py-3 text-muted-foreground">{item.quantity}</td>
                    <td className="px-6 py-3 text-foreground">{formatPrice(item.subtotal)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="mb-3 font-medium text-foreground">用户信息</h2>
            <div className="space-y-2 text-sm">
              <p className="text-foreground"><span className="text-muted-foreground">姓名: </span>{order.user?.name || "—"}</p>
              <p className="text-foreground"><span className="text-muted-foreground">邮箱: </span>{order.user?.email}</p>
              <p className="text-foreground"><span className="text-muted-foreground">累计消费: </span>{formatPrice(order.user?.totalSpent ?? 0)}</p>
              <p className="text-foreground"><span className="text-muted-foreground">会员等级: </span>{getTierLabel(order.user?.membershipTier ?? "")}</p>
            </div>
          </Card>

          {order.addressSnapshot && (
            <Card className="p-6">
              <h2 className="mb-2 font-medium text-foreground">收货地址</h2>
              {(() => {
                try {
                  const a = JSON.parse(order.addressSnapshot);
                  return (
                    <div className="text-sm text-muted-foreground space-y-0.5">
                      <p><span className="text-foreground">{a.name}</span> {a.phone}</p>
                      <p>{a.province}{a.city}{a.district} {a.detail}</p>
                    </div>
                  );
                } catch { return <p className="text-sm text-muted-foreground">—</p>; }
              })()}
            </Card>
          )}

          <Card className="p-6">
            <h2 className="mb-3 font-medium text-foreground">金额汇总</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-foreground">
                <span className="text-muted-foreground">商品总额</span>
                <span>{formatPrice(order.totalAmount)}</span>
              </div>
              <div className="flex justify-between text-foreground">
                <span className="text-muted-foreground">折扣</span>
                <span className="text-danger-500">-{formatPrice(order.discountAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">会员等级(下单时)</span>
                <span className="text-foreground">{getTierLabel(order.membershipTierAtOrder)}</span>
              </div>
              <hr className="border-border" />
              <div className="flex justify-between font-medium text-foreground">
                <span>实付金额</span>
                <span className="text-lg">{formatPrice(order.finalAmount)}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
