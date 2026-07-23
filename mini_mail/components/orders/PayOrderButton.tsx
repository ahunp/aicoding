"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CreditCard } from "lucide-react";
import { toast } from "@/lib/toast";
import Button from "@/components/ui/Button";

export default function PayOrderButton({ orderId }: { orderId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handlePay() {
    setLoading(true);
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "pay" }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast(data.error || "支付失败", "error");
        return;
      }

      toast("支付成功", "success");
      router.refresh();
    } catch {
      toast("支付失败，请稍后重试", "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button onClick={handlePay} disabled={loading} variant="accent" size="lg" className="w-full">
      <CreditCard className="mr-1.5 h-4 w-4" />
      {loading ? "支付中..." : "去付款"}
    </Button>
  );
}
