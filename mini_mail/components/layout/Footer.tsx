import Link from "next/link";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-border bg-surface">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-3">
          {/* Brand */}
          <div>
            <h3 className="text-lg font-bold text-foreground">简购</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              精选优质商品，享受会员折扣。
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-sm font-semibold text-foreground">快速链接</h4>
            <nav className="mt-3 flex flex-col gap-2">
              <Link href="/products" className="text-sm text-muted-foreground transition-colors hover:text-primary-600">
                全部商品
              </Link>
              <Link href="/cart" className="text-sm text-muted-foreground transition-colors hover:text-primary-600">
                购物车
              </Link>
              <Link href="/orders" className="text-sm text-muted-foreground transition-colors hover:text-primary-600">
                我的订单
              </Link>
              <Link href="/help" className="text-sm text-muted-foreground transition-colors hover:text-primary-600">
                帮助中心
              </Link>
            </nav>
          </div>

          {/* About */}
          <div>
            <h4 className="text-sm font-semibold text-foreground">关于</h4>
            <nav className="mt-3 flex flex-col gap-2">
              <Link href="/about" className="text-sm text-muted-foreground transition-colors hover:text-primary-600">
                关于简购
              </Link>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Next.js 16 + TailwindCSS 4 + Prisma.
              </p>
            </nav>
          </div>
        </div>

        <div className="mt-10 border-t border-border pt-6 text-center text-xs text-muted-foreground">
          &copy; {year} 简购. 精选好物，简单购物.
        </div>
      </div>
    </footer>
  );
}
