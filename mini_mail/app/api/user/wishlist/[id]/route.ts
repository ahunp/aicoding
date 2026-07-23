import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "请先登录" }, { status: 401 });
  }

  const { id } = await params;
  const item = await prisma.wishlistItem.findUnique({ where: { id } });

  if (!item || item.userId !== session.user.id) {
    return NextResponse.json({ error: "不存在" }, { status: 404 });
  }

  await prisma.wishlistItem.delete({ where: { id } });
  return NextResponse.json({ data: null });
}
