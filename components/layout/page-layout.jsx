"use client";

import React from "react";
import { motion } from "framer-motion";
import { AppShell } from "./app-shell";
import { PageHeader } from "./page-header";
import { fadeIn, staggerContainer } from "@/lib/animations";
import { cn } from "@/lib/utils";

export function PageLayout({
  title,
  description,
  badge,
  actions,
  breadcrumbs,
  children,
  secondaryContent,
  className,
}) {
  return (
    <AppShell pageTitle={title}>
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className={cn("space-y-6", className)}
      >
        <PageHeader
          title={title}
          description={description}
          badge={badge}
          actions={actions}
          breadcrumbs={breadcrumbs}
        />

        <motion.div variants={fadeIn} className="space-y-6">
          {children}
        </motion.div>

        {secondaryContent && (
          <motion.div variants={fadeIn} className="pt-6 border-t border-[var(--border-subtle)]">
            {secondaryContent}
          </motion.div>
        )}
      </motion.div>
    </AppShell>
  );
}
