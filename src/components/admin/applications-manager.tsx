"use client";

import { useCallback, useEffect, useState } from "react";
import { Check, X, Loader2, ExternalLink } from "lucide-react";
import { useToast } from "@/components/ui/toast";
import { Skeleton } from "@/components/skeleton";
import { PLATFORMS, PlatformBadge } from "@/components/platform-icon";
import { cn } from "@/lib/utils";

interface Application {
  id: string;
  name: string;
  username: string;
  category: string;
  bio?: string | null;
  image?: string | null;
  cover?: string | null;
  reason?: string | null;
  platforms: unknown;
  status: string;
  createdAt: string;
}

const TABS = [
  { value: "PENDING", label: "معلّقة" },
  { value: "APPROVED", label: "مقبولة" },
  { value: "REJECTED", label: "مرفوضة" },
];

export function ApplicationsManager() {
  const { toast } = useToast();
  const [tab, setTab] = useState("PENDING");
  const [apps, setApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [pending, setPending] = useState<string | null>(null);

  const load = useCallback(async (status: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/applications?status=${status}`);
      const data = await res.json();
      setApps(data.applications);
    } catch {
      toast("حدث خطأ", "error");
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    load(tab);
  }, [tab, load]);

  const decide = async (id: string, action: string) => {
    setPending(id);
    const res = await fetch(`/api/admin/applications/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
    });
    setPending(null);
    if (res.ok) {
      toast(action === "APPROVED" ? "تم قبول الطلب" : "تم رفض الطلب");
      load(tab);
    } else {
      toast("حدث خطأ", "error");
    }
  };

  return (
    <div>
      <div className="mb-6 flex gap-2">
        {TABS.map((t) => (
          <button
            key={t.value}
            onClick={() => setTab(t.value)}
            className={cn(
              "h-10 rounded-xl border px-4 text-sm font-medium transition-colors",
              tab === t.value
                ? "border-brand-green/40 bg-brand-green/10 text-brand-lime"
                : "border-brand-border bg-brand-surface text-brand-muted hover:text-brand-text"
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-2xl" />
          ))}
        </div>
      ) : apps.length === 0 ? (
        <div className="flex flex-col items-center rounded-2xl border border-dashed border-brand-border py-16 text-center">
          <p className="text-brand-text">لا توجد طلبات في هذا التصنيف.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {apps.map((app) => {
            const platforms = (app.platforms as { key: string }[] | null) ?? [];
            return (
              <div
                key={app.id}
                className="rounded-2xl border border-brand-border bg-brand-surface p-5"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex size-12 items-center justify-center overflow-hidden rounded-xl bg-brand-dark text-lg font-bold text-brand-muted">
                      {app.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={app.image} alt={app.name} className="size-full object-cover" />
                      ) : (
                        app.name.charAt(0)
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-brand-text">{app.name}</p>
                      <p className="text-xs text-brand-muted" dir="ltr">
                        @{app.username} · {app.category}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs text-brand-muted">
                    {new Date(app.createdAt).toLocaleDateString("ar-EG")}
                  </span>
                </div>

                {app.bio && (
                  <p className="mt-3 line-clamp-2 text-sm text-brand-muted">{app.bio}</p>
                )}

                <div className="mt-3 flex flex-wrap gap-1.5">
                  {platforms.map((p) => (
                    <PlatformBadge key={p.key} platform={p.key} className="size-7 rounded-md" />
                  ))}
                </div>

                {tab === "PENDING" && (
                  <div className="mt-4 flex flex-wrap gap-2 border-t border-brand-border pt-4">
                    <button
                      onClick={() => decide(app.id, "APPROVED")}
                      disabled={pending === app.id}
                      className="inline-flex h-10 items-center gap-2 rounded-xl bg-brand-green px-4 text-sm font-medium text-brand-bg transition-colors hover:bg-brand-lime disabled:opacity-50"
                    >
                      {pending === app.id ? (
                        <Loader2 className="size-4 animate-spin" />
                      ) : (
                        <Check className="size-4" />
                      )}
                      قبول وتحويل لصانع محتوى
                    </button>
                    <button
                      onClick={() => decide(app.id, "REJECTED")}
                      disabled={pending === app.id}
                      className="inline-flex h-10 items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-4 text-sm font-medium text-red-400 transition-colors hover:bg-red-500/20 disabled:opacity-50"
                    >
                      <X className="size-4" />
                      رفض
                    </button>
                  </div>
                )}

                {tab === "APPROVED" && (
                  <a
                    href={`/creators/${app.username}`}
                    target="_blank"
                    className="mt-4 inline-flex items-center gap-2 text-sm text-brand-green hover:text-brand-lime"
                  >
                    <ExternalLink className="size-4" />
                    عرض الملف
                  </a>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}