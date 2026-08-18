import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const METRICS: Record<string, Prisma.CreatorOrderByWithRelationInput> = {
  views: { views: "desc" },
  followers: { followerCount: "desc" },
  score: { adminScore: "desc" },
  newest: { createdAt: "desc" },
};

export async function GET(req: NextRequest) {
  const metric = req.nextUrl.searchParams.get("metric") ?? "views";
  const limit = Math.min(
    50,
    Math.max(1, parseInt(req.nextUrl.searchParams.get("limit") ?? "20", 10))
  );

  try {
    const creators = await prisma.creator.findMany({
      orderBy: METRICS[metric] ?? METRICS.views,
      include: { category: true },
      take: limit,
    });
    return NextResponse.json({ creators, metric });
  } catch (err) {
    console.error("Leaderboard API error", err);
    return NextResponse.json({ error: "خطأ في التحميل." }, { status: 500 });
  }
}