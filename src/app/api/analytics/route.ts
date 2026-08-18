import { NextRequest, NextResponse } from "next/server";
import { getAnalyticsData, getViewsSeries } from "@/lib/admin-queries";
import { getAdminSession } from "@/lib/auth-admin";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });

  const range = (req.nextUrl.searchParams.get("range") ?? "week") as
    | "today"
    | "week"
    | "month"
    | "all";

  const days = range === "today" ? 1 : range === "week" ? 7 : range === "month" ? 30 : 60;
  const [data, series] = await Promise.all([
    getAnalyticsData(range),
    getViewsSeries(days),
  ]);

  return NextResponse.json({ ...data, series });
}