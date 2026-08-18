import React from "react";
import { cn } from "@/lib/utils";

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={cn(
      "h-11 w-full rounded-xl border border-brand-border bg-brand-bg/50 px-3.5 text-sm text-brand-text placeholder:text-brand-muted outline-none transition-colors focus:border-brand-green",
      className
    )}
    {...props}
  />
));
Input.displayName = "Input";

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      "w-full rounded-xl border border-brand-border bg-brand-bg/50 px-3.5 py-3 text-sm text-brand-text placeholder:text-brand-muted outline-none transition-colors focus:border-brand-green",
      className
    )}
    {...props}
  />
));
Textarea.displayName = "Textarea";

export function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-sm font-medium text-brand-text">{label}</span>
      {children}
      {hint && <span className="text-xs text-brand-muted">{hint}</span>}
    </label>
  );
}