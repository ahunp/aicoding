"use client";

import Button from "@/components/ui/Button";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-muted">出错了</h1>
        <p className="mt-4 text-sm text-muted-foreground">
          {error.message || "管理后台加载失败，请稍后重试"}
        </p>
        <Button onClick={reset} className="mt-6">
          重试
        </Button>
      </div>
    </div>
  );
}
