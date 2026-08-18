import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const ids = (req.nextUrl.searchParams.get("ids") ?? "")
    .split(",")
    .filter(Boolean)
    .map((s) => s.trim());

  if (ids.length === 0) {
    return NextResponse.json({ creators: [] });
  }

  try {
    const creators = await prisma.creator.findMany({
      where: { id: { in: ids } },
      include: { category: true },
    });
    return NextResponse.json({ creators });
  } catch {
    return NextResponse.json({ error: "خطأ." }, { status: 500 });
  }
}