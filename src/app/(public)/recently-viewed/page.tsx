import type { Metadata } from "next";
import { RecentlyViewedList } from "@/components/recently-viewed-list";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "شاهدتهم مؤخرًا",
  description: "الملفات الشخصية التي زرتها مؤخرًا.",
};

export default function RecentlyViewedPage() {
  return (
    <div className="container-page py-10 sm:py-14">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-brand-text">
          شاهدتهم مؤخرًا
        </h1>
        <p className="mt-2 text-sm text-brand-muted sm:text-base">
          الملفات الشخصية التي تصفحتها مؤخرًا.
        </p>
      </div>
      <RecentlyViewedList />
    </div>
  );
}