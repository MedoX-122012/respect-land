import { cn } from "@/lib/utils";

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("skeleton", className)} />;
}

export function CreatorCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-brand-border bg-brand-surface p-4">
      <Skeleton className="h-24 w-full" />
      <div className="-mt-8 flex items-end gap-3 px-1">
        <Skeleton className="size-16 rounded-2xl" />
        <div className="flex-1 space-y-2 pb-1">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>
      <div className="mt-4 space-y-2">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-2/3" />
      </div>
      <div className="mt-4 flex gap-2">
        <Skeleton className="size-7 rounded-md" />
        <Skeleton className="size-7 rounded-md" />
        <Skeleton className="size-7 rounded-md" />
      </div>
      <Skeleton className="mt-4 h-10 w-full rounded-xl" />
    </div>
  );
}

export function CreatorGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <CreatorCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function StatSkeleton() {
  return <Skeleton className="h-20 rounded-2xl" />;
}
