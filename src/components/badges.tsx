import { BadgeCheck, Sparkles, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

export function VerifiedBadge({
  className,
  size = "size-4",
}: {
  className?: string;
  size?: string;
}) {
  return (
    <BadgeCheck
      className={cn("fill-brand-green text-brand-bg", size, className)}
      aria-label="موثق"
    />
  );
}

export function FeaturedBadge({
  className,
}: {
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full bg-brand-lime/15 px-2.5 py-1 text-[11px] font-semibold text-brand-lime",
        className
      )}
    >
      <Sparkles className="size-3" />
      مميز
    </span>
  );
}

export function NewBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full bg-brand-green/15 px-2.5 py-1 text-[11px] font-semibold text-brand-green",
        className
      )}
    >
      <Zap className="size-3" />
      جديد
    </span>
  );
}