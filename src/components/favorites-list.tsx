"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Heart, ArrowLeft } from "lucide-react";
import type { CreatorWithCategory } from "@/lib/queries";
import { CreatorCard } from "@/components/creator-card";
import { CreatorGridSkeleton } from "@/components/skeleton";
import { getFavorites } from "@/lib/favorites";

export function FavoritesList() {
  const [creators, setCreators] = useState<CreatorWithCategory[] | null>(null);
  const [error, setError] = useState(false);
  const [favIds, setFavIds] = useState<string[]>([]);

  useEffect(() => {
    const favs = getFavorites();
    setFavIds(favs);
    if (favs.length === 0) {
      setCreators([]);
      return;
    }
    let cancelled = false;
    fetch(`/api/creators/by-ids?ids=${favs.join(",")}`)
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => {
        if (!cancelled) setCreators(data.creators);
      })
      .catch(() => {
        if (!cancelled) setError(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const empty = creators !== null && creators.length === 0 && !error;

  return (
    <div>
      {creators === null && !error && <CreatorGridSkeleton />}
      {error && (
        <div className="flex flex-col items-center rounded-2xl border border-dashed border-brand-border py-16 text-center">
          <p className="text-lg font-semibold text-brand-text">
            حدث خطأ أثناء تحميل البيانات.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 rounded-xl bg-brand-green px-5 py-2.5 text-sm text-brand-bg"
          >
            إعادة المحاولة
          </button>
        </div>
      )}
      {empty && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-brand-border bg-brand-surface/40 px-6 py-16 text-center">
          <div className="mb-4 flex size-14 items-center justify-center rounded-2xl border border-brand-border bg-brand-surface text-brand-muted">
            <Heart className="size-6" />
          </div>
          <h3 className="text-lg font-semibold text-brand-text">
            لم تقم بإضافة أي صناع محتوى للمفضلة.
          </h3>
          <p className="mt-2 max-w-sm text-sm text-brand-muted">
            اضغط على أيقونة القلب في بطاقة أي صانع محتوى لحفظه هنا.
          </p>
          <Link
            href="/creators"
            className="mt-6 inline-flex items-center gap-1.5 rounded-xl bg-brand-green px-5 py-2.5 text-sm font-medium text-brand-bg transition-colors hover:bg-brand-lime"
          >
            اكتشف صناع المحتوى
            <ArrowLeft className="size-4" />
          </Link>
        </div>
      )}
      {creators !== null && creators.length > 0 && (
        <>
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-brand-muted">
              <b className="text-brand-text">{creators.length}</b> صانع محتوى في
              المفضلة
            </p>
            <Link
              href="/recently-viewed"
              className="text-sm text-brand-muted transition-colors hover:text-brand-green"
            >
              شاهدتهم مؤخرًا
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {creators.map((c, i) => (
              <CreatorCard key={c.id} creator={c} index={i} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}