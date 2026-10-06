"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { slideUp } from "@/lib/animations";

export function PageHeader({
  title,
  description,
  badge,
  actions,
  breadcrumbs,
  className,
}) {
  return (
    <motion.div
      variants={slideUp}
      initial="hidden"
      animate="visible"
      className={cn(
        "flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[var(--border-subtle)]",
        className
      )}
    >
      <div className="space-y-1">
        {breadcrumbs && (
          <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] mb-1">
            {breadcrumbs}
          </div>
        )}
        <div className="flex items-center gap-2.5">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--text-primary)]">
            {title}
          </h1>
          {badge && <div>{badge}</div>}
        </div>
        {description && (
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] max-w-2xl leading-relaxed">
            {description}
          </p>
        )}
      </div>

      {actions && (
        <div className="flex items-center gap-2.5 shrink-0 self-start sm:self-center">
          {actions}
        </div>
      )}
    </motion.div>
  );
}
