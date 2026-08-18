import type { Metadata } from "next";
import { ApplicationsManager } from "@/components/admin/applications-manager";

export const metadata: Metadata = { title: "طلبات الانضمام", robots: { index: false } };
export const dynamic = "force-dynamic";

export default function AdminApplicationsPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-brand-text">طلبات الانضمام</h1>
        <p className="mt-1 text-sm text-brand-muted">
          مراجعة طلبات انضمام صناع المحتوى الجدد.
        </p>
      </div>
      <ApplicationsManager />
    </div>
  );
}