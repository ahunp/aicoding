import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const product = await prisma.product.findUnique({
      where: { id },
      include: { category: true },
    });

    if (!product || !product.isActive) {
      return NextResponse.json(
        { error: "商品不存在" },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: product });
  } catch {
    return NextResponse.json(
      { error: "获取商品详情失败" },
      { status: 500 }
    );
  }
}
