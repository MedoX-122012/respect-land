import { Suspense } from "react";
import Link from "next/link";
import { Megaphone } from "lucide-react";
import { getActiveAnnouncement } from "@/lib/queries";

export async function AnnouncementBanner() {
  let announcement = null;
  try {
    announcement = await getActiveAnnouncement();
  } catch {
    announcement = null;
  }

  if (!announcement) return null;

  return (
    <div className="border-b border-brand-border bg-brand-dark/60">
      <Link
        href="/creators"
        className="container-page flex items-center justify-center gap-2 py-2.5 text-center text-[13px] text-brand-green"
      >
        <Megaphone className="size-3.5 shrink-0" />
        <span className="font-medium">{announcement.title}</span>
        {announcement.description && (
          <span className="hidden text-brand-muted sm:inline">
            — {announcement.description}
          </span>
        )}
      </Link>
    </div>
  );
}

export function AnnouncementBannerSkeleton() {
  return <div className="skeleton h-8 w-full rounded-none" />;
}

export function AnnouncementLoading() {
  return (
    <Suspense fallback={<AnnouncementBannerSkeleton />}>
      <AnnouncementBanner />
    </Suspense>
  );
}