import { ORDER_STATUS_LABELS } from "@/lib/utils";
import Badge from "@/components/ui/Badge";

const statusToVariant: Record<string, string> = {
  PENDING: "pending",
  PAID: "paid",
  SHIPPED: "shipped",
  DELIVERED: "delivered",
  CANCELLED: "cancelled",
};

export default function OrderStatusBadge({ status }: { status: string }) {
  const variant = statusToVariant[status] || "default";
  const label = ORDER_STATUS_LABELS[status] || status;

  return <Badge variant={variant as any}>{label}</Badge>;
}
