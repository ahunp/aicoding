import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const [reviews, stats] = await Promise.all([
    prisma.review.findMany({
      where: { productId: id },
      include: { user: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
      take: 20,
    }),
    prisma.review.aggregate({
      where: { productId: id },
      _avg: { rating: true },
      _count: true,
    }),
  ]);

  return NextResponse.json({
    data: {
      reviews,
      avgRating: stats._avg.rating ?? 0,
      total: stats._count,
    },
  });
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "请先登录" }, { status: 401 });
  }

  const { id: productId } = await params;
  const { orderId, rating, content } = await req.json();

  if (!rating || rating < 1 || rating > 5) {
    return NextResponse.json({ error: "评分必须在 1-5 之间" }, { status: 400 });
  }

  // Verify order belongs to user, is paid, and contains this product
  const order = await prisma.order.findFirst({
    where: { id: orderId, userId: session.user.id, status: "PAID" },
    include: { items: { where: { productId } } },
  });

  if (!order || order.items.length === 0) {
    return NextResponse.json({ error: "订单不存在或该商品未购买" }, { status: 400 });
  }

  // Check existing review
  const existing = await prisma.review.findUnique({
    where: { userId_productId_orderId: { userId: session.user.id, productId, orderId } },
  });

  if (existing) {
    return NextResponse.json({ error: "已评价过该商品" }, { status: 400 });
  }

  const review = await prisma.review.create({
    data: { userId: session.user.id, productId, orderId, rating, content: content || "" },
  });

  return NextResponse.json({ data: review }, { status: 201 });
}
