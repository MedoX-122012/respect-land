import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth-admin";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 10;

const SORTS: Record<string, Prisma.CreatorOrderByWithRelationInput> = {
  newest: { createdAt: "desc" },
  name: { name: "asc" },
  views: { views: "desc" },
  followers: { followerCount: "desc" },
};

const creatorSchema = z.object({
  name: z.string().min(2),
  username: z
    .string()
    .min(2)
    .regex(/^[a-zA-Z0-9_.]+$/, "username بالأحرف الإنجليزية فقط"),
  avatar: z.string().optional().nullable(),
  cover: z.string().optional().nullable(),
  bio: z.string().optional().nullable(),
  categoryId: z.string().optional().nullable(),
  platforms: z.array(z.any()).default([]),
  followerCount: z.coerce.number().int().min(0).default(0),
  views: z.coerce.number().int().min(0).default(0),
  featured: z.boolean().default(false),
  verified: z.boolean().default(false),
  isNew: z.boolean().default(false),
  trending: z.boolean().default(false),
  adminScore: z.coerce.number().int().min(0).default(0),
});

export async function GET(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });

  const params = req.nextUrl.searchParams;
  const q = (params.get("q") ?? "").trim();
  const status = params.get("status") ?? "all";
  const sort = params.get("sort") ?? "newest";
  const page = Math.max(1, parseInt(params.get("page") ?? "1", 10) || 1);

  const where: Prisma.CreatorWhereInput = {};
  if (q) {
    where.OR = [
      { name: { contains: q } },
      { username: { contains: q } },
    ];
  }
  if (status === "verified") where.verified = true;
  if (status === "featured") where.featured = true;
  if (status === "new") where.isNew = true;

  const [creators, total] = await Promise.all([
    prisma.creator.findMany({
      where,
      orderBy: SORTS[sort] ?? SORTS.newest,
      include: { category: true },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.creator.count({ where }),
  ]);

  return NextResponse.json({ creators, total, page, pageSize: PAGE_SIZE });
}

export async function POST(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = creatorSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }
  const data = parsed.data;

  const exists = await prisma.creator.findUnique({
    where: { username: data.username },
  });
  if (exists) {
    return NextResponse.json(
      { error: { username: ["اسم المستخدم مستخدم بالفعل"] } },
      { status: 409 }
    );
  }

  const creator = await prisma.creator.create({
    data: {
      name: data.name,
      username: data.username,
      avatar: data.avatar || null,
      cover: data.cover || null,
      bio: data.bio || null,
      categoryId: data.categoryId || null,
      platforms: data.platforms as unknown as never,
      followerCount: data.followerCount,
      views: data.views,
      featured: data.featured,
      verified: data.verified,
      isNew: data.isNew,
      trending: data.trending,
      adminScore: data.adminScore,
    },
    include: { category: true },
  });

  await prisma.activityLog.create({
    data: { action: "تمت إضافة صانع المحتوى", admin: data.username, target: data.name },
  });

  return NextResponse.json({ creator }, { status: 201 });
}