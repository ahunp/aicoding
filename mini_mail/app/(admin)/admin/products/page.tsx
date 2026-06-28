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
  searchParams: Promise<{ page?: string; search?: string }>;
}) {
  const sp = await searchParams;
  const page = Math.max(1, Number(sp.page) || 1);
  const search = sp.search || "";
  const limit = 20;

  const where = search ? { name: { contains: search } } : {};

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: { category: true },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.product.count({ where }),
  ]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">商品管理</h1>
        <Link href="/admin/products/new">
          <Button>添加商品</Button>
        </Link>
      </div>

      <form className="mb-4 flex gap-2">
        <Input
          name="search"
          defaultValue={search}
          placeholder="搜索商品名称..."
          className="max-w-xs"
        />
        <Button type="submit" variant="secondary">搜索</Button>
      </form>

      <Card className="overflow-x-auto" padding={false}>
        <table className="w-full text-sm">
          <thead className="border-b bg-muted text-left">
            <tr>
              <th className="px-4 py-3 font-medium text-muted-foreground">名称</th>
              <th className="px-4 py-3 font-medium text-muted-foreground">分类</th>
              <th className="px-4 py-3 font-medium text-muted-foreground">价格</th>
              <th className="px-4 py-3 font-medium text-muted-foreground">库存</th>
              <th className="px-4 py-3 font-medium text-muted-foreground">状态</th>
              <th className="px-4 py-3 font-medium text-muted-foreground">创建时间</th>
              <th className="px-4 py-3 font-medium text-muted-foreground">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {products.map((p) => (
              <tr key={p.id} className="hover:bg-muted">
                <td className="px-4 py-3 text-foreground">{p.name}</td>
                <td className="px-4 py-3 text-muted-foreground">{p.category?.name}</td>
                <td className="px-4 py-3 text-foreground">{formatPrice(p.price)}</td>
                <td className="px-4 py-3">{p.stock}</td>
                <td className="px-4 py-3">
                  <Badge variant={p.isActive ? "success" : "danger"}>
                    {p.isActive ? "上架" : "下架"}
                  </Badge>
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
            ))}
          </tbody>
        </table>
      </Card>

      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Link
              key={p}
              href={`/admin/products?page=${p}${search ? `&search=${search}` : ""}`}
              className={`rounded px-3 py-1 text-sm ${
                p === page
                  ? "bg-primary-600 text-white"
                  : "bg-muted text-foreground hover:bg-muted-foreground/20"
              }`}
            >
              {p}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
