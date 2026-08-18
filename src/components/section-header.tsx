import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

export function SectionHeader({
  title,
  subtitle,
  link,
  linkLabel,
  className,
}: {
  title: React.ReactNode;
  subtitle?: string;
  link?: string;
  linkLabel?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "mb-8 flex items-end justify-between gap-4",
        className
      )}
    >
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-brand-text sm:text-3xl">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-2 max-w-xl text-sm text-brand-muted sm:text-base">
            {subtitle}
          </p>
        )}
      </div>
      {link && (
        <Link
          href={link}
          className="group inline-flex shrink-0 items-center gap-1.5 text-sm font-medium text-brand-green transition-colors hover:text-brand-lime"
        >
          {linkLabel ?? "عرض الكل"}
          <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-0.5" />
        </Link>
      )}
    </div>
  );
}