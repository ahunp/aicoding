import Link from "next/link";
import Image from "next/image";
import { Package } from "lucide-react";
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
      className="group rounded-lg border border-border bg-surface p-4 shadow-card transition-shadow hover:shadow-card-hover"
    >
      <div className="mb-3 relative h-40 rounded bg-muted">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-contain p-2"
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 25vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <Package className="h-12 w-12 text-muted-foreground" />
          </div>
        )}
      </div>

      <div className="space-y-1">
        <h3 className="text-sm font-medium text-foreground group-hover:text-primary-600 line-clamp-2">
          {product.name}
        </h3>

        <p className="text-lg font-bold text-danger-500">
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
