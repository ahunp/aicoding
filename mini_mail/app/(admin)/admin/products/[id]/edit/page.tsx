import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import ProductForm from "../../ProductForm";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [product, categories] = await Promise.all([
    prisma.product.findUnique({ where: { id } }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  if (!product) notFound();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">编辑商品</h1>
      <ProductForm
        categories={categories}
        initial={{
          id: product.id,
          name: product.name,
          price: product.price,
          description: product.description ?? "",
          imageUrl: product.imageUrl ?? "",
          stock: product.stock,
          categoryId: product.categoryId ?? "",
          isActive: product.isActive,
          isMemberExclusive: product.isMemberExclusive,
          isFlashDeal: product.isFlashDeal,
          flashDealDiscount: product.flashDealDiscount,
          flashDealEndsAt: product.flashDealEndsAt instanceof Date ? product.flashDealEndsAt.toISOString().slice(0, 16) : "",
        }}
      />
    </div>
  );
}
