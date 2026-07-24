import Link from "next/link";
import Image from "next/image";
import { Package, ArrowRight } from "lucide-react";
import Badge from "@/components/ui/Badge";
import { formatPrice } from "@/lib/utils";

interface CategoryRowProps {
  category: { id: string; name: string };
  products: Array<{
    id: string;
    name: string;
    price: number;
    imageUrl: string | null;
    stock: number;
    category: { name: string } | null;
  }>;
}

export default function CategoryRow({ category, products }: CategoryRowProps) {
  if (products.length === 0) return null;

  return (
    <section className="py-8">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-6 w-1 rounded-full bg-gradient-to-b from-primary-500 to-accent-500" />
            <h2 className="text-xl font-bold text-foreground">{category.name}</h2>
          </div>
          <Link
            href={`/products?category=${category.id}`}
            className="flex items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-700"
          >
            查看更多 <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {products.map((product) => (
            <Link
              key={product.id}
              href={`/products/${product.id}`}
              className="group relative overflow-hidden rounded-xl bg-surface shadow-card ring-1 ring-border/50 transition-all duration-300 hover:shadow-card-hover hover:-translate-y-0.5"
            >
              <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-muted to-muted/60">
                {product.imageUrl ? (
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    className="object-cover transition-all duration-500 group-hover:scale-110"
                    sizes="(max-width: 640px) 50vw, 25vw"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <Package className="h-10 w-10 text-muted-foreground/30" />
                  </div>
                )}
                <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-black/30 to-transparent" />
              </div>
              <div className="p-3">
                <h3 className="truncate text-sm font-medium text-foreground group-hover:text-primary-600">
                  {product.name}
                </h3>
                <div className="mt-1 flex items-center justify-between">
                  <span className="text-base font-bold text-price">
                    {formatPrice(product.price)}
                  </span>
                  {product.stock > 0 && product.stock <= 5 && (
                    <span className="text-[10px] text-warning-500">仅剩 {product.stock}</span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
