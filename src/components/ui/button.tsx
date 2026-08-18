import React from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost" | "outline";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
}

const base =
  "inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green disabled:opacity-50 disabled:pointer-events-none cursor-pointer select-none";

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-brand-green text-brand-bg hover:bg-brand-lime hover:text-brand-bg active:scale-[0.98] shadow-lg shadow-brand-green/15",
  secondary:
    "bg-brand-surface text-brand-text border border-brand-border hover:border-brand-green/40 hover:bg-brand-surface-2 active:scale-[0.98]",
  ghost: "text-brand-text hover:bg-brand-surface hover:text-brand-text",
  outline:
    "border border-brand-green/40 text-brand-green hover:bg-brand-green/10 active:scale-[0.98]",
};

const sizes: Record<ButtonSize, string> = {
  sm: "h-9 px-3.5 text-sm",
  md: "h-11 px-5 text-sm",
  lg: "h-12 px-6 text-base",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant = "primary", size = "md", isLoading, children, ...props },
    ref
  ) => (
    <button
      ref={ref}
      className={cn(base, variants[variant], sizes[size], className)}
      {...props}
    >
      {isLoading && (
        <span className="size-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
      )}
      {children}
    </button>
  )
);
Button.displayName = "Button";