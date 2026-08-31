import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { getAdminSession } from "@/lib/auth-admin";

export const dynamic = "force-dynamic";
export const maxDuration = 15;

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"];
const MAX_SIZE = 5 * 1024 * 1024;

export async function POST(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });

  const formData = await req.formData().catch(() => null);
  if (!formData) return NextResponse.json({ error: "FormData غير صالح" }, { status: 400 });

  const file = formData.get("file") as File | null;
  const type = (formData.get("type") as string) || "avatar";

  if (!file) return NextResponse.json({ error: "لا يوجد ملف" }, { status: 400 });
  if (!ALLOWED_TYPES.includes(file.type)) return NextResponse.json({ error: "نوع الملف غير مدعوم" }, { status: 400 });
  if (file.size > MAX_SIZE) return NextResponse.json({ error: "حجم الملف كبير (الحد 5MB)" }, { status: 400 });

  const ext = file.name.split(".").pop()?.toLowerCase() || (file.type === "image/jpeg" ? "jpg" : "png");
  const fileName = `${type}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  const buffer = Buffer.from(await file.arrayBuffer());

  if (process.env.VERCEL === "1") {
    const base64 = buffer.toString("base64");
    const dataUrl = `data:${file.type};base64,${base64}`;
    return NextResponse.json({ url: dataUrl });
  }

  try {
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    if (!existsSync(uploadDir)) await mkdir(uploadDir, { recursive: true });
    const filePath = path.join(uploadDir, fileName);
    await writeFile(filePath, buffer);
    return NextResponse.json({ url: `/uploads/${fileName}` });
  } catch (e) {
    console.warn("[upload] local write failed, falling back to data URL", e);
    const base64 = buffer.toString("base64");
    const dataUrl = `data:${file.type};base64,${base64}`;
    return NextResponse.json({ url: dataUrl });
  }
}
