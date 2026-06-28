import Link from "next/link";
import Image from "next/image";
import { Package, ShoppingCart } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import Badge from "@/components/ui/Badge";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    price: number;
    imageUrl: string | null;
    stock: number;
    category: { name: string } | null;
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Link
      href={`/products/${product.id}`}
      className="group relative block rounded-lg bg-surface p-4 shadow-card transition-all duration-200 hover:shadow-card-hover ring-1 ring-border/50"
    >
      {/* Image */}
      <div className="relative mb-3 aspect-[4/3] overflow-hidden rounded-lg bg-gradient-to-br from-muted to-muted/50">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-contain p-2 transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 25vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <Package className="h-12 w-12 text-muted-foreground/40" />
          </div>
        )}

        {/* Hover overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/[0.06] to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
      </div>

      {/* Quick add decoration - floating button on hover */}
      <div className="pointer-events-none absolute bottom-14 right-4 translate-y-2 opacity-0 transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-600 text-white shadow-lg">
          <ShoppingCart className="h-4 w-4" />
        </span>
      </div>

      <div className="space-y-1">
        <h3 className="text-sm font-medium text-foreground group-hover:text-primary-600 line-clamp-2">
          {product.name}
        </h3>

        <p className="text-lg font-bold text-price">
          {formatPrice(product.price)}
        </p>

        <div className="flex items-center justify-between">
          {product.category && (
            <Badge>{product.category.name}</Badge>
          )}
          <span className={`text-xs ${product.stock > 0 ? "text-success-500" : "text-danger-500"}`}>
            {product.stock > 0 ? `库存 ${product.stock}` : "缺货"}
          </span>
        </div>
      </div>
    </Link>
  );
}
