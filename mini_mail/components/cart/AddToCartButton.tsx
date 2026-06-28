"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddToCartButton({
  productId,
  disabled,
}: {
  productId: string;
  disabled?: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [added, setAdded] = useState(false);

  async function handleAdd() {
    setLoading(true);
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity: 1 }),
      });

      if (!res.ok) {
        const data = await res.json();
        alert(data.error || "添加失败");
        return;
      }

      setAdded(true);
      router.refresh();
      setTimeout(() => setAdded(false), 2000);
    } catch {
      alert("添加失败");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleAdd}
      disabled={disabled || loading}
      className={`w-full rounded px-6 py-3 text-sm font-medium transition-colors ${
        added
          ? "bg-green-500 text-white"
          : "bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-300"
      }`}
    >
      {loading ? "添加中..." : added ? "已加入购物车 ✓" : "加入购物车"}
    </button>
  );
}
