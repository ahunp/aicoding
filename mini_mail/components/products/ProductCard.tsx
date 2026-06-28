import Link from "next/link";
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
      className="group rounded-lg border bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="mb-3 flex h-40 items-center justify-center rounded bg-gray-50">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="h-full w-full object-contain p-2"
          />
        ) : (
          <div className="text-4xl text-gray-300">📦</div>
        )}
      </div>

      <div className="space-y-1">
        <h3 className="text-sm font-medium text-gray-900 group-hover:text-blue-600 line-clamp-2">
          {product.name}
        </h3>

        <p className="text-lg font-bold text-red-600">
          ¥{formatPrice(product.price)}
        </p>

        <div className="flex items-center justify-between">
          {product.category && (
            <Badge>{product.category.name}</Badge>
          )}
          <span className={`text-xs ${product.stock > 0 ? "text-green-600" : "text-red-500"}`}>
            {product.stock > 0 ? `库存 ${product.stock}` : "缺货"}
          </span>
        </div>
      </div>
    </Link>
  );
}
