import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getTierLabel } from "@/lib/membership";
import OrderStatusBadge from "@/components/orders/OrderStatusBadge";
import CancelOrderButton from "@/components/orders/CancelOrderButton";
import PayOrderButton from "@/components/orders/PayOrderButton";
import OrderReview from "@/components/orders/OrderReview";
import Card from "@/components/ui/Card";

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const { id } = await params;

  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: true },
  });

  if (!order) notFound();
  if (order.userId !== session.user.id && session.user.role !== "ADMIN") {
    redirect("/orders");
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">订单详情</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          订单号: {order.id.slice(0, 12)}...
        </p>
      </div>

      <div className="space-y-4">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm text-muted-foreground">订单状态</span>
              <div className="mt-1">
                <OrderStatusBadge status={order.status} />
              </div>
            </div>
            <div className="text-right">
              <span className="text-sm text-muted-foreground">下单时间</span>
              <p className="text-sm text-foreground">
                {new Date(order.createdAt).toLocaleString("zh-CN")}
              </p>
            </div>
          </div>
          {order.status === "PENDING" && (
            <div className="mt-4 space-y-2">
              <PayOrderButton orderId={order.id} />
              <CancelOrderButton orderId={order.id} />
            </div>
          )}
        </Card>

        {/* Address */}
        {order.addressSnapshot && (
          <Card>
            <h2 className="mb-2 text-sm font-medium text-foreground">收货地址</h2>
            {(() => {
              try {
                const a = JSON.parse(order.addressSnapshot);
                return (
                  <div className="text-sm text-muted-foreground space-y-0.5">
                    <p><span className="text-foreground">{a.name}</span> {a.phone}</p>
                    <p>{a.province}{a.city}{a.district} {a.detail}</p>
                  </div>
                );
              } catch { return null; }
            })()}
          </Card>
        )}

        <Card>
          <h2 className="mb-3 text-sm font-medium text-foreground">商品列表</h2>
          <div className="divide-y divide-border">
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm text-foreground">{item.productName}</p>
                  <p className="text-xs text-muted-foreground">
                    ¥{item.productPrice.toFixed(2)} × {item.quantity}
                  </p>
                  {order.status === "PAID" && (
                    <OrderReview productId={item.productId} orderId={order.id} />
                  )}
                </div>
                <p className="text-sm font-medium">
                  ¥{item.subtotal.toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          {order.discountAmount > 0 && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">会员折扣</span>
              <span className="text-success-500">-¥{order.discountAmount.toFixed(2)}</span>
            </div>
          )}
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">会员等级（下单时）</span>
            <span className="text-foreground">{getTierLabel(order.membershipTierAtOrder)}</span>
          </div>
          <div className="mt-2 flex items-center justify-between border-t border-border pt-2">
            <span className="font-medium text-foreground">实付金额</span>
            <span className="text-lg font-bold text-price">
              ¥{order.finalAmount.toFixed(2)}
            </span>
          </div>
        </Card>
      </div>
    </div>
  );
}
