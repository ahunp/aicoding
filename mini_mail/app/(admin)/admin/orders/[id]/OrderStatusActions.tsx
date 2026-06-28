"use client";

import { useRouter } from "next/navigation";

const STATUS_FLOW: Record<string, string[]> = {
  PENDING: ["PAID", "CANCELLED"],
  PAID: ["SHIPPED", "CANCELLED"],
  SHIPPED: ["DELIVERED"],
  DELIVERED: [],
  CANCELLED: [],
};

const STATUS_LABELS: Record<string, string> = {
  PENDING: "待付款",
  PAID: "已付款",
  SHIPPED: "已发货",
  DELIVERED: "已送达",
  CANCELLED: "已取消",
};

export default function OrderStatusActions({
  orderId,
  currentStatus,
}: {
  orderId: string;
  currentStatus: string;
}) {
  const router = useRouter();
  const nextStatuses = STATUS_FLOW[currentStatus] || [];

  async function handleUpdate(status: string) {
    const label = STATUS_LABELS[status];
    if (!confirm(`确定将订单状态改为"${label}"？`)) return;

    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (res.ok) {
        router.refresh();
      } else {
        const data = await res.json().catch(() => ({}));
        alert(data.error || "更新失败");
      }
    } catch {
      alert("网络错误，更新失败");
    }
  }

  if (nextStatuses.length === 0) {
    return <p className="text-sm text-gray-400">终态，不可变更</p>;
  }

  return (
    <div className="flex gap-2">
      {nextStatuses.map((s) => (
        <button
          key={s}
          onClick={() => handleUpdate(s)}
          className="rounded bg-blue-600 px-4 py-1.5 text-sm text-white hover:bg-blue-700"
        >
          标记为 {STATUS_LABELS[s]}
        </button>
      ))}
    </div>
  );
}
