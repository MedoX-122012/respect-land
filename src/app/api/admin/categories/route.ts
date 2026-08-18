import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth-admin";

export const dynamic = "force-dynamic";

const schema = z.object({
  name: z.string().min(2),
  icon: z.string().optional(),
  description: z.string().optional(),
  order: z.coerce.number().int().default(0),
});

function slugify(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);
}

export async function GET(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });

  const categories = await prisma.category.findMany({
    orderBy: { order: "asc" },
    include: { _count: { select: { creators: true } } },
  });
  return NextResponse.json({ categories });
}

export async function POST(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "بيانات غير صحيحة" }, { status: 400 });

  const maxOrder = await prisma.category.aggregate({ _max: { order: true } });
  const slug = slugify(parsed.data.name) || `cat-${Date.now()}`;

  const existing = await prisma.category.findUnique({ where: { slug } });
  if (existing) {
    return NextResponse.json({ error: { slug: ["يوجد تصنيف بنفس الاسم"] } }, { status: 409 });
  }

  const category = await prisma.category.create({
    data: {
      name: parsed.data.name,
      icon: parsed.data.icon,
      description: parsed.data.description,
      order: parsed.data.order || (maxOrder._max.order ?? 0) + 1,
      slug,
    },
  });

  await prisma.activityLog.create({
    data: { action: "تم إنشاء تصنيف", target: parsed.data.name },
  });

  return NextResponse.json({ category }, { status: 201 });
}