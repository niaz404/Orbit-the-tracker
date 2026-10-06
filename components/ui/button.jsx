import React from "react";
import { cn } from "@/lib/utils";

const buttonVariants = {
  primary:
    "bg-gradient-to-r from-indigo-500 via-indigo-600 to-purple-600 text-white hover:from-indigo-400 hover:via-indigo-500 hover:to-purple-500 shadow-lg shadow-indigo-500/25 active:scale-[0.97] border border-indigo-400/30",
  secondary:
    "bg-white/[0.05] backdrop-blur-xl text-[var(--text-primary)] hover:bg-white/[0.09] border border-[var(--border-subtle)] hover:border-[var(--border-muted)] active:scale-[0.97] shadow-sm",
  outline:
    "bg-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-muted)] hover:bg-white/[0.04] active:scale-[0.97]",
  ghost:
    "bg-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/[0.06] active:scale-[0.97]",
  danger:
    "bg-rose-500/15 text-rose-300 hover:bg-rose-500/25 border border-rose-500/30 active:scale-[0.97] shadow-lg shadow-rose-500/10",
  subtle:
    "bg-indigo-500/15 text-[var(--accent-text)] hover:bg-indigo-500/25 border border-indigo-500/30 active:scale-[0.97]",
};

const buttonSizes = {
  xs: "h-7 px-2.5 text-xs rounded-lg gap-1.5",
  sm: "h-8 px-3.5 text-xs font-medium rounded-xl gap-1.5",
  md: "h-9.5 px-4 text-sm font-medium rounded-xl gap-2",
  lg: "h-11 px-5 text-base font-medium rounded-2xl gap-2.5",
  icon: "h-9.5 w-9.5 p-0 rounded-xl justify-center",
  iconSm: "h-7.5 w-7.5 p-0 rounded-lg justify-center text-xs",
};

export const Button = React.forwardRef(
  (
    {
      className,
      variant = "secondary",
      size = "md",
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          "inline-flex items-center justify-center font-medium transition-all duration-200 select-none cursor-pointer focus-ring",
          "disabled:opacity-40 disabled:pointer-events-none disabled:cursor-not-allowed",
          buttonVariants[variant] || buttonVariants.secondary,
          buttonSizes[size] || buttonSizes.md,
          className
        )}
        {...props}
      >
        {isLoading ? (
          <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        ) : (
          leftIcon
        )}
        {children}
        {!isLoading && rightIcon}
      </button>
    );
  }
);

Button.displayName = "Button";
