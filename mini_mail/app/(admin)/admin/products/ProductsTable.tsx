"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { formatPrice, formatDate } from "@/lib/utils";
import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { toast } from "@/lib/toast";

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  isActive: boolean;
  isMemberExclusive: boolean;
  isFlashDeal: boolean;
  flashDealDiscount: number;
  createdAt: Date | string;
  category: { name: string } | null;
}

function DelBtn({ id }: { id: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  return (
    <button onClick={async () => {
      if (!confirm("确定删除？")) return;
      setBusy(true);
      await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
      router.refresh();
    }} disabled={busy} className="text-danger-500 hover:text-danger-700 text-sm">
      {busy ? "..." : "删除"}
    </button>
  );
}

function SortTh({ field, currentSortBy, currentSortOrder, children }: {
  field: string;
  currentSortBy: string;
  currentSortOrder: string;
  children: React.ReactNode;
}) {
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams.toString());
  const isActive = currentSortBy === field;
  const newOrder = isActive && currentSortOrder === "asc" ? "desc" : "asc";
  params.set("sortBy", field);
  params.set("sortOrder", newOrder);
  params.delete("page");

  return (
    <Link
      href={`/admin/products?${params.toString()}`}
      className="inline-flex items-center gap-1.5 hover:text-foreground"
    >
      {children}
      <span className={`text-xs leading-none transition-opacity ${isActive ? "text-primary-600" : "text-muted-foreground/40"}`}>
        {isActive ? (currentSortOrder === "asc" ? "↑" : "↓") : "⇅"}
      </span>
    </Link>
  );
}

export default function ProductsTable({ products, sortBy, sortOrder }: {
  products: Product[];
  sortBy: string;
  sortOrder: string;
}) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [priceVal, setPriceVal] = useState("");
  const [loading, setLoading] = useState(false);
  const allSelected = products.length > 0 && selected.size === products.length;
  const ids = Array.from(selected);

  function toggleAll() {
    setSelected(allSelected ? new Set() : new Set(products.map((p) => p.id)));
  }

  function toggle(id: string) {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id); else next.add(id);
    setSelected(next);
  }

  async function batch(action: string, extra?: Record<string, unknown>) {
    if (ids.length === 0) { toast("请先选择商品", "error"); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/admin/products", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids, action, ...extra }),
      });
      if (!res.ok) { const d = await res.json(); toast(d.error, "error"); return; }
      toast(`已更新 ${ids.length} 件商品`, "success");
      setSelected(new Set());
      window.location.reload();
    } catch { toast("操作失败", "error"); }
    finally { setLoading(false); }
  }

  return (
    <>
      <Card className="overflow-x-auto" padding={false}>
        <table className="w-full text-sm">
          <thead className="border-b bg-muted text-left">
            <tr>
              <th className="w-10 px-4 py-3"><input type="checkbox" checked={allSelected} onChange={toggleAll} className="rounded border-border" /></th>
              <th className="px-4 py-3 font-medium text-muted-foreground"><SortTh field="name" currentSortBy={sortBy} currentSortOrder={sortOrder}>名称</SortTh></th>
              <th className="px-4 py-3 font-medium text-muted-foreground">分类</th>
              <th className="px-4 py-3 font-medium text-muted-foreground"><SortTh field="price" currentSortBy={sortBy} currentSortOrder={sortOrder}>价格</SortTh></th>
              <th className="px-4 py-3 font-medium text-muted-foreground"><SortTh field="stock" currentSortBy={sortBy} currentSortOrder={sortOrder}>库存</SortTh></th>
              <th className="px-4 py-3 font-medium text-muted-foreground">状态</th>
              <th className="px-4 py-3 font-medium text-muted-foreground">会员</th>
              <th className="px-4 py-3 font-medium text-muted-foreground">抢购</th>
              <th className="px-4 py-3 font-medium text-muted-foreground"><SortTh field="createdAt" currentSortBy={sortBy} currentSortOrder={sortOrder}>时间</SortTh></th>
              <th className="px-4 py-3 font-medium text-muted-foreground">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {products.length === 0 ? (
              <tr><td colSpan={10} className="px-4 py-8 text-center text-sm text-muted-foreground">没有找到匹配的商品</td></tr>
            ) : (
              products.map((p) => (
                <tr key={p.id} className={`hover:bg-muted ${p.stock === 0 ? "bg-danger-50/50" : p.stock <= 5 ? "bg-warning-50/50" : ""}`}>
                  <td className="px-4 py-3"><input type="checkbox" checked={selected.has(p.id)} onChange={() => toggle(p.id)} className="rounded border-border" /></td>
                  <td className="px-4 py-3 text-foreground">{p.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{p.category?.name}</td>
                  <td className="px-4 py-3 text-foreground">{formatPrice(p.price)}</td>
                  <td className="px-4 py-3"><span className="flex items-center gap-2">{p.stock}{p.stock === 0 ? <Badge variant="danger">已售罄</Badge> : p.stock <= 5 ? <Badge variant="warning">不足</Badge> : null}</span></td>
                  <td className="px-4 py-3"><Badge variant={p.isActive ? "success" : "danger"}>{p.isActive ? "上架" : "下架"}</Badge></td>
                  <td className="px-4 py-3">{p.isMemberExclusive ? <Badge variant="info">会员</Badge> : <span className="text-xs text-muted-foreground">-</span>}</td>
                  <td className="px-4 py-3">{p.isFlashDeal ? <Badge variant="danger">抢购{p.flashDealDiscount > 0 ? ` ${p.flashDealDiscount}%` : ""}</Badge> : <span className="text-xs text-muted-foreground">-</span>}</td>
                  <td className="px-4 py-3 text-muted-foreground">{formatDate(p.createdAt)}</td>
                  <td className="px-4 py-3"><div className="flex gap-2"><Link href={`/admin/products/${p.id}/edit`} className="text-primary-600 hover:text-primary-700">编辑</Link><DelBtn id={p.id} /></div></td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </Card>

      {selected.size > 0 && (
        <div className="sticky bottom-4 mt-4 flex flex-wrap items-center gap-3 rounded-xl border border-border bg-surface p-3 shadow-lg">
          <span className="text-sm text-muted-foreground">已选 {selected.size} 件</span>
          <Button size="sm" variant="success" disabled={loading} onClick={() => batch("activate")}>上架</Button>
          <Button size="sm" variant="secondary" disabled={loading} onClick={() => batch("deactivate")}>下架</Button>
          <div className="flex items-center gap-2">
            <Input type="number" step="0.01" min="0.01" value={priceVal} onChange={(e) => setPriceVal(e.target.value)} placeholder="改价" className="w-20" />
            <Button size="sm" variant="secondary" disabled={loading || !priceVal} onClick={() => batch("price", { price: parseFloat(priceVal) })}>改价</Button>
          </div>
        </div>
      )}
    </>
  );
}
