"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { toast } from "@/lib/toast";

interface BatchActionsProps {
  products: { id: string; name: string }[];
}

export default function BatchActions({ products }: BatchActionsProps) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [priceValue, setPriceValue] = useState("");
  const [loading, setLoading] = useState(false);

  const ids = Array.from(selected);
  const allSelected = products.length > 0 && selected.size === products.length;

  function toggleAll() {
    if (allSelected) setSelected(new Set());
    else setSelected(new Set(products.map((p) => p.id)));
  }

  function toggle(id: string) {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
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
      if (!res.ok) { const d = await res.json(); toast(d.error || "操作失败", "error"); return; }
      toast(`已更新 ${ids.length} 件商品`, "success");
      setSelected(new Set());
      window.location.reload();
    } catch { toast("操作失败", "error"); }
    finally { setLoading(false); }
  }

  return { selected, allSelected, toggleAll, toggle, batch, ids, priceValue, setPriceValue, loading };
}
