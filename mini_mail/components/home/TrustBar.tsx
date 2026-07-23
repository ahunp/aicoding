import { ShieldCheck, Truck, RotateCcw } from "lucide-react";

const items = [
  { icon: ShieldCheck, label: "正品保障", desc: "所有商品均为正品" },
  { icon: Truck, label: "极速发货", desc: "下单后 24 小时内发货" },
  { icon: RotateCcw, label: "无忧退换", desc: "7 天无理由退换" },
];

export default function TrustBar() {
  return (
    <section className="border-t border-border bg-muted/50">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="grid grid-cols-3 gap-6">
          {items.map((item) => (
            <div key={item.label} className="flex flex-col items-center text-center">
              <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 text-primary-600">
                <item.icon className="h-5 w-5" />
              </div>
              <span className="text-sm font-medium text-foreground">{item.label}</span>
              <span className="mt-0.5 text-xs text-muted-foreground">{item.desc}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
