import React from "react";
import { cn } from "@/lib/utils";

export const Select = React.forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement>
>(({ className, children, ...props }, ref) => (
  <select
    ref={ref}
    className={cn(
      "h-11 w-full cursor-pointer rounded-xl border border-brand-border bg-brand-bg/50 px-3.5 text-sm text-brand-text outline-none transition-colors focus:border-brand-green",
      className
    )}
    {...props}
  >
    {children}
  </select>
));
Select.displayName = "Select";

export const Switch = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
  <label className={cn("relative inline-flex h-6 w-11 cursor-pointer items-center", className)}>
    <input ref={ref} type="checkbox" className="peer sr-only" {...props} />
    <span className="absolute inset-0 rounded-full bg-brand-border transition-colors peer-checked:bg-brand-green" />
    <span className="absolute right-0.5 size-5 translate-x-0 rounded-full bg-brand-text transition-transform peer-checked:translate-x-[-20px]" />
  </label>
));
Switch.displayName = "Switch";