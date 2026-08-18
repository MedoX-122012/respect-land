"use client";

import { useEffect, useState, useCallback } from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Eye, Search, Layers, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/skeleton";
import { AdminStatCard } from "@/components/admin/stat-card";

const RANGES = [
  { value: "today", label: "اليوم" },
  { value: "week", label: "هذا الأسبوع" },
  { value: "month", label: "هذا الشهر" },
  { value: "all", label: "الكل" },
];

interface AnalyticsData {
  totalViews: number;
  profileViews: number;
  searches: number;
  categoryViews: number;
  series: { date: string; views: number }[];
  topCreatorList: { creator: { name: string; avatar?: string | null } | null; views: number }[];
  platforms: { type: string; _count: { _all: number } }[];
}

const tooltipStyle = {
  backgroundColor: "#101612",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: "12px",
  color: "#F5F7F5",
  fontSize: "12px",
};

export function AnalyticsCharts() {
  const [range, setRange] = useState("week");
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async (r: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/analytics?range=${r}`);
      const json = await res.json();
      setData(json);
    } catch {
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load(range);
  }, [range, load]);

  if (loading) {
    return (
      <div className="grid gap-6">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-2xl" />
          ))}
        </div>
        <Skeleton className="h-72 rounded-2xl" />
        <Skeleton className="h-72 rounded-2xl" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex flex-col items-center rounded-2xl border border-dashed border-brand-border py-16 text-center">
        <p className="text-brand-text">حدث خطأ أثناء تحميل التحليلات.</p>
        <button
          onClick={() => load(range)}
          className="mt-4 rounded-xl bg-brand-green px-5 py-2.5 text-sm text-brand-bg"
        >
          إعادة المحاولة
        </button>
      </div>
    );
  }

  const cards = [
    { label: "إجمالي الأحداث", value: data.totalViews, icon: <BarChart3 className="size-4" /> },
    { label: "مشاهدات الملفات", value: data.profileViews, icon: <Eye className="size-4" /> },
    { label: "عمليات البحث", value: data.searches, icon: <Search className="size-4" /> },
    { label: "مشاهدات التصنيفات", value: data.categoryViews, icon: <Layers className="size-4" /> },
  ];

  const platformData = data.platforms.map((p) => ({
    name:
      p.type === "profile_view"
        ? "مشاهدات ملفات"
        : p.type === "search"
        ? "بحث"
        : p.type === "category_view"
        ? "تصنيفات"
        : p.type,
    count: p._count._all,
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {RANGES.map((r) => (
          <button
            key={r.value}
            onClick={() => setRange(r.value)}
            className={cn(
              "h-10 rounded-xl border px-4 text-sm font-medium transition-colors",
              range === r.value
                ? "border-brand-green/40 bg-brand-green/10 text-brand-lime"
                : "border-brand-border bg-brand-surface text-brand-muted hover:text-brand-text"
            )}
          >
            {r.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {cards.map((c) => (
          <AdminStatCard key={c.label} label={c.label} value={c.value} icon={c.icon} />
        ))}
      </div>

      <div className="rounded-2xl border border-brand-border bg-brand-surface p-5">
        <h2 className="mb-5 text-sm font-semibold text-brand-text">
          مشاهدات الملفات يوميًا
        </h2>
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={data.series}>
            <defs>
              <linearGradient id="gv" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#22C55E" stopOpacity={0.35} />
                <stop offset="1" stopColor="#22C55E" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis
              dataKey="date"
              tick={{ fill: "#8B958E", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "#8B958E", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              allowDecimals={false}
            />
            <Tooltip contentStyle={tooltipStyle} />
            <Area
              type="monotone"
              dataKey="views"
              stroke="#22C55E"
              strokeWidth={2}
              fill="url(#gv)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-brand-border bg-brand-surface p-5">
          <h2 className="mb-5 text-sm font-semibold text-brand-text">
            أنواع الأحداث
          </h2>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={platformData}>
              <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="name" tick={{ fill: "#8B958E", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#8B958E", fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="count" fill="#A3E635" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-2xl border border-brand-border bg-brand-surface p-5">
          <h2 className="mb-4 text-sm font-semibold text-brand-text">
            الأكثر زيارة
          </h2>
          {data.topCreatorList.length === 0 ? (
            <p className="text-sm text-brand-muted">لا توجد بيانات بعد.</p>
          ) : (
            <div className="space-y-2">
              {data.topCreatorList.map((t, i) => (
                <div
                  key={t.creator?.name ?? i}
                  className="flex items-center justify-between rounded-xl border border-brand-border bg-brand-bg/40 px-4 py-2.5"
                >
                  <span className="flex items-center gap-3">
                    <span className="text-sm text-brand-muted">{i + 1}</span>
                    <span className="text-sm font-medium text-brand-text">
                      {t.creator?.name}
                    </span>
                  </span>
                  <span className="text-sm text-brand-green tabular-nums">
                    {t.views}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}