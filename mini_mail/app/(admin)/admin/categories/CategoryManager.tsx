"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

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
      <form onSubmit={handleCreate} className="rounded-lg bg-white p-4 shadow-sm">
        <h2 className="mb-3 text-sm font-medium text-gray-900">新建分类</h2>
        <div className="space-y-3">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="分类名称"
            className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
            required
          />
          <input
            type="text"
            value={newDesc}
            onChange={(e) => setNewDesc(e.target.value)}
            placeholder="描述（可选）"
            className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
          />
          <button
            type="submit"
            disabled={loading}
            className="rounded bg-blue-600 px-4 py-1.5 text-sm text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "创建中..." : "创建"}
          </button>
        </div>
      </form>

      <div className="space-y-2">
        {categories.map((cat) => (
          <div key={cat.id} className="rounded-lg bg-white p-4 shadow-sm">
            {editingId === cat.id ? (
              <div className="space-y-3">
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
                />
                <input
                  type="text"
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                  className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
                />
                <div className="flex gap-2">
                  <button onClick={() => handleUpdate(cat.id)} className="rounded bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-700">保存</button>
                  <button onClick={() => setEditingId(null)} className="rounded bg-gray-100 px-3 py-1 text-sm text-gray-700 hover:bg-gray-200">取消</button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm font-medium text-gray-900">{cat.name}</span>
                  {cat.description && <span className="ml-2 text-xs text-gray-500">{cat.description}</span>}
                  <span className="ml-2 text-xs text-gray-400">({cat._count.products} 商品)</span>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => startEdit(cat)} className="text-xs text-blue-600 hover:text-blue-800">编辑</button>
                  <button onClick={() => handleDelete(cat.id, cat._count.products)} className="text-xs text-red-600 hover:text-red-800">删除</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
