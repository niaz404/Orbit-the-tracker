import React from "react";
import { cn } from "@/lib/utils";

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center p-8 sm:p-12 rounded-lg border border-dashed border-[var(--border-muted)] bg-[var(--bg-surface-primary)]/40",
        className
      )}
    >
      {icon && (
        <div className="w-10 h-10 rounded-full bg-[var(--bg-surface-secondary)] border border-[var(--border-subtle)] flex items-center justify-center text-[var(--text-muted)] mb-3">
          {icon}
        </div>
      )}
      <h4 className="text-sm font-semibold text-[var(--text-primary)] mb-1">
        {title}
      </h4>
      {description && (
        <p className="text-xs text-[var(--text-secondary)] max-w-sm mb-4 leading-relaxed">
          {description}
        </p>
      )}
      {action && <div className="mt-1">{action}</div>}
    </div>
  );
}
