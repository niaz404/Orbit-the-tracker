import React from "react";
import { cn } from "@/lib/utils";

const badgeVariants = {
  default:
    "bg-white/[0.06] backdrop-blur-md text-[var(--text-secondary)] border-white/[0.08]",
  accent:
    "bg-indigo-500/15 backdrop-blur-md text-indigo-300 border-indigo-500/30 shadow-sm shadow-indigo-500/10",
  success:
    "bg-emerald-500/15 backdrop-blur-md text-emerald-300 border-emerald-500/30 shadow-sm shadow-emerald-500/10",
  warning:
    "bg-amber-500/15 backdrop-blur-md text-amber-300 border-amber-500/30 shadow-sm shadow-amber-500/10",
  error:
    "bg-rose-500/15 backdrop-blur-md text-rose-300 border-rose-500/30 shadow-sm shadow-rose-500/10",
  info:
    "bg-cyan-500/15 backdrop-blur-md text-cyan-300 border-cyan-500/30 shadow-sm shadow-cyan-500/10",
  outline:
    "bg-transparent text-[var(--text-muted)] border-white/[0.12]",
};

const problemStatusMap = {
  ac: {
    label: "AC",
    class: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-sm shadow-emerald-500/20",
  },
  done: {
    label: "Done",
    class: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-sm shadow-emerald-500/20",
  },
  "in-progress": {
    label: "In Progress",
    class: "bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-sm shadow-amber-500/20",
  },
  "not-started": {
    label: "Not Started",
    class: "bg-white/[0.05] text-[var(--text-muted)] border-white/[0.08]",
  },
  wa: {
    label: "WA",
    class: "bg-rose-500/20 text-rose-300 border-rose-500/40 shadow-sm shadow-rose-500/20",
  },
};

// Helper for Codeforces ratings
export function getRatingTier(rating) {
  if (!rating || rating < 1200) return { label: "Newbie", class: "text-slate-300 bg-slate-500/15 border-slate-500/30" };
  if (rating < 1400) return { label: "Pupil", class: "text-emerald-300 bg-emerald-500/15 border-emerald-500/30" };
  if (rating < 1600) return { label: "Specialist", class: "text-cyan-300 bg-cyan-500/15 border-cyan-500/30" };
  if (rating < 1900) return { label: "Expert", class: "text-blue-300 bg-blue-500/15 border-blue-500/30" };
  if (rating < 2200) return { label: "Candidate Master", class: "text-purple-300 bg-purple-500/15 border-purple-500/30" };
  if (rating < 2400) return { label: "Master", class: "text-amber-300 bg-amber-500/15 border-amber-500/30" };
  return { label: "Grandmaster", class: "text-rose-300 bg-rose-500/15 border-rose-500/30" };
}

export function Badge({
  className,
  variant = "default",
  status,
  rating,
  dot,
  children,
  ...props
}) {
  let customClass = badgeVariants[variant] || badgeVariants.default;
  let content = children;

  if (status && problemStatusMap[status]) {
    customClass = problemStatusMap[status].class;
    if (!content) content = problemStatusMap[status].label;
  } else if (rating !== undefined) {
    const tier = getRatingTier(rating);
    customClass = tier.class;
  }

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-medium rounded-full border transition-all select-none",
        customClass,
        className
      )}
      {...props}
    >
      {dot && (
        <span className="w-1.5 h-1.5 rounded-full bg-current opacity-90 animate-pulse" />
      )}
      {content}
    </span>
  );
}
