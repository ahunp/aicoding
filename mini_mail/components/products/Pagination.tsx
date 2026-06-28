"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

interface PaginationProps {
  current: number;
  total: number;
  limit: number;
}

export default function Pagination({ current, total, limit }: PaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const totalPages = Math.ceil(total / limit);

  if (totalPages <= 1) return null;

  function goToPage(page: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));
    router.push(`/products?${params.toString()}`);
  }

  return (
    <div className="mt-8 flex items-center justify-center gap-2">
      <button
        onClick={() => goToPage(current - 1)}
        disabled={current <= 1}
        className="rounded border px-3 py-1.5 text-sm disabled:opacity-30"
      >
        上一页
      </button>

      {Array.from({ length: totalPages }, (_, i) => i + 1)
        .filter((p) => p === 1 || p === totalPages || Math.abs(p - current) <= 2)
        .map((p, idx, arr) => (
          <span key={p} className="flex items-center gap-1">
            {idx > 0 && arr[idx - 1] !== p - 1 && <span className="px-1 text-gray-400">...</span>}
            <button
              onClick={() => goToPage(p)}
              className={cn(
                "rounded px-3 py-1.5 text-sm",
                p === current
                  ? "bg-blue-600 text-white"
                  : "border hover:bg-gray-50"
              )}
            >
              {p}
            </button>
          </span>
        ))}

      <button
        onClick={() => goToPage(current + 1)}
        disabled={current >= totalPages}
        className="rounded border px-3 py-1.5 text-sm disabled:opacity-30"
      >
        下一页
      </button>
    </div>
  );
}
