import React from "react";
import { cn } from "@/lib/utils";

const cardVariants = {
  primary:
    "glass-panel text-[var(--text-primary)] rounded-2xl shadow-xl shadow-black/30",
  secondary:
    "bg-[var(--bg-surface-secondary)] backdrop-blur-xl border border-[var(--border-subtle)] text-[var(--text-primary)] rounded-2xl",
  elevated:
    "bg-[var(--bg-surface-elevated)] backdrop-blur-2xl border border-[var(--border-muted)] text-[var(--text-primary)] rounded-2xl shadow-2xl shadow-black/60",
  interactive:
    "glass-panel-interactive text-[var(--text-primary)] rounded-2xl cursor-pointer select-none",
};

export const Card = React.forwardRef(
  ({ className, variant = "primary", children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "relative overflow-hidden",
          cardVariants[variant] || cardVariants.primary,
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
Card.displayName = "Card";

export function CardHeader({ className, children, ...props }) {
  return (
    <div
      className={cn(
        "flex flex-col space-y-1.5 p-5 sm:p-6 border-b border-[var(--border-subtle)] bg-white/[0.01]",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardTitle({ className, children, ...props }) {
  return (
    <h3
      className={cn(
        "text-base font-semibold text-[var(--text-primary)] tracking-tight",
        className
      )}
      {...props}
    >
      {children}
    </h3>
  );
}

export function CardDescription({ className, children, ...props }) {
  return (
    <p
      className={cn("text-xs text-[var(--text-secondary)] leading-relaxed", className)}
      {...props}
    >
      {children}
    </p>
  );
}

export function CardContent({ className, children, ...props }) {
  return (
    <div className={cn("p-5 sm:p-6", className)} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({ className, children, ...props }) {
  return (
    <div
      className={cn(
        "flex items-center p-4 sm:p-5 border-t border-[var(--border-subtle)] bg-white/[0.02]",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
