import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth-admin";

export const dynamic = "force-dynamic";

const createUserSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(["ADMIN", "USER"]).default("ADMIN"),
});

export async function GET() {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });

  const currentUserId = (session.user as { uid?: string } | undefined)?.uid
    ?? (session as unknown as { uid?: string }).uid
    ?? null;

  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ users, currentUserId });
}

export async function POST(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = createUserSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const { name, email, password, role } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json(
      { error: { email: ["البريد الإلكتروني مستخدم بالفعل"] } },
      { status: 409 }
    );
  }

  const hashed = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { name, email, password: hashed, role },
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  });

  await prisma.activityLog.create({
    data: {
      action: `تمت إضافة مستخدم جديد: ${name}`,
      admin: (session.user as { email?: string }).email ?? "admin",
      target: email,
    },
  });

  return NextResponse.json({ user }, { status: 201 });
}

const updateRoleSchema = z.object({
  id: z.string(),
  role: z.enum(["ADMIN", "USER"]),
});

export async function PUT(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = updateRoleSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "بيانات غير صحيحة" }, { status: 400 });
  }

  const { id, role } = parsed.data;

  const currentUserId = (session.user as { uid?: string } | undefined)?.uid
    ?? (session as unknown as { uid?: string }).uid
    ?? null;

  // Prevent self-demotion
  if (currentUserId && id === currentUserId && role !== "ADMIN") {
    return NextResponse.json(
      { error: "لا يمكنك تغيير صلاحيتك الخاصة" },
      { status: 403 }
    );
  }

  const user = await prisma.user.findUnique({ where: { id }, select: { id: true, role: true } });
  if (!user) {
    return NextResponse.json({ error: "المستخدم غير موجود" }, { status: 404 });
  }

  const updated = await prisma.user.update({
    where: { id },
    data: { role },
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  });

  await prisma.activityLog.create({
    data: {
      action: `تم تغيير صلاحية ${updated.name ?? updated.email} إلى ${role}`,
      admin: (session.user as { email?: string }).email ?? "admin",
      target: updated.email ?? id,
    },
  });

  return NextResponse.json({ user: updated });
}

const deleteUserSchema = z.object({ id: z.string().min(1) });

export async function DELETE(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = deleteUserSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "بيانات غير صحيحة" }, { status: 400 });
  }

  const { id } = parsed.data;

  const currentUserId = (session.user as { uid?: string } | undefined)?.uid
    ?? (session as unknown as { uid?: string }).uid
    ?? null;

  // Prevent self-deletion
  if (currentUserId && id === currentUserId) {
    return NextResponse.json(
      { error: "لا يمكنك حذف حسابك الخاص" },
      { status: 403 }
    );
  }

  const user = await prisma.user.findUnique({
    where: { id },
    select: { id: true, name: true, email: true },
  });
  if (!user) {
    return NextResponse.json({ error: "المستخدم غير موجود" }, { status: 404 });
  }

  // Prevent deleting the last admin
  if (user.email) {
    const adminCount = await prisma.user.count({ where: { role: "ADMIN" } });
    const targetUser = await prisma.user.findUnique({ where: { id }, select: { role: true } });
    if (targetUser?.role === "ADMIN" && adminCount <= 1) {
      return NextResponse.json(
        { error: "لا يمكن حذف آخر مدير في النظام" },
        { status: 403 }
      );
    }
  }

  await prisma.user.delete({ where: { id } });

  await prisma.activityLog.create({
    data: {
      action: `تم حذف المستخدم: ${user.name ?? user.email}`,
      admin: (session.user as { email?: string }).email ?? "admin",
      target: user.email ?? id,
    },
  });

  return NextResponse.json({ ok: true });
}
