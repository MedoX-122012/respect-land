import Link from "next/link";
import { Settings } from "lucide-react";
import { Logo } from "@/components/logo";
import { PlatformIcon, PLATFORMS } from "@/components/platform-icon";
import { getSiteSettings } from "@/lib/queries";

const navLinks = [
  { href: "/", label: "الرئيسية" },
  { href: "/creators", label: "صناع المحتوى" },
  { href: "/categories", label: "التصنيفات" },
  { href: "/leaderboard", label: "المتصدرون" },
  { href: "/about", label: "عن Respect Land" },
];

const adminLink = { href: "/login", label: "لوحة التحكم" };

export async function Footer() {
  let settings = null;
  try {
    settings = await getSiteSettings();
  } catch {
    settings = null;
  }
  const socials: Record<string, string> =
    (settings?.socialLinks as Record<string, string>) ?? {};

  return (
    <footer className="mt-24 border-t border-brand-border">
      <div className="container-page py-14">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div className="max-w-sm">
            <Logo size={34} />
            <p className="mt-4 text-sm leading-relaxed text-brand-muted">
              {settings?.description ??
                "مجتمع يجمع صناع المحتوى ويمنحهم مساحة يستحقونها."}
            </p>
            {settings?.inviteLink && (
              <a
                href={settings.inviteLink}
                target="_blank"
                rel="noreferrer"
                className="mt-5 inline-flex h-10 items-center gap-2 rounded-xl border border-brand-green/30 bg-brand-green/10 px-4 text-sm font-medium text-brand-green transition-colors hover:bg-brand-green/20"
              >
                انضم إلى المجتمع
              </a>
            )}
          </div>

          <div>
            <h3 className="text-sm font-semibold text-brand-text">روابط سريعة</h3>
            <ul className="mt-4 space-y-2.5">
              {navLinks.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-brand-muted transition-colors hover:text-brand-green"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
              <li className="pt-2">
                <Link
                  href={adminLink.href}
                  className="inline-flex items-center gap-1.5 text-sm text-brand-muted transition-colors hover:text-brand-green"
                >
                  <Settings className="size-4" />
                  {adminLink.label}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-brand-text">تابعنا</h3>
            <div className="mt-4 flex flex-wrap gap-2">
              {Object.entries(socials).map(([key, url]) => {
                if (!PLATFORMS[key as keyof typeof PLATFORMS]) return null;
                return (
                  <a
                    key={key}
                    href={url}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={PLATFORMS[key as keyof typeof PLATFORMS].label}
                    className="inline-flex size-10 items-center justify-center rounded-xl border border-brand-border bg-brand-surface text-brand-muted transition-all hover:border-brand-green/40 hover:text-brand-green"
                  >
                    <span className="size-5">
                      <PlatformIcon platform={key} />
                    </span>
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center gap-4 border-t border-brand-border pt-6 text-sm text-brand-muted sm:flex-row sm:justify-between">
          <p dir="ltr">© {new Date().getFullYear()} Respect Land. All rights reserved.</p>
          <p className="font-medium text-brand-muted/80">
            {settings?.footerText ?? "صُنع بأيادي عربية 🇪🇬"}
          </p>
        </div>
      </div>
    </footer>
  );
}
