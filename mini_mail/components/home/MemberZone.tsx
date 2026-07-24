"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Package, Crown, Lock } from "lucide-react";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { formatPrice } from "@/lib/utils";
import { getTierLabel, getTierIndex, MEMBERSHIP_TIERS } from "@/lib/membership";

interface MemberZoneProps {
  products: Array<{
    id: string;
    name: string;
    price: number;
    imageUrl: string | null;
    category: { name: string } | null;
  }>;
  minTier: string;
}

export default function MemberZone({ products, minTier }: MemberZoneProps) {
  const { data: session } = useSession();
  const [userTier, setUserTier] = useState<string | null>(null);

  useEffect(() => {
    if (session?.user) {
      fetch("/api/user")
        .then((r) => r.json())
        .then((d) => {
          if (d.data?.membership?.currentTier) setUserTier(d.data.membership.currentTier);
        })
        .catch(() => {});
    }
  }, [session]);

  const minTierLabel = getTierLabel(minTier);
  const userTierIndex = userTier ? getTierIndex(userTier) : -1;
  const minTierIndex = getTierIndex(minTier);
  const meetsTier = userTierIndex >= minTierIndex;

  return (
    <section className="mx-auto max-w-7xl px-4 py-8">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-600 via-purple-700 to-pink-700 p-6 md:p-8">
        <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-white/5 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-8 -left-8 h-24 w-24 rounded-full bg-white/5 blur-xl" />

        <div className="relative">
          <div className="mb-4 flex items-center gap-2">
            <span className="text-lg">💎</span>
            <h2 className="text-xl font-bold text-white">会员专享</h2>
            <span className="rounded-full bg-white/20 px-3 py-0.5 text-xs font-medium text-white/90">
              {minTierLabel}起购
            </span>
          </div>

          {!session?.user ? (
            <div className="flex flex-col items-center justify-center py-8">
              <Lock className="mb-2 h-8 w-8 text-white/40" />
              <p className="mb-1 text-sm text-white/70">
                请登录后查看会员专享好物
              </p>
              <p className="mb-4 text-xs text-white/50">
                需要 {minTierLabel} 及以上等级可购买
              </p>
              <Link href="/login">
                <Button variant="accent" size="sm">
                  立即登录
                </Button>
              </Link>
            </div>
          ) : !meetsTier ? (
            <div className="flex flex-col items-center justify-center py-8">
              <Crown className="mb-2 h-8 w-8 text-white/40" />
              <p className="mb-1 text-sm text-white/70">
                需要 {minTierLabel} 及以上等级才能购买
              </p>
              <p className="mb-4 text-xs text-white/50">
                你当前等级：{getTierLabel(userTier || "")}，继续购物升级吧
              </p>
              <Link href="/products">
                <Button variant="accent" size="sm">
                  去购物升级
                </Button>
              </Link>
            </div>
          ) : products.length === 0 ? (
            <p className="py-4 text-sm text-white/60">暂无会员专享商品</p>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {products.map((product) => (
                <Link
                  key={product.id}
                  href={`/products/${product.id}`}
                  className="group rounded-xl bg-white/10 p-3 backdrop-blur-sm transition-all hover:bg-white/20"
                >
                  <div className="relative mb-2 aspect-square overflow-hidden rounded-lg bg-white/10">
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
                        <Package className="h-8 w-8 text-white/30" />
                      </div>
                    )}
                    <span className="absolute left-1 top-1 rounded bg-accent-500 px-1.5 py-0.5 text-[10px] font-bold text-white">
                      会员价
                    </span>
                  </div>
                  <h3 className="truncate text-sm font-medium text-white">
                    {product.name}
                  </h3>
                  <p className="mt-1 text-base font-bold text-accent-300">
                    {formatPrice(product.price)}
                  </p>
                  {product.category && (
                    <Badge className="mt-1 bg-white/15 text-white/80">
                      {product.category.name}
                    </Badge>
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
