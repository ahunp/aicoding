import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { getTierConfig } from "@/lib/membership";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "请先登录" }, { status: 401 });
  }

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ data: orders });
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "请先登录" }, { status: 401 });
  }

  try {
    const userId = session.user.id;
    const { addressId } = await req.json().catch(() => ({}));

    // Resolve address
    const address = addressId
      ? await prisma.address.findFirst({ where: { id: addressId, userId } })
      : null;

    // Fetch user with cart items
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    const cartItems = await prisma.cartItem.findMany({
      where: { userId },
      include: { product: true },
    });

    if (cartItems.length === 0) {
      return NextResponse.json({ error: "购物车是空的" }, { status: 400 });
    }

    const totalAmount = cartItems.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );

    // Calculate membership discount
    if (!user) {
      return NextResponse.json({ error: "用户不存在" }, { status: 404 });
    }
    const tier = getTierConfig(user.totalSpent);
    const discountAmount = totalAmount * (tier.discountPct / 100);
    const finalAmount = totalAmount - discountAmount;

    // Create order in transaction
    const order = await prisma.$transaction(async (tx) => {
      // Validate stock inside transaction (atomic)
      for (const item of cartItems) {
        const product = await tx.product.findUnique({ where: { id: item.product.id } });
        if (!product || product.stock < item.quantity) {
          throw new Error(`STOCK:${item.product.name}:${product?.stock ?? 0}`);
        }
      }

      const addressSnapshot = address
        ? JSON.stringify({ name: address.name, phone: address.phone, province: address.province, city: address.city, district: address.district, detail: address.detail })
        : "";

      const newOrder = await tx.order.create({
        data: {
          userId,
          totalAmount,
          discountAmount,
          finalAmount,
          membershipTierAtOrder: tier.name,
          addressSnapshot,
          items: {
            create: cartItems.map((item) => ({
              productId: item.product.id,
              productName: item.product.name,
              productPrice: item.product.price,
              quantity: item.quantity,
              subtotal: item.product.price * item.quantity,
            })),
          },
        },
        include: { items: true },
      });

      // Decrement stock
      for (const item of cartItems) {
        await tx.product.update({
          where: { id: item.product.id },
          data: { stock: { decrement: item.quantity } },
        });
      }

      // Clear cart
      await tx.cartItem.deleteMany({
        where: { userId },
      });

      return newOrder;
    });

    return NextResponse.json({ data: order }, { status: 201 });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "";
    if (msg.startsWith("STOCK:")) {
      const [, name, stock] = msg.split(":");
      return NextResponse.json(
        { error: `"${name}" 库存不足（剩余 ${stock}）` },
        { status: 400 }
      );
    }
    return NextResponse.json({ error: "下单失败，请稍后重试" }, { status: 500 });
  }
}
