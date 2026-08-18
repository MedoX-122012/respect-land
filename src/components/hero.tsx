import Link from "next/link";
import { Users, Layers, Eye, Globe, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnimatedCounter } from "@/components/stat-counter";
import { getLiveStats } from "@/lib/queries";
import type { LiveStats } from "@/lib/queries";

const statConfig: {
  key: keyof LiveStats;
  label: string;
  icon: React.ReactNode;
  suffix?: string;
}[] = [
  { key: "creators", label: "صناع المحتوى", icon: <Users className="size-4" /> },
  { key: "categories", label: "التصنيفات", icon: <Layers className="size-4" /> },
  { key: "views", label: "المشاهدات", icon: <Eye className="size-4" /> },
  { key: "platforms", label: "المنصات", icon: <Globe className="size-4" /> },
];

export async function Hero() {
  let stats: LiveStats = { creators: 0, categories: 0, views: 0, platforms: 0 };
  try {
    stats = await getLiveStats();
  } catch {
    stats = { creators: 0, categories: 0, views: 0, platforms: 0 };
  }

  return (
    <section className="relative overflow-hidden">
      {/* Background layers */}
      <div className="absolute inset-0 bg-grid [mask-image:radial-gradient(ellipse_60%_50%_at_50%_20%,black,transparent)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-10%,rgba(34,197,94,0.12),transparent_55%)]" />
      <div className="pointer-events-none absolute inset-0">
        <span className="absolute left-[15%] top-[30%] size-1 rounded-full bg-brand-green/40 animate-pulse" />
        <span className="absolute right-[20%] top-[45%] size-1.5 rounded-full bg-brand-lime/50 animate-pulse" style={{ animationDelay: "1s" }} />
        <span className="absolute left-[45%] top-[60%] size-1 rounded-full bg-brand-green/30 animate-pulse" style={{ animationDelay: "0.5s" }} />
        <span className="absolute right-[35%] top-[25%] size-[3px] rounded-full bg-brand-lime/40 animate-pulse" style={{ animationDelay: "1.4s" }} />
      </div>

      <div className="container-page relative flex flex-col items-center py-28 text-center sm:py-36">
        {/* Community badge */}
        <span className="inline-flex items-center gap-2 rounded-full border border-brand-border bg-brand-surface px-3.5 py-1.5 text-xs font-medium text-brand-muted animate-fade-in">
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-brand-green opacity-60" />
            <span className="relative inline-flex size-2 rounded-full bg-brand-green" />
          </span>
          مجتمع Respect Land
        </span>

        <h1 className="mt-6 max-w-3xl text-balance text-4xl font-extrabold leading-[1.15] tracking-tight text-brand-text sm:text-5xl lg:text-6xl animate-fade-up">
          اكتشف صناع المحتوى في{" "}
          <span className="bg-gradient-to-l from-brand-lime to-brand-green bg-clip-text text-transparent">
            Respect Land
          </span>
        </h1>

        <p className="mt-6 max-w-xl text-pretty text-base leading-relaxed text-brand-muted sm:text-lg animate-fade-up" style={{ animationDelay: "100ms" }}>
          مكان واحد يجمع صناع المحتوى المميزين في مجتمع Respect Land.
        </p>

        <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row animate-fade-up" style={{ animationDelay: "180ms" }}>
          <Link href="/creators">
            <Button size="lg" className="w-full sm:w-auto">
              استكشف صناع المحتوى
              <ArrowLeft className="size-4" />
            </Button>
          </Link>
          <Link href="/apply">
            <Button size="lg" variant="secondary" className="w-full sm:w-auto">
              انضم إلى المجتمع
            </Button>
          </Link>
        </div>

        {/* Live statistics */}
        <div className="mt-16 grid w-full max-w-3xl grid-cols-2 gap-3 sm:grid-cols-4 animate-fade-up" style={{ animationDelay: "260ms" }}>
          {statConfig.map((s) => (
            <div
              key={s.key}
              className="flex flex-col items-center gap-1.5 rounded-2xl border border-brand-border bg-brand-surface/60 px-4 py-5 backdrop-blur transition-colors hover:border-brand-green/30"
            >
              <span className="flex items-center gap-1.5 text-xs text-brand-muted">
                {s.icon}
                {s.label}
              </span>
              <span className="text-2xl font-bold tabular-nums text-brand-text">
                <AnimatedCounter value={stats[s.key]} />
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
