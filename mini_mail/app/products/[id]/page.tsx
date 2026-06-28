import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import Image from "next/image";
import { Package } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import Badge from "@/components/ui/Badge";
import AddToCartButton from "@/components/cart/AddToCartButton";

interface ProductDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { id } = await params;
  const session = await auth();

  const product = await prisma.product.findUnique({
    where: { id },
    include: { category: true },
  });

  if (!product || !product.isActive) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="grid gap-8 md:grid-cols-2">
        {/* Image */}
        <div className="relative flex items-center justify-center rounded-lg bg-surface shadow-card min-h-80">
          {product.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              className="object-contain p-4"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          ) : (
            <Package className="h-24 w-24 text-muted" />
          )}
        </div>

        {/* Info */}
        <div className="space-y-4">
          {product.category && (
            <Badge>{product.category.name}</Badge>
          )}

          <h1 className="text-2xl font-bold text-foreground">{product.name}</h1>

          <p className="text-3xl font-bold text-danger-500">
            {formatPrice(product.price)}
          </p>

          <p className={`text-sm ${product.stock > 0 ? "text-success-500" : "text-danger-500"}`}>
            {product.stock > 0 ? `库存: ${product.stock} 件` : "暂时缺货"}
          </p>

          {product.description && (
            <p className="text-sm leading-relaxed text-muted-foreground">
              {product.description}
            </p>
          )}

          {session?.user && (
            <AddToCartButton productId={product.id} disabled={product.stock <= 0} />
          )}

          {!session?.user && (
            <p className="text-sm text-muted-foreground">
              请先<a href="/login" className="text-primary-600 hover:underline"> 登录 </a>
              以加入购物车
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
