import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "12")));
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") || "desc";
    const memberExclusive = searchParams.get("memberExclusive");

    const where: Prisma.ProductWhereInput = {
      isActive: true,
      ...(search ? { name: { contains: search } } : {}),
      ...(category ? { categoryId: category } : {}),
      ...(memberExclusive === "true" ? { isMemberExclusive: true } : {}),
    };

    // Random sort: fetch all, shuffle, paginate in-memory
    if (sortBy === "random") {
      const all = await prisma.product.findMany({
        where,
        include: { category: true },
      });
      // Fisher-Yates shuffle
      for (let i = all.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [all[i], all[j]] = [all[j], all[i]];
      }
      const total = all.length;
      const data = all.slice((page - 1) * limit, page * limit);
      return NextResponse.json({ data, total, page, limit });
    }

    const validSortFields = ["createdAt", "price", "name"];
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
  } catch {
    return NextResponse.json(
      { error: "获取商品列表失败" },
      { status: 500 }
    );
  }
}
