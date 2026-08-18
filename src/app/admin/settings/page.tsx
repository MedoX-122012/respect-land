import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { SettingsForm } from "@/components/admin/settings-form";
import { DataTransfer } from "@/components/admin/data-transfer";
import { AnnouncementsManager } from "@/components/admin/announcements-manager";

export const metadata: Metadata = { title: "الإعدادات", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const [settings, creators] = await Promise.all([
    prisma.siteSetting.findFirst({ where: { id: 1 } }),
    prisma.creator.findMany({ orderBy: { name: "asc" }, take: 200 }),
  ]);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-brand-text">إعدادات الموقع</h1>
        <p className="mt-1 text-sm text-brand-muted">
          تحكم في هوية المنصة وروابطها ووضع الصيانة.
        </p>
      </div>
      <div className="max-w-3xl space-y-8">
        <SettingsForm
          initial={settings}
          creators={creators.map((c) => ({ id: c.id, name: c.name }))}
        />
        <div className="rounded-2xl border border-brand-border bg-brand-surface p-6">
          <h2 className="mb-4 text-sm font-semibold text-brand-text">الإعلانات</h2>
          <AnnouncementsManager />
        </div>
        <DataTransfer />
      </div>
    </div>
  );
}