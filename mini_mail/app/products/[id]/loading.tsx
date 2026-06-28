import Skeleton from "@/components/ui/Skeleton";

export default function ProductDetailLoading() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="grid gap-8 md:grid-cols-2">
        <Skeleton className="h-80 rounded-lg" />
        <div className="space-y-4">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-10 w-1/3" />
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-12 w-full rounded" />
        </div>
      </div>
    </div>
  );
}
