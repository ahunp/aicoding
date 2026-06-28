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
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-900 via-primary-700 to-accent-500 py-24 md:py-32">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDJWMTdsMnYxNXoiLz48cGF0aCBkPSJNMzYgMzR2LThoMnY2aC0yeiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative mx-auto max-w-7xl px-4 text-center"
        >
          <h1 className="text-4xl font-bold tracking-tight text-white md:text-6xl">
            发现精选好物
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-white/80">
            从数码到家居，精选优质商品，尽在 Mini Mall
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link
              href="/products"
              className={buttonVariants({ variant: "accent", size: "lg", className: "text-base" })}
            >
              立即选购 <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <Link
              href="/register"
              className={buttonVariants({ variant: "secondary", size: "lg", className: "text-base bg-white/20 text-white hover:bg-white/30 border-0" })}
            >
              注册账号
            </Link>
          </div>
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
                  <p className="mt-1 text-lg font-bold text-danger-500">
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
