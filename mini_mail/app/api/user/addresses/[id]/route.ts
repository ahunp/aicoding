import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { z } from "zod";

const updateSchema = z.object({
  name: z.string().min(1).optional(),
  phone: z.string().min(1).optional(),
  province: z.string().min(1).optional(),
  city: z.string().min(1).optional(),
  district: z.string().optional(),
  detail: z.string().min(1).optional(),
  isDefault: z.boolean().optional(),
});

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "请先登录" }, { status: 401 });
  }

  const { id } = await params;
  const address = await prisma.address.findUnique({ where: { id } });
  if (!address || address.userId !== session.user.id) {
    return NextResponse.json({ error: "地址不存在" }, { status: 404 });
  }

  const body = await req.json();
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  if (parsed.data.isDefault) {
    await prisma.address.updateMany({
      where: { userId: session.user.id },
      data: { isDefault: false },
    });
  }

  const updated = await prisma.address.update({
    where: { id },
    data: parsed.data,
  });

  return NextResponse.json({ data: updated });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "请先登录" }, { status: 401 });
  }

  const { id } = await params;
  const address = await prisma.address.findUnique({ where: { id } });
  if (!address || address.userId !== session.user.id) {
    return NextResponse.json({ error: "地址不存在" }, { status: 404 });
  }

  await prisma.address.delete({ where: { id } });
  return NextResponse.json({ data: null });
}
