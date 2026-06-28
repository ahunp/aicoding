import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-300">404</h1>
        <p className="mt-4 text-lg text-gray-600">页面不存在</p>
        <Link
          href="/"
          className="mt-6 inline-block rounded bg-blue-600 px-6 py-2 text-sm text-white hover:bg-blue-700"
        >
          返回首页
        </Link>
      </div>
    </div>
  );
}
