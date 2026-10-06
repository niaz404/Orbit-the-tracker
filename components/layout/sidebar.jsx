"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Code2,
  Users,
  Tv,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  X,
  LayoutGrid,
  Settings,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/avatar";
import { getAccountProfile } from "@/lib/storage";

export function Sidebar({ isMobileOpen, onMobileClose }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [trackerExpanded, setTrackerExpanded] = useState(true);
  const [account, setAccount] = useState({
    displayName: "Explorer",
    username: "orbit_user",
    avatarUrl: "",
    avatarBorderColor: "#6366f1",
  });

  useEffect(() => {
    setAccount(getAccountProfile());
    const handleUpdate = () => setAccount(getAccountProfile());
    window.addEventListener("orbit_account_updated", handleUpdate);
    return () => window.removeEventListener("orbit_account_updated", handleUpdate);
  }, []);

  const isTrackerActive =
    pathname.startsWith("/workspace") ||
    pathname.startsWith("/find-people") ||
    pathname.startsWith("/profile") ||
    pathname.startsWith("/tracker") ||
    pathname === "/";

  const isYtActive = pathname.startsWith("/yt-extractor");
  const isSettingsActive = pathname.startsWith("/settings");

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[var(--bg-sidebar)] backdrop-blur-2xl border-r border-[var(--border-subtle)] select-none">
      {/* BIG, BOLD, IMPACTFUL BRAND LOGO (PURE TYPOGRAPHY, NO ICONS) */}
      <div className="h-20 px-6 flex items-center justify-between border-b border-[var(--border-subtle)] bg-white/[0.01]">
        <Link
          href="/workspace"
          onClick={onMobileClose}
          className="flex items-center group cursor-pointer"
        >
          {!collapsed ? (
            <div className="flex flex-col">
              <span className="font-black text-2xl tracking-tighter bg-gradient-to-r from-white via-slate-100 to-indigo-200 bg-clip-text text-transparent group-hover:from-indigo-300 group-hover:to-cyan-300 transition-all duration-300">
                ORBIT
              </span>
              <span className="text-[9px] font-bold text-indigo-400 tracking-[0.25em] uppercase">
                GROWTH ENGINE
              </span>
            </div>
          ) : (
            <span className="font-black text-xl tracking-tighter bg-gradient-to-r from-white to-indigo-300 bg-clip-text text-transparent">
              O
            </span>
          )}
        </Link>

        {/* Top-Right Collapse Toggle */}
        <div className="flex items-center">
          {isMobileOpen ? (
            <button
              onClick={onMobileClose}
              className="p-2 rounded-xl text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-white/[0.06] md:hidden cursor-pointer transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="hidden md:flex p-1.5 rounded-xl text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-white/[0.06] cursor-pointer transition-colors"
              title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {collapsed ? (
                <ChevronRight className="w-4 h-4" />
              ) : (
                <ChevronLeft className="w-4 h-4" />
              )}
            </button>
          )}
        </div>
      </div>

      {/* Main Navigation — Exactly 2 sections */}
      <div className="flex-1 py-6 px-3.5 space-y-3 overflow-y-auto">
        <div className="space-y-1.5">
          {/* SECTION 1: Problem Solving Tracker (Expandable) */}
          <div className="rounded-2xl transition-colors">
            <button
              type="button"
              onClick={() => {
                if (collapsed) setCollapsed(false);
                setTrackerExpanded(!trackerExpanded);
              }}
              className={cn(
                "w-full flex items-center justify-between gap-3 px-3.5 py-3 rounded-2xl text-xs font-semibold transition-all cursor-pointer group",
                isTrackerActive
                  ? "bg-white/[0.06] text-[var(--text-primary)] shadow-sm border border-white/[0.08]"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/[0.03]"
              )}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={cn(
                    "p-2 rounded-xl transition-colors",
                    isTrackerActive
                      ? "bg-indigo-500/20 text-[var(--accent-text)] border border-indigo-500/30"
                      : "bg-white/[0.04] text-[var(--text-muted)] group-hover:text-[var(--text-secondary)]"
                  )}
                >
                  <Code2 className="w-4 h-4" />
                </div>
                {!collapsed && (
                  <span className="truncate text-[13px]">Problem Tracker</span>
                )}
              </div>

              {!collapsed && (
                <ChevronDown
                  className={cn(
                    "w-3.5 h-3.5 text-[var(--text-muted)] transition-transform duration-200",
                    trackerExpanded && "rotate-180 text-[var(--text-secondary)]"
                  )}
                />
              )}
            </button>

            {/* Sub-Items: Workspace & Find People */}
            <AnimatePresence initial={false}>
              {trackerExpanded && !collapsed && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.18, ease: "easeInOut" }}
                  className="overflow-hidden pl-5 pr-1 pt-1.5 space-y-1"
                >
                  {/* Sub-item: Workspace */}
                  <Link
                    href="/workspace"
                    onClick={onMobileClose}
                    className={cn(
                      "flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all group relative",
                      pathname === "/workspace" || pathname === "/"
                        ? "bg-indigo-500/15 text-[var(--accent-text)] font-semibold border border-indigo-500/30"
                        : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/[0.04]"
                    )}
                  >
                    <LayoutGrid className="w-3.5 h-3.5 shrink-0" />
                    <span>Workspace</span>
                  </Link>

                  {/* Sub-item: Find People */}
                  <Link
                    href="/find-people"
                    onClick={onMobileClose}
                    className={cn(
                      "flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all group relative",
                      pathname === "/find-people" || pathname.startsWith("/profile")
                        ? "bg-indigo-500/15 text-[var(--accent-text)] font-semibold border border-indigo-500/30"
                        : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/[0.04]"
                    )}
                  >
                    <Users className="w-3.5 h-3.5 shrink-0" />
                    <span>Find People</span>
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* SECTION 2: YT Playlist Extractor */}
          <Link
            href="/yt-extractor"
            onClick={onMobileClose}
            className={cn(
              "flex items-center justify-between gap-3 px-3.5 py-3 rounded-2xl text-xs font-semibold transition-all group cursor-pointer",
              isYtActive
                ? "bg-white/[0.06] text-[var(--text-primary)] shadow-sm border border-white/[0.08]"
                : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/[0.03]"
            )}
          >
            <div className="flex items-center gap-3 min-w-0">
              <div
                className={cn(
                  "p-2 rounded-xl transition-colors",
                  isYtActive
                    ? "bg-indigo-500/20 text-[var(--accent-text)] border border-indigo-500/30"
                    : "bg-white/[0.04] text-[var(--text-muted)] group-hover:text-[var(--text-secondary)]"
                )}
              >
                <Tv className="w-4 h-4" />
              </div>
              {!collapsed && (
                <span className="truncate text-[13px]">YT Extractor</span>
              )}
            </div>

            {!collapsed && (
              <span className="text-[9px] px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 font-mono font-semibold">
                Soon
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Sidebar Bottom: Sleek User Profile Widget */}
      <div className="p-3 border-t border-[var(--border-subtle)] bg-black/20">
        <Link
          href="/settings"
          onClick={onMobileClose}
          className={cn(
            "flex items-center gap-3 p-2 rounded-2xl transition-all duration-200 group cursor-pointer border",
            isSettingsActive
              ? "bg-indigo-500/15 border-indigo-500/40 text-white shadow-lg shadow-indigo-500/10"
              : "border-white/[0.06] bg-[#0a0c16]/80 hover:bg-[#101426] hover:border-white/[0.15] shadow-md"
          )}
        >
          <div className="relative shrink-0">
            <Avatar
              src={account.avatarUrl}
              fallback={account.displayName}
              size="md"
              status="online"
              borderColor={account.avatarBorderColor}
              className="shrink-0 shadow-md ring-2 ring-[#0a0c16]"
            />
          </div>

          {!collapsed && (
            <div className="flex items-center justify-between min-w-0 flex-1">
              <div className="flex flex-col min-w-0 pr-1">
                <span className="text-xs font-bold text-white group-hover:text-indigo-200 transition-colors truncate">
                  {account.displayName || "Explorer"}
                </span>
                <span className="text-[11px] text-slate-400 truncate font-mono">
                  @{account.username || "orbit_user"}
                </span>
              </div>
              <div className="p-1.5 rounded-xl bg-white/[0.04] text-slate-400 group-hover:text-indigo-300 group-hover:bg-indigo-500/20 transition-all shrink-0">
                <Settings className="w-3.5 h-3.5" />
              </div>
            </div>
          )}
        </Link>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Glass Sidebar */}
      <aside
        className={cn(
          "hidden md:flex flex-col shrink-0 h-screen sticky top-0 transition-all duration-300 z-30",
          collapsed ? "w-[72px]" : "w-[260px]"
        )}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Glass Drawer */}
      <AnimatePresence>
        {isMobileOpen && (
          <div className="fixed inset-0 z-50 md:hidden flex">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onMobileClose}
              className="fixed inset-0 bg-black/70 backdrop-blur-md"
            />
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-72 max-w-[85vw] h-full z-10"
            >
              {sidebarContent}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
