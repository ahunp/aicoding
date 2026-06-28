"use client";

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
        <h1 className="text-4xl font-bold text-gray-300">出错了</h1>
        <p className="mt-4 text-sm text-gray-500">
          {error.message || "管理后台加载失败，请稍后重试"}
        </p>
        <button
          onClick={reset}
          className="mt-6 rounded bg-blue-600 px-6 py-2 text-sm text-white hover:bg-blue-700"
        >
          重试
        </button>
      </div>
    </div>
  );
}
