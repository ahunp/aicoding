"use client";

import { useRouter } from "next/navigation";

export default function DeleteButton({ id }: { id: string }) {
  const router = useRouter();

  async function handleDelete() {
    if (!confirm("确定删除该商品？此操作不可恢复。")) return;

    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: "DELETE",
      });

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

  return (
    <button onClick={handleDelete} className="text-red-600 hover:text-red-800">
      删除
    </button>
  );
}
