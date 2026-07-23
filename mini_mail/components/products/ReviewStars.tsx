"use client";

import { Star } from "lucide-react";

interface ReviewStarsProps {
  rating: number;
  size?: "sm" | "md" | "lg";
  interactive?: boolean;
  onChange?: (r: number) => void;
}

export default function ReviewStars({ rating, size = "sm", interactive, onChange }: ReviewStarsProps) {
  const sizeClass = size === "lg" ? "h-6 w-6" : size === "md" ? "h-5 w-5" : "h-3.5 w-3.5";

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={!interactive}
          onClick={() => onChange?.(star)}
          className={`${interactive ? "cursor-pointer hover:scale-110" : "cursor-default"} transition-transform`}
        >
          <Star
            className={`${sizeClass} ${
              star <= rating
                ? "fill-amber-400 text-amber-400"
                : "fill-none text-muted-foreground/30"
            }`}
          />
        </button>
      ))}
    </div>
  );
}
