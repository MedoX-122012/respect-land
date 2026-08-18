import type { Metadata } from "next";
import { getCategories } from "@/lib/queries";
import { CreatorForm } from "@/components/admin/creator-form";

export const metadata: Metadata = { title: "إضافة صانع محتوى", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function NewCreatorPage() {
  const categories = await getCategories();
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-brand-text">إضافة صانع محتوى</h1>
        <p className="mt-1 text-sm text-brand-muted">
          أضف صانع محتوى جديد إلى المنصة.
        </p>
      </div>
      <CreatorForm categories={categories.map((c) => ({ id: c.id, name: c.name }))} />
    </div>
  );
}