import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatPrice, formatDate } from "@/lib/utils";
import DeleteButton from "./DeleteButton";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    search?: string;
    categoryId?: string;
    priceMin?: string;
    priceMax?: string;
    memberExclusive?: string;
    flashDeal?: string;
    sortBy?: string;
    sortOrder?: string;
  }>;
}) {
  const sp = await searchParams;
  const page = Math.max(1, Number(sp.page) || 1);
  const search = sp.search || "";
  const categoryId = sp.categoryId || "";
  const priceMin = sp.priceMin || "";
  const priceMax = sp.priceMax || "";
  const memberExclusive = sp.memberExclusive || "";
  const flashDeal = sp.flashDeal || "";
  const sortBy = sp.sortBy || "createdAt";
  const sortOrder = sp.sortOrder || "desc";
  const limit = 20;

  const where = {
    ...(search ? { name: { contains: search } } : {}),
    ...(categoryId ? { categoryId } : {}),
    ...(priceMin || priceMax ? {
      price: {
        ...(priceMin ? { gte: parseFloat(priceMin) } : {}),
        ...(priceMax ? { lte: parseFloat(priceMax) } : {}),
      },
    } : {}),
    ...(memberExclusive === "1" ? { isMemberExclusive: true } : {}),
    ...(flashDeal === "1" ? { isFlashDeal: true } : {}),
  };

  const validSort = ["createdAt", "price", "stock", "name"];
  const field = validSort.includes(sortBy) ? sortBy : "createdAt";
  const order = sortOrder === "asc" ? "asc" : "desc";

  const [products, total, categories] = await Promise.all([
    prisma.product.findMany({
      where,
      include: { category: true },
      orderBy: { [field]: order },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.product.count({ where }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  const totalPages = Math.ceil(total / limit);

  function rowClass(stock: number) {
    if (stock === 0) return "bg-danger-50/50";
    if (stock <= 5) return "bg-warning-50/50";
    return "";
  }

  function stockLabel(stock: number) {
    if (stock === 0) return <Badge variant="danger">已售罄</Badge>;
    if (stock <= 5) return <Badge variant="warning">库存不足</Badge>;
    return null;
  }

  function sortLink(fieldName: string) {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (categoryId) params.set("categoryId", categoryId);
    if (priceMin) params.set("priceMin", priceMin);
    if (priceMax) params.set("priceMax", priceMax);
    params.set("sortBy", fieldName);
    if (sortBy === fieldName) {
      params.set("sortOrder", sortOrder === "asc" ? "desc" : "asc");
    } else {
      params.set("sortOrder", "asc");
    }
    return `/admin/products?${params.toString()}`;
  }

  function sortArrow(fieldName: string) {
    if (sortBy !== fieldName) return "";
    return sortOrder === "asc" ? " ↑" : " ↓";
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">商品管理</h1>
        <Link href="/admin/products/new">
          <Button>添加商品</Button>
        </Link>
      </div>

      {/* Filter form */}
      <form className="mb-4 space-y-3">
        <div className="flex flex-wrap gap-2">
          <Input
            name="search"
            defaultValue={search}
            placeholder="搜索商品名称..."
            className="max-w-xs"
          />
          <select
            name="categoryId"
            defaultValue={categoryId}
            className="rounded-lg border border-border bg-surface px-3 py-2 text-sm"
          >
            <option value="">全部分类</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          <Input
            name="priceMin"
            defaultValue={priceMin}
            placeholder="最低价"
            type="number"
            step="0.01"
            className="w-24"
          />
          <Input
            name="priceMax"
            defaultValue={priceMax}
            placeholder="最高价"
            type="number"
            step="0.01"
            className="w-24"
          />
          <select
            name="memberExclusive"
            defaultValue={memberExclusive}
            className="rounded-lg border border-border bg-surface px-3 py-2 text-sm"
          >
            <option value="">全部商品</option>
            <option value="1">会员专享</option>
          </select>
          <select
            name="flashDeal"
            defaultValue={flashDeal}
            className="rounded-lg border border-border bg-surface px-3 py-2 text-sm"
          >
            <option value="">全部商品</option>
            <option value="1">限时抢购</option>
          </select>
          <Button type="submit" variant="secondary">筛选</Button>
          {(search || categoryId || priceMin || priceMax || memberExclusive || flashDeal) && (
            <Link href="/admin/products" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
              清空
            </Link>
          )}
        </div>
      </form>

      <Card className="overflow-x-auto" padding={false}>
        <table className="w-full text-sm">
          <thead className="border-b bg-muted text-left">
            <tr>
              <th className="px-4 py-3 font-medium text-muted-foreground w-4" />
              <th className="px-4 py-3 font-medium text-muted-foreground">
                <Link href={sortLink("name")} className="hover:text-foreground">
                  名称{sortArrow("name")}
                </Link>
              </th>
              <th className="px-4 py-3 font-medium text-muted-foreground">分类</th>
              <th className="px-4 py-3 font-medium text-muted-foreground">
                <Link href={sortLink("price")} className="hover:text-foreground">
                  价格{sortArrow("price")}
                </Link>
              </th>
              <th className="px-4 py-3 font-medium text-muted-foreground">
                <Link href={sortLink("stock")} className="hover:text-foreground">
                  库存{sortArrow("stock")}
                </Link>
              </th>
              <th className="px-4 py-3 font-medium text-muted-foreground">状态</th>
              <th className="px-4 py-3 font-medium text-muted-foreground">会员</th>
              <th className="px-4 py-3 font-medium text-muted-foreground">抢购</th>
              <th className="px-4 py-3 font-medium text-muted-foreground">
                <Link href={sortLink("createdAt")} className="hover:text-foreground">
                  创建时间{sortArrow("createdAt")}
                </Link>
              </th>
              <th className="px-4 py-3 font-medium text-muted-foreground">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {products.length === 0 ? (
              <tr>
                <td colSpan={10} className="px-4 py-8 text-center text-sm text-muted-foreground">
                  没有找到匹配的商品
                </td>
              </tr>
            ) : (
              products.map((p) => (
                <tr key={p.id} className={`hover:bg-muted ${rowClass(p.stock)}`}>
                  <td className="px-4 py-3">
                    {p.stock === 0 && <span className="block h-2 w-2 rounded-full bg-danger-500" title="已售罄" />}
                    {p.stock > 0 && p.stock <= 5 && <span className="block h-2 w-2 rounded-full bg-warning-500" title="库存不足" />}
                  </td>
                  <td className="px-4 py-3 text-foreground">{p.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{p.category?.name}</td>
                  <td className="px-4 py-3 text-foreground">{formatPrice(p.price)}</td>
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-2">
                      {p.stock}
                      {stockLabel(p.stock)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={p.isActive ? "success" : "danger"}>
                      {p.isActive ? "上架" : "下架"}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    {p.isMemberExclusive ? (
                      <Badge variant="info">会员</Badge>
                    ) : (
                      <span className="text-xs text-muted-foreground">-</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {p.isFlashDeal ? (
                      <Badge variant="danger">
                        抢购{p.flashDealDiscount > 0 ? ` ${p.flashDealDiscount}%` : ""}
                      </Badge>
                    ) : (
                      <span className="text-xs text-muted-foreground">-</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{formatDate(p.createdAt)}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <Link
                        href={`/admin/products/${p.id}/edit`}
                        className="text-primary-600 hover:text-primary-700"
                      >
                        编辑
                      </Link>
                      <DeleteButton id={p.id} />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </Card>

      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
            const params = new URLSearchParams();
            params.set("page", String(p));
            if (search) params.set("search", search);
            if (categoryId) params.set("categoryId", categoryId);
            if (priceMin) params.set("priceMin", priceMin);
            if (priceMax) params.set("priceMax", priceMax);
            params.set("sortBy", sortBy);
            params.set("sortOrder", sortOrder);
            return (
              <Link
                key={p}
                href={`/admin/products?${params.toString()}`}
                className={`rounded px-3 py-1 text-sm ${
                  p === page
                    ? "bg-primary-600 text-white"
                    : "bg-muted text-foreground hover:bg-muted-foreground/20"
                }`}
              >
                {p}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
