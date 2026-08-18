import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth-admin";

export const dynamic = "force-dynamic";

const schema = z.object({
  siteName: z.string().optional(),
  description: z.string().nullable().optional(),
  logo: z.string().nullable().optional(),
  favicon: z.string().nullable().optional(),
  inviteLink: z.string().nullable().optional(),
  footerText: z.string().nullable().optional(),
  homeCtaTitle: z.string().nullable().optional(),
  homeCtaSubtitle: z.string().nullable().optional(),
  themeAccent: z.string().nullable().optional(),
  maintenanceMode: z.boolean().optional(),
  newBadgeDays: z.coerce.number().int().min(1).optional(),
  creatorOfWeekId: z.string().nullable().optional(),
  trendingLimit: z.coerce.number().int().min(1).optional(),
  socialLinks: z.any().optional(),
});

export async function GET(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });

  const settings = await prisma.siteSetting.findFirst({ where: { id: 1 } });
  return NextResponse.json({ settings });
}

export async function PUT(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "بيانات غير صحيحة" }, { status: 400 });

  await prisma.siteSetting.upsert({
    where: { id: 1 },
    update: parsed.data,
    create: { id: 1, ...parsed.data },
  });

  await prisma.activityLog.create({
    data: { action: "تم تحديث إعدادات الموقع" },
  });

  return NextResponse.json({ ok: true });
}