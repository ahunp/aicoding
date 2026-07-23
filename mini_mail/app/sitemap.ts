import { prisma } from "@/lib/prisma";
import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://jiongou.com";

  const products = await prisma.product.findMany({
    where: { isActive: true },
    select: { id: true, updatedAt: true },
  });

  const categories = await prisma.category.findMany({
    select: { id: true },
  });

  return [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${baseUrl}/products`, lastModified: new Date(), changeFrequency: "daily", priority: 0.8 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 },
    { url: `${baseUrl}/help`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 },
    ...products.map((p) => ({
      url: `${baseUrl}/products/${p.id}`,
      lastModified: p.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
    ...categories.map((c) => ({
      url: `${baseUrl}/products?category=${c.id}`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.5,
    })),
  ];
}
