import Link from "next/link";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { LogOut } from "lucide-react";
import AdminNavLink from "./AdminNavLink";

const navItems = [
  { label: "仪表盘", href: "/admin", icon: "dashboard" as const },
  { label: "商品管理", href: "/admin/products", icon: "products" as const },
  { label: "订单管理", href: "/admin/orders", icon: "orders" as const },
  { label: "分类管理", href: "/admin/categories", icon: "categories" as const },
  { label: "用户管理", href: "/admin/users", icon: "users" as const },
  { label: "会员设置", href: "/admin/settings", icon: "settings" as const },
  { label: "评价管理", href: "/admin/reviews", icon: "reviews" as const },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") redirect("/");

  return (
    <div className="flex min-h-[calc(100vh-3.5rem)]">
      <aside className="w-56 shrink-0 border-r border-border bg-muted p-4 flex flex-col">
        <nav className="space-y-1 flex-1">
          {navItems.map((item) => (
            <AdminNavLink key={item.href} href={item.href} icon={item.icon}>
              {item.label}
            </AdminNavLink>
          ))}
        </nav>

        <Link
          href="/"
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-muted-foreground/10 transition-colors"
        >
          <LogOut className="h-4 w-4" />
          <span>返回前台</span>
        </Link>
      </aside>
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
