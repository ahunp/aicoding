import ProductCard from "./ProductCard";

interface ProductGridProps {
  products: Array<{
    id: string;
    name: string;
    price: number;
    imageUrl: string | null;
    stock: number;
    category: { name: string } | null;
  }>;
}

export default function ProductGrid({ products }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="py-12 text-center text-gray-500">
        没有找到商品
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
