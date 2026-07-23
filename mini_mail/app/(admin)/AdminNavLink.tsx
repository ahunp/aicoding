"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Package,
  ClipboardList,
  Tags,
  Users,
  Settings,
  MessageSquare,
} from "lucide-react";
import { cn } from "@/lib/utils";

const iconMap: Record<string, React.ElementType> = {
  dashboard: BarChart3,
  products: Package,
  orders: ClipboardList,
  categories: Tags,
  users: Users,
  settings: Settings,
  reviews: MessageSquare,
};

export default function AdminNavLink({
  href,
  icon,
  children,
}: {
  href: string;
  icon: keyof typeof iconMap;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isActive = href === "/admin"
    ? pathname === "/admin"
    : pathname === href || pathname.startsWith(href + "/");
  const Icon = iconMap[icon];

  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors",
        isActive
          ? "bg-primary-100 text-primary-700 font-medium"
          : "text-foreground hover:bg-muted-foreground/10"
      )}
    >
      {Icon && <Icon className="h-4 w-4" />}
      <span>{children}</span>
    </Link>
  );
}
