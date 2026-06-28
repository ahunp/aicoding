import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import Link from "next/link";
import ProductGrid from "@/components/products/ProductGrid";
import ProductSearch from "@/components/products/ProductSearch";
import CategoryFilter from "@/components/products/CategoryFilter";
import Pagination from "@/components/products/Pagination";

interface ProductsPageProps {
  searchParams: Promise<{
    search?: string;
    category?: string;
    page?: string;
  }>;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams;
  const search = params.search || "";
  const categoryId = params.category || "";
  const page = Math.max(1, parseInt(params.page || "1"));
  const limit = 12;

  const where = {
    isActive: true,
    ...(search ? { name: { contains: search } } : {}),
    ...(categoryId ? { categoryId } : {}),
  };

  const [products, total, categories, session] = await Promise.all([
    prisma.product.findMany({
      where,
      include: { category: true },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.product.count({ where }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    auth(),
  ]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">全部商品</h1>
        <div className="flex items-center gap-3">
            <ProductSearch />
            <Link
            href="/products"
            className="text-sm text-blue-600 hover:underline"
          >
            清空筛选
          </Link>
        </div>
      </div>

      <div className="mb-6">
        <CategoryFilter categories={categories} />
      </div>

      <ProductGrid products={products} />

      <Pagination current={page} total={total} limit={limit} />

      {!session?.user && (
        <div className="mt-8 rounded-lg bg-blue-50 p-6 text-center">
          <p className="text-sm text-blue-800">
            登录后即可加入购物车和下单
          </p>
          <div className="mt-3 flex justify-center gap-3">
            <Link
              href="/login"
              className="rounded bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
            >
              登录
            </Link>
            <Link
              href="/register"
              className="rounded bg-white px-4 py-2 text-sm text-blue-600 hover:bg-blue-50"
            >
              注册
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
