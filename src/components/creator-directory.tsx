"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  Search,
  X,
  SlidersHorizontal,
  RotateCcw,
  UserX,
  Loader2,
} from "lucide-react";
import type { CreatorWithCategory } from "@/lib/queries";
import type { Category } from "@prisma/client";
import { CreatorCard } from "@/components/creator-card";
import { CreatorGridSkeleton } from "@/components/skeleton";
import { PLATFORM_KEYS, PLATFORMS } from "@/components/platform-icon";
import { cn } from "@/lib/utils";

interface ApiResponse {
  creators: CreatorWithCategory[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

const STATUS_OPTIONS = [
  { value: "all", label: "الكل" },
  { value: "verified", label: "موثق" },
  { value: "featured", label: "مميز" },
  { value: "new", label: "جديد" },
];

const SORT_OPTIONS = [
  { value: "newest", label: "الأحدث" },
  { value: "views", label: "الأكثر مشاهدة" },
  { value: "followers", label: "الأكثر متابعة" },
  { value: "score", label: "الأكثر تأثيرًا" },
  { value: "alpha", label: "أبجديًا" },
];

export function CreatorDirectory({
  categories,
}: {
  categories: { slug: string; name: string }[];
}) {
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("");
  const [platform, setPlatform] = useState("");
  const [status, setStatus] = useState("all");
  const [sort, setSort] = useState("views");
  const [page, setPage] = useState(1);

  const [creators, setCreators] = useState<CreatorWithCategory[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined
  );
  const requestId = useRef(0);

  const fetchCreators = useCallback(
    async (overrides?: { page?: number; q?: string }, reset = false) => {
      const currentPage = overrides?.page ?? page;
      const currentQ = overrides?.q ?? q;
      const myId = ++requestId.current;

      setLoading(true);
      setError(false);

      const search = new URLSearchParams();
      if (currentQ) search.set("q", currentQ);
      if (category) search.set("category", category);
      if (platform) search.set("platform", platform);
      if (status !== "all") search.set("status", status);
      search.set("sort", sort);
      search.set("page", String(currentPage));

      try {
        const res = await fetch(`/api/creators?${search.toString()}`);
        if (!res.ok) throw new Error("bad");
        const data: ApiResponse = await res.json();
        if (requestId.current !== myId) return;
        setCreators((prev) =>
          reset || currentPage === 1 ? data.creators : [...prev, ...data.creators]
        );
        setTotal(data.total);
        setHasMore(data.hasMore);
        setPage(currentPage);
      } catch {
        if (requestId.current !== myId) return;
        setError(true);
      } finally {
        if (requestId.current === myId) setLoading(false);
      }
    },
    [category, platform, status, sort, page, q]
  );

  useEffect(() => {
    debounceRef.current = setTimeout(() => {
      fetchCreators({ q, page: 1 }, true);
    }, 300);
    return () => clearTimeout(debounceRef.current);
  }, [q, category, platform, status, sort, fetchCreators]);

  const resetAll = () => {
    setQ("");
    setCategory("");
    setPlatform("");
    setStatus("all");
    setSort("views");
    setPage(1);
    fetchCreators({ q: "", page: 1 }, true);
  };

  const hasActiveFilters =
    q || category || platform || status !== "all" || sort !== "views";

  const hasResults = !loading && !error && creators.length > 0;
  const showEmpty = !loading && !error && creators.length === 0;

  const Select = ({
    value,
    onChange,
    options,
    label,
  }: {
    value: string;
    onChange: (v: string) => void;
    options: { value: string; label: string }[];
    label: string;
  }) => (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs text-brand-muted">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-11 w-full cursor-pointer rounded-xl border border-brand-border bg-brand-surface px-3 text-sm text-brand-text outline-none transition-colors focus:border-brand-green"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );

  const FilterControls = () => (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      <Select
        label="التصنيف"
        value={category}
        onChange={setCategory}
        options={[
          { value: "", label: "كل التصنيفات" },
          ...categories.map((c) => ({ value: c.slug, label: c.name })),
        ]}
      />
      <Select
        label="المنصة"
        value={platform}
        onChange={setPlatform}
        options={[
          { value: "", label: "كل المنصات" },
          ...PLATFORM_KEYS.map((k) => ({
            value: k,
            label: PLATFORMS[k].label,
          })),
        ]}
      />
      <Select
        label="الحالة"
        value={status}
        onChange={setStatus}
        options={STATUS_OPTIONS}
      />
      <Select
        label="الترتيب"
        value={sort}
        onChange={setSort}
        options={SORT_OPTIONS}
      />
    </div>
  );

  return (
    <div>
      {/* Top toolbar */}
      <div className="mb-6 flex flex-col gap-3">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-brand-muted" />
            <input
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="ابحث عن صانع محتوى..."
              className="h-12 w-full rounded-xl border border-brand-border bg-brand-surface pr-11 pl-10 text-sm text-brand-text placeholder:text-brand-muted outline-none transition-colors focus:border-brand-green"
              aria-label="ابحث عن صانع محتوى"
            />
            {q && (
              <button
                onClick={() => setQ("")}
                className="absolute left-3 top-1/2 flex size-6 -translate-y-1/2 items-center justify-center rounded-full bg-brand-border text-brand-muted transition-colors hover:text-brand-text"
                aria-label="مسح البحث"
              >
                <X className="size-3.5" />
              </button>
            )}
          </div>
          <button
            onClick={() => setShowFilters((s) => !s)}
            className={cn(
              "inline-flex h-12 items-center gap-2 rounded-xl border px-4 text-sm font-medium transition-colors sm:hidden",
              showFilters || hasActiveFilters
                ? "border-brand-green/40 bg-brand-green/10 text-brand-lime"
                : "border-brand-border bg-brand-surface text-brand-text"
            )}
            aria-expanded={showFilters}
          >
            <SlidersHorizontal className="size-4" />
            تصفية
          </button>
        </div>

        {/* Desktop filters inline */}
        <div className="hidden sm:block">
          <FilterControls />
        </div>

        {/* Reset */}
        {hasActiveFilters && (
          <button
            onClick={resetAll}
            className="inline-flex w-fit items-center gap-1.5 text-sm text-brand-muted transition-colors hover:text-brand-green"
          >
            <RotateCcw className="size-3.5" />
            إعادة ضبط الفلاتر
          </button>
        )}
      </div>

      {/* Mobile bottom sheet */}
      <div
        className={cn(
          "fixed inset-x-0 bottom-0 z-40 transition-transform duration-300 sm:hidden",
          showFilters ? "translate-y-0" : "translate-y-full"
        )}
      >
        <div
          className="absolute inset-0 bg-black/60 -z-10"
          onClick={() => setShowFilters(false)}
        />
        <div className="rounded-t-3xl border-t border-brand-border bg-brand-surface p-5 pb-8">
          <div className="mx-auto mb-5 h-1 w-12 rounded-full bg-brand-border" />
          <h3 className="mb-4 text-base font-semibold text-brand-text">
            تصفية النتائج
          </h3>
          <FilterControls />
          <button
            onClick={() => setShowFilters(false)}
            className="mt-5 h-12 w-full rounded-xl bg-brand-green text-sm font-semibold text-brand-bg"
          >
            عرض النتائج
          </button>
        </div>
      </div>

      {/* Results meta */}
      {!loading && !error && (
        <p className="mb-5 text-sm text-brand-muted">
          {total > 0 ? (
            <>
              عدد النتائج: <b className="text-brand-text">{total}</b>
            </>
          ) : null}
        </p>
      )}

      {/* Error */}
      {error && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-brand-border bg-brand-surface/40 px-6 py-16 text-center">
          <p className="text-lg font-semibold text-brand-text">
            حدث خطأ أثناء تحميل البيانات.
          </p>
          <div className="mt-6 flex gap-3">
            <button
              onClick={() => fetchCreators({ q, page: 1 }, true)}
              className="rounded-xl bg-brand-green px-5 py-2.5 text-sm font-medium text-brand-bg transition-colors hover:bg-brand-lime"
            >
              إعادة المحاولة
            </button>
          </div>
        </div>
      )}

      {/* Loading skeleton */}
      {loading && <CreatorGridSkeleton count={6} />}

      {/* Empty */}
      {showEmpty && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-brand-border bg-brand-surface/40 px-6 py-16 text-center">
          <div className="mb-4 flex size-14 items-center justify-center rounded-2xl border border-brand-border bg-brand-surface text-brand-muted">
            <UserX className="size-6" />
          </div>
          <h3 className="text-lg font-semibold text-brand-text">
            {q ? "لم نجد صانع محتوى بهذا الاسم." : "لم نجد نتائج مطابقة."}
          </h3>
          <p className="mt-2 max-w-sm text-sm text-brand-muted">
            جرّب تعديل البحث أو إعادة ضبط الفلاتر.
          </p>
          <button
            onClick={resetAll}
            className="mt-6 inline-flex items-center gap-1.5 rounded-xl bg-brand-green px-5 py-2.5 text-sm font-medium text-brand-bg transition-colors hover:bg-brand-lime"
          >
            <RotateCcw className="size-4" />
            مسح البحث
          </button>
        </div>
      )}

      {/* Results */}
      {hasResults && (
        <>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {creators.map((c, i) => (
              <CreatorCard key={c.id} creator={c} index={i} />
            ))}
          </div>
          {hasMore && !loading && (
            <div className="mt-10 flex justify-center">
              <button
                onClick={() => fetchCreators({ page: page + 1 })}
                className="inline-flex h-11 items-center gap-2 rounded-xl border border-brand-border bg-brand-surface px-6 text-sm font-medium text-brand-text transition-colors hover:border-brand-green/40 hover:bg-brand-surface-2"
              >
                {loading ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : null}
                تحميل المزيد
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}