import { cn } from "@/lib/utils";

export function AdminStatCard({
  label,
  value,
  icon,
  className,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col justify-between gap-4 rounded-2xl border border-brand-border bg-brand-surface p-5",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs text-brand-muted">{label}</span>
        <span className="flex size-8 items-center justify-center rounded-lg bg-brand-green/10 text-brand-green">
          {icon}
        </span>
      </div>
      <p className="text-2xl font-bold tabular-nums text-brand-text">
        {new Intl.NumberFormat("ar-EG").format(value)}
      </p>
    </div>
  );
}