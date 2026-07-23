import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function DELETE() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "未登录" }, { status: 401 });
  }

  await prisma.cartItem.deleteMany({
    where: { userId: session.user.id },
  });

  return NextResponse.json({ message: "购物车已清空" });
}
