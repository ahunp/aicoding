import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import CartItemRow from "@/components/cart/CartItem";
import CheckoutButton from "@/components/cart/CheckoutButton";
import Link from "next/link";

export default async function CartPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const items = await prisma.cartItem.findMany({
    where: { userId: session.user.id },
    include: { product: { include: { category: true } } },
    orderBy: { createdAt: "desc" },
  });

  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">购物车</h1>

      {items.length === 0 ? (
        <div className="rounded-lg bg-white p-12 text-center shadow-sm">
          <p className="text-gray-500">购物车是空的</p>
          <Link
            href="/products"
            className="mt-4 inline-block rounded bg-blue-600 px-6 py-2 text-sm text-white hover:bg-blue-700"
          >
            去逛逛
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="rounded-lg bg-white p-4 shadow-sm">
            {items.map((item) => (
              <CartItemRow key={item.id} item={item} />
            ))}
          </div>

          <div className="rounded-lg bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-base text-gray-600">合计</span>
              <span className="text-xl font-bold text-red-600">
                ¥{subtotal.toFixed(2)}
              </span>
            </div>

            <CheckoutButton />
          </div>
        </div>
      )}
    </div>
  );
}
