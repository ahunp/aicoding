"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Clock, ArrowLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { formatPrice } from "@/lib/utils";
import { getViewedIds } from "@/lib/history";
import { Package } from "lucide-react";

interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl: string | null;
  category: { name: string } | null;
}

export default function HistoryPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const ids = getViewedIds();
    if (ids.length === 0) { setLoading(false); return; }

    fetch(`/api/products?limit=50`)
      .then((r) => r.json())
      .then((d) => {
        if (d.data) {
          const map = new Map(d.data.map((p: Product) => [p.id, p]));
          setProducts(ids.map((id) => map.get(id)).filter(Boolean) as Product[]);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <div className="mb-6 flex items-center gap-3">
        <button onClick={() => router.push("/profile")} className="text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-2xl font-bold text-foreground">浏览历史</h1>
      </div>

      {loading ? (
        <div className="space-y-3">{[1, 2, 3].map((i) => <div key={i} className="h-20 animate-pulse rounded-lg bg-muted" />)}</div>
      ) : products.length === 0 ? (
        <Card className="p-12 text-center">
          <Clock className="mx-auto mb-2 h-10 w-10 text-muted-foreground/40" />
          <p className="text-muted-foreground">还没有浏览记录</p>
          <Link href="/products" className="mt-4 inline-block"><Button>去逛逛</Button></Link>
        </Card>
      ) : (
        <div className="space-y-3">
          {products.map((product) => (
            <Link key={product.id} href={`/products/${product.id}`} className="block">
              <Card className="flex items-center gap-4 p-4">
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-muted">
                  {product.imageUrl ? (
                    <Image src={product.imageUrl} alt={product.name} fill className="object-contain p-1" sizes="64px" />
                  ) : (
                    <div className="flex h-full items-center justify-center"><Package className="h-6 w-6 text-muted-foreground/40" /></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">{product.name}</p>
                  <p className="mt-0.5 text-base font-bold text-price">{formatPrice(product.price)}</p>
                  {product.category && <Badge className="mt-1">{product.category.name}</Badge>}
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
