import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth-admin";

export const dynamic = "force-dynamic";

const schema = z.object({
  name: z.string().min(2).optional(),
  icon: z.string().optional(),
  description: z.string().nullable().optional(),
  order: z.coerce.number().int().optional(),
});

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });

  const { id } = await params;
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "بيانات غير صحيحة" }, { status: 400 });

  const category = await prisma.category.update({
    where: { id },
    data: parsed.data,
  });

  await prisma.activityLog.create({
    data: { action: "تم تعديل تصنيف", target: category.name },
  });

  return NextResponse.json({ category });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });

  const { id } = await params;
  const body = await req.json().catch(() => ({}));
  const reassignTo = (body as { reassignTo?: string }).reassignTo ?? null;

  const count = await prisma.creator.count({ where: { categoryId: id } });
  if (count > 0 && !reassignTo) {
    return NextResponse.json(
      { error: "هذا التصنيف يحتوي على صناع محتوى. حدد تصنيفًا لنقلهم إليه أو احذفهم أولًا." },
      { status: 409 }
    );
  }

  if (count > 0) {
    await prisma.creator.updateMany({
      where: { categoryId: id },
      data: { categoryId: reassignTo || null },
    });
  }

  const category = await prisma.category.delete({ where: { id } });

  await prisma.activityLog.create({
    data: { action: "تم حذف تصنيف", target: category.name },
  });

  return NextResponse.json({ ok: true });
}