import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { z } from "zod";

const updateSchema = z.object({
  name: z.string().min(1, "商品名称不能为空").optional(),
  price: z.number().positive("价格必须大于 0").optional(),
  description: z.string().optional(),
  imageUrl: z.string().optional(),
  stock: z.number().int().min(0, "库存不能为负数").optional(),
  categoryId: z.string().min(1, "分类不能为空").optional(),
  isActive: z.boolean().optional(),
  isMemberExclusive: z.boolean().optional(),
  isFlashDeal: z.boolean().optional(),
  flashDealDiscount: z.number().int().min(0).max(100).optional(),
  flashDealEndsAt: z.string().optional().nullable(),
});

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "无权限" }, { status: 403 });
  }

  const { id } = await params;
  const product = await prisma.product.findUnique({
    where: { id },
    include: { category: true },
  });

  if (!product) {
    return NextResponse.json({ error: "商品不存在" }, { status: 404 });
  }

  return NextResponse.json({ data: product });
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "无权限" }, { status: 403 });
  }

  const { id } = await params;
  const body = await req.json();
  const { images, ...rest } = body;
  const parsed = updateSchema.safeParse(rest);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0].message },
      { status: 400 }
    );
  }

  const data: Record<string, unknown> = { ...parsed.data };
  if (data.name) {
    data.slug = String(data.name)
      .toLowerCase()
      .replace(/[^a-z0-9一-鿿]+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");
  }
  // Convert datetime-local string to Date object for Prisma
  if (data.flashDealEndsAt !== undefined && data.flashDealEndsAt !== null) {
    const raw = String(data.flashDealEndsAt);
    data.flashDealEndsAt = raw.includes("T") ? new Date(raw + ":00") : new Date(raw);
  }

  const product = await prisma.$transaction(async (tx) => {
    const updated = await tx.product.update({
      where: { id },
      data,
    });

    if (Array.isArray(images)) {
      await tx.productImage.deleteMany({ where: { productId: id } });
      const validUrls = images.filter((u: string) => u && u.trim());
      if (validUrls.length > 0) {
        await tx.productImage.createMany({
          data: validUrls.map((url: string, i: number) => ({ productId: id, url, sort: i })),
        });
      }
    }

    return updated;
  });

  return NextResponse.json({ data: product });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "无权限" }, { status: 403 });
  }

  const { id } = await params;
  await prisma.product.delete({ where: { id } });
  return NextResponse.json({ data: null });
}
