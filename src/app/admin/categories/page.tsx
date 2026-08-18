import type { Metadata } from "next";
import { CategoriesManager } from "@/components/admin/categories-manager";

export const metadata: Metadata = { title: "إدارة التصنيفات", robots: { index: false } };
export const dynamic = "force-dynamic";

export default function AdminCategoriesPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-brand-text">التصنيفات</h1>
        <p className="mt-1 text-sm text-brand-muted">
          إضافة وتعديل وحذف وترتيب التصنيفات.
        </p>
      </div>
      <CategoriesManager />
    </div>
  );
}