import React from "react";
import { cn } from "@/lib/utils";

export function Progress({
  value = 0,
  max = 100,
  className,
  barClassName,
  showLabel = false,
}) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className="w-full space-y-1.5">
      {showLabel && (
        <div className="flex justify-between text-xs text-[var(--text-secondary)] font-medium">
          <span>Progress</span>
          <span className="font-code text-[var(--text-primary)] font-semibold">{Math.round(percentage)}%</span>
        </div>
      )}
      <div
        className={cn(
          "w-full h-2 bg-white/[0.05] rounded-full overflow-hidden border border-white/[0.06] p-[1px]",
          className
        )}
      >
        <div
          className={cn(
            "h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 rounded-full transition-all duration-400 ease-out shadow-sm shadow-indigo-500/30",
            barClassName
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
