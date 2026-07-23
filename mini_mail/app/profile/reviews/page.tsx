"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { MessageSquare, ArrowLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import ReviewStars from "@/components/products/ReviewStars";
import { formatPrice } from "@/lib/utils";
import { Package } from "lucide-react";

export default function MyReviewsPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session?.user) { router.push("/login"); return; }
    fetch("/api/user/reviews")
      .then((r) => r.json())
      .then((d) => { if (d.data) setReviews(d.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [session]);

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <div className="mb-6 flex items-center gap-3">
        <button onClick={() => router.push("/profile")} className="text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-2xl font-bold text-foreground">我的评价</h1>
      </div>

      {loading ? (
        <div className="space-y-3">{[1, 2, 3].map((i) => <div key={i} className="h-24 animate-pulse rounded-lg bg-muted" />)}</div>
      ) : reviews.length === 0 ? (
        <Card className="p-12 text-center">
          <MessageSquare className="mx-auto mb-2 h-10 w-10 text-muted-foreground/40" />
          <p className="text-muted-foreground">还没有评价过商品</p>
          <Link href="/orders" className="mt-4 inline-block"><Button>查看订单</Button></Link>
        </Card>
      ) : (
        <div className="space-y-3">
          {reviews.map((rv) => (
            <Card key={rv.id} className="p-4">
              <Link href={`/products/${rv.productId}`} className="flex items-center gap-3">
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-muted">
                  {rv.product?.imageUrl ? (
                    <Image src={rv.product.imageUrl} alt={rv.product.name} fill className="object-contain p-1" sizes="56px" />
                  ) : (
                    <div className="flex h-full items-center justify-center"><Package className="h-6 w-6 text-muted-foreground/40" /></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">{rv.product?.name}</p>
                  <p className="text-xs text-muted-foreground">{formatPrice(rv.product?.price ?? 0)}</p>
                </div>
              </Link>
              <div className="mt-2 flex items-center gap-2">
                <ReviewStars rating={rv.rating} size="sm" />
                <span className="text-xs text-muted-foreground">{new Date(rv.createdAt).toLocaleDateString("zh-CN")}</span>
              </div>
              {rv.content && <p className="mt-1 text-sm text-muted-foreground">{rv.content}</p>}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
