"use client";

import { useEffect, useState } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { toast } from "@/lib/toast";
import { MEMBERSHIP_TIERS } from "@/lib/membership";

export default function AdminSettingsPage() {
  const [tier, setTier] = useState("GOLD");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((d) => {
        if (d.data) setTier(d.data.minTierForExclusive);
      })
      .catch(() => {});
  }, []);

  async function handleSave() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ minTierForExclusive: tier }),
      });
      if (!res.ok) {
        const data = await res.json();
        toast(data.error || "保存失败", "error");
        return;
      }
      toast("保存成功", "success");
    } catch {
      toast("保存失败", "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-foreground">会员设置</h1>

      <Card className="max-w-lg">
        <label className="block text-sm font-medium text-foreground">
          会员专享商品最低等级
        </label>
        <p className="mt-1 text-xs text-muted-foreground">
          只有达到该等级及以上的会员才能购买「会员专享」商品
        </p>
        <select
          value={tier}
          onChange={(e) => setTier(e.target.value)}
          className="mt-3 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm"
        >
          {MEMBERSHIP_TIERS.map((t) => (
            <option key={t.name} value={t.name}>
              {t.label} (累计消费 ¥{t.minSpent})
            </option>
          ))}
        </select>

        <Button onClick={handleSave} disabled={loading} className="mt-4">
          {loading ? "保存中..." : "保存"}
        </Button>
      </Card>
    </div>
  );
}
