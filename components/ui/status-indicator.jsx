import React from "react";
import { cn } from "@/lib/utils";

const statusConfigs = {
  active: {
    color: "bg-[var(--status-success)]",
    ring: "bg-[var(--status-success)]/20",
    label: "Active",
  },
  idle: {
    color: "bg-[var(--status-warning)]",
    ring: "bg-[var(--status-warning)]/20",
    label: "Idle",
  },
  error: {
    color: "bg-[var(--status-error)]",
    ring: "bg-[var(--status-error)]/20",
    label: "Failed",
  },
  accepted: {
    color: "bg-[var(--status-success)]",
    ring: "bg-[var(--status-success)]/20",
    label: "Accepted",
  },
  rejected: {
    color: "bg-[var(--status-error)]",
    ring: "bg-[var(--status-error)]/20",
    label: "Wrong Answer",
  },
  syncing: {
    color: "bg-[var(--accent-primary)]",
    ring: "bg-[var(--accent-primary)]/20",
    label: "Syncing",
  },
  neutral: {
    color: "bg-[var(--text-muted)]",
    ring: "bg-[var(--text-muted)]/20",
    label: "Neutral",
  },
};

export function StatusIndicator({
  status = "active",
  pulse = false,
  label,
  className,
}) {
  const config = statusConfigs[status] || statusConfigs.neutral;
  const displayLabel = label ?? config.label;

  return (
    <span className={cn("inline-flex items-center gap-2 text-xs text-[var(--text-secondary)]", className)}>
      <span className="relative flex h-2 w-2">
        {pulse && (
          <span
            className={cn(
              "animate-ping absolute inline-flex h-full w-full rounded-full opacity-75",
              config.color
            )}
          />
        )}
        <span
          className={cn(
            "relative inline-flex rounded-full h-2 w-2",
            config.color
          )}
        />
      </span>
      {displayLabel && <span>{displayLabel}</span>}
    </span>
  );
}
