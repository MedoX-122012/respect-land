import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const now = new Date();

  const [creators, categories] = await Promise.all([
    prisma.creator.findMany({
      select: { username: true, updatedAt: true },
    }),
    prisma.category.findMany({
      select: { slug: true, createdAt: true },
    }),
  ]);

  const staticRoutes = ["", "/creators", "/categories", "/leaderboard", "/about"].map(
    (r) => ({
      url: `${baseUrl}${r}`,
      lastModified: now,
      changeFrequency: "daily" as const,
      priority: r === "" ? 1 : 0.8,
    })
  );

  const creatorRoutes = creators.map((c) => ({
    url: `${baseUrl}/creators/${c.username}`,
    lastModified: c.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const categoryRoutes = categories.map((c) => ({
    url: `${baseUrl}/category/${c.slug}`,
    lastModified: c.createdAt,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...creatorRoutes, ...categoryRoutes];
}