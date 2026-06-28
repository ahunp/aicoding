"use client";

import Button from "@/components/ui/Button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-muted">出错了</h1>
        <p className="mt-4 text-sm text-muted-foreground">
          {error.message || "页面加载失败，请稍后重试"}
        </p>
        <Button onClick={reset} className="mt-6">
          重试
        </Button>
      </div>
    </div>
  );
}
