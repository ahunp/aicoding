import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "请先登录" }, { status: 401 });
  }

  const reviews = await prisma.review.findMany({
    where: { userId: session.user.id },
    include: { product: { select: { name: true, imageUrl: true, price: true } } },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ data: reviews });
}
