import type { Metadata } from "next";
import { AnalyticsCharts } from "@/components/admin/analytics-charts";

export const metadata: Metadata = { title: "التحليلات", robots: { index: false } };
export const dynamic = "force-dynamic";

export default function AdminAnalyticsPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-brand-text">التحليلات</h1>
        <p className="mt-1 text-sm text-brand-muted">
          تتبع أداء المنصة ونشاط الزوار.
        </p>
      </div>
      <AnalyticsCharts />
    </div>
  );
}