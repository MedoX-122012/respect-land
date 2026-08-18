"use client";

import { useState } from "react";
import { Save } from "lucide-react";
import { Input, Textarea, Field } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/select";
import { useToast } from "@/components/ui/toast";
import type { SiteSetting } from "@prisma/client";

export function SettingsForm({
  initial,
  creators,
}: {
  initial: SiteSetting | null;
  creators: { id: string; name: string }[];
}) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    siteName: initial?.siteName ?? "Respect Land",
    description: initial?.description ?? "",
    logo: initial?.logo ?? "",
    favicon: initial?.favicon ?? "",
    inviteLink: initial?.inviteLink ?? "",
    footerText: initial?.footerText ?? "",
    homeCtaTitle: initial?.homeCtaTitle ?? "",
    homeCtaSubtitle: initial?.homeCtaSubtitle ?? "",
    themeAccent: initial?.themeAccent ?? "#22C55E",
    maintenanceMode: initial?.maintenanceMode ?? false,
    newBadgeDays: initial?.newBadgeDays ?? 30,
    trendingLimit: initial?.trendingLimit ?? 8,
    creatorOfWeekId: initial?.creatorOfWeekId ?? "",
    socialLinks: (initial?.socialLinks as Record<string, string> | null) ?? {},
  });

  const set = (k: string, v: unknown) => setForm((p) => ({ ...p, [k]: v }));
  const setSocial = (k: string, v: string) =>
    set("socialLinks", { ...form.socialLinks, [k]: v });

  const save = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        logo: form.logo || null,
        favicon: form.favicon || null,
        inviteLink: form.inviteLink || null,
        footerText: form.footerText || null,
        creatorOfWeekId: form.creatorOfWeekId || null,
      }),
    });
    setLoading(false);
    if (res.ok) {
      toast("تم حفظ التغييرات بنجاح");
    } else {
      toast("حدث خطأ أثناء الحفظ", "error");
    }
  };

  const socials = ["youtube", "tiktok", "twitch", "kick", "instagram", "discord", "x"];

  return (
    <div className="space-y-8">
      <div className="grid gap-6 rounded-2xl border border-brand-border bg-brand-surface p-6">
        <h2 className="text-sm font-semibold text-brand-text">الهوية العامة</h2>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="اسم الموقع">
            <Input value={form.siteName} onChange={(e) => set("siteName", e.target.value)} />
          </Field>
          <Field label="رابط الغلاف (logo)">
            <Input value={form.logo} onChange={(e) => set("logo", e.target.value)} dir="ltr" />
          </Field>
          <Field label="الأيقونة (favicon)">
            <Input value={form.favicon} onChange={(e) => set("favicon", e.target.value)} dir="ltr" />
          </Field>
          <Field label="لون التمييز">
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={form.themeAccent}
                onChange={(e) => set("themeAccent", e.target.value)}
                className="h-11 w-14 cursor-pointer rounded-xl border border-brand-border bg-transparent p-1"
              />
              <Input value={form.themeAccent} onChange={(e) => set("themeAccent", e.target.value)} dir="ltr" />
            </div>
          </Field>
        </div>
        <Field label="وصف الموقع">
          <Textarea rows={2} value={form.description} onChange={(e) => set("description", e.target.value)} />
        </Field>
      </div>

      <div className="grid gap-6 rounded-2xl border border-brand-border bg-brand-surface p-6">
        <h2 className="text-sm font-semibold text-brand-text">الصفحة الرئيسية</h2>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="نص زر الدعوة">
            <Input value={form.homeCtaTitle} onChange={(e) => set("homeCtaTitle", e.target.value)} />
          </Field>
          <Field label="رابط دعوة المجتمع">
            <Input value={form.inviteLink} onChange={(e) => set("inviteLink", e.target.value)} dir="ltr" />
          </Field>
        </div>
        <Field label="نص فرعي للدعوة">
          <Textarea rows={2} value={form.homeCtaSubtitle} onChange={(e) => set("homeCtaSubtitle", e.target.value)} />
        </Field>
        <Field label="صانع محتوى الأسبوع">
          <select
            value={form.creatorOfWeekId}
            onChange={(e) => set("creatorOfWeekId", e.target.value)}
            className="h-11 w-full cursor-pointer rounded-xl border border-brand-border bg-brand-bg/50 px-3 text-sm text-brand-text outline-none"
          >
            <option value="">بدون اختيار</option>
            {creators.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </Field>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="مدة شارة «جديد» (بالأيام)">
            <Input
              type="number"
              value={form.newBadgeDays}
              onChange={(e) => set("newBadgeDays", e.target.value)}
            />
          </Field>
          <Field label="عدد صناع «الرائج»">
            <Input
              type="number"
              value={form.trendingLimit}
              onChange={(e) => set("trendingLimit", e.target.value)}
            />
          </Field>
        </div>
      </div>

      <div className="grid gap-6 rounded-2xl border border-brand-border bg-brand-surface p-6">
        <h2 className="text-sm font-semibold text-brand-text">روابط التواصل</h2>
        <div className="grid gap-5 sm:grid-cols-2">
          {socials.map((s) => (
            <Field key={s} label={s}>
              <Input
                value={(form.socialLinks as Record<string, string>)[s] ?? ""}
                onChange={(e) => setSocial(s, e.target.value)}
                dir="ltr"
              />
            </Field>
          ))}
        </div>
        <Field label="نص التذييل">
          <Input value={form.footerText} onChange={(e) => set("footerText", e.target.value)} />
        </Field>
      </div>

      <div className="flex items-center justify-between rounded-2xl border border-brand-border bg-brand-surface p-6">
        <div>
          <h2 className="text-sm font-semibold text-brand-text">وضع الصيانة</h2>
          <p className="mt-1 text-xs text-brand-muted">
            يُظهر صفحة صيانة للزوار بينما تبقى لوحة التحكم متاحة.
          </p>
        </div>
        <Switch
          checked={form.maintenanceMode}
          onChange={(e) => set("maintenanceMode", e.target.checked)}
        />
      </div>

      <div className="flex items-center gap-3">
        <Button onClick={save} size="lg" isLoading={loading}>
          <Save className="size-4" />
          حفظ التغييرات
        </Button>
      </div>
    </div>
  );
}