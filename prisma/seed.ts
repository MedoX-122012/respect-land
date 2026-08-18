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

const creators = [
  {
    name: "أحمد الشاذلي",
    username: "ahmedshadly",
    avatar: "/avatars/ahmedshadly.svg",
    cover: "/covers/ahmedshadly.svg",
    bio: "صانع محتوى ألعاب متخصص في الألعاب القتالية والترفيهية. أقدم تجارب لعب تفاعلية ومحتوى مونتاج عالي الجودة.",
    category: "gaming",
    platforms: [
      { key: "youtube", url: "https://youtube.com", handle: "@AhmedShadly" },
      { key: "tiktok", url: "https://tiktok.com", handle: "@ahmedshadly" },
      { key: "instagram", url: "https://instagram.com", handle: "@ahmedshadly" },
      { key: "discord", url: "https://discord.com", handle: "ahmedshadly" },
    ],
    followerCount: 482000,
    views: 18400000,
    featured: true,
    featuredOrder: 1,
    verified: true,
    isNew: false,
    trending: true,
    trendingOrder: 1,
    adminScore: 92,
  },
  {
    name: "سارة المنصور",
    username: "saramansour",
    avatar: "/avatars/saramansour.svg",
    cover: "/covers/saramansour.svg",
    bio: "محتوى ستريمينغ متنوع، ألعاب، شات، وتحديات. أصدقاء جمهوري معروفون باسم عائلة المنصور.",
    category: "streaming",
    platforms: [
      { key: "twitch", url: "https://twitch.tv", handle: "SaraMansour" },
      { key: "youtube", url: "https://youtube.com", handle: "@SaraMansour" },
      { key: "x", url: "https://x.com", handle: "@SaraMansour" },
    ],
    followerCount: 356000,
    views: 9200000,
    featured: true,
    featuredOrder: 2,
    verified: true,
    isNew: false,
    trending: true,
    trendingOrder: 2,
    adminScore: 88,
  },
  {
    name: "يوسف عادل",
    username: "yousefadel",
    avatar: "/avatars/yousefadel.svg",
    cover: "/covers/yousefadel.svg",
    bio: "محرر ومخرج محتوى ماين كرافت. أبني عوالم وقصص متكاملة لمجتمع ضخم.",
    category: "minecraft",
    platforms: [
      { key: "youtube", url: "https://youtube.com", handle: "@YousefAdel" },
      { key: "tiktok", url: "https://tiktok.com", handle: "@yousefadel" },
      { key: "discord", url: "https://discord.com", handle: "yousefadel" },
    ],
    followerCount: 621000,
    views: 25100000,
    featured: true,
    featuredOrder: 3,
    verified: true,
    isNew: false,
    trending: true,
    trendingOrder: 3,
    adminScore: 95,
  },
  {
    name: "ليلى حسن",
    username: "laylahassan",
    avatar: "/avatars/laylahassan.svg",
    cover: "/covers/laylahassan.svg",
    bio: "محتويات روبلوكس وترفيه للأطفال والعائلات. حكايات وألعاب تفاعلية يومية.",
    category: "roblox",
    platforms: [
      { key: "tiktok", url: "https://tiktok.com", handle: "@laylahassan" },
      { key: "youtube", url: "https://youtube.com", handle: "@LaylaHassan" },
      { key: "instagram", url: "https://instagram.com", handle: "@laylahassan" },
    ],
    followerCount: 274000,
    views: 13800000,
    featured: false,
    featuredOrder: 0,
    verified: true,
    isNew: false,
    trending: false,
    trendingOrder: 0,
    adminScore: 74,
  },
  {
    name: "عمر نبيل",
    username: "omarnabil",
    avatar: "/avatars/omarnabil.svg",
    cover: "/covers/omarnabil.svg",
    bio: "فيديوهات قصيرة وترندات لايف ستايل ورياضة على تيك توك.",
    category: "tiktok",
    platforms: [
      { key: "tiktok", url: "https://tiktok.com", handle: "@omarnabil" },
      { key: "instagram", url: "https://instagram.com", handle: "@omarnabil" },
      { key: "kick", url: "https://kick.com", handle: "omarnabil" },
    ],
    followerCount: 895000,
    views: 42000000,
    featured: false,
    featuredOrder: 0,
    verified: true,
    isNew: false,
    trending: true,
    trendingOrder: 4,
    adminScore: 81,
  },
  {
    name: "منة الله فتحي",
    username: "mennafathy",
    avatar: "/avatars/mennafathy.svg",
    cover: "/covers/mennafathy.svg",
    bio: "محتوى تعليمي وترفيهي، تفسير الألعاب وقصصها بأسلوب مبسط.",
    category: "variety",
    platforms: [
      { key: "youtube", url: "https://youtube.com", handle: "@MennaFathy" },
      { key: "x", url: "https://x.com", handle: "@MennaFathy" },
    ],
    followerCount: 120000,
    views: 3400000,
    featured: false,
    featuredOrder: 0,
    verified: false,
    isNew: true,
    trending: false,
    trendingOrder: 0,
    adminScore: 60,
  },
  {
    name: "خالد سمير",
    username: "khaledsamir",
    avatar: "/avatars/khaledsamir.svg",
    cover: "/covers/khaledsamir.svg",
    bio: "مذيع تويتش متخصص في الألعاب الاستراتيجية والمنافسات.",
    category: "twitch",
    platforms: [
      { key: "twitch", url: "https://twitch.tv", handle: "KhaledSamir" },
      { key: "kick", url: "https://kick.com", handle: "khaledsamir" },
      { key: "discord", url: "https://discord.com", handle: "khaledsamir" },
    ],
    followerCount: 98000,
    views: 5600000,
    featured: false,
    featuredOrder: 0,
    verified: true,
    isNew: false,
    trending: false,
    trendingOrder: 0,
    adminScore: 66,
  },
  {
    name: "نور إبراهيم",
    username: "nooribrahim",
    avatar: "/avatars/nooribrahim.svg",
    cover: "/covers/nooribrahim.svg",
    bio: "مدونة فيديو يومية ومحتوى آراء حول التقنية والمجتمع.",
    category: "variety",
    platforms: [
      { key: "youtube", url: "https://youtube.com", handle: "@NoorIbrahim" },
      { key: "instagram", url: "https://instagram.com", handle: "@nooribrahim" },
    ],
    followerCount: 64000,
    views: 2100000,
    featured: false,
    featuredOrder: 0,
    verified: false,
    isNew: true,
    trending: false,
    trendingOrder: 0,
    adminScore: 52,
  },
  {
    name: "مصطفى رضا",
    username: "mostafareda",
    avatar: "/avatars/mostafareda.svg",
    cover: "/covers/mostafareda.svg",
    bio: "محترف ألعاب إلكترونية ومنافسات، بطولات وتمارين لعب احترافية.",
    category: "gaming",
    platforms: [
      { key: "twitch", url: "https://twitch.tv", handle: "MostafaReda" },
      { key: "youtube", url: "https://youtube.com", handle: "@MostafaReda" },
      { key: "x", url: "https://x.com", handle: "@MostafaReda" },
    ],
    followerCount: 410000,
    views: 17500000,
    featured: false,
    featuredOrder: 0,
    verified: true,
    isNew: false,
    trending: true,
    trendingOrder: 5,
    adminScore: 84,
  },
  {
    name: "هدى خليل",
    username: "hodakhalil",
    avatar: "/avatars/hodakhalil.svg",
    cover: "/covers/hodakhalil.svg",
    bio: "صناعة محتوى تجميع ألعاب المستقلة والريميكس والألعاب الكلاسيكية.",
    category: "other",
    platforms: [
      { key: "youtube", url: "https://youtube.com", handle: "@HodaKhalil" },
      { key: "tiktok", url: "https://tiktok.com", handle: "@hodakhalil" },
    ],
    followerCount: 45000,
    views: 980000,
    featured: false,
    featuredOrder: 0,
    verified: false,
    isNew: true,
    trending: false,
    trendingOrder: 0,
    adminScore: 44,
  },
  {
    name: "علي فؤاد",
    username: "alifouad",
    avatar: "/avatars/alifouad.svg",
    cover: "/covers/alifouad.svg",
    bio: "محتوى ألعاب الجوال والموبايل، مراجعات وتحديات يومية.",
    category: "gaming",
    platforms: [
      { key: "tiktok", url: "https://tiktok.com", handle: "@alifouad" },
      { key: "youtube", url: "https://youtube.com", handle: "@AliFouad" },
      { key: "instagram", url: "https://instagram.com", handle: "@alifouad" },
    ],
    followerCount: 198000,
    views: 7900000,
    featured: false,
    featuredOrder: 0,
    verified: true,
    isNew: false,
    trending: false,
    trendingOrder: 0,
    adminScore: 70,
  },
  {
    name: "ريم محمود",
    username: "reemmahmoud",
    avatar: "/avatars/reemmahmoud.svg",
    cover: "/covers/reemmahmoud.svg",
    bio: "محتوى تويتش ألعاب هادئة وستريمينغ مجتمعي مع جمهور متفاعل.",
    category: "twitch",
    platforms: [
      { key: "twitch", url: "https://twitch.tv", handle: "ReemMahmoud" },
      { key: "discord", url: "https://discord.com", handle: "reemmahmoud" },
      { key: "instagram", url: "https://instagram.com", handle: "@reemmahmoud" },
    ],
    followerCount: 76000,
    views: 3100000,
    featured: false,
    featuredOrder: 0,
    verified: false,
    isNew: true,
    trending: false,
    trendingOrder: 0,
    adminScore: 55,
  },
];

async function main() {
  console.log("Clearing existing data...");
  await prisma.analyticsEvent.deleteMany();
  await prisma.creator.deleteMany();
  await prisma.category.deleteMany();
  await prisma.application.deleteMany();
  await prisma.announcement.deleteMany();
  await prisma.activityLog.deleteMany();
  await prisma.user.deleteMany();
  await prisma.siteSetting.deleteMany();

  console.log("Seeding categories...");
  for (const c of categories) {
    await prisma.category.create({ data: c });
  }

  console.log("Seeding creators...");
  const categoryMap = new Map<string, string>();
  const dbCategories = await prisma.category.findMany();
  for (const c of dbCategories) categoryMap.set(c.slug, c.id);

  for (const creator of creators) {
    const { category, ...data } = creator;
    await prisma.creator.create({
      data: {
        ...data,
        categoryId: categoryMap.get(category) ?? null,
      },
    });
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

  console.log("Seeding announcement...");
  await prisma.announcement.create({
    data: {
      title: "مرحبًا بكم في Respect Land",
      description: "منصتنا الرسمية لاكتشاف أفضل صناع المحتوى في مجتمعنا.",
      type: "info",
      active: true,
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
