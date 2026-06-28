import Link from "next/link";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

const navItems = [
  { label: "仪表盘", href: "/admin", icon: "📊" },
  { label: "商品管理", href: "/admin/products", icon: "📦" },
  { label: "订单管理", href: "/admin/orders", icon: "📋" },
  { label: "分类管理", href: "/admin/categories", icon: "🏷️" },
  { label: "用户管理", href: "/admin/users", icon: "👥" },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") redirect("/");

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      <aside className="w-56 shrink-0 border-r bg-gray-50 p-4">
        <nav className="space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-200"
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      </aside>
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
