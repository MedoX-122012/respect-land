import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Users, Eye, Undo2, Share2 } from "lucide-react";
import {
  getCreatorByUsername,
  getRelatedCreators,
  getNewBadgeDays,
} from "@/lib/queries";
import { prisma } from "@/lib/prisma";
import {
  VerifiedBadge,
  FeaturedBadge,
  NewBadge,
} from "@/components/badges";
import { PlatformBadge } from "@/components/platform-icon";
import { FavoriteButton } from "@/components/favorite-button";
import { ShareButton } from "@/components/share-button";
import { CreatorCard } from "@/components/creator-card";
import { SectionHeader } from "@/components/section-header";
import { formatFullNumber } from "@/lib/utils";
import { RecentlyViewed } from "@/components/recently-viewed";
import type { CreatorWithCategory } from "@/lib/queries";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string }>;
}): Promise<Metadata> {
  const { username } = await params;
  const creator = await getCreatorByUsername(username);
  if (!creator) return {};
  const url = `/creators/${creator.username}`;
  return {
    title: `${creator.name} | Respect Land`,
    description:
      creator.bio ??
      `استكشف الملف الشخصي لصانع المحتوى ${creator.name} على Respect Land.`,
    alternates: { canonical: url },
    openGraph: {
      title: `${creator.name} | Respect Land`,
      description: creator.bio ?? `صانع محتوى في Respect Land`,
      type: "profile",
      images: creator.avatar ? [creator.avatar] : [],
      url,
    },
  };
}

async function RelatedContent({ creator }: { creator: CreatorWithCategory }) {
  const [related, newDays] = await Promise.all([
    getRelatedCreators(creator, 4),
    getNewBadgeDays(),
  ]);
  if (related.length === 0) return null;
  const isNew = (c: { createdAt: Date }) =>
    Date.now() - c.createdAt.getTime() < newDays * 24 * 60 * 60 * 1000;
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {related.map((c, i) => (
        <CreatorCard key={c.id} creator={c} index={i} showNew={isNew(c)} />
      ))}
    </div>
  );
}

export default async function CreatorProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const creator = await getCreatorByUsername(username);
  if (!creator) notFound();

  const newDays = await getNewBadgeDays();
  const showNew =
    Date.now() - creator.createdAt.getTime() < newDays * 24 * 60 * 60 * 1000;

  void prisma.analyticsEvent.create({
    data: {
      type: "profile_view",
      creatorId: creator.id,
    },
  });

  const platforms: { key: string; url?: string; handle?: string }[] =
    (creator.platforms as { key: string; url?: string; handle?: string }[]) ??
    [];
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "";
  const profileUrl = `${baseUrl}/creators/${creator.username}`;

  return (
    <div>
      <RecentlyViewed
        creator={{
          id: creator.id,
          username: creator.username,
          name: creator.name,
          avatar: creator.avatar,
          viewedAt: Date.now(),
        }}
      />
      {/* Cover */}
      <div className="relative h-48 sm:h-64">
        {creator.cover ? (
          <Image
            src={creator.cover}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-brand-dark to-brand-surface-2" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-brand-bg via-brand-bg/40 to-transparent" />
      </div>

      {/* Profile body */}
      <div className="container-page -mt-14 sm:-mt-16">
        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-end">
            <div className="relative -mt-4 size-28 shrink-0 overflow-hidden rounded-3xl border-4 border-brand-bg bg-brand-dark sm:size-36">
              {creator.avatar ? (
                <Image
                  src={creator.avatar}
                  alt={creator.name}
                  fill
                  sizes="144px"
                  priority
                  className="object-cover"
                />
              ) : (
                <span className="flex size-full items-center justify-center text-5xl font-bold text-brand-muted">
                  {creator.name.charAt(0)}
                </span>
              )}
            </div>
            <div className="mt-3 text-center sm:mt-0 sm:text-start">
              <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                <h1 className="text-2xl font-extrabold tracking-tight text-brand-text sm:text-3xl">
                  {creator.name}
                </h1>
                {creator.verified && <VerifiedBadge size="size-6" />}
                {creator.featured && <FeaturedBadge />}
                {showNew && <NewBadge />}
              </div>
              <p className="mt-2 flex flex-wrap items-center justify-center gap-2 text-sm text-brand-muted sm:justify-start">
                <span dir="ltr">@{creator.username}</span>
                {creator.category && (
                  <Link
                    href={`/category/${creator.category.slug}`}
                    className="rounded-full border border-brand-border bg-brand-surface px-2.5 py-0.5 text-xs text-brand-green transition-colors hover:border-brand-green/40"
                  >
                    {creator.category.name}
                  </Link>
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 sm:justify-end">
            <ShareButton url={profileUrl} label="مشاركة الملف" />
            <FavoriteButton creatorId={creator.id} />
          </div>
        </div>

        {/* Stats + bio */}
        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">
          <div>
            {creator.bio && (
              <div className="rounded-2xl border border-brand-border bg-brand-surface p-6">
                <h2 className="mb-3 text-sm font-semibold text-brand-text">
                  نبذة عن صانع المحتوى
                </h2>
                <p className="text-sm leading-relaxed text-brand-muted sm:text-base">
                  {creator.bio}
                </p>
              </div>
            )}

            {creator.featured && (
              <div className="mt-6">
                <SectionHeader title="محتوى مميز" />
                <p className="text-sm text-brand-muted">
                  {creator.name} من صناع المحتوى المميزين المعتمدين في مجتمع
                  Respect Land.
                </p>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-2xl border border-brand-border bg-brand-surface p-5 text-center">
                <Users className="mx-auto mb-2 size-5 text-brand-green" />
                <p className="text-xl font-bold tabular-nums text-brand-text">
                  {formatFullNumber(creator.followerCount)}
                </p>
                <p className="mt-1 text-xs text-brand-muted">متابع</p>
              </div>
              <div className="rounded-2xl border border-brand-border bg-brand-surface p-5 text-center">
                <Eye className="mx-auto mb-2 size-5 text-brand-green" />
                <p className="text-xl font-bold tabular-nums text-brand-text">
                  {formatFullNumber(creator.views)}
                </p>
                <p className="mt-1 text-xs text-brand-muted">مشاهدة</p>
              </div>
            </div>

            {platforms.length > 0 && (
              <div className="rounded-2xl border border-brand-border bg-brand-surface p-5">
                <h3 className="mb-4 text-sm font-semibold text-brand-text">
                  منصات التواصل
                </h3>
                <div className="space-y-2.5">
                  {platforms.map((p) => (
                    <a
                      key={p.key}
                      href={p.url ?? "#"}
                      target={p.url ? "_blank" : undefined}
                      rel="noreferrer"
                      className="flex items-center gap-3 rounded-xl border border-brand-border bg-brand-bg/50 p-2.5 transition-colors hover:border-brand-green/40"
                    >
                      <PlatformBadge
                        platform={p.key}
                        className="size-6 rounded-lg"
                      />
                      <span className="min-w-0">
                        <span className="block text-xs text-brand-muted">
                          {p.key}
                        </span>
                        {p.handle && (
                          <span
                            className="block truncate text-sm font-medium text-brand-text"
                            dir="ltr"
                          >
                            {p.handle}
                          </span>
                        )}
                      </span>
                      <span className="mr-auto text-brand-muted">
                        <Share2 className="size-4" />
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related */}
        <div className="mt-16">
          <SectionHeader title="صناع محتوى مشابهون" link="/creators" />
          <RelatedContent creator={creator} />
        </div>

        <div className="mt-8 flex justify-center">
          <Link
            href="/creators"
            className="inline-flex items-center gap-2 text-sm text-brand-muted transition-colors hover:text-brand-green"
          >
            <Undo2 className="size-4" />
            العودة إلى قائمة صناع المحتوى
          </Link>
        </div>
      </div>
    </div>
  );
}