import { Suspense } from "react";
import { SectionHeader } from "@/components/section-header";
import { CreatorCard } from "@/components/creator-card";
import { CreatorGridSkeleton } from "@/components/skeleton";
import { EmptyState } from "@/components/empty-state";
import { getNewCreators } from "@/lib/queries";

async function Content() {
  const creators = await getNewCreators(6);

  if (creators.length === 0) {
    return <EmptyState title="لا يوجد صناع محتوى جدد حتى الآن." />;
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {creators.map((c, i) => (
        <CreatorCard key={c.id} creator={c} index={i} showNew />
      ))}
    </div>
  );
}

export function NewCreators() {
  return (
    <section className="py-14">
      <div className="container-page">
        <SectionHeader
          title="وصلوا حديثًا"
          subtitle="أحدث صناع المحتوى المنضمين إلى مجتمع Respect Land."
          link="/creators"
        />
        <Suspense fallback={<CreatorGridSkeleton />}>
          <Content />
        </Suspense>
      </div>
    </section>
  );
}