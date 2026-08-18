import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth-admin";

export const dynamic = "force-dynamic";

const updateSchema = z.object({
  name: z.string().min(2).optional(),
  username: z
    .string()
    .min(2)
    .regex(/^[a-zA-Z0-9_.]+$/)
    .optional(),
  avatar: z.string().nullable().optional(),
  cover: z.string().nullable().optional(),
  bio: z.string().nullable().optional(),
  categoryId: z.string().nullable().optional(),
  platforms: z.array(z.any()).optional(),
  followerCount: z.coerce.number().int().min(0).optional(),
  views: z.coerce.number().int().min(0).optional(),
  featured: z.boolean().optional(),
  verified: z.boolean().optional(),
  isNew: z.boolean().optional(),
  trending: z.boolean().optional(),
  featuredOrder: z.coerce.number().int().optional(),
  adminScore: z.coerce.number().int().min(0).optional(),
});

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });

  const { id } = await params;
  const body = await req.json().catch(() => null);
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "بيانات غير صحيحة" }, { status: 400 });
  }
  const data = parsed.data;

  if (data.username) {
    const exists = await prisma.creator.findFirst({
      where: { username: data.username, NOT: { id } },
    });
    if (exists) {
      return NextResponse.json(
        { error: { username: ["اسم المستخدم مستخدم بالفعل"] } },
        { status: 409 }
      );
    }
  }

  const creator = await prisma.creator.update({
    where: { id },
    data: {
      ...data,
      platforms: data.platforms as unknown as never,
    },
    include: { category: true },
  });

  await prisma.activityLog.create({
    data: { action: "تم تحديث صانع المحتوى", admin: data.username ?? id, target: creator.name },
  });

  return NextResponse.json({ creator });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });

  const { id } = await params;
  const creator = await prisma.creator.delete({ where: { id } });

  await prisma.activityLog.create({
    data: { action: "تم حذف صانع المحتوى", target: creator.name },
  });

  return NextResponse.json({ ok: true });
}