import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { formatPrice } from "@/lib/utils";
import { getTierLabel } from "@/lib/membership";
import { CheckCircle, CreditCard, ArrowRight, Clock } from "lucide-react";
import PayOrderButton from "@/components/orders/PayOrderButton";
import CancelOrderButton from "@/components/orders/CancelOrderButton";
import Card from "@/components/ui/Card";
import Link from "next/link";

export default async function PayPage({
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
  if (order.userId !== session.user.id) redirect("/orders");

  // If already paid, show success
  if (order.status === "PAID") {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <CheckCircle className="mx-auto h-16 w-16 text-success-500" />
        <h1 className="mt-4 text-2xl font-bold text-foreground">支付成功</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          订单 #{order.id.slice(0, 8)} 已完成支付
        </p>
        <div className="mt-6 space-y-2 text-sm">
          <p className="text-muted-foreground">实付金额：<span className="text-lg font-bold text-price">{formatPrice(order.finalAmount)}</span></p>
          {order.discountAmount > 0 && (
            <p className="text-success-500">会员折扣：-{formatPrice(order.discountAmount)}</p>
          )}
          <p className="text-muted-foreground">会员等级：{getTierLabel(order.membershipTierAtOrder)}</p>
        </div>
        <Link href={`/orders/${order.id}`} className="mt-8 inline-flex items-center gap-1 text-sm text-primary-600 hover:underline">
          查看订单详情 <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
    );
  }

  // Cancelled
  if (order.status === "CANCELLED") {
    redirect(`/orders/${order.id}`);
  }

  // Pending payment
  return (
    <div className="mx-auto max-w-lg px-4 py-12">
      <div className="mb-6 text-center">
        <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-warning-50">
          <Clock className="h-7 w-7 text-warning-500" />
        </div>
        <h1 className="text-2xl font-bold text-foreground">订单待付款</h1>
        <div className="mt-2 flex items-center justify-center gap-2">
          <span className="rounded-full bg-warning-100 px-3 py-1 text-xs font-medium text-warning-700">
            ⏳ 待付款
          </span>
          <span className="text-sm text-muted-foreground">
            订单 #{order.id.slice(0, 8)}
          </span>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          订单已生成，请完成支付。支付成功后购物车商品将正式购买
        </p>
      </div>

      <Card className="mt-6 space-y-3 p-6">
        {order.items.map((item) => (
          <div key={item.id} className="flex items-center justify-between text-sm">
            <span className="text-foreground">{item.productName} × {item.quantity}</span>
            <span className="text-muted-foreground">{formatPrice(item.subtotal)}</span>
          </div>
        ))}
        <div className="border-t border-border pt-3" />
        {order.discountAmount > 0 && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">会员折扣（{getTierLabel(order.membershipTierAtOrder)}）</span>
            <span className="text-success-500">-{formatPrice(order.discountAmount)}</span>
          </div>
        )}
        <div className="flex items-center justify-between text-base font-bold">
          <span className="text-foreground">实付</span>
          <span className="text-price">{formatPrice(order.finalAmount)}</span>
        </div>
      </Card>

      <div className="mt-6 space-y-2">
        <PayOrderButton orderId={order.id} />
        <CancelOrderButton orderId={order.id} />
      </div>
    </div>
  );
}
