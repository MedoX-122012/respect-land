"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Users,
  Layers,
  Inbox,
  BarChart3,
  History,
  Settings,
  ExternalLink,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { Logo } from "@/components/logo";
import { useState } from "react";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/admin", label: "نظرة عامة", icon: LayoutDashboard },
  { href: "/admin/creators", label: "صناع المحتوى", icon: Users },
  { href: "/admin/categories", label: "التصنيفات", icon: Layers },
  { href: "/admin/applications", label: "طلبات الانضمام", icon: Inbox },
  { href: "/admin/users", label: "المستخدمون", icon: Users },
  { href: "/admin/analytics", label: "التحليلات", icon: BarChart3 },
  { href: "/admin/activity", label: "سجل النشاط", icon: History },
  { href: "/admin/settings", label: "الإعدادات", icon: Settings },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const sidebar = (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center px-5">
        <Link href="/admin">
          <Logo size={32} />
        </Link>
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {nav.map((item) => {
          const active =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-brand-green/10 text-brand-lime"
                  : "text-brand-muted hover:bg-brand-surface hover:text-brand-text"
              )}
            >
              <item.icon className="size-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="space-y-1 border-t border-brand-border p-3">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm text-brand-muted transition-colors hover:bg-brand-surface hover:text-brand-text"
        >
          <ExternalLink className="size-4" />
          عرض الموقع
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm text-brand-muted transition-colors hover:bg-red-500/10 hover:text-red-400"
        >
          <LogOut className="size-4" />
          تسجيل الخروج
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen">
      {/* Mobile topbar */}
      <div className="flex h-14 items-center justify-between border-b border-brand-border bg-brand-surface/80 px-4 lg:hidden">
        <Link href="/admin">
          <Logo size={28} />
        </Link>
        <button
          onClick={() => setOpen((o) => !o)}
          className="flex size-9 items-center justify-center rounded-lg text-brand-muted"
          aria-label="القائمة"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 right-0 z-40 hidden w-64 border-l border-brand-border bg-brand-bg lg:block">
        {sidebar}
      </aside>

      {/* Mobile drawer */}
      <div
        className={cn(
          "fixed inset-y-0 right-0 z-40 w-72 bg-brand-bg transition-transform duration-300 lg:hidden",
          open ? "translate-x-0" : "translate-x-full"
        )}
      >
        {sidebar}
      </div>

      <main className="px-4 py-6 sm:px-8 lg:mr-64 lg:px-10 lg:py-10">
        {children}
      </main>
    </div>
  );
}