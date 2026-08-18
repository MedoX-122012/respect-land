import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth-admin";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });

  const [creators, categories] = await Promise.all([
    prisma.creator.findMany({ include: { category: true } }),
    prisma.category.findMany(),
  ]);

  const payload = { version: 1, exportedAt: new Date().toISOString(), categories, creators };

  await prisma.activityLog.create({
    data: { action: "تم تصدير البيانات" },
  });

  return NextResponse.json(payload);
}