"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Package } from "lucide-react";
import Button from "@/components/ui/Button";

interface CartItemProps {
  item: {
    id: string;
    productId: string;
    quantity: number;
    product: {
      id: string;
      name: string;
      price: number;
      imageUrl: string | null;
      stock: number;
    };
  };
}

export default function CartItemRow({ item }: CartItemProps) {
  const router = useRouter();
  const [qty, setQty] = useState(item.quantity);
  const [updating, setUpdating] = useState(false);

  async function updateQuantity(newQty: number) {
    if (newQty < 1) return;
    setUpdating(true);
    await fetch(`/api/cart/${item.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quantity: newQty }),
    });
    setQty(newQty);
    setUpdating(false);
    router.refresh();
  }

  async function removeItem() {
    await fetch(`/api/cart/${item.id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <div className="flex items-center gap-4 border-b border-border py-4">
      <div className="relative h-16 w-16 shrink-0 rounded bg-muted">
        {item.product.imageUrl ? (
          <Image
            src={item.product.imageUrl}
            alt={item.product.name}
            fill
            className="object-contain p-1"
            sizes="64px"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <Package className="h-8 w-8 text-muted-foreground" />
          </div>
        )}
      </div>

      <div className="flex-1">
        <p className="text-sm font-medium text-foreground">{item.product.name}</p>
        <p className="text-sm text-danger-500">
          ¥{item.product.price.toFixed(2)}
        </p>
      </div>

      <div className="flex items-center gap-2">
        <Button
          onClick={() => updateQuantity(qty - 1)}
          disabled={qty <= 1 || updating}
          variant="outline"
          size="sm"
        >
          -
        </Button>
        <span className="w-8 text-center text-sm">{qty}</span>
        <Button
          onClick={() => updateQuantity(qty + 1)}
          disabled={qty >= item.product.stock || updating}
          variant="outline"
          size="sm"
        >
          +
        </Button>
      </div>

      <p className="w-20 text-right text-sm font-medium">
        ¥{(item.product.price * qty).toFixed(2)}
      </p>

      <button
        onClick={removeItem}
        className="text-sm text-danger-500 hover:text-danger-700"
      >
        删除
      </button>
    </div>
  );
}
