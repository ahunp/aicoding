import { TableSkeleton } from "@/components/ui/Skeleton";

export default function AdminProductsLoading() {
  return (
    <div>
      <div className="mb-6 h-8 w-32 animate-pulse rounded bg-muted" />
      <div className="mb-4 h-10 w-80 animate-pulse rounded bg-muted" />
      <TableSkeleton rows={8} cols={7} />
    </div>
  );
}
