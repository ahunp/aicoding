import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

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
