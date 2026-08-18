import {
  Prisma,
  type Creator,
  type Category,
  type SiteSetting,
} from "@prisma/client";
import { prisma } from "./prisma";

export type CreatorWithCategory = Creator & {
  category: Category | null;
};

const DEFAULT_SETTINGS: SiteSetting & {
  creatorOfWeek: (Creator & { category: Category | null }) | null;
} = {
  id: 1,
  siteName: "Respect Land",
  logo: null,
  favicon: null,
  description: null,
  inviteLink: null,
  socialLinks: null,
  footerText: null,
  homeCtaTitle: null,
  homeCtaSubtitle: null,
  themeAccent: null,
  maintenanceMode: false,
  newBadgeDays: 30,
  creatorOfWeekId: null,
  trendingLimit: 8,
  updatedAt: new Date(0),
  creatorOfWeek: null,
};

export async function getSiteSettings(): Promise<
  SiteSetting & {
    creatorOfWeek: (Creator & { category: Category | null }) | null;
  }
> {
  try {
    const settings = await prisma.siteSetting.findFirst({
      where: { id: 1 },
    });
    if (!settings) {
      return { ...DEFAULT_SETTINGS };
    }
    let creatorOfWeek = null;
    if (settings.creatorOfWeekId) {
      creatorOfWeek = await prisma.creator.findUnique({
        where: { id: settings.creatorOfWeekId },
        include: { category: true },
      });
    }
    return { ...settings, creatorOfWeek };
  } catch (err) {
    console.warn("[queries] getSiteSettings failed, using defaults", err);
    return { ...DEFAULT_SETTINGS };
  }
}

export async function getSettings(): Promise<SiteSetting | null> {
  return prisma.siteSetting.findFirst({ where: { id: 1 } }).catch(() => null);
}

export async function getCategories(): Promise<
  (Category & {
    _count: { creators: number };
    creators: { name: string; username: string; avatar: string | null }[];
  })[]
> {
  return prisma.category
    .findMany({
      orderBy: { order: "asc" },
      include: {
        _count: { select: { creators: true } },
        creators: {
          orderBy: { views: "desc" },
          take: 4,
          select: { name: true, username: true, avatar: true },
        },
      },
    })
    .catch(() => []);
}

export async function getFeaturedCreators(): Promise<CreatorWithCategory[]> {
  return prisma.creator
    .findMany({
      where: { featured: true },
      orderBy: [{ featuredOrder: "asc" }, { createdAt: "desc" }],
      include: { category: true },
    })
    .catch(() => []);
}

export async function getTrendingCreators(
  limit = 8
): Promise<CreatorWithCategory[]> {
  try {
    const settings = await getSettings();
    const effectiveLimit = settings?.trendingLimit ?? limit;
    const manual = await prisma.creator.findMany({
      where: { trending: true },
      orderBy: [{ trendingOrder: "asc" }, { createdAt: "desc" }],
      include: { category: true },
      take: effectiveLimit,
    });
    if (manual.length >= effectiveLimit) return manual;

    const ids = manual.map((c) => c.id);
    const computed = await prisma.creator.findMany({
      where: { id: { notIn: ids }, featured: true },
      orderBy: [{ views: "desc" }, { followerCount: "desc" }],
      include: { category: true },
      take: effectiveLimit - manual.length,
    });
    return [...manual, ...computed].slice(0, effectiveLimit);
  } catch {
    return [];
  }
}

export async function getNewCreators(limit = 6): Promise<CreatorWithCategory[]> {
  return prisma.creator
    .findMany({
      orderBy: { createdAt: "desc" },
      include: { category: true },
      take: limit,
    })
    .catch(() => []);
}

export async function getNewBadgeDays(): Promise<number> {
  const settings = await getSettings();
  return settings?.newBadgeDays ?? 30;
}

export async function getLeaderboard(
  metric: "views" | "followers" | "adminScore" | "createdAt" = "views",
  limit = 10
): Promise<CreatorWithCategory[]> {
  const orderBy: Prisma.CreatorOrderByWithRelationInput =
    metric === "createdAt"
      ? { createdAt: "desc" }
      : { [metric]: "desc" };
  return prisma.creator
    .findMany({
      orderBy,
      include: { category: true },
      take: limit,
    })
    .catch(() => []);
}

export async function getCreatorByUsername(
  username: string
): Promise<CreatorWithCategory | null> {
  return prisma.creator
    .findUnique({
      where: { username },
      include: { category: true },
    })
    .catch(() => null);
}

export async function getCreatorById(
  id: string
): Promise<CreatorWithCategory | null> {
  return prisma.creator
    .findUnique({
      where: { id },
      include: { category: true },
    })
    .catch(() => null);
}

export async function getRelatedCreators(
  creator: CreatorWithCategory,
  limit = 4
): Promise<CreatorWithCategory[]> {
  return prisma.creator
    .findMany({
      where: {
        id: { not: creator.id },
        OR: [{ categoryId: creator.categoryId ?? "" }, { trending: true }],
      },
      orderBy: [{ verified: "desc" }, { views: "desc" }],
      include: { category: true },
      take: limit,
    })
    .catch(() => []);
}

export async function getCreatorsBySlug(
  slug: string,
  limit?: number
): Promise<CreatorWithCategory[]> {
  const args: Prisma.CreatorFindManyArgs = {
    where: { category: { slug } },
    orderBy: [{ featured: "desc" }, { views: "desc" }],
    include: { category: true },
  };
  if (limit) args.take = limit;
  return prisma.creator
    .findMany(args)
    .catch(() => []) as Promise<CreatorWithCategory[]>;
}

export async function getCategoryBySlug(slug: string) {
  return prisma.category.findUnique({
    where: { slug },
  }).catch(() => null);
}

export interface LiveStats {
  creators: number;
  categories: number;
  views: number;
  platforms: number;
}

export async function getLiveStats(): Promise<LiveStats> {
  try {
    const [creators, categories, aggregate] = await Promise.all([
      prisma.creator.count(),
      prisma.category.count(),
      prisma.creator.aggregate({ _sum: { views: true } }),
    ]);
    return {
      creators,
      categories,
      views: aggregate._sum.views ?? 0,
      platforms: PLATFORM_COUNT,
    };
  } catch {
    return { creators: 0, categories: 0, views: 0, platforms: PLATFORM_COUNT };
  }
}

export const PLATFORM_COUNT = 7;

export async function getActiveAnnouncement() {
  const now = new Date();
  return prisma.announcement
    .findFirst({
      where: {
        active: true,
        OR: [{ startDate: null }, { startDate: { lte: now } }],
        AND: [{ endDate: null }],
      },
      orderBy: { createdAt: "desc" },
    })
    .catch(() => null);
}

export async function getCategoryWithCreators(slug: string, limit?: number) {
  const [category, creators] = await Promise.all([
    getCategoryBySlug(slug),
    getCreatorsBySlug(slug, limit),
  ]);
  return { category, creators };
}