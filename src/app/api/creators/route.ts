import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 12;

const SORTS: Record<string, Prisma.CreatorOrderByWithRelationInput> = {
  newest: { createdAt: "desc" },
  views: { views: "desc" },
  followers: { followerCount: "desc" },
  score: { adminScore: "desc" },
  alpha: { name: "asc" },
};

export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams;
  const q = (params.get("q") ?? "").trim();
  const category = params.get("category") ?? "";
  const platform = params.get("platform") ?? "";
  const status = params.get("status") ?? "all";
  const sort = params.get("sort") ?? "views";
  const page = Math.max(1, parseInt(params.get("page") ?? "1", 10) || 1);

  const where: Prisma.CreatorWhereInput = {};

  if (category) {
    where.category = { slug: category };
  }

  if (q) {
    where.OR = [
      { name: { contains: q } },
      { username: { contains: q } },
      { bio: { contains: q } },
    ];
  }

  if (status === "verified") where.verified = true;
  if (status === "featured") where.featured = true;
  if (status === "new") where.isNew = true;

  const orderBy = SORTS[sort] ?? SORTS.views;

  if (q) {
    void prisma.analyticsEvent.create({
      data: { type: "search", value: q.slice(0, 120) },
    });
  }
  if (category) {
    void prisma.analyticsEvent.create({
      data: { type: "category_view", value: category },
    });
  }

  try {
    const [raw, total] = await Promise.all([
      prisma.creator.findMany({
        where,
        orderBy,
        include: { category: true },
        skip: (page - 1) * PAGE_SIZE,
        take: PAGE_SIZE * 3,
      }),
      prisma.creator.count({ where }),
    ]);

    // Platform filter applied in app code (SQLite JSON compatibility)
    const creators = platform
      ? raw.filter((c) => {
          const platforms: { key?: string }[] = Array.isArray(c.platforms)
            ? (c.platforms as { key?: string }[])
            : [];
          return platforms.some((p) => p.key === platform);
        })
      : raw;

    const filteredTotal = platform ? creators.length : total;

    return NextResponse.json({
      creators,
      total: Math.min(filteredTotal, total),
      page,
      pageSize: PAGE_SIZE,
      hasMore: page * PAGE_SIZE < filteredTotal,
    });
  } catch (err) {
    console.error("Creators API error", err);
    return NextResponse.json(
      { error: "حدث خطأ أثناء تحميل البيانات." },
      { status: 500 }
    );
  }
}