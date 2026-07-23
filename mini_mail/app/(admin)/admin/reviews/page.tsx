"use client";

import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import ReviewStars from "@/components/products/ReviewStars";
import { formatDate } from "@/lib/utils";
import { toast } from "@/lib/toast";

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchReviews(); }, []);

  async function fetchReviews() {
    try {
      const res = await fetch("/api/admin/reviews");
      const d = await res.json();
      if (d.data) setReviews(d.data);
    } catch { /* */ }
    finally { setLoading(false); }
  }

  async function handleDelete(id: string) {
    if (!confirm("确定删除这条评价？")) return;
    try {
      const res = await fetch("/api/admin/reviews", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        toast("已删除", "success");
        fetchReviews();
      } else {
        toast("删除失败", "error");
      }
    } catch { toast("删除失败", "error"); }
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-foreground">评价管理</h1>

      {loading ? (
        <div className="space-y-3">{[1, 2, 3].map((i) => <div key={i} className="h-16 animate-pulse rounded-lg bg-muted" />)}</div>
      ) : reviews.length === 0 ? (
        <Card className="p-12 text-center"><p className="text-muted-foreground">暂无评价</p></Card>
      ) : (
        <div className="space-y-3">
          {reviews.map((rv) => (
            <Card key={rv.id} className="flex items-start justify-between p-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-foreground">{rv.user?.name || rv.user?.email}</span>
                  <Badge>{(rv as any).product?.name}</Badge>
                </div>
                <div className="mt-1 flex items-center gap-2">
                  <ReviewStars rating={rv.rating} size="sm" />
                  <span className="text-xs text-muted-foreground">{formatDate(rv.createdAt)}</span>
                </div>
                {rv.content && <p className="mt-1 text-sm text-muted-foreground">{rv.content}</p>}
              </div>
              <button onClick={() => handleDelete(rv.id)} className="shrink-0 rounded p-1.5 text-muted-foreground hover:bg-danger-50 hover:text-danger-500">
                <Trash2 className="h-4 w-4" />
              </button>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
