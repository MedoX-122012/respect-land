import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth-admin";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });

  const status = req.nextUrl.searchParams.get("status") ?? "PENDING";
  const applications = await prisma.application.findMany({
    where: { status },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ applications });
}