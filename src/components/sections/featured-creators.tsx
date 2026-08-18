import { Suspense } from "react";
import { SectionHeader } from "@/components/section-header";
import { CreatorCard } from "@/components/creator-card";
import { CreatorGridSkeleton } from "@/components/skeleton";
import { getFeaturedCreators, getNewBadgeDays } from "@/lib/queries";
import { EmptyState } from "@/components/empty-state";

async function Content() {
  const [creators, newDays] = await Promise.all([
    getFeaturedCreators(),
    getNewBadgeDays(),
  ]);

  if (creators.length === 0) {
    return (
      <EmptyState
        title="لا يوجد صناع محتوى مميزون حتى الآن."
        description="سيظهر هنا صناع المحتوى المميزون فور إضافتهم من الإدارة."
        actionHref="/creators"
        actionLabel="تصفح جميع صناع المحتوى"
      />
    );
  }

  const isNew = (c: { createdAt: Date }) =>
    Date.now() - c.createdAt.getTime() < newDays * 24 * 60 * 60 * 1000;

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {creators.slice(0, 6).map((c, i) => (
        <CreatorCard key={c.id} creator={c} index={i} showNew={isNew(c)} />
      ))}
    </div>
  );
}

export function FeaturedCreators() {
  return (
    <section className="py-14 first:pt-24">
      <div className="container-page">
        <SectionHeader
          title="صناع المحتوى المميزون"
          subtitle="أبرز الوجوه التي اختارها مجتمع Respect Land."
          link="/creators"
        />
        <Suspense fallback={<CreatorGridSkeleton />}>
          <Content />
        </Suspense>
      </div>
    </section>
  );
}