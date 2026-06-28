import { cn } from "@/lib/utils";

export default function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="rounded-lg border border-border bg-surface p-4">
      <Skeleton className="mb-3 h-40 w-full rounded" />
      <Skeleton className="mb-2 h-4 w-3/4" />
      <Skeleton className="mb-2 h-6 w-1/3" />
      <Skeleton className="h-4 w-1/4" />
    </div>
  );
}

export function ProductGridSkeleton({ count = 12 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: count }, (_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function TableSkeleton({ rows = 8, cols = 6 }: { rows?: number; cols?: number }) {
  return (
    <div className="rounded-lg border border-border bg-surface">
      <div className="border-b border-border bg-muted p-3">
        <div className="flex gap-4">
          {Array.from({ length: cols }, (_, i) => (
            <Skeleton key={i} className="h-4 flex-1" />
          ))}
        </div>
      </div>
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} className="flex gap-4 border-b border-border p-3">
          {Array.from({ length: cols }, (_, j) => (
            <Skeleton key={j} className="h-4 flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
}
