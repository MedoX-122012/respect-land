import type { Metadata } from "next";
import { FavoritesList } from "@/components/favorites-list";

export const metadata: Metadata = {
  title: "المفضلة",
  description: "صانعو المحتوى الذين حفظتهم في قائمة المفضلة.",
};

export default function FavoritesPage() {
  return (
    <div className="container-page py-10 sm:py-14">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-brand-text">
          المفضلة
        </h1>
        <p className="mt-2 text-sm text-brand-muted sm:text-base">
          صناع المحتوى الذين حفظتهم لمشاهدتهم لاحقًا.
        </p>
      </div>
      <FavoritesList />
    </div>
  );
}