import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth-admin";

export const dynamic = "force-dynamic";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });

  const { id } = await params;
  const body = await req.json().catch(() => ({}));
  const action = (body as { action?: string }).action;

  if (!["APPROVED", "REJECTED"].includes(action ?? "")) {
    return NextResponse.json({ error: "إجراء غير صحيح" }, { status: 400 });
  }

  const application = await prisma.application.findUnique({ where: { id } });
  if (!application) return NextResponse.json({ error: "غير موجود" }, { status: 404 });

  let createdCreator = null;
  if (action === "APPROVED") {
    const existingCreator = await prisma.creator.findUnique({
      where: { username: application.username },
    });
    if (!existingCreator) {
      const category = await prisma.category.findUnique({
        where: { slug: application.category },
      });
      createdCreator = await prisma.creator.create({
        data: {
          name: application.name,
          username: application.username,
          avatar: application.image || null,
          cover: application.cover || null,
          bio: application.bio || null,
          categoryId: category?.id ?? null,
          platforms: application.platforms as unknown as never,
          isNew: true,
        },
      });
    }
  }

  const updated = await prisma.application.update({
    where: { id },
    data: { status: action, reviewedAt: new Date() },
  });

  await prisma.activityLog.create({
    data: {
      action: action === "APPROVED" ? "تم قبول الطلب" : "تم رفض الطلب",
      target: application.name,
    },
  });

  return NextResponse.json({ application: updated, createdCreator });
}