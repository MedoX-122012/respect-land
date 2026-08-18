import { Suspense } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { SectionHeader } from "@/components/section-header";
import { CategoryIcon } from "@/components/category-icon";
import { getCategories } from "@/lib/queries";
import { Skeleton } from "@/components/skeleton";

async function Content() {
  const categories = await getCategories();
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {categories.map((c) => (
        <Link
          key={c.id}
          href={`/category/${c.slug}`}
          className="group relative flex flex-row items-center gap-4 rounded-2xl border border-brand-border bg-brand-surface p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-green/30 hover:bg-brand-surface-2"
        >
          <span className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-brand-border bg-brand-dark text-brand-green transition-colors group-hover:text-brand-lime">
            <CategoryIcon icon={c.icon} className="size-5" />
          </span>
          <span className="min-w-0">
            <span className="block truncate text-sm font-semibold text-brand-text">
              {c.name}
            </span>
            <span className="block text-xs text-brand-muted">
              {c._count.creators} صانع محتوى
            </span>
          </span>
          <ArrowLeft className="mr-auto size-4 shrink-0 text-brand-muted opacity-0 transition-opacity group-hover:opacity-100" />
        </Link>
      ))}
    </div>
  );
}

export function FeaturedCategories() {
  return (
    <section className="py-14">
      <div className="container-page">
        <SectionHeader
          title="التصنيفات"
          subtitle="استكشف المجتمعات التي ينتمي إليها صناع المحتوى."
          link="/categories"
        />
        <Suspense
          fallback={
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-20 rounded-2xl" />
              ))}
            </div>
          }
        >
          <Content />
        </Suspense>
      </div>
    </section>
  );
}