import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export function EmptyState({
  title,
  description,
  actionHref,
  actionLabel,
  icon,
}: {
  title: string;
  description?: string;
  actionHref?: string;
  actionLabel?: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-brand-border bg-brand-surface/40 px-6 py-16 text-center">
      {icon && (
        <div className="mb-4 flex size-14 items-center justify-center rounded-2xl border border-brand-border bg-brand-surface text-brand-muted">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-semibold text-brand-text">{title}</h3>
      {description && (
        <p className="mt-2 max-w-sm text-sm text-brand-muted">{description}</p>
      )}
      {actionHref && actionLabel && (
        <Link
          href={actionHref}
          className="mt-6 inline-flex items-center gap-1.5 rounded-xl bg-brand-green px-4 py-2.5 text-sm font-medium text-brand-bg transition-colors hover:bg-brand-lime"
        >
          {actionLabel}
          <ArrowLeft className="size-4" />
        </Link>
      )}
    </div>
  );
}