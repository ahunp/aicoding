import { TableSkeleton } from "@/components/ui/Skeleton";

export default function AdminOrdersLoading() {
  return (
    <div>
      <div className="mb-6 h-8 w-32 animate-pulse rounded bg-muted" />
      <div className="mb-4 flex gap-2">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="h-8 w-16 animate-pulse rounded-full bg-muted" />
        ))}
      </div>
      <TableSkeleton rows={8} cols={6} />
    </div>
  );
}
