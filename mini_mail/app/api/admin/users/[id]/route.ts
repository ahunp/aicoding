import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

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
  const { name, email, role, membershipTier } = body;

  const data: Record<string, string> = {};
  if (typeof name === "string") data.name = name;
  if (typeof email === "string") data.email = email;
  if (role === "USER" || role === "ADMIN") data.role = role;
  if (typeof membershipTier === "string") data.membershipTier = membershipTier;

  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: "没有需要更新的字段" }, { status: 400 });
  }

  const user = await prisma.user.update({
    where: { id },
    data,
    select: { id: true, name: true, email: true, role: true, membershipTier: true },
  });

  return NextResponse.json({ data: user });
}
