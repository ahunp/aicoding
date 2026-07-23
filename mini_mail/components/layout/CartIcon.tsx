"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { formatPrice } from "@/lib/utils";

export default function CartIcon() {
  const [count, setCount] = useState(0);
  const [total, setTotal] = useState(0);

  const fetchCart = useCallback(() => {
    fetch("/api/cart")
      .then((r) => r.json())
      .then((d) => {
        if (d.data) {
          setCount(d.data.length);
          setTotal(d.data.reduce((s: number, i: any) => s + i.product.price * i.quantity, 0));
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    fetchCart();
    window.addEventListener("cart-updated", fetchCart);
    return () => window.removeEventListener("cart-updated", fetchCart);
  }, [fetchCart]);

  return (
    <Link
      href="/cart"
      className="relative flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
    >
      <ShoppingCart className="h-5 w-5" />
      {count > 0 && (
        <>
          <span className="absolute -right-1.5 -top-1.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-primary-600 px-1 text-[10px] font-bold text-white">
            {count > 99 ? "99+" : count}
          </span>
          <span className="hidden text-xs font-medium sm:inline">
            {formatPrice(total)}
          </span>
        </>
      )}
    </Link>
  );
}
