import React, { useState } from "react";
import { cn } from "@/lib/utils";

const sizeClasses = {
  xs: "w-6 h-6 text-[10px]",
  sm: "w-8 h-8 text-xs",
  md: "w-10 h-10 text-sm",
  lg: "w-12 h-12 text-base",
  xl: "w-16 h-16 text-lg",
  "2xl": "w-24 h-24 text-2xl",
};

export function Avatar({
  src,
  alt = "",
  fallback = "U",
  size = "md",
  status,
  borderColor,
  className,
}) {
  const [hasError, setHasError] = useState(false);

  return (
    <div className="relative inline-block select-none">
      <div
        style={borderColor ? { borderColor, borderWidth: "2px", borderStyle: "solid" } : {}}
        className={cn(
          "rounded-full overflow-hidden flex items-center justify-center font-bold bg-white/[0.05] border border-[var(--border-subtle)] text-[var(--text-secondary)] shadow-sm transition-all",
          sizeClasses[size] || sizeClasses.md,
          className
        )}
      >
        {src && !hasError ? (
          <img
            src={src}
            alt={alt}
            onError={() => setHasError(true)}
            className="w-full h-full object-cover"
          />
        ) : (
          <span>{fallback?.slice(0, 2).toUpperCase()}</span>
        )}
      </div>
      {status && (
        <span
          className={cn(
            "absolute bottom-0 right-0 block rounded-full ring-2 ring-[#06070a]",
            size === "xs" || size === "sm" ? "w-2 h-2" : "w-2.5 h-2.5",
            status === "online" && "bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.6)]",
            status === "idle" && "bg-amber-400",
            status === "offline" && "bg-[var(--text-muted)]"
          )}
        />
      )}
    </div>
  );
}
