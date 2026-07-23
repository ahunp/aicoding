import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import ProductGrid from "@/components/products/ProductGrid";
import ProductSearch from "@/components/products/ProductSearch";
import CategoryFilter from "@/components/products/CategoryFilter";
import Pagination from "@/components/products/Pagination";
import Button from "@/components/ui/Button";
import { ArrowLeft } from "lucide-react";
import type { Prisma } from "@prisma/client";

interface ProductsPageProps {
  searchParams: Promise<{
    search?: string;
    category?: string;
    page?: string;
    sortBy?: string;
    sortOrder?: string;
    section?: string;
  }>;
}

const SECTION_CONFIG: Record<string, { title: string; sub: string; icon: string; gradient: string; defaultSortBy: string; defaultSortOrder: string; memberExclusive?: boolean }> = {
  new: {
    title: "新品上市",
    sub: "最新上架的好物，抢先体验",
    icon: "🎉",
    gradient: "from-blue-500/10 to-indigo-500/10",
    defaultSortBy: "createdAt",
    defaultSortOrder: "desc",
  },
  deals: {
    title: "限时特惠",
    sub: "超值优选，性价比之选",
    icon: "🔥",
    gradient: "from-orange-500/10 to-red-500/10",
    defaultSortBy: "price",
    defaultSortOrder: "asc",
  },
  member: {
    title: "会员专享",
    sub: "尊享好物，仅限会员购买",
    icon: "💎",
    gradient: "from-purple-500/10 to-pink-500/10",
    defaultSortBy: "createdAt",
    defaultSortOrder: "desc",
    memberExclusive: true,
  },
};

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams;
  const section = params.section || "";
  const sectionCfg = section ? SECTION_CONFIG[section] : null;
  const search = params.search || "";
  const categoryId = params.category || "";
  const page = Math.max(1, parseInt(params.page || "1"));
  const sortBy = sectionCfg ? (params.sortBy || sectionCfg.defaultSortBy) : (params.sortBy || "createdAt");
  const sortOrder = sectionCfg ? (params.sortOrder || sectionCfg.defaultSortOrder) : (params.sortOrder || "desc");
  const limit = 12;

  const where: Prisma.ProductWhereInput = { isActive: true };
  if (search) where.name = { contains: search };
  if (categoryId) where.categoryId = categoryId;
  if (sectionCfg?.memberExclusive) where.isMemberExclusive = true;

  const validSort = ["createdAt", "price", "name"];
  const field = validSort.includes(sortBy) ? sortBy : "createdAt";
  const order = sortOrder === "asc" ? "asc" : "desc";

  const [products, total, categories, session] = await Promise.all([
    prisma.product.findMany({
      where,
      include: { category: true },
      orderBy: { [field]: order },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.product.count({ where }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    auth(),
  ]);

  // Fetch fallback recommendations when no results
  const fallbackProducts = products.length === 0 && search
    ? await prisma.product.findMany({
        where: { isActive: true },
        include: { category: true },
        orderBy: { price: "asc" },
        take: 4,
      })
    : [];

  const sortOptions = [
    { label: "最新", by: "createdAt", order: "desc" },
    { label: "价格 ↑", by: "price", order: "asc" },
    { label: "价格 ↓", by: "price", order: "desc" },
    { label: "名称 A-Z", by: "name", order: "asc" },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      {/* Section header banner */}
      {sectionCfg && (
        <div className={`mb-8 rounded-2xl bg-gradient-to-r ${sectionCfg.gradient} border border-border/50 p-6 md:p-8`}>
          <Link
            href="/products"
            className="mb-3 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-3 w-3" /> 全部商品
          </Link>
          <p className="text-2xl md:text-3xl font-bold text-foreground">
            {sectionCfg.icon} {sectionCfg.title}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">{sectionCfg.sub}</p>
        </div>
      )}

      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">
          {sectionCfg ? sectionCfg.title : "全部商品"}
        </h1>
        <div className="flex items-center gap-3">
          <ProductSearch />
          <Link href="/products" className="text-sm text-primary-600 hover:underline">
            清空筛选
          </Link>
        </div>
      </div>

      {/* Sort + Category filters */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <CategoryFilter categories={categories} />
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">排序：</span>
          <div className="flex gap-1">
            {sortOptions.map((opt) => {
              const sp = new URLSearchParams();
              if (search) sp.set("search", search);
              if (categoryId) sp.set("category", categoryId);
              if (section) sp.set("section", section);
              sp.set("sortBy", opt.by);
              sp.set("sortOrder", opt.order);
              const isActive = sortBy === opt.by && sortOrder === opt.order;
              return (
                <Link
                  key={opt.label}
                  href={`/products?${sp.toString()}`}
                  className={`rounded px-2.5 py-1 text-xs transition-colors ${isActive ? "bg-primary-600 text-white" : "bg-muted text-muted-foreground hover:bg-muted-foreground/20"}`}
                >
                  {opt.label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Results count */}
      <p className="mb-4 text-xs text-muted-foreground">
        共 {total} 件商品
      </p>

      <ProductGrid products={products} />

      {fallbackProducts.length > 0 && (
        <div className="mt-8">
          <div className="mb-4 flex items-center gap-2">
            <span className="flex h-5 w-0.5 rounded-full bg-primary-500" />
            <h2 className="text-lg font-bold text-foreground">没有找到相关商品，看看这些吧</h2>
          </div>
          <ProductGrid products={fallbackProducts} />
        </div>
      )}

      <Pagination current={page} total={total} limit={limit} />

      {!session?.user && (
        <div className="mt-8 rounded-lg bg-primary-50 p-6 text-center">
          <p className="text-sm text-primary-700">登录后即可加入购物车和下单</p>
          <div className="mt-3 flex justify-center gap-3">
            <Link href="/login"><Button variant="primary">登录</Button></Link>
            <Link href="/register"><Button variant="outline">注册</Button></Link>
          </div>
        </div>
      )}
    </div>
  );
}
