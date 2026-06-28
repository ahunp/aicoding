"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

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
    <div className="flex items-center gap-4 border-b py-4">
      <div className="flex h-16 w-16 items-center justify-center rounded bg-gray-50">
        {item.product.imageUrl ? (
          <img src={item.product.imageUrl} alt={item.product.name} className="h-full w-full object-contain p-1" />
        ) : (
          <span className="text-2xl">📦</span>
        )}
      </div>

      <div className="flex-1">
        <p className="text-sm font-medium text-gray-900">{item.product.name}</p>
        <p className="text-sm text-red-600">
          ¥{item.product.price.toFixed(2)}
        </p>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => updateQuantity(qty - 1)}
          disabled={qty <= 1 || updating}
          className="rounded border px-2 py-1 text-sm disabled:opacity-30"
        >
          -
        </button>
        <span className="w-8 text-center text-sm">{qty}</span>
        <button
          onClick={() => updateQuantity(qty + 1)}
          disabled={qty >= item.product.stock || updating}
          className="rounded border px-2 py-1 text-sm disabled:opacity-30"
        >
          +
        </button>
      </div>

      <p className="w-20 text-right text-sm font-medium">
        ¥{(item.product.price * qty).toFixed(2)}
      </p>

      <button
        onClick={removeItem}
        className="text-sm text-red-500 hover:text-red-700"
      >
        删除
      </button>
    </div>
  );
}
