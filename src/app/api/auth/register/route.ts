import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST() {
  return NextResponse.json(
    { error: "التسجيل معطّل. تواصل مع المدير للحصول على حساب." },
    { status: 403 }
  );
}
