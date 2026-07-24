import Link from "next/link";

const items = [
  { icon: "🎉", label: "新品上架", href: "/products?section=new", bg: "from-pink-500 to-rose-500" },
  { icon: "🔥", label: "限时特惠", href: "/products?section=deals", bg: "from-orange-500 to-red-500" },
  { icon: "💎", label: "会员专享", href: "/products?section=member", bg: "from-purple-500 to-violet-500" },
  { icon: "📦", label: "全部分类", href: "/products", bg: "from-blue-500 to-cyan-500" },
];

export default function QuickNav() {
  return (
    <section className="mx-auto max-w-7xl px-4 -mt-6 relative z-10">
      <div className="flex items-center justify-center gap-4 sm:gap-10 rounded-2xl bg-surface/80 backdrop-blur-xl border border-border/50 p-4 shadow-lg sm:p-6">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="group flex flex-col items-center gap-2"
          >
            <span
              className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${item.bg} text-2xl shadow-lg shadow-primary-500/10 transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl`}
            >
              {item.icon}
            </span>
            <span className="text-xs font-medium text-muted-foreground transition-colors group-hover:text-foreground">
              {item.label}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
