import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Package } from "lucide-react";
import Link from "next/link";
import OrderStatusBadge from "@/components/orders/OrderStatusBadge";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

export default async function OrdersPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-foreground">我的订单</h1>

      {orders.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
            <Package className="h-10 w-10 text-muted-foreground/40" />
          </div>
          <p className="text-muted-foreground">暂无订单</p>
          <Link href="/products" className="mt-4 inline-block">
            <Button>去购物</Button>
          </Link>
        </Card>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="block">
              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">
                      {new Date(order.createdAt).toLocaleDateString("zh-CN")}
                    </p>
                    <p className="text-sm font-medium text-foreground">
                      {order.items.length} 件商品
                    </p>
                    <Link
                      href={`/orders/${order.id}`}
                      className="text-xs text-muted-foreground hover:text-primary-600"
                    >
                      查看详情 →
                    </Link>
                  </div>
                  <div className="text-right">
                    <OrderStatusBadge status={order.status} />
                    <p className="mt-1 text-sm font-bold text-price">
                      ¥{order.finalAmount.toFixed(2)}
                    </p>
                    {order.status === "PENDING" && (
                      <Link
                        href={`/orders/${order.id}/pay`}
                        className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-accent-600 hover:text-accent-700"
                      >
                        去付款 →
                      </Link>
                    )}
                  </div>
                </div>
              </Card>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
