"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "@/lib/toast";
import Button from "@/components/ui/Button";

export default function CancelOrderButton({ orderId }: { orderId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleCancel() {
    if (!confirm("确定取消此订单？")) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "cancel" }),
      });

      const data = await res.json();
      if (res.ok) {
        toast("订单已取消", "success");
        router.refresh();
      } else {
        toast(data.error || "取消失败", "error");
      }
    } catch {
      toast("取消失败", "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button onClick={handleCancel} disabled={loading} variant="danger" size="sm">
      {loading ? "取消中..." : "取消订单"}
    </Button>
  );
}
