import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "请先登录" }, { status: 401 });
  }

  const items = await prisma.wishlistItem.findMany({
    where: { userId: session.user.id },
    include: { product: { include: { category: true } } },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ data: items });
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "请先登录" }, { status: 401 });
  }

  const { productId } = await req.json();
  if (!productId) {
    return NextResponse.json({ error: "缺少商品 ID" }, { status: 400 });
  }

  const existing = await prisma.wishlistItem.findUnique({
    where: { userId_productId: { userId: session.user.id, productId } },
  });

  if (existing) {
    // Toggle off
    await prisma.wishlistItem.delete({ where: { id: existing.id } });
    return NextResponse.json({ data: { favorited: false } });
  }

  await prisma.wishlistItem.create({
    data: { userId: session.user.id, productId },
  });

  return NextResponse.json({ data: { favorited: true } }, { status: 201 });
}
