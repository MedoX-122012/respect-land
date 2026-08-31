import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth-admin";
import { isAllowedUrl, scrapeByPlatform, detectPlatform } from "@/lib/scraper";

export const dynamic = "force-dynamic";
export const maxDuration = 15;

export async function POST(req: Request) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: { url?: string; platform?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const rawUrl = body.url?.trim();
  if (!rawUrl) return NextResponse.json({ error: "url مطلوب" }, { status: 400 });

  let parsed: URL;
  try {
    parsed = new URL(rawUrl);
  } catch {
    return NextResponse.json({ error: "رابط غير صالح" }, { status: 400 });
  }

  if (!["http:", "https:"].includes(parsed.protocol))
    return NextResponse.json({ error: "البروتوكول غير مسموح" }, { status: 400 });
  if (!isAllowedUrl(rawUrl))
    return NextResponse.json({ error: "الدومين غير مدعوم" }, { status: 400 });

  const platform = body.platform?.trim().toLowerCase() || detectPlatform(rawUrl) || "";
  if (!platform) return NextResponse.json({ error: "تعذر تحديد المنصة" }, { status: 400 });

  try {
    const result = await scrapeByPlatform(platform, rawUrl);
    return NextResponse.json(result);
  } catch (e) {
    return NextResponse.json(
      { platform, error: e instanceof Error ? e.message : "فشل الجلب" },
      { status: 500 }
    );
  }
}
