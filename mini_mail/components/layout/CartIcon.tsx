"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";

export default function CartIcon() {
  const { data: session } = useSession();
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!session?.user) return;
    fetch("/api/cart")
      .then((res) => res.json())
      .then((data) => {
        if (data.data) setCount(data.data.length);
      })
      .catch(() => {});
  }, [session]);

  return (
    <Link href="/cart" className="relative p-1 text-muted-foreground hover:text-foreground">
      <ShoppingCart className="h-5 w-5" />
      {count > 0 && (
        <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-danger-500 text-xs text-white">
          {count}
        </span>
      )}
    </Link>
  );
}
