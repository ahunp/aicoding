import Link from "next/link";

export default function HomePage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <section className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900">
          欢迎来到 Mini Mall
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          精选好物，尽在 Mini Mall
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Link
            href="/products"
            className="rounded bg-blue-600 px-6 py-3 text-sm font-medium text-white hover:bg-blue-700"
          >
            浏览商品
          </Link>
          <Link
            href="/register"
            className="rounded border border-gray-300 px-6 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            立即注册
          </Link>
        </div>
      </section>
    </div>
  );
}
