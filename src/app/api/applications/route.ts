import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const platformSchema = z.object({
  key: z.string(),
  url: z.string().url().optional().or(z.literal("")),
  handle: z.string().optional(),
});

const applicationSchema = z.object({
  name: z.string().min(2, "الاسم مطلوب"),
  username: z
    .string()
    .min(2, "اسم المستخدم قصير")
    .regex(/^[a-zA-Z0-9_.]+$/, "اسم المستخدم يجب أن يكون بالإنجليزية"),
  category: z.string().min(1, "اختر تصنيفًا"),
  bio: z.string().optional(),
  platforms: z.array(platformSchema).default([]),
  image: z.string().url().optional().or(z.literal("")),
  cover: z.string().url().optional().or(z.literal("")),
  reason: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = applicationSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }
    const data = parsed.data;

    const existing = await prisma.application.findUnique({
      where: { username: data.username },
    });
    if (existing) {
      return NextResponse.json(
        { error: { username: ["اسم المستخدم مستخدم بالفعل"] } },
        { status: 409 }
      );
    }

    await prisma.application.create({
      data: {
        name: data.name,
        username: data.username,
        category: data.category,
        bio: data.bio,
        platforms: data.platforms as unknown as never,
        links: (data.platforms.filter((p) => p.url) as unknown as never) ?? [],
        image: data.image || null,
        cover: data.cover || null,
        reason: data.reason,
      },
    });

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (err) {
    console.error("Application error", err);
    return NextResponse.json({ error: "خطأ في حفظ الطلب." }, { status: 500 });
  }
}