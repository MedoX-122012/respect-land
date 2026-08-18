import type { Metadata } from "next";
import { getCategories } from "@/lib/queries";
import { CreatorsManager } from "@/components/admin/creators-manager";

export const metadata: Metadata = {
  title: "إدارة صناع المحتوى",
  robots: { index: false },
};

export const dynamic = "force-dynamic";

export default async function AdminCreatorsPage() {
  const categories = await getCategories();
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-brand-text">صناع المحتوى</h1>
        <p className="mt-1 text-sm text-brand-muted">
          إدارة جميع صناع المحتوى في المنصة.
        </p>
      </div>
      <CreatorsManager
        categories={categories.map((c) => ({ id: c.id, name: c.name }))}
      />
    </div>
  );
}