"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { Users, Eye, Loader2 } from "lucide-react";
import type { CreatorWithCategory } from "@/lib/queries";
import { VerifiedBadge } from "@/components/badges";
import { formatNumber } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { CreatorGridSkeleton } from "@/components/skeleton";

const METRICS = [
  { value: "views", label: "الأكثر مشاهدة" },
  { value: "followers", label: "الأكثر متابعة" },
  { value: "score", label: "الأكثر تأثيرًا" },
  { value: "newest", label: "الأحدث" },
];

const medals = ["🥇", "🥈", "🥉"];
const podiumStyles = [
  "border-yellow-500/40 text-yellow-500",
  "border-slate-400/40 text-slate-300",
  "border-amber-700/40 text-amber-600",
];

export function Leaderboard() {
  const [metric, setMetric] = useState("views");
  const [creators, setCreators] = useState<CreatorWithCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = useCallback(async (m: string) => {
    setLoading(true);
    setError(false);
    try {
      const res = await fetch(`/api/leaderboard?metric=${m}&limit=20`);
      if (!res.ok) throw new Error("bad");
      const data = await res.json();
      setCreators(data.creators);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load(metric);
  }, [metric, load]);

  const top = creators.slice(0, 3);
  const rest = creators.slice(3);

  return (
    <div>
      {/* Metric tabs */}
      <div className="mb-8 flex flex-wrap gap-2">
        {METRICS.map((m) => (
          <button
            key={m.value}
            onClick={() => setMetric(m.value)}
            className={cn(
              "h-10 rounded-xl border px-4 text-sm font-medium transition-colors",
              metric === m.value
                ? "border-brand-green/40 bg-brand-green/10 text-brand-lime"
                : "border-brand-border bg-brand-surface text-brand-muted hover:text-brand-text"
            )}
          >
            {m.label}
          </button>
        ))}
      </div>

      {error && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-brand-border py-16 text-center">
          <p className="text-lg font-semibold text-brand-text">
            حدث خطأ أثناء تحميل البيانات.
          </p>
          <button
            onClick={() => load(metric)}
            className="mt-4 rounded-xl bg-brand-green px-5 py-2.5 text-sm font-medium text-brand-bg"
          >
            إعادة المحاولة
          </button>
        </div>
      )}

      {loading && <CreatorGridSkeleton count={3} />}

      {!loading && !error && creators.length > 0 && (
        <>
          {/* Podium top 3 */}
          <div className="mb-8 grid gap-4 sm:grid-cols-3">
            {top.map((c, i) => {
              const url = `/creators/${c.username}`;
              return (
                <Link
                  key={c.id}
                  href={url}
                  className={cn(
                    "group relative flex flex-col items-center rounded-2xl border bg-brand-surface p-6 text-center transition-all duration-300 hover:-translate-y-1",
                    podiumStyles[i]
                  )}
                >
                  <span className="absolute -top-4 flex size-10 items-center justify-center rounded-full border border-brand-border bg-brand-bg text-xl shadow-lg">
                    {medals[i]}
                  </span>
                  <div className="relative mt-2 size-20 overflow-hidden rounded-2xl border-2 border-brand-border bg-brand-dark">
                    {c.avatar ? (
                      <Image
                        src={c.avatar}
                        alt={c.name}
                        fill
                        sizes="80px"
                        className="object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                    ) : (
                      <span className="flex size-full items-center justify-center text-3xl font-bold text-brand-muted">
                        {c.name.charAt(0)}
                      </span>
                    )}
                  </div>
                  <div className="mt-4 flex items-center gap-1.5">
                    <h3 className="text-lg font-bold text-brand-text">
                      {c.name}
                    </h3>
                    {c.verified && <VerifiedBadge />}
                  </div>
                  <p className="mt-1 flex items-center gap-3 text-sm text-brand-muted">
                    <span className="flex items-center gap-1">
                      <Users className="size-3.5" />
                      {formatNumber(c.followerCount)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="size-3.5" />
                      {formatNumber(c.views)}
                    </span>
                  </p>
                </Link>
              );
            })}
          </div>

          {/* Rest of list */}
          <div className="overflow-hidden rounded-2xl border border-brand-border">
            {rest.map((c, i) => {
              const url = `/creators/${c.username}`;
              return (
                <Link
                  key={c.id}
                  href={url}
                  className="group flex items-center gap-4 border-b border-brand-border bg-brand-surface/40 px-4 py-3.5 transition-colors last:border-0 hover:bg-brand-surface"
                >
                  <span className="w-8 text-center text-sm font-bold text-brand-muted">
                    {i + 4}
                  </span>
                  <span className="relative size-10 overflow-hidden rounded-xl bg-brand-dark">
                    {c.avatar ? (
                      <Image
                        src={c.avatar}
                        alt={c.name}
                        fill
                        sizes="40px"
                        className="object-cover"
                      />
                    ) : (
                      <span className="flex size-full items-center justify-center font-bold text-brand-muted">
                        {c.name.charAt(0)}
                      </span>
                    )}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-1.5 truncate text-sm font-semibold text-brand-text">
                      {c.name}
                      {c.verified && <VerifiedBadge />}
                    </span>
                    {c.category && (
                      <span className="block text-xs text-brand-muted">
                        {c.category.name}
                      </span>
                    )}
                  </span>
                  <span className="flex items-center gap-3 text-xs text-brand-muted">
                    <span className="flex items-center gap-1">
                      <Users className="size-3.5" />
                      {formatNumber(c.followerCount)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="size-3.5" />
                      {formatNumber(c.views)}
                    </span>
                  </span>
                </Link>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}