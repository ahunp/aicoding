"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { Package, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { buttonVariants } from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { formatPrice } from "@/lib/utils";

interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl: string | null;
  category: { name: string } | null;
}

interface Category {
  id: string;
  name: string;
  description: string | null;
}

export default function HomePage() {
  const { data: session } = useSession();
  const [featured, setFeatured] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const ac = new AbortController();
    fetch("/api/products?limit=4&sort=latest", { signal: ac.signal })
      .then((r) => r.json())
      .then((d) => {
        if (d.data) setFeatured(d.data);
      })
      .catch(() => {});

    fetch("/api/categories", { signal: ac.signal })
      .then((r) => r.json())
      .then((d) => {
        if (d.data) setCategories(d.data);
      })
      .catch(() => {});

    return () => ac.abort();
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-900 via-primary-800 to-accent-600 py-24 md:py-36">
        {/* Decorative blobs */}
        <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-accent-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-32 h-80 w-80 rounded-full bg-primary-400/10 blur-3xl" />

        {/* Floating decorative circles */}
        <div className="pointer-events-none absolute left-1/4 top-20 h-6 w-6 rounded-full bg-white/10 animate-float" style={{ animationDelay: "0s" }} />
        <div className="pointer-events-none absolute right-1/3 top-32 h-4 w-4 rounded-full bg-accent-300/20 animate-float" style={{ animationDelay: "0.8s" }} />
        <div className="pointer-events-none absolute left-2/3 bottom-24 h-5 w-5 rounded-full bg-white/15 animate-float" style={{ animationDelay: "1.6s" }} />
        <div className="pointer-events-none absolute right-1/4 bottom-32 h-3 w-3 rounded-full bg-accent-400/20 animate-float" style={{ animationDelay: "2.4s" }} />

        {/* SVG pattern overlay */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNCI+PHBhdGggZD0iTTM2IDM0djItSDJWMTdsMnYxNXoiLz48cGF0aCBkPSJNMzYgMzR2LThoMnY2aC0yeiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative mx-auto max-w-7xl px-4 text-center"
        >
          <h1 className="text-4xl font-bold tracking-tight text-white md:text-6xl [text-shadow:0_2px_12px_rgb(0_0_0_/_0.3)]">
            发现精选好物
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-white/80">
            从数码到家居，精选优质商品，尽在简购
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/products"
              className="inline-flex items-center justify-center rounded-full bg-accent-500 px-8 py-3.5 text-base font-medium text-white shadow-lg shadow-primary-900/20 transition-all duration-200 hover:bg-accent-600 hover:shadow-xl hover:shadow-primary-900/30 active:scale-[0.97]"
            >
              立即选购 <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center justify-center rounded-full border border-white/30 bg-white/10 px-8 py-3.5 text-base font-medium text-white backdrop-blur-sm transition-all duration-200 hover:bg-white/20 active:scale-[0.97]"
            >
              注册账号
            </Link>
          </div>
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

      {/* Featured Products */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-foreground">精选好物</h2>
          <Link href="/products" className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1">
            查看全部 <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        {featured.length === 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4">
            {Array.from({ length: 4 }, (_, i) => (
              <div key={i} className="h-64 animate-pulse rounded-lg bg-muted" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4">
            {featured.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.08 }}
              >
                <Link
                  href={`/products/${product.id}`}
                  className="group block rounded-lg border border-border bg-surface p-4 shadow-card transition-shadow hover:shadow-card-hover"
                >
                  <div className="mb-3 relative h-40 rounded bg-muted">
                    {product.imageUrl ? (
                      <Image src={product.imageUrl} alt={product.name} fill className="object-contain p-2" sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 25vw" />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <Package className="h-12 w-12 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <h3 className="text-sm font-medium text-foreground group-hover:text-primary-600 line-clamp-2">
                    {product.name}
                  </h3>
                  <p className="mt-1 text-lg font-bold text-price">
                    {formatPrice(product.price)}
                  </p>
                  {product.category && (
                    <Badge className="mt-1">{product.category.name}</Badge>
                  )}
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* Category Cards */}
      <section className="bg-muted py-16">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="mb-8 text-2xl font-bold text-foreground">商品分类</h2>
          {categories.length === 0 ? (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
              {Array.from({ length: 5 }, (_, i) => (
                <div key={i} className="h-24 animate-pulse rounded-lg bg-surface" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/products?category=${cat.id}`}
                  className="group rounded-lg bg-surface p-6 text-center shadow-card transition-shadow hover:shadow-card-hover"
                >
                  <p className="text-sm font-medium text-foreground group-hover:text-primary-600">
                    {cat.name}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    浏览商品
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Banner — 未登录时显示 */}
      {!session?.user && (
        <section className="mx-auto max-w-7xl px-4 py-16 text-center">
          <div className="rounded-2xl bg-gradient-to-r from-primary-600 to-primary-800 p-12">
            <h2 className="text-2xl font-bold text-white">准备好开始购物了吗？</h2>
            <p className="mt-2 text-white/80">注册账号，立即享受会员折扣</p>
            <Link
              href="/register"
              className="mt-6 inline-block"
            >
              <span className={buttonVariants({ variant: "accent", size: "lg", className: "text-base" })}>
                立即注册
              </span>
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}
