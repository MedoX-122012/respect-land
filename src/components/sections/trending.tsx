import { Suspense } from "react";
import { TrendingUp } from "lucide-react";
import { SectionHeader } from "@/components/section-header";
import { CreatorCard } from "@/components/creator-card";
import { CreatorGridSkeleton } from "@/components/skeleton";
import { EmptyState } from "@/components/empty-state";
import { getTrendingCreators, getNewBadgeDays } from "@/lib/queries";

async function Content() {
  const [creators, newDays] = await Promise.all([
    getTrendingCreators(6),
    getNewBadgeDays(),
  ]);

  if (creators.length === 0) {
    return <EmptyState title="لا توجد إضافات رائجة حاليًا." />;
  }

  const isNew = (c: { createdAt: Date }) =>
    Date.now() - c.createdAt.getTime() < newDays * 24 * 60 * 60 * 1000;

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {creators.map((c, i) => (
        <CreatorCard key={c.id} creator={c} index={i} showNew={isNew(c)} />
      ))}
    </div>
  );
}

export function TrendingSection() {
  return (
    <section className="py-14">
      <div className="container-page">
        <SectionHeader
          title={
            <span className="inline-flex items-center gap-2.5">
              <TrendingUp className="size-6 text-brand-green" />
              الرائج الآن
            </span>
          }
          subtitle="أكثر صناع المحتوى تفاعلًا ونشاطًا في الفترة الأخيرة."
          link="/creators"
        />
        <Suspense fallback={<CreatorGridSkeleton />}>
          <Content />
        </Suspense>
      </div>
    </section>
  );
}