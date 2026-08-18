import Link from "next/link";
import { Users, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getSiteSettings } from "@/lib/queries";

export async function CommunityCTA() {
  let settings = null;
  try {
    settings = await getSiteSettings();
  } catch {
    settings = null;
  }

  return (
    <section className="py-14">
      <div className="container-page">
        <div className="relative overflow-hidden rounded-3xl border border-brand-border bg-gradient-to-br from-brand-dark via-brand-surface to-brand-surface-2 px-6 py-14 text-center sm:px-12 sm:py-16">
          <div className="absolute inset-0 bg-grid opacity-40 [mask-image:radial-gradient(ellipse_50%_60%_at_50%_50%,black,transparent)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(34,197,94,0.15),transparent_60%)]" />
          <div className="relative">
            <span className="inline-flex items-center gap-2 rounded-full border border-brand-border bg-brand-surface px-3.5 py-1.5 text-xs font-medium text-brand-muted">
              <Users className="size-3.5 text-brand-green" />
              مجتمع Respect Land
            </span>
            <h2 className="mx-auto mt-5 max-w-xl text-balance text-3xl font-extrabold tracking-tight text-brand-text sm:text-4xl">
              {settings?.homeCtaTitle ?? "انضم إلى المجتمع"}
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-pretty text-sm leading-relaxed text-brand-muted sm:text-base">
              {settings?.homeCtaSubtitle ??
                "كن جزءًا من Respect Land وشارك تجربتك مع أفضل صناع المحتوى."}
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link href="/apply">
                <Button size="lg">
                  انضم كصانع محتوى
                  <ArrowLeft className="size-4" />
                </Button>
              </Link>
              {settings?.inviteLink && (
                <a
                  href={settings.inviteLink}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Button size="lg" variant="secondary">
                    تابعنا على Discord
                  </Button>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}