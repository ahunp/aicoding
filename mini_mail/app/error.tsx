"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <p className="text-7xl font-bold text-danger-500/20">!</p>
      <h1 className="mt-4 text-2xl font-bold text-foreground">出了点问题</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        请稍后重试，如果问题持续存在请联系我们
      </p>
      <button
        onClick={reset}
        className="mt-8 rounded-lg bg-primary-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-700"
      >
        重试
      </button>
    </div>
  );
}
