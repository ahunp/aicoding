"use client";

import { useEffect, useState } from "react";
import ReviewForm from "@/components/products/ReviewForm";
import { MessageSquare } from "lucide-react";

export default function OrderReview({ productId, orderId }: { productId: string; orderId: string }) {
  const [showForm, setShowForm] = useState(false);
  const [done, setDone] = useState(false);

  // Check if already reviewed
  useEffect(() => {
    fetch(`/api/products/${productId}/reviews`)
      .then((r) => r.json())
      .then((d) => {
        if (d.data?.reviews) {
          const found = d.data.reviews.find((rv: any) => rv.orderId === orderId);
          if (found) setDone(true);
        }
      })
      .catch(() => {});
  }, [productId, orderId]);

  if (done) {
    return <span className="text-xs text-success-500">已评价</span>;
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => setShowForm(!showForm)}
        className="flex items-center gap-1 text-xs text-primary-600 hover:text-primary-700"
      >
        <MessageSquare className="h-3 w-3" /> {showForm ? "收起" : "评价"}
      </button>
      {showForm && (
        <div className="mt-2">
          <ReviewForm productId={productId} orderId={orderId} onSuccess={() => { setShowForm(false); setDone(true); }} />
        </div>
      )}
    </div>
  );
}
