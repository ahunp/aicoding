import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { z } from "zod";
import { getTierName } from "@/lib/membership";

const statusSchema = z.object({
  status: z.enum(["PENDING", "PAID", "SHIPPED", "DELIVERED", "CANCELLED"]),
});

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "无权限" }, { status: 403 });
  }

  const { id } = await params;
  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      items: true,
      user: { select: { id: true, name: true, email: true, totalSpent: true, membershipTier: true } },
    },
  });

  if (!order) {
    return NextResponse.json({ error: "订单不存在" }, { status: 404 });
  }

  return NextResponse.json({ data: order });
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "无权限" }, { status: 403 });
  }

  const { id } = await params;
  const body = await req.json();
  const parsed = statusSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0].message },
      { status: 400 }
    );
  }

  const { status } = parsed.data;

  const order = await prisma.$transaction(async (tx) => {
    const existing = await tx.order.findUnique({ where: { id } });
    if (!existing) throw new Error("NOT_FOUND");

    // When marking as PAID, update user totalSpent and membershipTier
    if (status === "PAID" && existing.status !== "PAID") {
      const user = await tx.user.findUnique({
        where: { id: existing.userId },
        select: { totalSpent: true },
      });
      const newTotalSpent = (user?.totalSpent ?? 0) + existing.finalAmount;
      await tx.user.update({
        where: { id: existing.userId },
        data: {
          totalSpent: { increment: existing.finalAmount },
          membershipTier: getTierName(newTotalSpent),
        },
      });
    }

    return tx.order.update({
      where: { id },
      data: { status },
      include: { items: true, user: { select: { name: true, email: true } } },
    });
  });

  return NextResponse.json({ data: order });
}
