import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { hash, compare } from "bcryptjs";

export async function PATCH(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "未登录" }, { status: 401 });
  }

  const { currentPassword, newPassword } = await req.json();

  if (!currentPassword || !newPassword) {
    return NextResponse.json({ error: "请填写旧密码和新密码" }, { status: 400 });
  }
  if (newPassword.length < 6) {
    return NextResponse.json({ error: "新密码至少 6 位" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { password: true },
  });

  if (!user) {
    return NextResponse.json({ error: "用户不存在" }, { status: 404 });
  }

  const isValid = await compare(currentPassword, user.password);
  if (!isValid) {
    return NextResponse.json({ error: "旧密码错误" }, { status: 400 });
  }

  const hashed = await hash(newPassword, 12);
  await prisma.user.update({
    where: { id: session.user.id },
    data: { password: hashed },
  });

  return NextResponse.json({ message: "密码修改成功" });
}
