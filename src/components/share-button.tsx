"use client";

import { useState } from "react";
import { Check, Link as LinkIcon, Share2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/toast";

export function ShareButton({
  url,
  title,
  className,
  label,
}: {
  url: string;
  title?: string;
  className?: string;
  label?: string;
}) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      const el = document.createElement("textarea");
      el.value = url;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
    }
    setCopied(true);
    toast("تم نسخ الرابط بنجاح");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClick = async () => {
    const nav = navigator as Navigator & { share?: (d: ShareData) => Promise<void> };
    if (nav.share) {
      try {
        await nav.share({ url, title });
        return;
      } catch {
        // fallback to copy if user cancels or unsupported
      }
    }
    copy();
  };

  if (label) {
    return (
      <button
        onClick={handleClick}
        className={cn(
          "inline-flex items-center gap-2 rounded-xl border border-brand-border bg-brand-surface px-4 py-2 text-sm font-medium text-brand-text transition-all hover:border-brand-green/40 hover:bg-brand-surface-2 active:scale-[0.98]",
          className
        )}
      >
        {copied ? (
          <Check className="size-4 text-brand-green" />
        ) : (
          <Share2 className="size-4" />
        )}
        {label}
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      aria-label="مشاركة الملف"
      title="مشاركة"
      className={cn(
        "inline-flex size-9 items-center justify-center rounded-full border border-brand-border bg-brand-bg/70 text-brand-muted backdrop-blur transition-all duration-200 hover:scale-110 hover:text-brand-text active:scale-95",
        className
      )}
    >
      {copied ? (
        <Check className="size-4 text-brand-green" />
      ) : (
        <LinkIcon className="size-4" />
      )}
    </button>
  );
}