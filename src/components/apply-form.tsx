"use client";

import { useState } from "react";
import { Loader2, CheckCircle2, Upload, X, Link2 } from "lucide-react";
import { Input, Textarea, Field } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PLATFORM_KEYS, PLATFORMS } from "@/components/platform-icon";
import { useToast } from "@/components/ui/toast";

interface PlatformRow {
  key: string;
  handle: string;
  url: string;
}

export function ApplyForm({ categories }: { categories: { slug: string; name: string }[] }) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [platforms, setPlatforms] = useState<PlatformRow[]>([]);
  const [uploading, setUploading] = useState<"image" | "cover" | null>(null);
  const [form, setForm] = useState({
    name: "",
    username: "",
    category: "",
    bio: "",
    image: "",
    cover: "",
    reason: "",
  });

  const handleUpload = async (file: File, field: "image" | "cover") => {
    if (!file.type.startsWith("image/")) {
      toast("اختر ملف صورة فقط", "error");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast("حجم الصورة كبير (الحد 5MB)", "error");
      return;
    }
    setUploading(field);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("type", field);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) {
        toast(data.error ?? "فشل الرفع", "error");
        return;
      }
      setForm((p) => ({ ...p, [field]: data.url }));
      toast("تم رفع الصورة بنجاح");
    } catch {
      toast("فشل رفع الصورة", "error");
    } finally {
      setUploading(null);
    }
  };

  const togglePlatform = (key: string) => {
    setPlatforms((prev) =>
      prev.some((p) => p.key === key)
        ? prev.filter((p) => p.key !== key)
        : [...prev, { key, handle: "", url: "" }]
    );
  };

  const setPlatformField = (key: string, field: "handle" | "url", value: string) => {
    setPlatforms((prev) =>
      prev.map((p) => (p.key === key ? { ...p, [field]: value } : p))
    );
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, platforms }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrors(data.error ?? {});
        return;
      }
      setDone(true);
      toast("تم إرسال طلبك بنجاح");
    } catch {
      toast("حدث خطأ أثناء الإرسال", "error");
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-brand-border bg-brand-surface px-6 py-16 text-center">
        <CheckCircle2 className="mb-4 size-12 text-brand-green" />
        <h2 className="text-xl font-bold text-brand-text">تم إرسال الطلب بنجاح</h2>
        <p className="mt-2 max-w-sm text-sm text-brand-muted">
          شكرًا لاهتمامك! سيقوم فريق الإدارة بمراجعة طلبك والرد عليك قريبًا.
        </p>
      </div>
    );
  }

  const err = (k: string) => errors[k]?.[0];

  return (
    <form onSubmit={submit} className="space-y-6">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="الاسم الكامل">
          <Input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="مثال: أحمد الشاذلي"
          />
          {err("name") && <span className="text-xs text-red-400">{err("name")}</span>}
        </Field>
        <Field label="اسم المستخدم" hint="بالأحرف الإنجليزية فقط">
          <Input
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            placeholder="username"
            dir="ltr"
          />
          {err("username") && <span className="text-xs text-red-400">{err("username")}</span>}
        </Field>
      </div>

      <Field label="التصنيف">
        <select
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          className="h-11 w-full cursor-pointer rounded-xl border border-brand-border bg-brand-bg/50 px-3.5 text-sm text-brand-text outline-none focus:border-brand-green"
        >
          <option value="">اختر التصنيف</option>
          {categories.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>
        {err("category") && <span className="text-xs text-red-400">{err("category")}</span>}
      </Field>

      <Field label="نبذة عنك">
        <Textarea
          rows={4}
          value={form.bio}
          onChange={(e) => setForm({ ...form, bio: e.target.value })}
          placeholder="تحدث عن محتواك وما تقدمه..."
        />
      </Field>

      <div>
        <span className="mb-2 block text-sm font-medium text-brand-text">
          منصاتك
        </span>
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
                    ? "inline-flex h-10 items-center gap-2 rounded-xl border border-brand-green/40 bg-brand-green/10 px-4 text-sm font-medium text-brand-lime"
                    : "inline-flex h-10 items-center gap-2 rounded-xl border border-brand-border bg-brand-surface px-4 text-sm text-brand-muted transition-colors hover:text-brand-text"
                }
              >
                {PLATFORMS[key].label}
              </button>
            );
          })}
        </div>

        {platforms.length > 0 && (
          <div className="mt-4 space-y-3">
            {platforms.map((p) => (
              <div
                key={p.key}
                className="rounded-xl border border-brand-border bg-brand-bg/40 p-3"
              >
                <span className="mb-2 block text-sm font-medium text-brand-text">
                  {PLATFORMS[p.key as keyof typeof PLATFORMS].label}
                </span>
                <div className="grid gap-3 sm:grid-cols-2">
                  <Input
                    value={p.handle}
                    onChange={(e) => setPlatformField(p.key, "handle", e.target.value)}
                    placeholder="اسم الحساب"
                    dir="ltr"
                  />
                  <Input
                    value={p.url}
                    onChange={(e) => setPlatformField(p.key, "url", e.target.value)}
                    placeholder="https://"
                    dir="ltr"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="صورة الملف الشخصي">
          <div className="space-y-2">
            <div
              className="group relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-brand-border bg-brand-bg/40 p-4 transition-colors hover:border-brand-green/40"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const f = e.dataTransfer.files?.[0];
                if (f) handleUpload(f, "image");
              }}
            >
              {form.image ? (
                <div className="relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={form.image} alt="preview" className="size-20 rounded-2xl border-2 border-brand-border object-cover" />
                  <button type="button" onClick={() => setForm((p) => ({ ...p, image: "" }))} className="absolute -right-2 -top-2 flex size-6 items-center justify-center rounded-full bg-red-500 text-white hover:bg-red-600">
                    <X className="size-3" />
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2 py-1 text-center">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-brand-surface text-brand-muted">
                    <Upload className="size-5" />
                  </div>
                  <span className="text-xs text-brand-muted">اسحب الصورة هنا</span>
                </div>
              )}
              <label className="mt-3 inline-flex cursor-pointer items-center gap-2 rounded-xl border border-brand-border bg-brand-surface px-3 py-1.5 text-xs font-medium text-brand-text hover:border-brand-green/40">
                <Upload className="size-3.5" />
                {uploading === "image" ? "جارٍ الرفع..." : "اختر صورة"}
                <input type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleUpload(f, "image"); e.target.value = ""; }} disabled={uploading === "image"} />
              </label>
              {uploading === "image" && <Loader2 className="mt-2 size-4 animate-spin text-brand-green" />}
            </div>
            <div className="flex items-center gap-2">
              <Link2 className="size-3.5 shrink-0 text-brand-muted" />
              <Input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} dir="ltr" placeholder="أو رابط https://..." />
            </div>
          </div>
        </Field>
        <Field label="صورة الغلاف (اختياري)">
          <div className="space-y-2">
            <div
              className="group relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-brand-border bg-brand-bg/40 p-4 transition-colors hover:border-brand-green/40"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const f = e.dataTransfer.files?.[0];
                if (f) handleUpload(f, "cover");
              }}
            >
              {form.cover ? (
                <div className="relative w-full">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={form.cover} alt="cover preview" className="h-20 w-full rounded-xl border border-brand-border object-cover" />
                  <button type="button" onClick={() => setForm((p) => ({ ...p, cover: "" }))} className="absolute right-2 top-2 flex size-6 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur hover:bg-red-500">
                    <X className="size-3" />
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2 py-1 text-center">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-brand-surface text-brand-muted">
                    <Upload className="size-5" />
                  </div>
                  <span className="text-xs text-brand-muted">اسحب صورة الغلاف</span>
                </div>
              )}
              <label className="mt-3 inline-flex cursor-pointer items-center gap-2 rounded-xl border border-brand-border bg-brand-surface px-3 py-1.5 text-xs font-medium text-brand-text hover:border-brand-green/40">
                <Upload className="size-3.5" />
                {uploading === "cover" ? "جارٍ الرفع..." : "اختر صورة الغلاف"}
                <input type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleUpload(f, "cover"); e.target.value = ""; }} disabled={uploading === "cover"} />
              </label>
              {uploading === "cover" && <Loader2 className="mt-2 size-4 animate-spin text-brand-green" />}
            </div>
            <div className="flex items-center gap-2">
              <Link2 className="size-3.5 shrink-0 text-brand-muted" />
              <Input value={form.cover} onChange={(e) => setForm({ ...form, cover: e.target.value })} dir="ltr" placeholder="أو رابط https://..." />
            </div>
          </div>
        </Field>
      </div>

      <Field label="لماذا تريد الانضمام؟">
        <Textarea
          rows={3}
          value={form.reason}
          onChange={(e) => setForm({ ...form, reason: e.target.value })}
          placeholder="اشرح سبب رغبتك في الانضمام..."
        />
      </Field>

      <Button type="submit" size="lg" className="w-full" isLoading={loading}>
        {loading ? "جارٍ الإرسال..." : "إرسال الطلب"}
      </Button>
    </form>
  );
}