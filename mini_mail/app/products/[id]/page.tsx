import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
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
        <div className="flex items-center justify-center rounded-lg bg-white p-8 shadow-sm">
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="max-h-80 object-contain"
            />
          ) : (
            <div className="text-8xl text-gray-300">📦</div>
          )}
        </div>

        {/* Info */}
        <div className="space-y-4">
          {product.category && (
            <Badge>{product.category.name}</Badge>
          )}

          <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>

          <p className="text-3xl font-bold text-red-600">
            ¥{formatPrice(product.price)}
          </p>

          <p className={`text-sm ${product.stock > 0 ? "text-green-600" : "text-red-500"}`}>
            {product.stock > 0 ? `库存: ${product.stock} 件` : "暂时缺货"}
          </p>

          {product.description && (
            <p className="text-sm leading-relaxed text-gray-600">
              {product.description}
            </p>
          )}

          {session?.user && (
            <AddToCartButton productId={product.id} disabled={product.stock <= 0} />
          )}

          {!session?.user && (
            <p className="text-sm text-gray-500">
              请先<a href="/login" className="text-blue-600 hover:underline"> 登录 </a>
              以加入购物车
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
