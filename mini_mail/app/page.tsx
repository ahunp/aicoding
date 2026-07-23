"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { ArrowRight, Package } from "lucide-react";
import { motion } from "framer-motion";
import ProductCard from "@/components/products/ProductCard";
import HeroSearch from "@/components/home/HeroSearch";
import QuickNav from "@/components/home/QuickNav";
import FlashDeals from "@/components/home/FlashDeals";
import CategoryRow from "@/components/home/CategoryRow";
import MemberZone from "@/components/home/MemberZone";
import TrustBar from "@/components/home/TrustBar";
import RecentlyViewed from "@/components/products/RecentlyViewed";

interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl: string | null;
  stock: number;
  category: { name: string } | null;
  flashDealDiscount?: number;
  flashDealEndsAt?: string | null;
  isMemberExclusive?: boolean;
}

interface Category {
  id: string;
  name: string;
  description: string | null;
}

interface HomeData {
  flashDeals: Product[];
  newArrivals: Product[];
  memberProducts: Product[];
  categoryRows: { category: Category; products: Product[] }[];
  minTierForExclusive: string;
}

export default function HomePage() {
  const { data: session } = useSession();
  const [data, setData] = useState<HomeData | null>(null);

  useEffect(() => {
    const ac = new AbortController();
    fetch("/api/home", { signal: ac.signal })
      .then((r) => r.json())
      .then((d) => {
        if (d.data) setData(d.data);
      })
      .catch(() => {});
    return () => ac.abort();
  }, []);

  const heroProduct = data?.flashDeals?.[0];

  return (
    <div>
      {/* ── ① Hero ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-900 via-primary-800 to-accent-600 py-24 md:py-36">
        {/* Decorative blobs */}
        <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-accent-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-32 h-80 w-80 rounded-full bg-primary-400/10 blur-3xl" />
        <div className="pointer-events-none absolute left-1/4 top-20 h-6 w-6 rounded-full bg-white/10 animate-float" style={{ animationDelay: "0s" }} />
        <div className="pointer-events-none absolute right-1/3 top-32 h-4 w-4 rounded-full bg-accent-300/20 animate-float" style={{ animationDelay: "0.8s" }} />
        <div className="pointer-events-none absolute left-2/3 bottom-24 h-5 w-5 rounded-full bg-white/15 animate-float" style={{ animationDelay: "1.6s" }} />
        <div className="pointer-events-none absolute right-1/4 bottom-32 h-3 w-3 rounded-full bg-accent-400/20 animate-float" style={{ animationDelay: "2.4s" }} />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNCI+PHBhdGggZD0iTTM2IDM0djItSDJWMTdsMnYxNXoiLz48cGF0aCBkPSJNMzYgMzR2LThoMnY2aC0yeiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative mx-auto max-w-7xl px-4 text-center"
        >
          <HeroSearch />

          {session?.user ? (
            <>
              <h1 className="text-3xl font-bold tracking-tight text-white md:text-5xl [text-shadow:0_2px_12px_rgb(0_0_0_/_0.3)]">
                你好，{session.user.name || "用户"} 👋
              </h1>
              <p className="mx-auto mt-4 max-w-xl text-lg text-white/80">
                为你精选好物，看看今天有什么值得买的吧
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <Link
                  href="/products"
                  className="inline-flex items-center justify-center rounded-full bg-accent-500 px-8 py-3.5 text-base font-medium text-white shadow-lg shadow-primary-900/20 transition-all duration-200 hover:bg-accent-600 active:scale-[0.97]"
                >
                  去购物 <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </>
          ) : (
            <>
              <h1 className="text-4xl font-bold tracking-tight text-white md:text-6xl [text-shadow:0_2px_12px_rgb(0_0_0_/_0.3)]">
                发现精选好物
              </h1>
              <p className="mx-auto mt-4 max-w-xl text-lg text-white/80">
                从数码到家居，精选优质商品，尽在简购
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <Link
                  href="/products"
                  className="inline-flex items-center justify-center rounded-full bg-accent-500 px-8 py-3.5 text-base font-medium text-white shadow-lg shadow-primary-900/20 transition-all duration-200 hover:bg-accent-600 active:scale-[0.97]"
                >
                  立即选购 <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center rounded-full border border-white/30 bg-white/10 px-8 py-3.5 text-base font-medium text-white backdrop-blur-sm transition-all duration-200 hover:bg-white/20 active:scale-[0.97]"
                >
                  登录
                </Link>
              </div>
              <p className="mt-4 text-sm text-white/50">
                没有账号？<Link href="/register" className="text-white/80 underline hover:text-white">立即注册</Link>
              </p>
            </>
          )}
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="flex flex-col items-center gap-1"
          >
            <span className="text-xs text-white/50">向下滚动</span>
            <svg className="h-4 w-4 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </motion.div>
        </motion.div>
      </section>

      {/* ── ② QuickNav ──────────────────────────────────────────── */}
      <QuickNav />

      {/* ── ③ Flash Deals ──────────────────────────────────────── */}
      {data?.flashDeals && <FlashDeals products={data.flashDeals} />}

      {/* ── ④ New Arrivals ─────────────────────────────────────── */}
      {data?.newArrivals && data.newArrivals.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-6">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex h-5 w-0.5 rounded-full bg-primary-500" />
              <h2 className="text-lg font-bold text-foreground">✨ 新品首发</h2>
            </div>
            <Link
              href="/products?section=new"
              className="flex items-center gap-0.5 text-xs text-muted-foreground hover:text-primary-600"
            >
              查看更多 <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {data.newArrivals.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* ── ⑤ Category Rows ────────────────────────────────────── */}
      {data?.categoryRows?.map((row) => (
        <CategoryRow key={row.category.id} category={row.category} products={row.products} />
      ))}

      {/* ── ⑥ Member Zone ──────────────────────────────────────── */}
      <MemberZone products={data?.memberProducts ?? []} minTier={data?.minTierForExclusive ?? "GOLD"} />

      {/* ── ⑦ Recently Viewed ──────────────────────────────────── */}
      <RecentlyViewed />

      {/* ── ⑧ Trust Bar ────────────────────────────────────────── */}
      <TrustBar />
    </div>
  );
}
