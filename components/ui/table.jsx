import React from "react";
import { cn } from "@/lib/utils";

export function TableContainer({ className, children, ...props }) {
  return (
    <div
      className={cn(
        "w-full overflow-x-auto rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-glass-card)] backdrop-blur-xl shadow-xl shadow-black/30",
        className
      )}
      {...props}
    >
      <table className="w-full text-left text-xs border-collapse">
        {children}
      </table>
    </div>
  );
}

export function TableHeader({ className, children, ...props }) {
  return (
    <thead
      className={cn(
        "bg-white/[0.03] backdrop-blur-2xl text-[var(--text-secondary)] font-semibold uppercase tracking-wider border-b border-[var(--border-subtle)] sticky top-0 z-10",
        className
      )}
      {...props}
    >
      {children}
    </thead>
  );
}

export function TableBody({ className, children, ...props }) {
  return (
    <tbody
      className={cn("divide-y divide-white/[0.04] text-[var(--text-secondary)]", className)}
      {...props}
    >
      {children}
    </tbody>
  );
}

export function TableRow({ className, isSelected, ...props }) {
  return (
    <tr
      className={cn(
        "transition-colors duration-150 hover:bg-white/[0.04]",
        isSelected && "bg-emerald-500/[0.08] hover:bg-emerald-500/[0.12]",
        className
      )}
      {...props}
    />
  );
}

export function TableHead({ className, children, ...props }) {
  return (
    <th
      className={cn("px-4 py-3.5 font-semibold text-[11px] text-[var(--text-muted)] select-none", className)}
      {...props}
    >
      {children}
    </th>
  );
}

export function TableCell({ className, children, ...props }) {
  return (
    <td className={cn("px-4 py-3.5 whitespace-nowrap align-middle", className)} {...props}>
      {children}
    </td>
  );
}
