import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const categories = [
  { name: "Gaming", slug: "gaming", icon: "gamepad", description: "صناع محتوى الألعاب والترفيه الرقمي.", order: 1 },
  { name: "Streaming", slug: "streaming", icon: "radio", description: "المذيعون المباشرون على منصات البث.", order: 2 },
  { name: "YouTube", slug: "youtube", icon: "youtube", description: "صناع المحتوى على يوتيوب.", order: 3 },
  { name: "TikTok", slug: "tiktok", icon: "music", description: "صناع الفيديوهات القصيرة والترندات.", order: 4 },
  { name: "Twitch", slug: "twitch", icon: "twitch", description: "صناع المحتوى على تويتش.", order: 5 },
  { name: "Minecraft", slug: "minecraft", icon: "blocks", description: "مجتمع ماين كرافت الإبداعي.", order: 6 },
  { name: "Roblox", slug: "roblox", icon: "dice", description: "صناع المحتوى وعوالم روبلوكس.", order: 7 },
  { name: "Variety", slug: "variety", icon: "sparkles", description: "محتوى متنوع خارج إطار واحد.", order: 8 },
  { name: "Other", slug: "other", icon: "star", description: "تصنيفات وأشكال محتوى أخرى.", order: 9 },
];

async function main() {
  console.log("Clearing existing data...");
  await prisma.analyticsEvent.deleteMany();
  await prisma.creator.deleteMany();
  await prisma.application.deleteMany();
  await prisma.announcement.deleteMany();
  await prisma.activityLog.deleteMany();
  await prisma.user.deleteMany();
  await prisma.siteSetting.deleteMany();

  console.log("Seeding categories...");
  for (const c of categories) {
    await prisma.category.create({ data: c });
  }

  console.log("Seeding admin user...");
  const hashed = await bcrypt.hash("admin123", 10);
  await prisma.user.create({
    data: {
      name: "مدير الموقع",
      email: "admin@respect.land",
      password: hashed,
      role: "ADMIN",
    },
  });

  console.log("Seeding site settings...");
  await prisma.siteSetting.create({
    data: {
      siteName: "Respect Land",
      description: "مجتمع يجمع صناع المحتوى المميزين ويمنحهم مساحة يستحقونها.",
      footerText: "صُنع بأيادي عربية 🇪🇬",
      homeCtaTitle: "انضم إلى المجتمع",
      homeCtaSubtitle: "كن جزءًا من Respect Land وشارك تجربتك مع أفضل صناع المحتوى.",
      inviteLink: "https://discord.gg/respectland",
      socialLinks: {
        discord: "https://discord.gg/respectland",
        x: "https://x.com/respectland",
        instagram: "https://instagram.com/respectland",
        tiktok: "https://tiktok.com/@respectland",
        youtube: "https://youtube.com/@respectland",
      },
      themeAccent: "#22C55E",
      newBadgeDays: 30,
      trendingLimit: 8,
    },
  });

  console.log("Seed completed ✅");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });