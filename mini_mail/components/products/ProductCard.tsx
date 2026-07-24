import Link from "next/link";
import Image from "next/image";
import { Package, ShoppingCart } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import Badge from "@/components/ui/Badge";
import ReviewStars from "./ReviewStars";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    price: number;
    imageUrl: string | null;
    stock: number;
    category: { name: string } | null;
    _count?: { reviews?: number };
    reviews?: { rating: number }[];
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Link
      href={`/products/${product.id}`}
      className="group relative flex flex-col overflow-hidden rounded-xl bg-surface shadow-card ring-1 ring-border/50 transition-all duration-300 hover:shadow-card-hover hover:-translate-y-0.5"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-muted to-muted/60">
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
            <Package className="h-12 w-12 text-muted-foreground/30" />
          </div>
        )}

        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        {/* Bottom gradient fade for text readability */}
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/40 to-transparent" />

        {/* Quick-add floating button on hover */}
        <div className="pointer-events-none absolute bottom-2 right-2 translate-y-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <span className="pointer-events-auto flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-primary-600 shadow-lg backdrop-blur-sm transition-colors hover:bg-primary-600 hover:text-white">
            <ShoppingCart className="h-4 w-4" />
          </span>
        </div>

        {/* Stock badge */}
        {product.stock === 0 && (
          <span className="absolute left-2 top-2 rounded bg-black/60 px-2 py-0.5 text-[10px] font-medium text-white backdrop-blur-sm">
            已售罄
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-1.5 p-3">
        <h3 className="line-clamp-2 text-sm font-medium leading-snug text-foreground transition-colors group-hover:text-primary-600">
          {product.name}
        </h3>

        <p className="text-lg font-bold tracking-tight text-price">
          {formatPrice(product.price)}
        </p>

        <div className="mt-auto flex items-center justify-between">
          {product.category && (
            <Badge className="text-[10px]">{product.category.name}</Badge>
          )}
          {product.stock > 0 && product.stock <= 5 && (
            <span className="text-[10px] text-warning-500">仅剩 {product.stock} 件</span>
          )}
        </div>
      </div>

      {/* Brand accent color bar on left edge */}
      <div className="absolute left-0 top-0 h-0 w-0.5 bg-gradient-to-b from-primary-500 to-accent-500 transition-all duration-300 group-hover:h-full" />
    </Link>
  );
}
