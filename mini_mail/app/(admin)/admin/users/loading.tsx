import { TableSkeleton } from "@/components/ui/Skeleton";

export default function AdminUsersLoading() {
  return (
    <div>
      <div className="mb-6 h-8 w-32 animate-pulse rounded bg-muted" />
      <TableSkeleton rows={8} cols={6} />
    </div>
  );
}
