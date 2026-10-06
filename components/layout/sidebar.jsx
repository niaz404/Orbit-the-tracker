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
  PanelLeftClose,
  PanelLeftOpen,
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
      {/* 1. BRAND LOGO HEADER WITH STYLISH TYPOGRAPHY (OUTFIT) & SLEEK TOGGLE */}
      <div className="h-20 px-5 flex items-center justify-between border-b border-[var(--border-subtle)] bg-white/[0.01]">
        <Link
          href="/workspace"
          onClick={onMobileClose}
          className="flex items-center gap-3 group cursor-pointer"
        >
          {!collapsed ? (
            <div className="flex flex-col">
              <span className="font-brand font-black text-2xl tracking-[-0.03em] bg-gradient-to-r from-white via-slate-100 to-indigo-200 bg-clip-text text-transparent group-hover:from-indigo-300 group-hover:to-cyan-300 transition-all duration-300">
                ORBIT
              </span>
              <span className="text-[9px] font-bold text-indigo-400 tracking-[0.28em] uppercase -mt-0.5">
                GROWTH ENGINE
              </span>
            </div>
          ) : (
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600/30 to-purple-600/30 border border-indigo-500/40 flex items-center justify-center text-white font-brand font-black text-lg shadow-md group-hover:scale-105 transition-all">
              O
            </div>
          )}
        </Link>

        {/* Sleek Collapse Toggle Button */}
        <div className="flex items-center">
          {isMobileOpen ? (
            <button
              onClick={onMobileClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.08] md:hidden cursor-pointer transition-all active:scale-95"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="hidden md:flex p-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] text-slate-400 hover:text-white border border-white/[0.06] hover:border-indigo-500/40 transition-all duration-200 cursor-pointer shadow-sm active:scale-95 hover:scale-105"
              title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {collapsed ? (
                <PanelLeftOpen className="w-4 h-4 text-indigo-300" />
              ) : (
                <PanelLeftClose className="w-4 h-4 text-slate-400 hover:text-indigo-300" />
              )}
            </button>
          )}
        </div>
      </div>

      {/* 2. MAIN NAVIGATION */}
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
                  <span className="truncate text-[13px] font-medium">Problem Tracker</span>
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
                  {/* Workspace */}
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

                  {/* Find People */}
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
                <span className="truncate text-[13px] font-medium">YT Extractor</span>
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

      {/* 3. SIDEBAR BOTTOM USER PROFILE WIDGET */}
      <div className="p-3 border-t border-[var(--border-subtle)] bg-black/25">
        <Link
          href="/settings"
          onClick={onMobileClose}
          className={cn(
            "flex items-center gap-3 p-2.5 rounded-2xl transition-all duration-200 group cursor-pointer border",
            isSettingsActive
              ? "bg-indigo-500/15 border-indigo-500/40 text-white shadow-lg shadow-indigo-500/10"
              : "border-white/[0.06] bg-[#0a0c16]/85 hover:bg-[#121626] hover:border-white/[0.15] shadow-md"
          )}
        >
          {/* Avatar Container with glowing border ring */}
          <div className="relative shrink-0">
            <div
              style={{
                borderColor: account.avatarBorderColor || "#6366f1",
                boxShadow: `0 0 16px ${(account.avatarBorderColor || "#6366f1")}35`,
              }}
              className="w-10 h-10 rounded-full border-2 overflow-hidden bg-[#0d101a] ring-2 ring-[#0c0e17] shadow-lg flex items-center justify-center"
            >
              {account.avatarUrl ? (
                <img
                  src={account.avatarUrl}
                  alt={account.displayName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-xs font-bold text-slate-300">
                  {(account.displayName || "E").slice(0, 2).toUpperCase()}
                </span>
              )}
            </div>
            {/* Glowing online status indicator */}
            <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#0c0e17] shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
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
      {/* Desktop Persistent Stationary Glass Sidebar */}
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
