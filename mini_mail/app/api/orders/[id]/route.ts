import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { getTierName } from "@/lib/membership";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "请先登录" }, { status: 401 });
  }

  try {
    const { id } = await params;

    const order = await prisma.order.findUnique({
      where: { id },
      include: { items: true },
    });

    if (!order) {
      return NextResponse.json({ error: "订单不存在" }, { status: 404 });
    }

    if (order.userId !== session.user.id && session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "无权查看" }, { status: 403 });
    }

    return NextResponse.json({ data: order });
  } catch {
    return NextResponse.json({ error: "获取订单失败" }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "请先登录" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const { action } = await req.json();

    const order = await prisma.order.findUnique({ where: { id } });

    if (!order) {
      return NextResponse.json({ error: "订单不存在" }, { status: 404 });
    }

    if (order.userId !== session.user.id) {
      return NextResponse.json({ error: "无权操作" }, { status: 403 });
    }

    if (action === "cancel") {
      if (order.status !== "PENDING") {
        return NextResponse.json({ error: "只有待付款订单可以取消" }, { status: 400 });
      }

      // Restore stock for each item
      const items = await prisma.orderItem.findMany({ where: { orderId: id } });
      for (const item of items) {
        await prisma.product.update({
          where: { id: item.productId },
          data: { stock: { increment: item.quantity } },
        });
      }

      await prisma.order.update({
        where: { id },
        data: { status: "CANCELLED" },
      });

      return NextResponse.json({ message: "订单已取消" });
    }

    if (action === "pay") {
      if (order.status !== "PENDING") {
        return NextResponse.json({ error: "只有待付款订单可以支付" }, { status: 400 });
      }

      await prisma.$transaction(async (tx) => {
        const user = await tx.user.findUnique({
          where: { id: order.userId },
          select: { totalSpent: true },
        });
        const newTotalSpent = (user?.totalSpent ?? 0) + order.finalAmount;

        await tx.order.update({
          where: { id },
          data: { status: "PAID" },
        });

        await tx.user.update({
          where: { id: order.userId },
          data: {
            totalSpent: { increment: order.finalAmount },
            membershipTier: getTierName(newTotalSpent),
          },
        });
      });

      return NextResponse.json({ message: "支付成功" });
    }

    return NextResponse.json({ error: "不支持的操作" }, { status: 400 });
  } catch {
    return NextResponse.json({ error: "操作失败" }, { status: 500 });
  }
}
