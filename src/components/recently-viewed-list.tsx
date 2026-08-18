"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { History, Trash2, ArrowLeft, Check } from "lucide-react";
import {
  getRecentlyViewed,
  clearRecentlyViewed,
  type RecentCreator,
} from "@/lib/recently-viewed";
import { VerifiedBadge } from "@/components/badges";

export function RecentlyViewedList() {
  const [items, setItems] = useState<RecentCreator[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setItems(getRecentlyViewed());
    setLoaded(true);
  }, []);

  if (!loaded) return null;

  const clear = () => {
    clearRecentlyViewed();
    setItems([]);
  };

  return (
    <div>
      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-brand-border bg-brand-surface/40 px-6 py-16 text-center">
          <div className="mb-4 flex size-14 items-center justify-center rounded-2xl border border-brand-border bg-brand-surface text-brand-muted">
            <History className="size-6" />
          </div>
          <h3 className="text-lg font-semibold text-brand-text">
            لم تشاهد أي صناع محتوى مؤخرًا.
          </h3>
          <p className="mt-2 max-w-sm text-sm text-brand-muted">
            الملفات الشخصية التي تزورها ستظهر هنا.
          </p>
          <Link
            href="/creators"
            className="mt-6 inline-flex items-center gap-1.5 rounded-xl bg-brand-green px-5 py-2.5 text-sm font-medium text-brand-bg transition-colors hover:bg-brand-lime"
          >
            اكتشف صناع المحتوى
            <ArrowLeft className="size-4" />
          </Link>
        </div>
      ) : (
        <>
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-brand-muted">
              <b className="text-brand-text">{items.length}</b> ملف تمت زيارته
            </p>
            <button
              onClick={clear}
              className="inline-flex items-center gap-1.5 text-sm text-brand-muted transition-colors hover:text-red-400"
            >
              <Trash2 className="size-4" />
              مسح السجل
            </button>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((c) => (
              <Link
                key={c.id}
                href={`/creators/${c.username}`}
                className="group flex items-center gap-4 rounded-2xl border border-brand-border bg-brand-surface p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-green/30"
              >
                <span className="relative size-12 shrink-0 overflow-hidden rounded-xl bg-brand-dark">
                  {c.avatar ? (
                    <Image
                      src={c.avatar}
                      alt={c.name}
                      fill
                      sizes="48px"
                      className="object-cover transition-transform duration-300 group-hover:scale-110"
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
                  </span>
                  <span className="block truncate text-xs text-brand-muted" dir="ltr">
                    @{c.username}
                  </span>
                </span>
                <Check className="size-4 text-brand-muted/40" />
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}