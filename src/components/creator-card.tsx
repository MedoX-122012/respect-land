import Link from "next/link";
import Image from "next/image";
import { Users, Eye, ArrowLeft } from "lucide-react";
import type { CreatorWithCategory } from "@/lib/queries";
import { formatNumber } from "@/lib/utils";
import { PlatformBadge } from "@/components/platform-icon";
import { VerifiedBadge, FeaturedBadge, NewBadge } from "@/components/badges";
import { FavoriteButton } from "@/components/favorite-button";
import { ShareButton } from "@/components/share-button";

export function CreatorCard({
  creator,
  index = 0,
  showNew = false,
}: {
  creator: CreatorWithCategory;
  index?: number;
  showNew?: boolean;
}) {
  const platforms: { key: string }[] = Array.isArray(creator.platforms)
    ? (creator.platforms as { key: string }[])
    : [];
  const profileUrl = `/creators/${creator.username}`;

  return (
    <article
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-brand-border bg-brand-surface transition-all duration-300 hover:-translate-y-1 hover:border-brand-green/30 hover:shadow-2xl hover:shadow-brand-green/5"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      {/* Cover */}
      <Link href={profileUrl} className="relative block h-28 overflow-hidden" tabIndex={-1}>
        {creator.cover ? (
          <Image
            src={creator.cover}
            alt=""
            fill
            sizes="(max-width: 640px) 100vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-brand-dark to-brand-surface-2" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-brand-surface via-transparent to-transparent" />

        {/* Badges */}
        <div className="absolute top-3 right-3 flex gap-1.5">
          {creator.featured && <FeaturedBadge />}
          {showNew && <NewBadge />}
        </div>
      </Link>

      {/* Avatar */}
      <div className="relative -mt-9 px-5">
        <Link href={profileUrl} className="inline-block">
          <div className="relative size-[72px] overflow-hidden rounded-2xl border-4 border-brand-surface bg-brand-dark">
            {creator.avatar ? (
              <Image
                src={creator.avatar}
                alt={creator.name}
                fill
                sizes="72px"
                className="object-cover transition-transform duration-300 group-hover:scale-110"
              />
            ) : (
              <span className="flex size-full items-center justify-center text-2xl font-bold text-brand-muted">
                {creator.name.charAt(0)}
              </span>
            )}
          </div>
        </Link>
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col px-5 pt-3">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <Link href={profileUrl} className="flex items-center gap-1.5">
              <h3 className="truncate text-base font-bold text-brand-text transition-colors group-hover:text-brand-lime">
                {creator.name}
              </h3>
              {creator.verified && <VerifiedBadge />}
            </Link>
            <p className="mt-0.5 truncate text-sm text-brand-muted" dir="ltr">
              @{creator.username}
            </p>
          </div>
        </div>

        {creator.category && (
          <span className="mt-2 inline-flex w-fit items-center rounded-md border border-brand-border bg-brand-bg/50 px-2 py-0.5 text-[11px] text-brand-muted">
            {creator.category.name}
          </span>
        )}

        {creator.bio && (
          <p className="mt-2.5 line-clamp-2 text-sm leading-relaxed text-brand-muted">
            {creator.bio}
          </p>
        )}

        {/* Platforms */}
        {platforms.length > 0 && (
          <div className="mt-3 flex flex-wrap items-center gap-1.5">
            {platforms.slice(0, 5).map((p) => (
              <PlatformBadge
                key={p.key}
                platform={p.key}
                className="size-7 rounded-md"
              />
            ))}
          </div>
        )}

        {/* Stats + actions */}
        <div className="mt-4 flex items-center justify-between border-t border-brand-border pt-3">
          <div className="flex items-center gap-3 text-xs text-brand-muted">
            <span className="flex items-center gap-1">
              <Users className="size-3.5" />
              {formatNumber(creator.followerCount)}
            </span>
            <span className="flex items-center gap-1">
              <Eye className="size-3.5" />
              {formatNumber(creator.views)}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <ShareButton
              url={`${process.env.NEXT_PUBLIC_SITE_URL || ""}${profileUrl}`}
            />
            <FavoriteButton creatorId={creator.id} />
          </div>
        </div>

        <Link
          href={profileUrl}
          className="mt-3 mb-4 flex h-10 items-center justify-center gap-1.5 rounded-xl border border-brand-border text-sm font-medium text-brand-text transition-colors hover:border-brand-green/40 hover:bg-brand-green/10 hover:text-brand-lime"
        >
          عرض الملف
          <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-0.5" />
        </Link>
      </div>
    </article>
  );
}
