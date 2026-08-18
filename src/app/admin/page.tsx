import Link from "next/link";
import {
  Users,
  BadgeCheck,
  Sparkles,
  Layers,
  Inbox,
  Eye,
  TrendingUp,
  ArrowLeft,
} from "lucide-react";
import { getDashboardStats } from "@/lib/admin-queries";
import { formatFullNumber } from "@/lib/utils";
import { PlatformBadge } from "@/components/platform-icon";
import { VerifiedBadge } from "@/components/badges";
import { AdminStatCard } from "@/components/admin/stat-card";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const stats = await getDashboardStats();

  const cards = [
    { label: "إجمالي صناع المحتوى", value: stats.creators, icon: Users },
    { label: "صناع موثقون", value: stats.verified, icon: BadgeCheck },
    { label: "صناع مميزون", value: stats.featured, icon: Sparkles },
    { label: "التصنيفات", value: stats.categories, icon: Layers },
    { label: "طلبات معلّقة", value: stats.applications, icon: Inbox },
    { label: "مشاهدات الملفات", value: stats.profileViews, icon: Eye },
  ];

  const platforms: { key: string }[] = (stats.mostViewed?.platforms as
    | { key: string }[]
    | null) ?? [];

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-brand-text">نظرة عامة</h1>
          <p className="mt-1 text-sm text-brand-muted">
            ملخص سريع لحالة المنصة.
          </p>
        </div>
        <Link
          href="/admin/analytics"
          className="inline-flex items-center gap-2 rounded-xl border border-brand-border bg-brand-surface px-4 py-2.5 text-sm font-medium text-brand-text transition-colors hover:border-brand-green/40"
        >
          التحليلات الكاملة
          <ArrowLeft className="size-4" />
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
        {cards.map((c) => (
          <AdminStatCard
            key={c.label}
            label={c.label}
            value={c.value}
            icon={<c.icon className="size-4" />}
          />
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {/* Most viewed */}
        <div className="rounded-2xl border border-brand-border bg-brand-surface p-6">
          <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold text-brand-text">
            <TrendingUp className="size-4 text-brand-green" />
            الأكثر مشاهدة
          </h2>
          {stats.mostViewed ? (
            <div className="flex items-center gap-4">
              <div className="flex size-14 items-center justify-center overflow-hidden rounded-2xl bg-brand-dark text-2xl font-bold text-brand-muted">
                {stats.mostViewed.avatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={stats.mostViewed.avatar}
                    alt={stats.mostViewed.name}
                    className="size-full object-cover"
                  />
                ) : (
                  stats.mostViewed.name.charAt(0)
                )}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <Link
                    href={`/creators/${stats.mostViewed.username}`}
                    className="truncate font-semibold text-brand-text hover:text-brand-lime"
                  >
                    {stats.mostViewed.name}
                  </Link>
                  {stats.mostViewed.verified && <VerifiedBadge />}
                </div>
                <p className="mt-1 text-sm text-brand-muted">
                  {formatFullNumber(stats.mostViewed.views)} مشاهدة
                </p>
                <div className="mt-2 flex gap-1.5">
                  {platforms.slice(0, 4).map((p) => (
                    <PlatformBadge key={p.key} platform={p.key} className="size-6 rounded-md" />
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <p className="text-sm text-brand-muted">لا يوجد بيانات بعد.</p>
          )}
        </div>

        {/* Recent activity */}
        <div className="rounded-2xl border border-brand-border bg-brand-surface p-6">
          <h2 className="mb-4 text-sm font-semibold text-brand-text">
            آخر النشاطات
          </h2>
          {stats.recentActivity.length === 0 ? (
            <p className="text-sm text-brand-muted">لا يوجد نشاط بعد.</p>
          ) : (
            <ul className="space-y-3">
              {stats.recentActivity.map((a) => (
                <li
                  key={a.id}
                  className="flex items-center justify-between gap-3 text-sm"
                >
                  <span className="truncate text-brand-text">{a.action}</span>
                  <span className="shrink-0 text-xs text-brand-muted">
                    {formatRelative(a.createdAt)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Recent creators */}
      <div className="mt-6 rounded-2xl border border-brand-border bg-brand-surface p-6">
        <h2 className="mb-4 text-sm font-semibold text-brand-text">
          أحدث صناع المحتوى
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {stats.recentCreators.map((c) => (
            <div
              key={c.id}
              className="flex items-center gap-3 rounded-xl border border-brand-border bg-brand-bg/40 p-3"
            >
              <div className="flex size-10 items-center justify-center overflow-hidden rounded-xl bg-brand-dark text-lg font-bold text-brand-muted">
                {c.avatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={c.avatar} alt={c.name} className="size-full object-cover" />
                ) : (
                  c.name.charAt(0)
                )}
              </div>
              <div className="min-w-0">
                <p className="flex items-center gap-1.5 truncate text-sm font-medium text-brand-text">
                  {c.name}
                  {c.verified && <VerifiedBadge />}
                </p>
                <p className="truncate text-xs text-brand-muted" dir="ltr">
                  @{c.username}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function formatRelative(date: Date) {
  const diff = Date.now() - date.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "الآن";
  if (mins < 60) return `منذ ${mins} د`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `منذ ${hours} س`;
  const days = Math.floor(hours / 24);
  return `منذ ${days} يوم`;
}
