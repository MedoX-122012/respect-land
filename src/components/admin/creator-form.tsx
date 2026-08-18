"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Loader2, ArrowRight } from "lucide-react";
import { Input, Textarea, Field } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { PLATFORM_KEYS, PLATFORMS } from "@/components/platform-icon";
import { useToast } from "@/components/ui/toast";
import type { CreatorWithCategory } from "@/lib/queries";

interface PlatformRow {
  key: string;
  handle: string;
  url: string;
}

export function CreatorForm({
  categories,
  initial,
}: {
  categories: { id: string; name: string }[];
  initial?: CreatorWithCategory | null;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const isEdit = !!initial;

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [platforms, setPlatforms] = useState<PlatformRow[]>(
    initial?.platforms
      ? (initial.platforms as unknown as PlatformRow[])
      : []
  );
  const [form, setForm] = useState({
    name: initial?.name ?? "",
    username: initial?.username ?? "",
    avatar: initial?.avatar ?? "",
    cover: initial?.cover ?? "",
    bio: initial?.bio ?? "",
    categoryId: initial?.categoryId ?? "",
    followerCount: initial?.followerCount ?? 0,
    views: initial?.views ?? 0,
    adminScore: initial?.adminScore ?? 0,
    featured: initial?.featured ?? false,
    verified: initial?.verified ?? false,
    isNew: initial?.isNew ?? false,
    trending: initial?.trending ?? false,
  });

  const preview = useMemo(() => {
    const cat = categories.find((c) => c.id === form.categoryId);
    return {
      name: form.name || "اسم صانع المحتوى",
      username: form.username || "username",
      avatar: form.avatar || null,
      bio: form.bio,
      category: cat?.name ?? null,
      platforms,
      verified: form.verified,
      featured: form.featured,
      followerCount: form.followerCount,
      views: form.views,
    };
  }, [form, platforms, categories]);

  const set = (k: string, v: unknown) => setForm((p) => ({ ...p, [k]: v }));

  const togglePlatform = (key: string) =>
    setPlatforms((prev) =>
      prev.some((p) => p.key === key)
        ? prev.filter((p) => p.key !== key)
        : [...prev, { key, handle: "", url: "" }]
    );

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    const url = isEdit ? `/api/admin/creators/${initial!.id}` : "/api/admin/creators";
    const method = isEdit ? "PUT" : "POST";
    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          categoryId: form.categoryId || null,
          platforms,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrors(data.error ?? {});
        toast("تحقق من الحقول", "error");
        return;
      }
      toast(isEdit ? "تم تحديث البيانات بنجاح" : "تمت إضافة صانع المحتوى بنجاح");
      router.push("/admin/creators");
      router.refresh();
    } catch {
      toast("حدث خطأ أثناء الحفظ", "error");
    } finally {
      setLoading(false);
    }
  };

  const err = (k: string) => errors[k]?.[0];

  const BooleanField = ({
    label,
    checked,
    onChange,
  }: {
    label: string;
    checked: boolean;
    onChange: (v: boolean) => void;
  }) => (
    <label className="flex cursor-pointer items-center justify-between rounded-xl border border-brand-border bg-brand-bg/40 px-4 py-3">
      <span className="text-sm text-brand-text">{label}</span>
      <span
        onClick={() => onChange(!checked)}
        className={
          checked
            ? "flex size-6 items-center justify-center rounded-md bg-brand-green text-brand-bg"
            : "flex size-6 items-center justify-center rounded-md border border-brand-border text-transparent"
        }
      >
        <Check className="size-4" />
      </span>
    </label>
  );

  return (
    <form onSubmit={submit} className="grid gap-8 lg:grid-cols-[1fr_340px]">
      <div className="space-y-6">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="الاسم">
            <Input value={form.name} onChange={(e) => set("name", e.target.value)} />
            {err("name") && <span className="text-xs text-red-400">{err("name")}</span>}
          </Field>
          <Field label="اسم المستخدم">
            <Input
              value={form.username}
              onChange={(e) => set("username", e.target.value)}
              dir="ltr"
            />
            {err("username") && <span className="text-xs text-red-400">{err("username")}</span>}
          </Field>
          <Field label="صورة الملف الشخصي (رابط)">
            <Input value={form.avatar} onChange={(e) => set("avatar", e.target.value)} dir="ltr" />
          </Field>
          <Field label="صورة الغلاف (رابط)">
            <Input value={form.cover} onChange={(e) => set("cover", e.target.value)} dir="ltr" />
          </Field>
        </div>

        <Field label="نبذة">
          <Textarea rows={3} value={form.bio} onChange={(e) => set("bio", e.target.value)} />
        </Field>

        <Field label="التصنيف">
          <Select
            value={form.categoryId}
            onChange={(e) => set("categoryId", e.target.value)}
          >
            <option value="">بدون تصنيف</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </Select>
        </Field>

        <div>
          <span className="mb-2 block text-sm font-medium text-brand-text">المنصات</span>
          <div className="flex flex-wrap gap-2">
            {PLATFORM_KEYS.map((key) => {
              const active = platforms.some((p) => p.key === key);
              return (
                <button
                  type="button"
                  key={key}
                  onClick={() => togglePlatform(key)}
                  className={
                    active
                      ? "h-10 rounded-xl border border-brand-green/40 bg-brand-green/10 px-4 text-sm font-medium text-brand-lime"
                      : "h-10 rounded-xl border border-brand-border bg-brand-surface px-4 text-sm text-brand-muted transition-colors hover:text-brand-text"
                  }
                >
                  {PLATFORMS[key].label}
                </button>
              );
            })}
          </div>
          {platforms.length > 0 && (
            <div className="mt-3 space-y-2">
              {platforms.map((p) => (
                <div key={p.key} className="rounded-xl border border-brand-border bg-brand-bg/40 p-3">
                  <div className="grid gap-2 sm:grid-cols-2">
                    <Input
                      value={p.handle}
                      onChange={(e) =>
                        setPlatforms((prev) =>
                          prev.map((x) =>
                            x.key === p.key ? { ...x, handle: e.target.value } : x
                          )
                        )
                      }
                      placeholder={`${PLATFORMS[p.key as keyof typeof PLATFORMS].label} handle`}
                      dir="ltr"
                    />
                    <Input
                      value={p.url}
                      onChange={(e) =>
                        setPlatforms((prev) =>
                          prev.map((x) =>
                            x.key === p.key ? { ...x, url: e.target.value } : x
                          )
                        )
                      }
                      placeholder="https://"
                      dir="ltr"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="grid gap-5 sm:grid-cols-3">
          <Field label="عدد المتابعين">
            <Input
              type="number"
              value={form.followerCount}
              onChange={(e) => set("followerCount", e.target.value)}
            />
          </Field>
          <Field label="عدد المشاهدات">
            <Input type="number" value={form.views} onChange={(e) => set("views", e.target.value)} />
          </Field>
          <Field label="درجة التأثير">
            <Input
              type="number"
              value={form.adminScore}
              onChange={(e) => set("adminScore", e.target.value)}
            />
          </Field>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <BooleanField label="موثق" checked={form.verified} onChange={(v) => set("verified", v)} />
          <BooleanField label="مميز" checked={form.featured} onChange={(v) => set("featured", v)} />
          <BooleanField label="جديد" checked={form.isNew} onChange={(v) => set("isNew", v)} />
          <BooleanField label="رائج" checked={form.trending} onChange={(v) => set("trending", v)} />
        </div>

        <div className="flex items-center gap-3">
          <Button type="submit" size="lg" isLoading={loading}>
            {loading ? "جارٍ الحفظ..." : isEdit ? "حفظ التغييرات" : "إضافة صانع المحتوى"}
          </Button>
          <Button type="button" variant="secondary" size="lg" onClick={() => router.back()}>
            إلغاء
          </Button>
        </div>
      </div>

      {/* Live preview */}
      <div className="lg:sticky lg:top-6 self-start">
        <p className="mb-3 flex items-center gap-2 text-sm font-medium text-brand-text">
          <ArrowRight className="size-4" />
          معاينة حية
        </p>
        <div className="overflow-hidden rounded-2xl border border-brand-border bg-brand-surface">
          <div className="relative h-24">
            {preview.avatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={preview.avatar}
                alt=""
                className="size-full object-cover"
              />
            ) : (
              <div className="h-full w-full bg-gradient-to-br from-brand-dark to-brand-surface-2" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-brand-surface to-transparent" />
          </div>
          <div className="px-5 pb-5">
            <div className="-mt-10 flex items-center gap-3">
              <div className="flex size-16 items-center justify-center overflow-hidden rounded-2xl border-4 border-brand-surface bg-brand-dark text-xl font-bold text-brand-muted">
                {preview.avatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={preview.avatar} alt={preview.name} className="size-full object-cover" />
                ) : (
                  preview.name.charAt(0)
                )}
              </div>
              <div className="pt-6 min-w-0">
                <p className="flex items-center gap-1.5 truncate font-bold text-brand-text">
                  {preview.name}
                  {preview.verified && <Check className="size-4 fill-brand-green text-brand-bg" />}
                </p>
                <p className="truncate text-xs text-brand-muted" dir="ltr">
                  @{preview.username}
                </p>
              </div>
            </div>
            {preview.category && (
              <span className="mt-3 inline-block rounded-md border border-brand-border bg-brand-bg/50 px-2 py-0.5 text-[11px] text-brand-muted">
                {preview.category}
              </span>
            )}
            {preview.bio && (
              <p className="mt-2.5 line-clamp-2 text-xs leading-relaxed text-brand-muted">
                {preview.bio}
              </p>
            )}
            <div className="mt-3 flex gap-1.5">
              {preview.platforms.slice(0, 5).map((p) => (
                <span
                  key={p.key}
                  className="flex size-6 items-center justify-center rounded-md border border-brand-border bg-brand-surface text-xs text-brand-muted"
                >
                  {PLATFORMS[p.key as keyof typeof PLATFORMS].label.charAt(0)}
                </span>
              ))}
            </div>
            <div className="mt-3 flex items-center justify-between border-t border-brand-border pt-3 text-xs text-brand-muted">
              <span>{preview.followerCount.toLocaleString()} متابع</span>
              <span>{preview.views.toLocaleString()} مشاهدة</span>
            </div>
            {preview.featured && (
              <span className="mt-2 inline-block rounded-full bg-brand-lime/15 px-2.5 py-1 text-[11px] text-brand-lime">
                ⭐ مميز
              </span>
            )}
          </div>
        </div>
      </div>
    </form>
  );
}