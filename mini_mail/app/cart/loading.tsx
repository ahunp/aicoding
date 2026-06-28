import Skeleton from "@/components/ui/Skeleton";

export default function CartLoading() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <Skeleton className="mb-6 h-8 w-24" />
      <div className="space-y-4">
        <div className="rounded-lg border border-border bg-surface p-4">
          {Array.from({ length: 3 }, (_, i) => (
            <div key={i} className="flex items-center gap-4 py-4">
              <Skeleton className="h-16 w-16 rounded" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-3 w-1/6" />
              </div>
              <Skeleton className="h-8 w-24" />
            </div>
          ))}
        </div>
        <Skeleton className="h-24 w-full rounded-lg" />
      </div>
    </div>
  );
}
