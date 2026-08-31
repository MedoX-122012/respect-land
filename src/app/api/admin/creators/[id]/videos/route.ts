import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth-admin";

export const dynamic = "force-dynamic";

const videoSchema = z.object({
  platform: z.string().min(1),
  externalId: z.string().min(1),
  title: z.string().optional().nullable(),
  thumbnail: z.string().optional().nullable(),
  url: z.string().url(),
  views: z.coerce.number().int().min(0).default(0),
  likes: z.coerce.number().int().min(0).default(0),
  comments: z.coerce.number().int().min(0).default(0).optional(),
  publishedAt: z.string().optional().nullable(),
  isLatest: z.boolean().optional(),
  isTopViewed: z.boolean().optional(),
  isTopLiked: z.boolean().optional(),
});

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  const { id } = await params;
  const body = await req.json().catch(() => null);
  const parsed = videoSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
  const data = parsed.data;
  const creator = await prisma.creator.findUnique({ where: { id } });
  if (!creator) return NextResponse.json({ error: "صانع المحتوى غير موجود" }, { status: 404 });
  const video = await prisma.video.upsert({
    where: { platform_externalId: { platform: data.platform, externalId: data.externalId } },
    update: {
      title: data.title ?? undefined,
      thumbnail: data.thumbnail ?? undefined,
      url: data.url,
      views: data.views,
      likes: data.likes,
      comments: data.comments ?? 0,
      publishedAt: data.publishedAt ? new Date(data.publishedAt) : null,
      isLatest: data.isLatest ?? false,
      isTopViewed: data.isTopViewed ?? false,
      isTopLiked: data.isTopLiked ?? false,
    },
    create: {
      creatorId: id,
      platform: data.platform,
      externalId: data.externalId,
      title: data.title ?? null,
      thumbnail: data.thumbnail ?? null,
      url: data.url,
      views: data.views,
      likes: data.likes,
      comments: data.comments ?? 0,
      publishedAt: data.publishedAt ? new Date(data.publishedAt) : null,
      isLatest: data.isLatest ?? false,
      isTopViewed: data.isTopViewed ?? false,
      isTopLiked: data.isTopLiked ?? false,
    },
  });
  return NextResponse.json({ video }, { status: 201 });
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  const { id } = await params;
  const videos = await prisma.video.findMany({ where: { creatorId: id }, orderBy: { views: "desc" } });
  return NextResponse.json({ videos });
}
