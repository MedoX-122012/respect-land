"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export function Modal({
  open,
  onClose,
  title,
  children,
  footer,
  destructive,
}: {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  destructive?: boolean;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />
      <div
        className={cn(
          "relative w-full max-w-lg rounded-2xl border border-brand-border bg-brand-surface p-6 shadow-2xl animate-scale-in",
          destructive && "border-red-500/30"
        )}
      >
        {title && (
          <div className="mb-4 flex items-start justify-between">
            <h3 className="text-lg font-bold text-brand-text">{title}</h3>
            <button
              onClick={onClose}
              className="flex size-8 items-center justify-center rounded-lg text-brand-muted transition-colors hover:bg-brand-border hover:text-brand-text"
              aria-label="إغلاق"
            >
              <X className="size-4" />
            </button>
          </div>
        )}
        <div className="text-sm text-brand-muted">{children}</div>
        {footer && (
          <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}