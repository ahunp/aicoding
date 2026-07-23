"use client";

import { useEffect, useRef, useState } from "react";
import { Check } from "lucide-react";
import { toast } from "@/lib/toast";
import Button from "@/components/ui/Button";

export default function AddToCartButton({
  productId,
  disabled,
}: {
  productId: string;
  disabled?: boolean;
}) {
  const [loading, setLoading] = useState(false);
  const [inCart, setInCart] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const interactedRef = useRef(false);

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/cart", { signal: controller.signal })
      .then((r) => r.json())
      .then((data) => {
        if (data.data && !interactedRef.current) {
          setInCart(data.data.some((item: any) => item.productId === productId));
        }
      })
      .catch(() => {});
    return () => controller.abort();
  }, [productId]);

  async function handleAdd() {
    setLoading(true);
    interactedRef.current = true;
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity }),
      });

      if (!res.ok) {
        const data = await res.json();
        toast(data.error || "添加失败", "error");
        return;
      }

      setInCart(true);
      window.dispatchEvent(new CustomEvent("cart-updated"));
      toast("已加入购物车", "success");
    } catch {
      toast("添加失败", "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">数量：</span>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            disabled={quantity <= 1}
            className="flex h-8 w-8 items-center justify-center rounded border border-border text-sm hover:bg-muted disabled:opacity-30"
          >
            -
          </button>
          <input
            type="number"
            value={quantity}
            min={1}
            onChange={(e) => {
              const v = parseInt(e.target.value);
              if (!isNaN(v) && v >= 1) setQuantity(v);
            }}
            onBlur={() => {
              if (!quantity || quantity < 1) setQuantity(1);
            }}
            className="h-8 w-14 rounded border border-border bg-transparent text-center text-sm font-medium [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          />
          <button
            onClick={() => setQuantity((q) => q + 1)}
            className="flex h-8 w-8 items-center justify-center rounded border border-border text-sm hover:bg-muted"
          >
            +
          </button>
        </div>
      </div>

      <Button
        onClick={handleAdd}
        disabled={disabled || loading}
        variant={inCart ? "success" : "primary"}
        size="lg"
        className="w-full"
      >
        {loading ? "添加中..." : inCart ? <><Check className="mr-1 h-4 w-4" /> 已加入购物车</> : "加入购物车"}
      </Button>
    </div>
  );
}
