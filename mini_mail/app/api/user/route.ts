import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { getTierConfig, getNextTier } from "@/lib/membership";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "未登录" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { name: true, email: true, createdAt: true, totalSpent: true, membershipTier: true },
  });

  if (!user) {
    return NextResponse.json({ error: "用户不存在" }, { status: 404 });
  }

  const currentTier = getTierConfig(user.totalSpent);
  const nextTier = getNextTier(currentTier.name);

  return NextResponse.json({
    data: {
      user: { name: user.name, email: user.email, createdAt: user.createdAt, totalSpent: user.totalSpent, membershipTier: user.membershipTier },
      membership: {
        currentTier: currentTier.name,
        currentLabel: currentTier.label,
        discountPct: currentTier.discountPct,
        totalSpent: user.totalSpent,
        nextTier: nextTier ? { name: nextTier.name, label: nextTier.label, minSpent: nextTier.minSpent } : null,
        amountToNext: nextTier ? Math.max(0, nextTier.minSpent - user.totalSpent) : 0,
      },
    },
  });
}

export async function PATCH(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "未登录" }, { status: 401 });
  }

  const { name } = await req.json();
  if (!name || typeof name !== "string" || name.trim().length === 0) {
    return NextResponse.json({ error: "姓名不能为空" }, { status: 400 });
  }

  const user = await prisma.user.update({
    where: { id: session.user.id },
    data: { name: name.trim() },
    select: { id: true, name: true, email: true },
  });

  return NextResponse.json({ data: user });
}
