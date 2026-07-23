import Link from "next/link";

const items = [
  { icon: "🎉", label: "新品", href: "/products?section=new", bg: "from-pink-500 to-rose-500" },
  { icon: "🔥", label: "特惠", href: "/products?section=deals", bg: "from-orange-500 to-red-500" },
  { icon: "💎", label: "会员", href: "/products?section=member", bg: "from-purple-500 to-violet-500" },
  { icon: "📦", label: "全部分类", href: "/products", bg: "from-blue-500 to-cyan-500" },
];

export default function QuickNav() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-6">
      <div className="flex items-center justify-center gap-4 sm:gap-8">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="group flex flex-col items-center gap-1.5"
          >
            <span
              className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${item.bg} text-xl shadow-md transition-transform duration-200 group-hover:scale-110 group-hover:shadow-lg`}
            >
              {item.icon}
            </span>
            <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground">
              {item.label}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
