"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "@/lib/toast";
import Button from "@/components/ui/Button";

export default function CheckoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleCheckout() {
    setLoading(true);
    try {
      const res = await fetch("/api/orders", { method: "POST" });
      const data = await res.json();

      if (!res.ok) {
        toast(data.error || "下单失败", "error");
        return;
      }

      toast("下单成功", "success");
      router.push(`/orders/${data.data.id}`);
      router.refresh();
    } catch {
      toast("下单失败，请稍后重试", "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      onClick={handleCheckout}
      disabled={loading}
      variant="accent"
      size="lg"
      className="mt-4 w-full"
    >
      {loading ? "下单中..." : "去结算"}
    </Button>
  );
}
