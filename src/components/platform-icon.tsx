import React from "react";
import { cn } from "@/lib/utils";

type PlatformKey =
  | "youtube"
  | "tiktok"
  | "twitch"
  | "kick"
  | "instagram"
  | "discord"
  | "x";

export interface PlatformInfo {
  key: PlatformKey;
  label: string;
  color: string;
}

export const PLATFORMS: Record<PlatformKey, PlatformInfo> = {
  youtube: { key: "youtube", label: "YouTube", color: "#FF0000" },
  tiktok: { key: "tiktok", label: "TikTok", color: "#00F2EA" },
  twitch: { key: "twitch", label: "Twitch", color: "#9146FF" },
  kick: { key: "kick", label: "Kick", color: "#53FC18" },
  instagram: { key: "instagram", label: "Instagram", color: "#E4405F" },
  discord: { key: "discord", label: "Discord", color: "#5865F2" },
  x: { key: "x", label: "X", color: "#1DA1F2" },
};

export const PLATFORM_KEYS = Object.keys(PLATFORMS) as PlatformKey[];

function Stroke({ children }: { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-full"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

function Brand() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="size-full" aria-hidden="true">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M14.5 4.5c0 1.1.3 2.1.9 2.9.5-.4.8-1 .8-1.7a2 2 0 0 0-.8-1.6c1.4.4 2.5.9 3.3 1.6.8.7 1.2 1.7 1.2 2.9 0 1.4-.6 2.7-1.5 3.6-.6-.4-1-1-1.2-1.7l.6-2.4-2.2-.6c-.3.4-.6.8-1 1.1a6 6 0 1 1-1.2-4.6l.9.9zM10 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"
      />
    </svg>
  );
}

export function PlatformIcon({
  platform,
  className,
}: {
  platform: string;
  className?: string;
}) {
  const key = platform.toLowerCase() as PlatformKey;
  const size = "size-full";

  switch (key) {
    case "youtube":
      return (
        <Stroke>
          <path d="M2.5 17a24.1 24.1 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.6 49.6 0 0 1 16.2 0 2 2 0 0 1 1.4 1.4 24.1 24.1 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.6 49.6 0 0 1-16.2 0A2 2 0 0 1 2.5 17z" />
          <path d="m10 15 5-3-5-3z" />
        </Stroke>
      );
    case "twitch":
      return (
        <Stroke>
          <path d="M4 3h16v11l-4 4h-4l-3 3v-3H4z" />
          <path d="M14 8v4" />
          <path d="M10 8v4" />
        </Stroke>
      );
    case "tiktok":
      return <Brand />;
    case "kick":
      return (
        <Stroke>
          <path d="M6 3v18" />
          <path d="M18 9V6h-4v3" />
          <path d="M18 15v3h-4" />
          <path d="M6 12h6" />
        </Stroke>
      );
    case "instagram":
      return (
        <Stroke>
          <rect x="3" y="3" width="18" height="18" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
        </Stroke>
      );
    case "discord":
      return (
        <Stroke>
          <path d="M8 4 6 2v2H3.5a.5.5 0 0 0-.5.5v11a.5.5 0 0 0 .5.5H6l2 2 1.5-1.5" />
          <path d="M16 4l2-2v2h2.5a.5.5 0 0 1 .5.5v11a.5.5 0 0 1-.5.5H18l-2 2-1.5-1.5" />
          <path d="M8 11a1 1 0 1 0 0 .01" />
          <path d="M16 11a1 1 0 1 0 0 .01" />
          <path d="M8 13c1.3 1 2.7 1.5 4 1.5s2.7-.5 4-1.5" />
        </Stroke>
      );
    case "x":
      return (
        <Stroke>
          <path d="M4 4l16 16" />
          <path d="M20 4L4 20" />
        </Stroke>
      );
    default:
      return (
        <Brand />
      );
  }
}

export function PlatformBadge({
  platform,
  className,
}: {
  platform: string;
  className?: string;
}) {
  const info = PLATFORMS[platform.toLowerCase() as PlatformKey];
  const label = info?.label ?? platform;
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-lg border border-brand-border bg-brand-surface text-brand-muted transition-colors hover:border-brand-green/40 hover:text-brand-text",
        className
      )}
      title={label}
      aria-label={label}
    >
      <PlatformIcon platform={platform} />
    </span>
  );
}