import ReviewStars from "./ReviewStars";

interface Review {
  id: string;
  rating: number;
  content: string | null;
  createdAt: string;
  user: { name: string | null };
}

export default function ReviewList({ reviews, avgRating, total }: { reviews: Review[]; avgRating: number; total: number }) {
  if (total === 0) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <span className="text-2xl font-bold text-foreground">{avgRating.toFixed(1)}</span>
        <div>
          <ReviewStars rating={Math.round(avgRating)} size="md" />
          <p className="mt-0.5 text-xs text-muted-foreground">{total} 条评价</p>
        </div>
      </div>

      <div className="divide-y divide-border">
        {reviews.map((review) => (
          <div key={review.id} className="py-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">{review.user.name || "匿名用户"}</span>
              <span className="text-xs text-muted-foreground">
                {new Date(review.createdAt).toLocaleDateString("zh-CN")}
              </span>
            </div>
            <ReviewStars rating={review.rating} size="sm" />
            {review.content && (
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{review.content}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
