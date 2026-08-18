import { cn } from "@/lib/utils";

/**
 * Respect Land geometric monogram: a bold "R" formed from angular strokes,
 * framed in a rounded tile. Recognizable without the wordmark.
 */
export function LogoMark({
  className,
  size = 40,
}: {
  className?: string;
  size?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("shrink-0", className)}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="rl-tile" x1="0" y1="0" x2="48" y2="48">
          <stop offset="0" stopColor="#102217" />
          <stop offset="0.55" stopColor="#0B0F0D" />
          <stop offset="1" stopColor="#102217" />
        </linearGradient>
        <linearGradient id="rl-r" x1="0" y1="0" x2="0" y2="48">
          <stop offset="0" stopColor="#A3E635" />
          <stop offset="1" stopColor="#22C55E" />
        </linearGradient>
      </defs>
      <rect
        x="2"
        y="2"
        width="44"
        height="44"
        rx="13"
        fill="url(#rl-tile)"
        stroke="rgba(255,255,255,0.12)"
        strokeWidth="1.5"
      />
      {/* R glyph */}
      <path
        d="M15 36V12h10.6c3.1 0 5.4.7 7 2s2.5 3.1 2.5 5.4c0 1.8-.5 3.3-1.6 4.6-1 1.2-2.4 2.1-4.1 2.6 2 .2 3.7.8 5.1 1.7 1 .7 1.6 1.6 1.9 2.7l1.6 5h-5.2l-1.3-4.5c-.4-1.5-.9-2.5-1.5-3-.7-.6-1.7-.9-3-.9H22.8V36H15zm7.8-6.3h2.4c2.4 0 4.1-.6 5.1-1.7 1-1.1 1.4-2.5 1.4-4.2 0-1.7-.4-3-1.2-3.8-.8-.8-2.2-1.2-4.3-1.2h-3.4V29.7z"
        fill="url(#rl-r)"
        fillRule="evenodd"
      />
    </svg>
  );
}

export function Logo({
  className,
  size = 32,
  showText = true,
}: {
  className?: string;
  size?: number;
  showText?: boolean;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark size={size} />
      {showText && (
        <span dir="ltr" className="font-bold text-lg tracking-tight text-brand-text flex items-baseline gap-1.5">
          Respect
          <span className="text-brand-green font-extrabold">Land</span>
        </span>
      )}
    </span>
  );
}