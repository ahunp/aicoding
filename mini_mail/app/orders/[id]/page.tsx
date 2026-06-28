import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import OrderStatusBadge from "@/components/orders/OrderStatusBadge";

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
        <h1 className="text-2xl font-bold text-gray-900">订单详情</h1>
        <p className="mt-1 text-sm text-gray-500">
          订单号: {order.id.slice(0, 12)}...
        </p>
      </div>

      <div className="space-y-4">
        <div className="rounded-lg bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">订单状态</span>
            <OrderStatusBadge status={order.status} />
          </div>
          <div className="mt-2 flex items-center justify-between">
            <span className="text-sm text-gray-600">下单时间</span>
            <span className="text-sm text-gray-900">
              {new Date(order.createdAt).toLocaleString("zh-CN")}
            </span>
          </div>
        </div>

        <div className="rounded-lg bg-white p-4 shadow-sm">
          <h2 className="mb-3 text-sm font-medium text-gray-900">商品列表</h2>
          <div className="divide-y">
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm text-gray-900">{item.productName}</p>
                  <p className="text-xs text-gray-500">
                    ¥{item.productPrice.toFixed(2)} × {item.quantity}
                  </p>
                </div>
                <p className="text-sm font-medium">
                  ¥{item.subtotal.toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg bg-white p-4 shadow-sm">
          {order.discountAmount > 0 && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">会员折扣</span>
              <span className="text-green-600">-¥{order.discountAmount.toFixed(2)}</span>
            </div>
          )}
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">会员等级（下单时）</span>
            <span className="text-gray-900">{order.membershipTierAtOrder}</span>
          </div>
          <div className="mt-2 flex items-center justify-between border-t pt-2">
            <span className="font-medium text-gray-900">实付金额</span>
            <span className="text-lg font-bold text-red-600">
              ¥{order.finalAmount.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
