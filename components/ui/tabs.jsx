"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { activeTabTransition } from "@/lib/animations";

export function Tabs({
  tabs = [],
  activeTab,
  onChange,
  className,
  variant = "pills", // 'pills' | 'underline'
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-1",
        variant === "pills" && "p-1 bg-[var(--bg-surface-primary)] border border-[var(--border-subtle)] rounded-lg w-fit",
        variant === "underline" && "border-b border-[var(--border-subtle)] w-full gap-6",
        className
      )}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange?.(tab.id)}
            className={cn(
              "relative px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer select-none focus-ring rounded-md",
              isActive
                ? "text-[var(--text-primary)]"
                : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]",
              variant === "underline" && "pb-2.5 rounded-none px-0"
            )}
          >
            {isActive && variant === "pills" && (
              <motion.div
                layoutId="activeTabPill"
                className="absolute inset-0 bg-[var(--bg-surface-elevated)] border border-[var(--border-muted)] rounded-md shadow-xs"
                transition={activeTabTransition}
              />
            )}
            {isActive && variant === "underline" && (
              <motion.div
                layoutId="activeTabUnderline"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--accent-primary)]"
                transition={activeTabTransition}
              />
            )}
            <span className="relative z-10 flex items-center gap-1.5">
              {tab.icon}
              {tab.label}
              {tab.count !== undefined && (
                <span className="px-1.5 py-0.2 text-[10px] rounded-full bg-[var(--bg-surface-secondary)] text-[var(--text-muted)]">
                  {tab.count}
                </span>
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
}
