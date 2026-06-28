"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

interface Category {
  id: string;
  name: string;
  description: string | null;
  _count: { products: number };
}

export default function CategoryManager({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!newName.trim()) return;

    setLoading(true);
    try {
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName, description: newDesc }),
      });

      if (!res.ok) {
        const data = await res.json();
        alert(data.error || "创建失败");
        return;
      }

      setNewName("");
      setNewDesc("");
      router.refresh();
    } catch {
      alert("创建失败");
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdate(id: string) {
    if (!editName.trim()) return;

    try {
      const res = await fetch(`/api/admin/categories/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editName, description: editDesc }),
      });

      if (res.ok) {
        setEditingId(null);
        router.refresh();
      } else {
        const data = await res.json().catch(() => ({}));
        alert(data.error || "更新失败");
      }
    } catch {
      alert("网络错误，更新失败");
    }
  }

  async function handleDelete(id: string, productCount: number) {
    if (productCount > 0) {
      alert(`该分类下有 ${productCount} 个商品，请先移除这些商品再删除分类`);
      return;
    }
    if (!confirm("确定删除该分类？")) return;

    try {
      const res = await fetch(`/api/admin/categories/${id}`, { method: "DELETE" });

      if (res.ok) {
        router.refresh();
      } else {
        const data = await res.json().catch(() => ({}));
        alert(data.error || "删除失败");
      }
    } catch {
      alert("网络错误，删除失败");
    }
  }

  function startEdit(cat: Category) {
    setEditingId(cat.id);
    setEditName(cat.name);
    setEditDesc(cat.description ?? "");
  }

  return (
    <div className="space-y-6">
      <Card>
        <h2 className="mb-3 text-sm font-medium text-foreground">新建分类</h2>
        <form onSubmit={handleCreate} className="space-y-3">
          <Input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="分类名称"
            required
          />
          <Input
            type="text"
            value={newDesc}
            onChange={(e) => setNewDesc(e.target.value)}
            placeholder="描述（可选）"
          />
          <Button type="submit" disabled={loading}>
            {loading ? "创建中..." : "创建"}
          </Button>
        </form>
      </Card>

      <div className="space-y-2">
        {categories.map((cat) => (
          <Card key={cat.id}>
            {editingId === cat.id ? (
              <div className="space-y-3">
                <Input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                />
                <Input
                  type="text"
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                />
                <div className="flex gap-2">
                  <Button onClick={() => handleUpdate(cat.id)}>保存</Button>
                  <Button variant="secondary" onClick={() => setEditingId(null)}>取消</Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm font-medium text-foreground">{cat.name}</span>
                  {cat.description && <span className="ml-2 text-xs text-muted-foreground">{cat.description}</span>}
                  <span className="ml-2 text-xs text-muted-foreground">({cat._count.products} 商品)</span>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={() => startEdit(cat)}>编辑</Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(cat.id, cat._count.products)} className="text-danger-500">删除</Button>
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
