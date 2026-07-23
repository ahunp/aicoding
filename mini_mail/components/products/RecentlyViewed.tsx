"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Package, ArrowRight } from "lucide-react";
import { getViewedIds } from "@/lib/history";
import { formatPrice } from "@/lib/utils";
import Badge from "@/components/ui/Badge";

interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl: string | null;
  category: { name: string } | null;
}

export default function RecentlyViewed() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const ids = getViewedIds();
    if (ids.length === 0) return;

    // Fetch product details for viewed IDs
    fetch(`/api/products?limit=${Math.min(ids.length, 8)}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.data) {
          // Sort by view order
          const map = new Map(d.data.map((p: Product) => [p.id, p]));
          setProducts(ids.map((id) => map.get(id)).filter(Boolean) as Product[]);
        }
      })
      .catch(() => {});
  }, []);

  if (products.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-6">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex h-5 w-0.5 rounded-full bg-primary-500" />
          <h2 className="text-lg font-bold text-foreground">最近浏览</h2>
        </div>
        <Link href="/profile/history" className="flex items-center gap-0.5 text-xs text-muted-foreground hover:text-primary-600">
          查看全部 <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {products.slice(0, 4).map((product) => (
          <Link
            key={product.id}
            href={`/products/${product.id}`}
            className="group rounded-xl bg-surface p-3 shadow-card ring-1 ring-border/50 transition-all hover:shadow-card-hover"
          >
            <div className="relative mb-2 aspect-square overflow-hidden rounded-lg bg-gradient-to-br from-muted to-muted/50">
              {product.imageUrl ? (
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  fill
                  className="object-contain p-2 transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 640px) 50vw, 25vw"
                />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <Package className="h-8 w-8 text-muted-foreground/40" />
                </div>
              )}
            </div>
            <h3 className="truncate text-sm font-medium text-foreground group-hover:text-primary-600">{product.name}</h3>
            <p className="mt-1 text-base font-bold text-price">{formatPrice(product.price)}</p>
            {product.category && <Badge className="mt-1">{product.category.name}</Badge>}
          </Link>
        ))}
      </div>
    </section>
  );
}
