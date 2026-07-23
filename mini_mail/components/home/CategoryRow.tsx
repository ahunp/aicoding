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
    <section className="mx-auto max-w-7xl px-4 py-6">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex h-5 w-0.5 rounded-full bg-primary-500" />
          <h2 className="text-lg font-bold text-foreground">{category.name}</h2>
        </div>
        <Link
          href={`/products?category=${category.id}`}
          className="flex items-center gap-0.5 text-xs text-muted-foreground hover:text-primary-600"
        >
          查看更多 <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {products.map((product, i) => (
          <Link
            key={product.id}
            href={`/products/${product.id}`}
            className="group rounded-xl bg-surface p-3 shadow-card ring-1 ring-border/50 transition-all duration-200 hover:shadow-card-hover"
          >
            <div className="relative mb-2 aspect-square overflow-hidden rounded-lg bg-gradient-to-br from-muted to-muted/50">
              {product.imageUrl ? (
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  fill
                  className="object-contain p-2 transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 640px) 50vw, 25vw"
                />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <Package className="h-8 w-8 text-muted-foreground/40" />
                </div>
              )}
            </div>
            <h3 className="truncate text-sm font-medium text-foreground group-hover:text-primary-600">
              {product.name}
            </h3>
            <div className="mt-1 flex items-center justify-between">
              <span className="text-base font-bold text-price">
                {formatPrice(product.price)}
              </span>
              {product.category && (
                <Badge className="text-[10px]">{product.category.name}</Badge>
              )}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
