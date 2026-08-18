import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Users } from "lucide-react";
import type { Category } from "@prisma/client";
import { CategoryIcon } from "@/components/category-icon";
import { VerifiedBadge } from "@/components/badges";
import { Skeleton } from "@/components/skeleton";
import { getCategories } from "@/lib/queries";

type CategoryCardData = Category & {
  _count: { creators: number };
  creators: { name: string; username: string; avatar: string | null }[];
};

async function Content() {
  const categories = await getCategories();
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {categories.map((c) => (
        <Link
          key={c.id}
          href={`/category/${c.slug}`}
          className="group relative flex flex-col overflow-hidden rounded-2xl border border-brand-border bg-brand-surface p-6 transition-all duration-300 hover:-translate-y-1 hover:border-brand-green/30 hover:shadow-2xl hover:shadow-brand-green/5"
        >
          <div className="flex items-start justify-between">
            <span className="flex size-12 items-center justify-center rounded-xl border border-brand-border bg-brand-dark text-brand-green transition-colors group-hover:text-brand-lime">
              <CategoryIcon icon={c.icon} className="size-5" />
            </span>
            <span className="flex items-center gap-1.5 rounded-full bg-brand-bg/60 px-2.5 py-1 text-xs text-brand-muted">
              <Users className="size-3.5" />
              {c._count.creators}
            </span>
          </div>

          <h3 className="mt-4 text-lg font-bold text-brand-text">{c.name}</h3>
          {c.description && (
            <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-brand-muted">
              {c.description}
            </p>
          )}

          {c.creators.length > 0 && (
            <div className="mt-5 flex items-center gap-2 border-t border-brand-border pt-4">
              <div className="flex -space-x-2 space-x-reverse">
                {c.creators.slice(0, 3).map((cr) => (
                  <span
                    key={cr.username}
                    className="relative size-7 overflow-hidden rounded-full border-2 border-brand-surface bg-brand-dark"
                    title={cr.name}
                  >
                    {cr.avatar ? (
                      <Image
                        src={cr.avatar}
                        alt={cr.name}
                        fill
                        sizes="28px"
                        className="object-cover"
                      />
                    ) : (
                      <span className="flex size-full items-center justify-center text-[10px] font-bold text-brand-muted">
                        {cr.name.charAt(0)}
                      </span>
                    )}
                  </span>
                ))}
              </div>
              <span className="text-xs text-brand-muted">
                {c.creators[0].name} وأكثر
              </span>
            </div>
          )}

          <span className="mt-auto flex items-center gap-1.5 pt-5 text-sm font-medium text-brand-green">
            استكشف التصنيف
            <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-0.5" />
          </span>
        </Link>
      ))}
    </div>
  );
}

export function CategoriesGrid() {
  return (
    <Suspense
      fallback={
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-56 rounded-2xl" />
          ))}
        </div>
      }
    >
      <Content />
    </Suspense>
  );
}