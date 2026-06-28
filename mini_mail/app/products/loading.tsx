import { ProductGridSkeleton } from "@/components/ui/Skeleton";

export default function ProductsLoading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6">
        <div className="h-8 w-32 animate-pulse rounded bg-muted" />
      </div>
      <ProductGridSkeleton />
    </div>
  );
}
