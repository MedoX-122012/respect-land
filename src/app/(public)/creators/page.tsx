import type { Metadata } from "next";
import { getCategories, getSiteSettings } from "@/lib/queries";
import { CreatorDirectory } from "@/components/creator-directory";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings().catch(() => null);
  return {
    title: "صناع المحتوى",
    description: `تصفح وابحث عن أفضل صناع المحتوى في ${
      settings?.siteName ?? "Respect Land"
    }.`,
  };
}

export default async function CreatorsPage() {
  const categories = await getCategories();
  return (
    <div className="container-page py-10 sm:py-14">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-brand-text">
          صناع المحتوى
        </h1>
        <p className="mt-2 text-sm text-brand-muted sm:text-base">
          اكتشف أفضل صناع المحتوى في مجتمع Respect Land.
        </p>
      </div>
      <CreatorDirectory
        categories={categories.map((c) => ({ slug: c.slug, name: c.name }))}
      />
    </div>
  );
}