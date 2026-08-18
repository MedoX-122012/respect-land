import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  getCategoryBySlug,
  getCreatorsBySlug,
  getNewBadgeDays,
} from "@/lib/queries";
import { CategoryIcon } from "@/components/category-icon";
import { CreatorCard } from "@/components/creator-card";
import { CreatorGridSkeleton } from "@/components/skeleton";
import { Suspense } from "react";
import { Users } from "lucide-react";
import { EmptyState } from "@/components/empty-state";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) return {};
  return {
    title: category.name,
    description:
      category.description ?? `استكشف صناع المحتوى في تصنيف ${category.name}.`,
    openGraph: {
      title: `${category.name} | Respect Land`,
      description: category.description ?? `تصنيف ${category.name}`,
    },
  };
}

async function CreatorListContent({ slug }: { slug: string }) {
  const [creators, newDays] = await Promise.all([
    getCreatorsBySlug(slug),
    getNewBadgeDays(),
  ]);
  if (creators.length === 0) {
    return (
      <EmptyState
        title="لا يوجد صناع محتوى في هذا التصنيف حتى الآن."
        actionHref="/creators"
        actionLabel="تصفح جميع صناع المحتوى"
      />
    );
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

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) notFound();

  const [count] = await Promise.all([getCreatorsBySlug(slug)]);
  const totalCreators = count.length;

  return (
    <div>
      <div className="relative overflow-hidden border-b border-brand-border">
        <div className="absolute inset-0 bg-grid [mask-image:radial-gradient(ellipse_60%_70%_at_50%_0%,black,transparent)]" />
        <div className="container-page relative flex flex-col items-center py-14 text-center sm:py-16">
          <span className="mb-4 flex size-16 items-center justify-center rounded-2xl border border-brand-border bg-brand-surface text-brand-green">
            <CategoryIcon icon={category.icon} className="size-8" />
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight text-brand-text sm:text-4xl">
            {category.name}
          </h1>
          {category.description && (
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-brand-muted sm:text-base">
              {category.description}
            </p>
          )}
          <span className="mt-5 inline-flex items-center gap-2 rounded-full border border-brand-border bg-brand-surface px-3.5 py-1.5 text-xs text-brand-muted">
            <Users className="size-3.5 text-brand-green" />
            {totalCreators} صانع محتوى
          </span>
        </div>
      </div>

      <div className="container-page py-10 sm:py-12">
        <Suspense fallback={<CreatorGridSkeleton />}>
          <CreatorListContent slug={slug} />
        </Suspense>
      </div>
    </div>
  );
}