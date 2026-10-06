import React from "react";
import { cn } from "@/lib/utils";

export function Skeleton({ className, ...props }) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-[var(--bg-surface-secondary)]/80 border border-[var(--border-subtle)]",
        className
      )}
      {...props}
    />
  );
}
