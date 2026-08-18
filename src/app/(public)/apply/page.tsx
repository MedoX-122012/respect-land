import type { Metadata } from "next";
import { getCategories } from "@/lib/queries";
import { ApplyForm } from "@/components/apply-form";

export const metadata: Metadata = {
  title: "انضم كصانع محتوى",
  description:
    "قدّم طلبك للانضمام إلى مجتمع Respect Land كصانع محتوى.",
};

export default async function ApplyPage() {
  const categories = await getCategories();
  return (
    <div className="container-page py-10 sm:py-14">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-extrabold tracking-tight text-brand-text">
            انضم كصانع محتوى
          </h1>
          <p className="mt-3 text-sm text-brand-muted sm:text-base">
            شارك محتواك مع مجتمع Respect Land. املأ النموذج وسيقوم فريق الإدارة
            بمراجعة طلبك.
          </p>
        </div>
        <div className="rounded-2xl border border-brand-border bg-brand-surface p-6 sm:p-8">
          <ApplyForm
            categories={categories.map((c) => ({ slug: c.slug, name: c.name }))}
          />
        </div>
      </div>
    </div>
  );
}