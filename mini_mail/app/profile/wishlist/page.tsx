"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Heart, ArrowLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { formatPrice } from "@/lib/utils";
import { Package } from "lucide-react";

export default function WishlistPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session?.user) { router.push("/login"); return; }
    fetch("/api/user/wishlist")
      .then((r) => r.json())
      .then((d) => { if (d.data) setItems(d.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [session]);

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <div className="mb-6 flex items-center gap-3">
        <button onClick={() => router.push("/profile")} className="text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-2xl font-bold text-foreground">我的收藏</h1>
      </div>

      {loading ? (
        <div className="space-y-3">{[1, 2, 3].map((i) => <div key={i} className="h-20 animate-pulse rounded-lg bg-muted" />)}</div>
      ) : items.length === 0 ? (
        <Card className="p-12 text-center">
          <Heart className="mx-auto mb-2 h-10 w-10 text-muted-foreground/40" />
          <p className="text-muted-foreground">还没有收藏的商品</p>
          <Link href="/products" className="mt-4 inline-block"><Button>去逛逛</Button></Link>
        </Card>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <Link key={item.id} href={`/products/${item.productId}`} className="block">
              <Card className="flex items-center gap-4 p-4">
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-muted">
                  {item.product.imageUrl ? (
                    <Image src={item.product.imageUrl} alt={item.product.name} fill className="object-contain p-1" sizes="64px" />
                  ) : (
                    <div className="flex h-full items-center justify-center"><Package className="h-6 w-6 text-muted-foreground/40" /></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">{item.product.name}</p>
                  <p className="mt-0.5 text-base font-bold text-price">{formatPrice(item.product.price)}</p>
                  {item.product.category && <Badge className="mt-1">{item.product.category.name}</Badge>}
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
