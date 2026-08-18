import { prisma } from "./prisma";

export async function getDashboardStats() {
  const [
    creators,
    verified,
    featured,
    categories,
    applications,
    profileViews,
    mostViewed,
    recentViews,
    recentCreators,
    recentActivity,
  ] = await Promise.all([
    prisma.creator.count(),
    prisma.creator.count({ where: { verified: true } }),
    prisma.creator.count({ where: { featured: true } }),
    prisma.category.count(),
    prisma.application.count({ where: { status: "PENDING" } }),
    prisma.analyticsEvent.count({ where: { type: "profile_view" } }),
    prisma.creator.findFirst({
      orderBy: { views: "desc" },
      include: { category: true },
    }),
    prisma.analyticsEvent.count({
      where: { type: "profile_view", createdAt: { gte: daysAgo(7) } },
    }),
    prisma.creator.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { category: true },
    }),
    prisma.activityLog.findMany({
      orderBy: { createdAt: "desc" },
      take: 8,
    }),
  ]);

  return {
    creators,
    verified,
    featured,
    categories,
    applications,
    profileViews,
    recentViews,
    mostViewed,
    recentCreators,
    recentActivity,
  };
}

export async function getAnalyticsData(range: "today" | "week" | "month" | "all") {
  const start =
    range === "today"
      ? startOfDay()
      : range === "week"
      ? daysAgo(7)
      : range === "month"
      ? daysAgo(30)
      : null;

  const where = start ? { createdAt: { gte: start } } : {};

  const [totalViews, profileViews, searches, categoryViews, topCreators, platforms] =
    await Promise.all([
      prisma.analyticsEvent.count({ where }),
      prisma.analyticsEvent.count({ where: { ...where, type: "profile_view" } }),
      prisma.analyticsEvent.count({ where: { ...where, type: "search" } }),
      prisma.analyticsEvent.count({
        where: { ...where, type: "category_view" },
      }),
      prisma.analyticsEvent.groupBy({
        by: ["creatorId"],
        where: { ...where, creatorId: { not: null }, type: "profile_view" },
        _count: { _all: true },
        orderBy: { _count: { creatorId: "desc" } },
        take: 8,
      }),
      prisma.analyticsEvent.groupBy({
        by: ["type"],
        where,
        _count: { _all: true },
      }),
    ]);

  const creatorIds = topCreators
    .map((c) => c.creatorId)
    .filter(Boolean) as string[];
  const creators = creatorIds.length
    ? await prisma.creator.findMany({ where: { id: { in: creatorIds } } })
    : [];
  const creatorMap = new Map(creators.map((c) => [c.id, c]));

  const topCreatorList = topCreators
    .map((t) => ({
      creator: t.creatorId ? creatorMap.get(t.creatorId) : null,
      views: t._count._all,
    }))
    .filter((t) => t.creator);

  return {
    totalViews,
    profileViews,
    searches,
    categoryViews,
    topCreatorList,
    platforms,
  };
}

function daysAgo(days: number) {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d;
}

function startOfDay() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

export async function getViewsSeries(days: number) {
  const start = daysAgo(days);
  const events = await prisma.analyticsEvent.findMany({
    where: { type: "profile_view", createdAt: { gte: start } },
    select: { createdAt: true },
  });

  const buckets = new Map<string, number>();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    buckets.set(key, 0);
  }

  for (const e of events) {
    const key = e.createdAt.toISOString().slice(0, 10);
    if (buckets.has(key)) buckets.set(key, (buckets.get(key) ?? 0) + 1);
  }

  return Array.from(buckets.entries()).map(([date, views]) => ({ date, views }));
}
