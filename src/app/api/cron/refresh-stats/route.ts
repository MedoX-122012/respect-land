import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { scrapeByPlatform } from "@/lib/scraper";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function GET(req: Request) {
  const auth = req.headers.get("authorization");
  const secret = process.env.CRON_SECRET?.trim();
  if (secret && auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const creators = await prisma.creator.findMany({ take: 20, orderBy: { lastScrapedAt: "asc" } });
  let updated = 0;
  let failed = 0;

  for (const c of creators) {
    const platforms = Array.isArray(c.platforms) ? (c.platforms as Array<{ key: string; url: string }>) : [];
    const yt = platforms.find((p) => p.key === "youtube" && p.url);
    const target = yt ?? platforms.find((p) => p.url);
    if (!target?.url) continue;
    try {
      const res = await scrapeByPlatform(target.key, target.url);
      if (res.error) {
        await prisma.creator.update({ where: { id: c.id }, data: { scrapeError: res.error, lastScrapedAt: new Date() } });
        failed++;
        continue;
      }
      const platformStats = { ...(c.platformStats as Record<string, unknown> | null ?? {}), [res.platform]: res };
      const videosToCreate = (res.videos ?? []).slice(0, 6);
      for (const v of videosToCreate) {
        await prisma.video.upsert({
          where: { platform_externalId: { platform: v.platform, externalId: v.externalId } },
          update: { title: v.title, thumbnail: v.thumbnail, url: v.url, views: v.views ?? 0, likes: v.likes ?? 0, publishedAt: v.publishedAt ? new Date(v.publishedAt) : null },
          create: { creatorId: c.id, platform: v.platform, externalId: v.externalId, title: v.title, thumbnail: v.thumbnail, url: v.url, views: v.views ?? 0, likes: v.likes ?? 0, publishedAt: v.publishedAt ? new Date(v.publishedAt) : null },
        });
      }
      await prisma.creator.update({
        where: { id: c.id },
        data: {
          followerCount: res.followerCount ?? c.followerCount,
          views: res.views ?? c.views,
          totalLikes: res.totalLikes ?? (c as unknown as { totalLikes?: number }).totalLikes ?? 0,
          platformStats: platformStats as never,
          lastScrapedAt: new Date(),
          scrapeError: null,
        },
      });
      updated++;
    } catch (e) {
      await prisma.creator.update({ where: { id: c.id }, data: { scrapeError: e instanceof Error ? e.message : "cron error", lastScrapedAt: new Date() } });
      failed++;
    }
  }

  await prisma.activityLog.create({ data: { action: `تحديث تلقائي: ${updated} نجح، ${failed} فشل`, admin: "cron" } });
  return NextResponse.json({ updated, failed, total: creators.length });
}
