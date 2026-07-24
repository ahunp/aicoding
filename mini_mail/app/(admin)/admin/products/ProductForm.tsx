"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

interface Category {
  id: string;
  name: string;
}

interface ProductFormProps {
  categories: Category[];
  initial?: {
    id: string;
    name: string;
    price: number;
    description: string;
    imageUrl: string;
    stock: number;
    categoryId: string;
    isActive: boolean;
    isMemberExclusive?: boolean;
    isFlashDeal?: boolean;
    flashDealDiscount?: number;
    flashDealEndsAt?: string | null;
    images?: { url: string; sort: number }[];
  };
}

export default function ProductForm({ categories, initial }: ProductFormProps) {
  const router = useRouter();
  const isEdit = !!initial;
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: initial?.name ?? "",
    price: initial?.price ?? 0,
    description: initial?.description ?? "",
    imageUrl: initial?.imageUrl ?? "",
    stock: initial?.stock ?? 0,
    categoryId: initial?.categoryId ?? "",
    isActive: initial?.isActive ?? true,
    isMemberExclusive: initial?.isMemberExclusive ?? false,
    isFlashDeal: initial?.isFlashDeal ?? false,
    flashDealDiscount: initial?.flashDealDiscount ?? 20,
    flashDealEndsAt: initial?.flashDealEndsAt ?? "",
  });
  const [extraImages, setExtraImages] = useState<string[]>(
    initial?.images ? initial.images.filter((i) => i.url !== initial?.imageUrl).map((i) => i.url) : []
  );

  function addImage() { setExtraImages([...extraImages, ""]); }
  function updateImage(i: number, val: string) { const next = [...extraImages]; next[i] = val; setExtraImages(next); }
  function removeImage(i: number) { setExtraImages(extraImages.filter((_, idx) => idx !== i)); }

  const allImages = [form.imageUrl, ...extraImages].filter(Boolean);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name) return alert("请输入商品名称");
    if (!form.categoryId) return alert("请选择分类");
    if (form.price <= 0) return alert("价格必须大于 0");

    setLoading(true);
    try {
      const url = isEdit
        ? `/api/admin/products/${initial.id}`
        : "/api/admin/products";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, images: allImages.length > 1 ? allImages : undefined }),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "保存失败");
        return;
      }

      router.push("/admin/products");
      router.refresh();
    } catch {
      alert("保存失败，请稍后重试");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-lg space-y-4"
    >
      <Card>
        <Input
          label="商品名称"
          type="text"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />

        <div className="mt-4">
          <Select
            label="分类"
            value={form.categoryId}
            onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
            options={[
              { value: "", label: "请选择分类" },
              ...categories.map((c) => ({ value: c.id, label: c.name })),
            ]}
            placeholder="请选择分类"
            required
          />
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4">
          <Input
            label="价格 (¥)"
            type="number"
            step="0.01"
            min="0.01"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) || 0 })}
            required
          />
          <Input
            label="库存"
            type="number"
            min="0"
            value={form.stock}
            onChange={(e) => setForm({ ...form, stock: parseInt(e.target.value) || 0 })}
          />
        </div>

        <div className="mt-4">
          <Input
            label="主图 URL"
            type="url"
            value={form.imageUrl}
            onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
            placeholder="https://..."
          />
          {/* Extra images */}
          <div className="mt-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">额外图片</span>
              <button type="button" onClick={addImage} className="text-xs text-primary-600 hover:text-primary-700">+ 添加</button>
            </div>
            {extraImages.map((url, i) => (
              <div key={i} className="flex items-center gap-2">
                <Input
                  type="url"
                  value={url}
                  onChange={(e) => updateImage(i, e.target.value)}
                  placeholder={`额外图片 ${i + 1}`}
                  className="flex-1"
                />
                <button type="button" onClick={() => removeImage(i)} className="shrink-0 text-sm text-danger-500 hover:text-danger-700">删除</button>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4">
          <Input
            label="描述"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </div>

        <label className="mt-4 flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.isActive}
            onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
            className="rounded border-border"
          />
          上架
        </label>

        <label className="mt-2 flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.isMemberExclusive}
            onChange={(e) => setForm({ ...form, isMemberExclusive: e.target.checked })}
            className="rounded border-border"
          />
          <span className="text-purple-600 font-medium">会员专享</span>
        </label>

        <label className="mt-2 flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.isFlashDeal}
            onChange={(e) => setForm({ ...form, isFlashDeal: e.target.checked })}
            className="rounded border-border"
          />
          <span className="text-danger-500 font-medium">限时抢购</span>
        </label>

        {form.isFlashDeal && (
          <div className="mt-3 space-y-3 rounded-lg border border-danger-200 bg-danger-50/30 p-3">
            <p className="text-xs font-medium text-danger-600">抢购配置</p>
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="折扣 (%)"
                type="number"
                min="0"
                max="100"
                value={form.flashDealDiscount}
                onChange={(e) => setForm({ ...form, flashDealDiscount: parseInt(e.target.value) || 0 })}
              />
              <Input
                label="截止时间"
                type="datetime-local"
                value={form.flashDealEndsAt}
                onChange={(e) => setForm({ ...form, flashDealEndsAt: e.target.value })}
              />
            </div>
          </div>
        )}

        <div className="mt-6 flex gap-3">
          <Button type="submit" disabled={loading}>
            {loading ? "保存中..." : isEdit ? "保存修改" : "添加商品"}
          </Button>
          <Button type="button" variant="secondary" onClick={() => router.back()}>
            取消
          </Button>
        </div>
      </Card>
    </form>
  );
}
