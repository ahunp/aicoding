import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { z } from "zod";

const addressSchema = z.object({
  name: z.string().min(1, "收货人不能为空"),
  phone: z.string().min(1, "手机号不能为空"),
  province: z.string().min(1, "省不能为空"),
  city: z.string().min(1, "市不能为空"),
  district: z.string().optional().default(""),
  detail: z.string().min(1, "详细地址不能为空"),
  isDefault: z.boolean().optional().default(false),
});

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "请先登录" }, { status: 401 });
  }

  const addresses = await prisma.address.findMany({
    where: { userId: session.user.id },
    orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
  });

  return NextResponse.json({ data: addresses });
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "请先登录" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = addressSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  const { isDefault, ...fields } = parsed.data;

  // If setting as default, unset other defaults
  if (isDefault) {
    await prisma.address.updateMany({
      where: { userId: session.user.id },
      data: { isDefault: false },
    });
  }

  const address = await prisma.address.create({
    data: { ...fields, isDefault, userId: session.user.id },
  });

  return NextResponse.json({ data: address }, { status: 201 });
}
