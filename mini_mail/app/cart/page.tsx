import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import CartItemRow from "@/components/cart/CartItem";
import CheckoutButton from "@/components/cart/CheckoutButton";
import Link from "next/link";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

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
      <h1 className="mb-6 text-2xl font-bold text-foreground">购物车</h1>

      {items.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground">购物车是空的</p>
          <Link
            href="/products"
            className="mt-4 inline-block"
          >
            <Button>去逛逛</Button>
          </Link>
        </Card>
      ) : (
        <div className="space-y-4">
          <Card>
            {items.map((item) => (
              <CartItemRow key={item.id} item={item} />
            ))}
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <span className="text-base text-muted-foreground">合计</span>
              <span className="text-xl font-bold text-danger-500">
                ¥{subtotal.toFixed(2)}
              </span>
            </div>

            <CheckoutButton />
          </Card>
        </div>
      )}
    </div>
  );
}
