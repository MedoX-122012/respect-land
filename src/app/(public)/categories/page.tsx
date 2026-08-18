import type { Metadata } from "next";
import { CategoriesGrid } from "@/components/categories-grid";
import { getSiteSettings } from "@/lib/queries";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings().catch(() => null);
  return {
    title: "التصنيفات",
    description: `استكشف التصنيفات والمجتمعات في ${
      settings?.siteName ?? "Respect Land"
    }.`,
  };
}

export default function CategoriesPage() {
  return (
    <div className="container-page py-10 sm:py-14">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-brand-text">
          التصنيفات
        </h1>
        <p className="mt-2 text-sm text-brand-muted sm:text-base">
          استكشف المجتمعات التي ينتمي إليها صناع المحتوى في Respect Land.
        </p>
      </div>
      <CategoriesGrid />
    </div>
  );
}