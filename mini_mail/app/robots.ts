import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/api/", "/cart", "/orders", "/profile"],
    },
    sitemap: "https://jiongou.com/sitemap.xml",
  };
}
