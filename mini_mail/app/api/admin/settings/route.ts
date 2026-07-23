import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "无权限" }, { status: 403 });
  }

  let settings = await prisma.memberSettings.findUnique({
    where: { id: "singleton" },
  });

  if (!settings) {
    settings = await prisma.memberSettings.create({
      data: { id: "singleton", minTierForExclusive: "GOLD" },
    });
  }

  return NextResponse.json({ data: settings });
}

export async function PUT(req: Request) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "无权限" }, { status: 403 });
  }

  const { minTierForExclusive } = await req.json();
  const validTiers = ["BRONZE", "SILVER", "GOLD", "PLATINUM", "DIAMOND"];

  if (!validTiers.includes(minTierForExclusive)) {
    return NextResponse.json({ error: "无效的会员等级" }, { status: 400 });
  }

  const settings = await prisma.memberSettings.upsert({
    where: { id: "singleton" },
    update: { minTierForExclusive },
    create: { id: "singleton", minTierForExclusive },
  });

  return NextResponse.json({ data: settings });
}
