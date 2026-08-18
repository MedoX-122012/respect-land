"use client";

import { useState } from "react";
import { Loader2, CheckCircle2 } from "lucide-react";
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
  const [form, setForm] = useState({
    name: "",
    username: "",
    category: "",
    bio: "",
    image: "",
    cover: "",
    reason: "",
  });

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
        <Field label="صورة الملف الشخصي" hint="رابط صورة">
          <Input
            value={form.image}
            onChange={(e) => setForm({ ...form, image: e.target.value })}
            placeholder="https://"
            dir="ltr"
          />
        </Field>
        <Field label="صورة الغلاف (اختياري)" hint="رابط صورة">
          <Input
            value={form.cover}
            onChange={(e) => setForm({ ...form, cover: e.target.value })}
            placeholder="https://"
            dir="ltr"
          />
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