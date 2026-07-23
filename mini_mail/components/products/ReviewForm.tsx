"use client";

import { useState } from "react";
import ReviewStars from "./ReviewStars";
import Button from "@/components/ui/Button";
import { toast } from "@/lib/toast";

interface ReviewFormProps {
  productId: string;
  orderId: string;
  onSuccess: () => void;
}

export default function ReviewForm({ productId, orderId, onSuccess }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit() {
    if (rating === 0) { toast("请选择评分", "error"); return; }
    setSaving(true);
    try {
      const res = await fetch(`/api/products/${productId}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, rating, content }),
      });
      const d = await res.json();
      if (!res.ok) { toast(d.error || "提交失败", "error"); return; }
      toast("评价成功", "success");
      onSuccess();
    } catch { toast("提交失败", "error"); }
    finally { setSaving(false); }
  }

  return (
    <div className="space-y-3 rounded-lg border border-border bg-surface p-4">
      <p className="text-sm font-medium text-foreground">商品评价</p>
      <ReviewStars rating={rating} size="lg" interactive onChange={setRating} />
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="写下你的使用感受（选填）"
        className="w-full rounded-lg border border-border bg-muted p-2 text-sm placeholder:text-muted-foreground focus:border-primary-500 focus:outline-none"
        rows={3}
      />
      <Button onClick={handleSubmit} disabled={saving} size="sm">
        {saving ? "提交中..." : "提交评价"}
      </Button>
    </div>
  );
}
