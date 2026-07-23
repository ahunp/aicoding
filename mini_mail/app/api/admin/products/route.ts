import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { z } from "zod";
import type { Prisma } from "@prisma/client";

const productSchema = z.object({
  name: z.string().min(1, "商品名称不能为空"),
  price: z.number().positive("价格必须大于 0"),
  description: z.string().optional().default(""),
  imageUrl: z.string().optional().default(""),
  stock: z.number().int().min(0, "库存不能为负数").default(0),
  categoryId: z.string().min(1, "分类不能为空"),
  isActive: z.boolean().optional().default(true),
  isMemberExclusive: z.boolean().optional().default(false),
  isFlashDeal: z.boolean().optional().default(false),
  flashDealDiscount: z.number().int().min(0).max(100).optional().default(0),
  flashDealEndsAt: z.string().optional().nullable(),
});

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "无权限" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const page = Math.max(1, Number(searchParams.get("page")) || 1);
  const limit = Math.min(50, Math.max(1, Number(searchParams.get("limit")) || 20));
  const search = searchParams.get("search") || "";
  const categoryId = searchParams.get("categoryId") || "";
  const priceMin = searchParams.get("priceMin");
  const priceMax = searchParams.get("priceMax");
  const sortBy = searchParams.get("sortBy") || "createdAt";
  const sortOrder = searchParams.get("sortOrder") || "desc";

  const where: Prisma.ProductWhereInput = {
    ...(search ? { name: { contains: search } } : {}),
    ...(categoryId ? { categoryId } : {}),
    ...(priceMin || priceMax ? {
      price: {
        ...(priceMin ? { gte: parseFloat(priceMin) } : {}),
        ...(priceMax ? { lte: parseFloat(priceMax) } : {}),
      },
    } : {}),
  };

  const validSortFields = ["createdAt", "price", "stock", "name"];
  const field = validSortFields.includes(sortBy) ? sortBy : "createdAt";
  const order = sortOrder === "asc" ? "asc" : "desc";

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: { category: true },
      orderBy: { [field]: order },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.product.count({ where }),
  ]);

  return NextResponse.json({ data: products, total, page, limit });
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "无权限" }, { status: 403 });
  }

  const body = await req.json();
  const parsed = productSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0].message },
      { status: 400 }
    );
  }

  const slug = parsed.data.name
    .toLowerCase()
    .replace(/[^a-z0-9一-鿿]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  const createData: Record<string, unknown> = { ...parsed.data, slug };
  if (createData.flashDealEndsAt !== undefined && createData.flashDealEndsAt !== null && createData.flashDealEndsAt !== "") {
    const raw = String(createData.flashDealEndsAt);
    createData.flashDealEndsAt = raw.includes("T") ? new Date(raw + ":00") : new Date(raw);
  }

  const product = await prisma.product.create({
    data: createData as any,
  });

  return NextResponse.json({ data: product }, { status: 201 });
}
