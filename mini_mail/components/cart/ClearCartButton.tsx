"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { toast } from "@/lib/toast";
import Button from "@/components/ui/Button";

export default function ClearCartButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleClear() {
    if (!confirm("确定清空购物车？此操作不可恢复。")) return;

    setLoading(true);
    try {
      const res = await fetch("/api/cart/clear", { method: "DELETE" });
      if (res.ok) {
        toast("购物车已清空", "success");
        router.refresh();
        window.dispatchEvent(new CustomEvent("cart-updated"));
      } else {
        toast("清空失败", "error");
      }
    } catch {
      toast("清空失败", "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      onClick={handleClear}
      variant="ghost"
      size="sm"
      disabled={loading}
      className="text-danger-500"
    >
      <Trash2 className="mr-1 h-4 w-4" />
      清空购物车
    </Button>
  );
}
