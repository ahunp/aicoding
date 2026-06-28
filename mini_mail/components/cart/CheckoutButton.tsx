"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CheckoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleCheckout() {
    setLoading(true);
    try {
      const res = await fetch("/api/orders", { method: "POST" });
      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "下单失败");
        return;
      }

      router.push(`/orders/${data.data.id}`);
      router.refresh();
    } catch {
      alert("下单失败，请稍后重试");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleCheckout}
      disabled={loading}
      className="mt-4 block w-full rounded bg-blue-600 px-6 py-3 text-center text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
    >
      {loading ? "下单中..." : "去结算"}
    </button>
  );
}
