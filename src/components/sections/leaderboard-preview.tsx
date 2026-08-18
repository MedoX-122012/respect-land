import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { Medal, Eye, Users } from "lucide-react";
import { SectionHeader } from "@/components/section-header";
import { VerifiedBadge } from "@/components/badges";
import { formatNumber } from "@/lib/utils";
import { getLeaderboard } from "@/lib/queries";
import { Skeleton } from "@/components/skeleton";

const medals: Record<number, { icon: string; ring: string }> = {
  0: { icon: "🥇", ring: "ring-yellow-500/40" },
  1: { icon: "🥈", ring: "ring-slate-400/40" },
  2: { icon: "🥉", ring: "ring-amber-700/40" },
};

async function Content() {
  const creators = await getLeaderboard("views", 8);

  return (
    <div className="grid gap-3 lg:grid-cols-2">
      {creators.map((c, i) => {
        const medal = medals[i];
        const url = `/creators/${c.username}`;
        return (
          <Link
            key={c.id}
            href={url}
            className={`group flex items-center gap-4 rounded-2xl border border-brand-border bg-brand-surface p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-green/30 ${
              medal ? `ring-1 ${medal.ring}` : ""
            }`}
          >
            <span className="flex size-10 shrink-0 items-center justify-center text-xl">
              {medal?.icon ?? <span className="text-brand-muted">{i + 1}</span>}
            </span>
            <div className="relative size-12 shrink-0 overflow-hidden rounded-xl bg-brand-dark">
              {c.avatar ? (
                <Image
                  src={c.avatar}
                  alt={c.name}
                  fill
                  sizes="48px"
                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                />
              ) : (
                <span className="flex size-full items-center justify-center text-lg font-bold text-brand-muted">
                  {c.name.charAt(0)}
                </span>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="flex items-center gap-1.5 truncate text-sm font-semibold text-brand-text">
                {c.name}
                {c.verified && <VerifiedBadge />}
              </p>
              <p className="mt-0.5 flex items-center gap-3 text-xs text-brand-muted">
                <span className="flex items-center gap-1">
                  <Users className="size-3" />
                  {formatNumber(c.followerCount)}
                </span>
                <span className="flex items-center gap-1">
                  <Eye className="size-3" />
                  {formatNumber(c.views)}
                </span>
              </p>
            </div>
            <span className="text-2xl text-brand-green/30">
              <Medal className="size-5 opacity-0" />
            </span>
          </Link>
        );
      })}
    </div>
  );
}

export function LeaderboardPreview() {
  return (
    <section className="py-14">
      <div className="container-page">
        <SectionHeader
          title="المتصدرون"
          subtitle="أفضل صناع المحتوى بناءً على المشاهدات والتأثير."
          link="/leaderboard"
        />
        <Suspense
          fallback={
            <div className="grid gap-3 lg:grid-cols-2">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-[72px] rounded-2xl" />
              ))}
            </div>
          }
        >
          <Content />
        </Suspense>
      </div>
    </section>
  );
}