import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { getTierConfig, getNextTier } from "@/lib/membership";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "请先登录" }, { status: 401 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { totalSpent: true, membershipTier: true },
    });

    if (!user) {
      return NextResponse.json({ error: "用户不存在" }, { status: 404 });
    }

    const currentTier = getTierConfig(user.totalSpent);
    const nextTier = getNextTier(currentTier.name);

    const data = {
      currentTier: currentTier.name,
      currentLabel: currentTier.label,
      discountPct: currentTier.discountPct,
      totalSpent: user.totalSpent,
      nextTier: nextTier
        ? { name: nextTier.name, label: nextTier.label, minSpent: nextTier.minSpent }
        : null,
      amountToNext: nextTier ? Math.max(0, nextTier.minSpent - user.totalSpent) : 0,
    };

    return NextResponse.json({ data });
  } catch {
    return NextResponse.json({ error: "获取会员信息失败" }, { status: 500 });
  }
}
