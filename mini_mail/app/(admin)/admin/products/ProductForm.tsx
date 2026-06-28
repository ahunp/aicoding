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
  });

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
        body: JSON.stringify(form),
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
            label="图片 URL"
            type="url"
            value={form.imageUrl}
            onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
            placeholder="https://..."
          />
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
