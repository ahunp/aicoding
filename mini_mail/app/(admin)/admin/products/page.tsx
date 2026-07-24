import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatPrice, formatDate } from "@/lib/utils";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import ProductsTable from "./ProductsTable";

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string; search?: string; categoryId?: string; priceMin?: string; priceMax?: string;
    productTag?: string; sortBy?: string; sortOrder?: string;
  }>;
}) {
  const sp = await searchParams;
  const page = Math.max(1, Number(sp.page) || 1);
  const search = sp.search || "";
  const categoryId = sp.categoryId || "";
  const priceMin = sp.priceMin || "";
  const priceMax = sp.priceMax || "";
  const productTag = sp.productTag || "";
  const sortBy = sp.sortBy || "createdAt";
  const sortOrder = sp.sortOrder || "desc";
  const limit = 20;

  const where = {
    ...(search ? { name: { contains: search } } : {}),
    ...(categoryId ? { categoryId } : {}),
    ...(priceMin || priceMax ? { price: { ...(priceMin ? { gte: parseFloat(priceMin) } : {}), ...(priceMax ? { lte: parseFloat(priceMax) } : {}) } } : {}),
    ...(productTag === "member" ? { isMemberExclusive: true } : productTag === "flash" ? { isFlashDeal: true } : {}),
  };

  const validSort = ["createdAt", "price", "stock", "name"];
  const field = validSort.includes(sortBy) ? sortBy : "createdAt";
  const order = sortOrder === "asc" ? "asc" : "desc";

  const [products, total, categories] = await Promise.all([
    prisma.product.findMany({ where, include: { category: true }, orderBy: { [field]: order }, skip: (page - 1) * limit, take: limit }),
    prisma.product.count({ where }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">商品管理</h1>
        <Link href="/admin/products/new"><Button>添加商品</Button></Link>
      </div>

      <form className="mb-4 space-y-3">
        <div className="flex flex-wrap gap-2">
          <Input name="search" defaultValue={search} placeholder="搜索商品名称..." className="max-w-xs" />
          <select name="categoryId" defaultValue={categoryId} className="rounded-lg border border-border bg-surface px-3 py-2 text-sm">
            <option value="">全部分类</option>
            {categories.map((c) => (<option key={c.id} value={c.id}>{c.name}</option>))}
          </select>
          <Input name="priceMin" defaultValue={priceMin} placeholder="最低价" type="number" step="0.01" className="w-24" />
          <Input name="priceMax" defaultValue={priceMax} placeholder="最高价" type="number" step="0.01" className="w-24" />
          <select name="productTag" defaultValue={productTag} className="rounded-lg border border-border bg-surface px-3 py-2 text-sm">
            <option value="">全部商品</option>
            <option value="member">会员专享</option>
            <option value="flash">限时抢购</option>
          </select>
          <Button type="submit" variant="secondary">筛选</Button>
          {(search || categoryId || priceMin || priceMax || productTag) && (
            <Link href="/admin/products" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">清空</Link>
          )}
        </div>
      </form>

      <ProductsTable products={products} sortBy={sortBy} sortOrder={sortOrder} />

      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
            const params = new URLSearchParams();
            params.set("page", String(p));
            if (search) params.set("search", search);
            if (categoryId) params.set("categoryId", categoryId);
            if (priceMin) params.set("priceMin", priceMin);
            if (priceMax) params.set("priceMax", priceMax);
            if (productTag) params.set("productTag", productTag);
            params.set("sortBy", sortBy);
            params.set("sortOrder", sortOrder);
            return (
              <Link key={p} href={`/admin/products?${params.toString()}`}
                className={`rounded px-3 py-1 text-sm ${p === page ? "bg-primary-600 text-white" : "bg-muted text-foreground hover:bg-muted-foreground/20"}`}>{p}</Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
