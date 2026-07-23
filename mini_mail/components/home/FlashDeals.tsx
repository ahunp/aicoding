"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Package, ChevronLeft, ChevronRight } from "lucide-react";
import { formatPrice } from "@/lib/utils";

interface FlashDealProduct {
  id: string;
  name: string;
  price: number;
  imageUrl: string | null;
  flashDealDiscount?: number;
  flashDealEndsAt?: string | null;
}

interface FlashDealsProps {
  products: FlashDealProduct[];
}

function formatCountdown(ms: number): string {
  if (ms <= 0) return "已结束";
  const total = Math.floor(ms / 1000);
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export default function FlashDeals({ products }: FlashDealsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [now, setNow] = useState(Date.now());

  // Determine the latest end time across all products for the header countdown
  const latestEnd = products.reduce((latest, p) => {
    if (!p.flashDealEndsAt) return latest;
    const t = new Date(p.flashDealEndsAt).getTime();
    return t > latest ? t : latest;
  }, 0);

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const headerCountdown = latestEnd ? formatCountdown(latestEnd - now) : "";

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = scrollRef.current.clientWidth * 0.8;
    scrollRef.current.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
  };

  const updateScrollState = () => {
    if (!scrollRef.current) return;
    const el = scrollRef.current;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  };

  if (products.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-6 w-1 rounded-full bg-primary-500" />
          <h2 className="text-xl font-bold text-foreground">⚡ 限时抢购</h2>
          {headerCountdown && (
            <span className={`rounded px-2 py-0.5 font-mono text-sm text-white tabular-nums ${
              headerCountdown === "已结束" ? "bg-muted-foreground" : "bg-danger-500"
            }`}>
              {headerCountdown}
            </span>
          )}
        </div>
        <Link href="/products?sortBy=price&sortOrder=asc" className="text-sm text-muted-foreground hover:text-primary-600">
          查看更多 →
        </Link>
      </div>

      <div className="group relative">
        {canScrollLeft && (
          <button onClick={() => scroll("left")} className="absolute -left-3 top-1/2 z-10 hidden -translate-y-1/2 md:flex h-8 w-8 items-center justify-center rounded-full bg-surface text-foreground shadow-md ring-1 ring-border/50 hover:bg-muted">
            <ChevronLeft className="h-4 w-4" />
          </button>
        )}

        <div ref={scrollRef} onScroll={updateScrollState} className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {products.map((product) => {
            const discount = product.flashDealDiscount || 0;
            const hasDiscount = discount > 0;
            const dealPrice = hasDiscount ? product.price * (1 - discount / 100) : product.price;
            const endsAt = product.flashDealEndsAt ? new Date(product.flashDealEndsAt).getTime() : 0;
            const remaining = endsAt ? endsAt - now : 0;
            const expired = endsAt > 0 && remaining <= 0;

            if (expired) return null;

            return (
              <Link key={product.id} href={`/products/${product.id}`} className="group/card flex w-36 shrink-0 snap-start flex-col rounded-xl bg-surface p-3 shadow-card ring-1 ring-border/50 transition-all hover:shadow-card-hover sm:w-40">
                <div className="relative mb-2 aspect-square overflow-hidden rounded-lg bg-gradient-to-br from-muted to-muted/50">
                  {product.imageUrl ? (
                    <Image src={product.imageUrl} alt={product.name} fill className="object-contain p-2 transition-transform duration-300 group-hover/card:scale-105" sizes="160px" />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <Package className="h-8 w-8 text-muted-foreground/40" />
                    </div>
                  )}
                  {hasDiscount && (
                    <span className="absolute left-1 top-1 rounded bg-danger-500 px-1.5 py-0.5 text-[10px] font-bold text-white">
                      -{discount}%
                    </span>
                  )}
                  {endsAt > 0 && remaining > 0 && (
                    <span className="absolute bottom-1 left-1 right-1 rounded bg-black/60 px-1 py-0.5 text-[10px] text-center text-white tabular-nums">
                      {formatCountdown(remaining)}
                    </span>
                  )}
                </div>
                <h3 className="truncate text-xs font-medium text-foreground">{product.name}</h3>
                <div className="mt-1 flex items-baseline gap-1">
                  <span className="text-sm font-bold text-price">
                    {hasDiscount ? formatPrice(dealPrice) : formatPrice(product.price)}
                  </span>
                  {hasDiscount && (
                    <span className="text-[10px] text-muted-foreground line-through">
                      {formatPrice(product.price)}
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </div>

        {canScrollRight && (
          <button onClick={() => scroll("right")} className="absolute -right-3 top-1/2 z-10 hidden -translate-y-1/2 md:flex h-8 w-8 items-center justify-center rounded-full bg-surface text-foreground shadow-md ring-1 ring-border/50 hover:bg-muted">
            <ChevronRight className="h-4 w-4" />
          </button>
        )}
      </div>
    </section>
  );
}
