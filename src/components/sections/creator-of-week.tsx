import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { Users, Eye, ArrowLeft, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PlatformBadge } from "@/components/platform-icon";
import { VerifiedBadge } from "@/components/badges";
import { formatNumber } from "@/lib/utils";
import { getSiteSettings } from "@/lib/queries";
import { Skeleton } from "@/components/skeleton";

async function Content() {
  const settings = await getSiteSettings();
  const creator = settings.creatorOfWeek;

  if (!creator) {
    return (
      <div className="flex items-center justify-center rounded-3xl border border-dashed border-brand-border bg-brand-surface/40 px-6 py-16 text-center text-sm text-brand-muted">
        لم يتم اختيار صانع محتوى لهذا الأسبوع بعد.
      </div>
    );
  }

  const platforms: { key: string }[] = Array.isArray(creator.platforms)
    ? (creator.platforms as { key: string }[])
    : [];
  const url = `/creators/${creator.username}`;

  return (
    <div className="relative overflow-hidden rounded-3xl border border-brand-border bg-brand-surface">
      {/* Cover */}
      <div className="relative h-44 sm:h-56">
        {creator.cover ? (
          <Image
            src={creator.cover}
            alt=""
            fill
            sizes="100vw"
            className="object-cover"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-brand-dark to-brand-surface-2" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-brand-surface via-brand-surface/20 to-transparent" />
        <span className="absolute top-5 right-5 inline-flex items-center gap-1.5 rounded-full bg-brand-green/90 px-3 py-1.5 text-xs font-semibold text-brand-bg">
          <CalendarDays className="size-3.5" />
          صانع المحتوى لهذا الأسبوع
        </span>
      </div>

      <div className="grid gap-8 p-6 sm:p-10 lg:grid-cols-[auto_1fr]">
        {/* Avatar */}
        <div className="flex flex-col items-center gap-4 lg:items-start">
          <div className="relative -mt-24 size-28 overflow-hidden rounded-3xl border-4 border-brand-surface bg-brand-dark sm:-mt-28 sm:size-36">
            {creator.avatar ? (
              <Image
                src={creator.avatar}
                alt={creator.name}
                fill
                sizes="144px"
                className="object-cover"
              />
            ) : (
              <span className="flex size-full items-center justify-center text-4xl font-bold text-brand-muted">
                {creator.name.charAt(0)}
              </span>
            )}
          </div>
          <div className="flex gap-1.5">
            {platforms.slice(0, 5).map((p) => (
              <PlatformBadge key={p.key} platform={p.key} className="size-9 rounded-lg" />
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col items-center text-center lg:items-start lg:text-start">
          <div className="flex items-center gap-2">
            <h3 className="text-2xl font-bold text-brand-text sm:text-3xl">
              {creator.name}
            </h3>
            {creator.verified && <VerifiedBadge size="size-5" />}
          </div>
          <p className="mt-1 text-sm text-brand-muted" dir="ltr">
            @{creator.username}
            {creator.category ? ` · ${creator.category.name}` : ""}
          </p>

          {creator.bio && (
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-brand-muted sm:text-base">
              {creator.bio}
            </p>
          )}

          <div className="mt-6 flex items-center gap-6 text-sm">
            <span className="flex items-center gap-2 text-brand-muted">
              <Users className="size-4 text-brand-green" />
              <b className="text-brand-text">{formatNumber(creator.followerCount)}</b> متابع
            </span>
            <span className="flex items-center gap-2 text-brand-muted">
              <Eye className="size-4 text-brand-green" />
              <b className="text-brand-text">{formatNumber(creator.views)}</b> مشاهدة
            </span>
          </div>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Link href={url}>
              <Button size="lg">عرض الملف الكامل</Button>
            </Link>
            <Link href="/creators">
              <Button size="lg" variant="secondary">
                اكتشف المزيد
                <ArrowLeft className="size-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export function CreatorOfTheWeek() {
  return (
    <section className="py-14">
      <div className="container-page">
        <Suspense
          fallback={<Skeleton className="h-[420px] w-full rounded-3xl" />}
        >
          <Content />
        </Suspense>
      </div>
    </section>
  );
}