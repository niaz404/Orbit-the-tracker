import React from "react";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";

export const Input = React.forwardRef(
  (
    {
      className,
      type = "text",
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label className="block text-xs font-medium text-[var(--text-secondary)]">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3 text-[var(--text-muted)] pointer-events-none flex items-center">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            type={type}
            disabled={disabled}
            className={cn(
              "w-full h-10 px-3.5 text-sm bg-white/[0.04] backdrop-blur-md text-[var(--text-primary)]",
              "border border-[var(--border-subtle)] rounded-xl placeholder:text-[var(--text-muted)]",
              "focus-ring transition-all duration-200 hover:border-[var(--border-muted)]",
              "disabled:opacity-45 disabled:cursor-not-allowed",
              leftIcon && "pl-9.5",
              rightIcon && "pr-9.5",
              error && "border-rose-500/50 focus-visible:border-rose-500",
              className
            )}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3.5 text-[var(--text-muted)] flex items-center">
              {rightIcon}
            </div>
          )}
        </div>
        {error ? (
          <p className="text-xs text-rose-400">{error}</p>
        ) : helperText ? (
          <p className="text-xs text-[var(--text-muted)]">{helperText}</p>
        ) : null}
      </div>
    );
  }
);
Input.displayName = "Input";

export const SearchInput = React.forwardRef(
  ({ className, shortcut = "⌘K", ...props }, ref) => {
    return (
      <div className="relative flex items-center w-full">
        <div className="absolute left-3.5 text-[var(--text-muted)] pointer-events-none flex items-center">
          <Search className="w-4 h-4" />
        </div>
        <input
          ref={ref}
          type="text"
          className={cn(
            "w-full h-10 pl-10 pr-14 text-sm bg-white/[0.04] backdrop-blur-md text-[var(--text-primary)]",
            "border border-[var(--border-subtle)] rounded-xl placeholder:text-[var(--text-muted)]",
            "focus-ring transition-all duration-200 hover:border-[var(--border-muted)] hover:bg-white/[0.06]",
            className
          )}
          {...props}
        />
        {shortcut && (
          <div className="absolute right-3 pointer-events-none">
            <kbd className="inline-flex items-center px-1.5 py-0.5 text-[10px] font-medium font-code text-[var(--text-muted)] bg-white/[0.06] border border-white/[0.08] rounded-md shadow-xs">
              {shortcut}
            </kbd>
          </div>
        )}
      </div>
    );
  }
);
SearchInput.displayName = "SearchInput";
