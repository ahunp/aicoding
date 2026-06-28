import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from "@/lib/utils";

export default function OrderStatusBadge({ status }: { status: string }) {
  const color = ORDER_STATUS_COLORS[status] || "bg-gray-100 text-gray-700";
  const label = ORDER_STATUS_LABELS[status] || status;

  return (
    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${color}`}>
      {label}
    </span>
  );
}
