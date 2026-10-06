"use client";

import React from "react";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function Pagination({
  currentPage = 1,
  totalItems = 0,
  pageSize = 50,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [25, 50, 100],
  className,
}) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const validPage = Math.min(Math.max(1, currentPage), totalPages);

  const startItem = totalItems === 0 ? 0 : (validPage - 1) * pageSize + 1;
  const endItem = Math.min(validPage * pageSize, totalItems);

  // Generate pagination items with ellipsis
  const getPageNumbers = () => {
    const delta = 2; // number of pages around current
    const range = [];
    for (
      let i = Math.max(2, validPage - delta);
      i <= Math.min(totalPages - 1, validPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (validPage - delta > 2) {
      range.unshift("...");
    }
    if (validPage + delta < totalPages - 1) {
      range.push("...");
    }

    range.unshift(1);
    if (totalPages > 1) {
      range.push(totalPages);
    }

    return range;
  };

  const pages = getPageNumbers();

  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row items-center justify-between gap-4 py-3 px-2 text-xs text-[var(--text-secondary)]",
        className
      )}
    >
      {/* Left: Summary & Page Size selector */}
      <div className="flex items-center gap-3">
        <span>
          Showing <strong className="font-mono text-[var(--text-primary)]">{startItem}-{endItem}</strong> of{" "}
          <strong className="font-mono text-[var(--text-primary)]">{totalItems}</strong>
        </span>

        {onPageSizeChange && (
          <div className="flex items-center gap-1.5 pl-3 border-l border-[var(--border-subtle)]">
            <span className="text-[11px] text-[var(--text-muted)]">Per page:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                onPageSizeChange(Number(e.target.value));
                onPageChange?.(1);
              }}
              className="bg-white/[0.05] border border-[var(--border-subtle)] hover:border-[var(--border-muted)] rounded-lg px-2 py-1 text-xs text-[var(--text-primary)] focus-ring outline-none cursor-pointer"
            >
              {pageSizeOptions.map((size) => (
                <option key={size} value={size} className="bg-[var(--bg-surface-elevated)]">
                  {size}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Right: Page Navigation Buttons */}
      <div className="flex items-center gap-1">
        {/* First page */}
        <button
          onClick={() => onPageChange?.(1)}
          disabled={validPage <= 1}
          aria-label="First page"
          className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-white/[0.06] disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
        >
          <ChevronsLeft className="w-4 h-4" />
        </button>

        {/* Prev page */}
        <button
          onClick={() => onPageChange?.(validPage - 1)}
          disabled={validPage <= 1}
          aria-label="Previous page"
          className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-white/[0.06] disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Numbered Buttons */}
        <div className="flex items-center gap-1">
          {pages.map((item, idx) => {
            if (item === "...") {
              return (
                <span key={`dots-${idx}`} className="px-2 text-[var(--text-muted)] font-mono">
                  ...
                </span>
              );
            }
            const isCurrent = item === validPage;
            return (
              <button
                key={item}
                onClick={() => onPageChange?.(item)}
                className={cn(
                  "min-w-[30px] h-[30px] px-2 flex items-center justify-center rounded-lg font-mono text-xs transition-all cursor-pointer",
                  isCurrent
                    ? "bg-indigo-500/20 text-indigo-300 font-bold border border-indigo-500/40 shadow-sm shadow-indigo-500/10"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/[0.06]"
                )}
              >
                {item}
              </button>
            );
          })}
        </div>

        {/* Next page */}
        <button
          onClick={() => onPageChange?.(validPage + 1)}
          disabled={validPage >= totalPages}
          aria-label="Next page"
          className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-white/[0.06] disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        {/* Last page */}
        <button
          onClick={() => onPageChange?.(totalPages)}
          disabled={validPage >= totalPages}
          aria-label="Last page"
          className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-white/[0.06] disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
        >
          <ChevronsRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
