import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth-admin";

export const dynamic = "force-dynamic";

const bulkSchema = z.object({
  ids: z.array(z.string()).min(1),
  action: z.enum([
    "delete",
    "verify",
    "unverify",
    "feature",
    "unfeature",
    "category",
  ]),
  categoryId: z.string().optional(),
});

export async function POST(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = bulkSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "بيانات غير صحيحة" }, { status: 400 });
  }
  const { ids, action, categoryId } = parsed.data;

  if (action === "delete") {
    const deleted = await prisma.creator.deleteMany({ where: { id: { in: ids } } });
    await prisma.activityLog.create({
      data: { action: `تم حذف ${deleted.count} صناع محتوى` },
    });
    return NextResponse.json({ ok: true, count: deleted.count });
  }

  const update: Record<string, unknown> = {};
  switch (action) {
    case "verify":
      update.verified = true;
      break;
    case "unverify":
      update.verified = false;
      break;
    case "feature":
      update.featured = true;
      break;
    case "unfeature":
      update.featured = false;
      break;
    case "category":
      update.categoryId = categoryId || null;
      break;
  }

  const result = await prisma.creator.updateMany({
    where: { id: { in: ids } },
    data: update,
  });

  await prisma.activityLog.create({
    data: { action: `تعديل جماعي: ${action} (${result.count})` },
  });

  return NextResponse.json({ ok: true, count: result.count });
}