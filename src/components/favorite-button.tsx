"use client";

import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { getFavorites, toggleFavorite } from "@/lib/favorites";
import { useToast } from "@/components/ui/toast";

export function FavoriteButton({
  creatorId,
  className,
}: {
  creatorId: string;
  className?: string;
}) {
  const [active, setActive] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setActive(getFavorites().includes(creatorId));
  }, [creatorId]);

  const handle = () => {
    const nowActive = toggleFavorite(creatorId);
    setActive(nowActive);
    toast(nowActive ? "تمت الإضافة إلى المفضلة" : "تمت الإزالة من المفضلة", "info");
  };

  return (
    <button
      onClick={handle}
      aria-label={active ? "إزالة من المفضلة" : "إضافة إلى المفضلة"}
      aria-pressed={active}
      title={active ? "إزالة من المفضلة" : "إضافة إلى المفضلة"}
      className={cn(
        "inline-flex size-9 items-center justify-center rounded-full border border-brand-border bg-brand-bg/70 text-brand-muted backdrop-blur transition-all duration-200 hover:scale-110 hover:text-brand-text active:scale-95",
        active && "border-brand-green/40 text-brand-green",
        className
      )}
    >
      <Heart
        className={cn("size-4 transition-transform", active && "fill-brand-green")}
      />
    </button>
  );
}