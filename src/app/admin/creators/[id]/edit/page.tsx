import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getCategories, getCreatorById } from "@/lib/queries";
import { CreatorForm } from "@/components/admin/creator-form";

export const metadata: Metadata = { title: "تعديل صانع محتوى", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function EditCreatorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [creator, categories] = await Promise.all([
    getCreatorById(id),
    getCategories(),
  ]);
  if (!creator) notFound();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-brand-text">تعديل: {creator.name}</h1>
        <p className="mt-1 text-sm text-brand-muted">قم بتعديل بيانات صانع المحتوى.</p>
      </div>
      <CreatorForm
        categories={categories.map((c) => ({ id: c.id, name: c.name }))}
        initial={creator}
      />
    </div>
  );
}