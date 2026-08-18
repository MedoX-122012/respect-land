import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth-admin";

export const dynamic = "force-dynamic";

const importCategory = z.object({
  name: z.string().min(1),
  slug: z.string().optional(),
  icon: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  order: z.number().optional(),
});

const importCreator = z.object({
  name: z.string().min(1),
  username: z.string().min(1),
  avatar: z.string().optional().nullable(),
  cover: z.string().optional().nullable(),
  bio: z.string().optional().nullable(),
  categorySlug: z.string().optional().nullable(),
  platforms: z.any().optional(),
  followerCount: z.number().optional(),
  views: z.number().optional(),
  featured: z.boolean().optional(),
  verified: z.boolean().optional(),
  isNew: z.boolean().optional(),
  trending: z.boolean().optional(),
  adminScore: z.number().optional(),
});

const schema = z.object({
  version: z.number().optional(),
  categories: z.array(importCategory).optional().default([]),
  creators: z.array(importCreator).optional().default([]),
});

export async function POST(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "البيانات غير صالحة. تأكد من ملف التصدير." },
      { status: 400 }
    );
  }

  const data = parsed.data;
  let categoriesAdded = 0;
  let creatorsAdded = 0;
  let skipped = 0;

  for (const c of data.categories) {
    const existing = await prisma.category.findFirst({
      where: {
        OR: [{ slug: c.slug ?? "" }, { name: c.name }],
      },
    });
    if (existing) {
      skipped++;
      continue;
    }
    const slug = c.slug || slugify(c.name);
    await prisma.category.create({
      data: {
        name: c.name,
        slug,
        icon: c.icon || null,
        description: c.description || null,
        order: c.order ?? 0,
      },
    });
    categoriesAdded++;
  }

  const categoryMap = new Map<string, string>();
  const allCats = await prisma.category.findMany();
  for (const cat of allCats) categoryMap.set(cat.slug, cat.id);

  for (const cr of data.creators) {
    const existing = await prisma.creator.findUnique({ where: { username: cr.username } });
    if (existing) {
      skipped++;
      continue;
    }
    await prisma.creator.create({
      data: {
        name: cr.name,
        username: cr.username,
        avatar: cr.avatar || null,
        cover: cr.cover || null,
        bio: cr.bio || null,
        categoryId: cr.categorySlug ? categoryMap.get(cr.categorySlug) ?? null : null,
        platforms: (cr.platforms as unknown as never) ?? [],
        followerCount: cr.followerCount ?? 0,
        views: cr.views ?? 0,
        featured: cr.featured ?? false,
        verified: cr.verified ?? false,
        isNew: cr.isNew ?? false,
        trending: cr.trending ?? false,
        adminScore: cr.adminScore ?? 0,
      },
    });
    creatorsAdded++;
  }

  await prisma.activityLog.create({
    data: {
      action: `تم استيراد البيانات (${categoriesAdded} تصنيف، ${creatorsAdded} صانع، ${skipped} تم تجاوزها)`,
    },
  });

  return NextResponse.json({ categoriesAdded, creatorsAdded, skipped });
}

function slugify(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);
}