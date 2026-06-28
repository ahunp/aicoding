import Link from "next/link";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import {
  BarChart3,
  Package,
  ClipboardList,
  Tags,
  Users,
} from "lucide-react";

const navItems = [
  { label: "仪表盘", href: "/admin", icon: BarChart3 },
  { label: "商品管理", href: "/admin/products", icon: Package },
  { label: "订单管理", href: "/admin/orders", icon: ClipboardList },
  { label: "分类管理", href: "/admin/categories", icon: Tags },
  { label: "用户管理", href: "/admin/users", icon: Users },
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
      <aside className="w-56 shrink-0 border-r border-border bg-muted p-4">
        <nav className="space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-foreground hover:bg-muted-foreground/10"
            >
              <item.icon className="h-4 w-4" />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      </aside>
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
