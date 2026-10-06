import React, { useState } from "react";
import { cn } from "@/lib/utils";

const sizeClasses = {
  xs: "w-6 h-6 min-w-6 min-h-6 text-[10px]",
  sm: "w-8 h-8 min-w-8 min-h-8 text-xs",
  md: "w-10 h-10 min-w-10 min-h-10 text-sm",
  lg: "w-12 h-12 min-w-12 min-h-12 text-base",
  xl: "w-16 h-16 min-w-16 min-h-16 text-lg",
  "2xl": "w-24 h-24 min-w-24 min-h-24 text-2xl",
  "3xl": "w-32 h-32 min-w-32 min-h-32 sm:w-36 sm:h-36 sm:min-w-36 sm:min-h-36 text-2xl sm:text-3xl",
  "4xl": "w-36 h-36 min-w-36 min-h-36 sm:w-44 sm:h-44 sm:min-w-44 sm:min-h-44 md:w-48 md:h-48 md:min-w-48 md:min-h-48 text-3xl sm:text-4xl",
};

export function Avatar({
  src,
  alt = "",
  fallback = "U",
  size = "md",
  borderColor,
  className,
}) {
  const [hasError, setHasError] = useState(false);

  return (
    <div className="relative inline-flex items-center justify-center shrink-0 select-none">
      <div
        style={
          borderColor
            ? {
                borderColor,
                borderWidth: size === "4xl" || size === "3xl" ? "4px" : "3px",
                borderStyle: "solid",
                boxShadow: `0 0 24px ${borderColor}40`,
              }
            : {}
        }
        className={cn(
          "rounded-full overflow-hidden flex items-center justify-center font-bold bg-[#0d101a] border border-[var(--border-subtle)] text-[var(--text-secondary)] shadow-2xl transition-all aspect-square shrink-0",
          sizeClasses[size] || sizeClasses.md,
          className
        )}
      >
        {src && !hasError ? (
          <img
            src={src}
            alt={alt}
            onError={() => setHasError(true)}
            className="w-full h-full object-cover object-center aspect-square shrink-0 block pointer-events-none select-none"
          />
        ) : (
          <span className="select-none tracking-tight">{fallback?.slice(0, 2).toUpperCase()}</span>
        )}
      </div>
    </div>
  );
}


