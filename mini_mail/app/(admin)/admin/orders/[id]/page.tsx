import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { formatPrice, formatDate, ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from "@/lib/utils";
import OrderStatusActions from "./OrderStatusActions";

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
        <h1 className="text-2xl font-bold text-gray-900">订单详情</h1>
        <p className="mt-1 text-sm text-gray-500">ID: {order.id}</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <span className={`rounded-full px-3 py-1 text-sm font-medium ${ORDER_STATUS_COLORS[order.status]}`}>
                  {ORDER_STATUS_LABELS[order.status]}
                </span>
                <p className="mt-2 text-xs text-gray-500">创建时间: {formatDate(order.createdAt)}</p>
              </div>
              <OrderStatusActions orderId={order.id} currentStatus={order.status} />
            </div>
          </div>

          <div className="rounded-lg bg-white shadow-sm">
            <div className="border-b px-6 py-3">
              <h2 className="font-medium text-gray-900">商品明细</h2>
            </div>
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-left">
                <tr>
                  <th className="px-6 py-2 font-medium text-gray-600">商品</th>
                  <th className="px-6 py-2 font-medium text-gray-600">单价</th>
                  <th className="px-6 py-2 font-medium text-gray-600">数量</th>
                  <th className="px-6 py-2 font-medium text-gray-600">小计</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {order.items.map((item) => (
                  <tr key={item.id}>
                    <td className="px-6 py-3 text-gray-900">{item.productName}</td>
                    <td className="px-6 py-3 text-gray-700">{formatPrice(item.productPrice)}</td>
                    <td className="px-6 py-3 text-gray-700">{item.quantity}</td>
                    <td className="px-6 py-3 text-gray-900">{formatPrice(item.subtotal)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <h2 className="mb-3 font-medium text-gray-900">用户信息</h2>
            <div className="space-y-2 text-sm">
              <p className="text-gray-700"><span className="text-gray-500">姓名: </span>{order.user?.name || "—"}</p>
              <p className="text-gray-700"><span className="text-gray-500">邮箱: </span>{order.user?.email}</p>
              <p className="text-gray-700"><span className="text-gray-500">累计消费: </span>{formatPrice(order.user?.totalSpent ?? 0)}</p>
              <p className="text-gray-700"><span className="text-gray-500">会员等级: </span>{order.user?.membershipTier}</p>
            </div>
          </div>

          <div className="rounded-lg bg-white p-6 shadow-sm">
            <h2 className="mb-3 font-medium text-gray-900">金额汇总</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-gray-700">
                <span className="text-gray-500">商品总额</span>
                <span>{formatPrice(order.totalAmount)}</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span className="text-gray-500">折扣</span>
                <span className="text-red-600">-{formatPrice(order.discountAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">会员等级(下单时)</span>
                <span className="text-gray-700">{order.membershipTierAtOrder}</span>
              </div>
              <hr />
              <div className="flex justify-between font-medium text-gray-900">
                <span>实付金额</span>
                <span className="text-lg">{formatPrice(order.finalAmount)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
