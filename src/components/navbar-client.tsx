"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Heart, Menu, X } from "lucide-react";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "الرئيسية" },
  { href: "/creators", label: "صناع المحتوى" },
  { href: "/categories", label: "التصنيفات" },
  { href: "/leaderboard", label: "المتصدرون" },
  { href: "/about", label: "عن Respect Land" },
];

export function NavbarClient() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled
          ? "border-b border-brand-border bg-brand-bg/80 backdrop-blur-xl"
          : "bg-transparent"
      )}
    >
      <nav className="container-page flex h-16 items-center justify-between gap-4">
        <Link href="/" aria-label="Respect Land - الرئيسية" className="shrink-0">
          <Logo size={32} />
        </Link>

        {/* Desktop nav */}
        <ul className="hidden items-center gap-1 lg:flex">
          {links.map((l) => {
            const active = pathname === l.href;
            return (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className={cn(
                    "relative rounded-lg px-3.5 py-2 text-sm font-medium transition-colors",
                    active
                      ? "text-brand-text"
                      : "text-brand-muted hover:text-brand-text"
                  )}
                >
                  {l.label}
                  {active && (
                    <span className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-brand-green" />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Right actions */}
        <div className="flex items-center gap-1.5">
          <Link
            href="/creators"
            className="inline-flex size-10 items-center justify-center rounded-xl text-brand-muted transition-colors hover:bg-brand-surface hover:text-brand-text"
            aria-label="بحث"
            title="بحث"
          >
            <Search className="size-5" />
          </Link>
          <Link
            href="/favorites"
            className="inline-flex size-10 items-center justify-center rounded-xl text-brand-muted transition-colors hover:bg-brand-surface hover:text-brand-text"
            aria-label="المفضلة"
            title="المفضلة"
          >
            <Heart className="size-5" />
          </Link>
          <Link href="/creators" className="hidden sm:block">
            <Button size="sm">اكتشف الآن</Button>
          </Link>
          <button
            onClick={() => setOpen((o) => !o)}
            className="inline-flex size-10 items-center justify-center rounded-xl text-brand-text transition-colors hover:bg-brand-surface lg:hidden"
            aria-label={open ? "إغلاق القائمة" : "فتح القائمة"}
            aria-expanded={open}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <div
        className={cn(
          "lg:hidden fixed inset-x-0 top-16 bottom-0 z-40 bg-brand-bg/95 backdrop-blur-xl transition-all duration-300",
          open
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        )}
      >
        <div className="container-page flex flex-col gap-1 pt-6">
          {links.map((l, i) => {
            const active = pathname === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                className={cn(
                  "flex items-center justify-between rounded-xl px-4 py-4 text-lg font-semibold transition-all",
                  active
                    ? "bg-brand-surface text-brand-lime"
                    : "text-brand-text hover:bg-brand-surface"
                )}
                style={{
                  transitionDelay: open ? `${i * 40}ms` : "0ms",
                  opacity: open ? 1 : 0,
                  transform: open ? "translateY(0)" : "translateY(12px)",
                }}
              >
                {l.label}
                <span className="text-brand-muted">‹</span>
              </Link>
            );
          })}
          <div className="mt-6 flex flex-col gap-3">
            <Link href="/creators">
              <Button className="w-full" size="lg">
                اكتشف الآن
              </Button>
            </Link>
            <Link
              href="/favorites"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-brand-border text-brand-muted transition-colors hover:bg-brand-surface hover:text-brand-text"
            >
              <Heart className="size-5" />
              المفضلة
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}