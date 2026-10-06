"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { fadeIn, scaleIn } from "@/lib/animations";

export function Modal({
  isOpen,
  onClose,
  children,
  className,
  size = "md", // 'sm' | 'md' | 'lg' | 'xl'
}) {
  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose?.();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Prevent background scrolling when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-2xl",
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop with rich blur */}
          <motion.div
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Modal Box */}
          <motion.div
            variants={scaleIn}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={cn(
              "relative w-full bg-[var(--bg-surface-elevated)] backdrop-blur-2xl border border-[var(--border-muted)]",
              "rounded-2xl shadow-2xl shadow-black/80 z-10 overflow-hidden flex flex-col my-auto",
              sizeClasses[size] || sizeClasses.md,
              className
            )}
          >
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export function ModalHeader({ className, children, onClose, ...props }) {
  return (
    <div
      className={cn(
        "flex items-center justify-between p-5 sm:p-6 border-b border-[var(--border-subtle)] bg-white/[0.02]",
        className
      )}
      {...props}
    >
      <div className="space-y-1">{children}</div>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="p-1.5 rounded-xl text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-white/[0.08] transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

export function ModalTitle({ className, children, ...props }) {
  return (
    <h3
      className={cn("text-base font-semibold text-[var(--text-primary)] tracking-tight", className)}
      {...props}
    >
      {children}
    </h3>
  );
}

export function ModalDescription({ className, children, ...props }) {
  return (
    <p
      className={cn("text-xs text-[var(--text-secondary)] leading-relaxed", className)}
      {...props}
    >
      {children}
    </p>
  );
}

export function ModalContent({ className, children, ...props }) {
  return (
    <div className={cn("p-5 sm:p-6 space-y-4 overflow-y-auto max-h-[70vh]", className)} {...props}>
      {children}
    </div>
  );
}

export function ModalFooter({ className, children, ...props }) {
  return (
    <div
      className={cn(
        "flex items-center justify-end gap-2.5 p-4 sm:p-5 border-t border-[var(--border-subtle)] bg-white/[0.02]",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
