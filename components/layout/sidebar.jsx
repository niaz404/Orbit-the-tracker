"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Code2,
  Users,
  Tv,
  ChevronDown,
  X,
  LayoutGrid,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/avatar";
import { getAccountProfile } from "@/lib/storage";

export function Sidebar({
  collapsed = false,
  onToggleCollapse,
  isMobileOpen,
  onMobileClose,
}) {
  const pathname = usePathname();
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
      {/* 1. BRAND LOGO (AGU DISPLAY FONT, BOLD & CLEAN, NO COLLAPSED BOX) */}
      <div className="h-[60px] px-5 flex items-center justify-between border-b border-[var(--border-subtle)]">
        <Link
          href="/workspace"
          onClick={onMobileClose}
          className="flex items-center gap-2.5 group cursor-pointer"
        >
          {!collapsed ? (
            <div className="flex items-baseline gap-2">
              <span className="font-logo font-black text-3xl tracking-wide bg-gradient-to-r from-white via-indigo-100 to-indigo-300 bg-clip-text text-transparent group-hover:from-indigo-300 group-hover:to-cyan-300 transition-all duration-300">
                ORBIT
              </span>
              <span className="font-logo font-bold text-xs text-indigo-400/90 tracking-wide">
                v2
              </span>
            </div>
          ) : (
            <span className="font-logo font-black text-2xl text-white group-hover:text-indigo-300 transition-colors mx-auto block text-center">
              O
            </span>
          )}
        </Link>

        {/* Mobile close button only */}
        {isMobileOpen && (
          <button
            onClick={onMobileClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.08] md:hidden cursor-pointer"
            aria-label="Close sidebar"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* 2. MAIN NAVIGATION (SMOOTH, NO JUMPING, NO ICON BACKGROUNDS) */}
      <div className="flex-1 py-5 px-3 space-y-2 overflow-y-auto">
        <div className="space-y-1">
          {/* SECTION 1: Problem Solving Tracker */}
          <div className="rounded-xl">
            <button
              type="button"
              onClick={() => {
                if (collapsed && onToggleCollapse) onToggleCollapse();
                setTrackerExpanded(!trackerExpanded);
              }}
              className={cn(
                "w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer group",
                isTrackerActive
                  ? "bg-white/[0.08] text-white"
                  : "text-slate-400 hover:text-white hover:bg-white/[0.04]"
              )}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Code2
                  className={cn(
                    "w-4 h-4 shrink-0 transition-colors",
                    isTrackerActive ? "text-indigo-400" : "text-slate-400 group-hover:text-slate-200"
                  )}
                />
                {!collapsed && (
                  <span className="truncate text-xs font-medium">Problem Tracker</span>
                )}
              </div>

              {!collapsed && (
                <ChevronDown
                  className={cn(
                    "w-3.5 h-3.5 text-slate-500 transition-transform duration-200",
                    trackerExpanded && "rotate-180 text-slate-300"
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
                  className="overflow-hidden pl-4 pr-1 pt-1 space-y-0.5"
                >
                  {/* Workspace */}
                  <Link
                    href="/workspace"
                    onClick={onMobileClose}
                    className={cn(
                      "flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors group",
                      pathname === "/workspace" || pathname === "/"
                        ? "bg-indigo-500/20 text-indigo-300 font-semibold"
                        : "text-slate-400 hover:text-white hover:bg-white/[0.04]"
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
                      "flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors group",
                      pathname === "/find-people" || pathname.startsWith("/profile")
                        ? "bg-indigo-500/20 text-indigo-300 font-semibold"
                        : "text-slate-400 hover:text-white hover:bg-white/[0.04]"
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
              "flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors group cursor-pointer",
              isYtActive
                ? "bg-white/[0.08] text-white"
                : "text-slate-400 hover:text-white hover:bg-white/[0.04]"
            )}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <Tv
                className={cn(
                  "w-4 h-4 shrink-0 transition-colors",
                  isYtActive ? "text-indigo-400" : "text-slate-400 group-hover:text-slate-200"
                )}
              />
              {!collapsed && (
                <span className="truncate text-xs font-medium">YT Extractor</span>
              )}
            </div>

            {!collapsed && (
              <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-amber-500/15 text-amber-300 font-mono font-semibold">
                Soon
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* 3. SIDEBAR BOTTOM USER PROFILE (CLEAN, NO BACKGROUND BOX, NO ONLINE DOT) */}
      <div className="p-3 border-t border-[var(--border-subtle)]">
        <Link
          href="/settings"
          onClick={onMobileClose}
          className={cn(
            "flex items-center gap-2.5 p-1.5 rounded-xl transition-colors group cursor-pointer",
            isSettingsActive
              ? "text-white bg-white/[0.06]"
              : "text-slate-400 hover:text-white hover:bg-white/[0.04]"
          )}
        >
          <div className="shrink-0">
            <Avatar
              src={account.avatarUrl}
              fallback={account.displayName}
              size="sm"
              borderColor={account.avatarBorderColor}
            />
          </div>

          {!collapsed && (
            <div className="flex items-center justify-between min-w-0 flex-1">
              <div className="flex flex-col min-w-0 pr-1">
                <span className="text-xs font-bold text-white group-hover:text-indigo-200 transition-colors truncate">
                  {account.displayName || "Explorer"}
                </span>
                <span className="text-[10px] text-slate-500 truncate font-mono">
                  @{account.username || "username"}
                </span>
              </div>
              <Settings className="w-3.5 h-3.5 text-slate-500 group-hover:text-indigo-300 transition-colors shrink-0" />
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
          collapsed ? "w-[68px]" : "w-[240px]"
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
              initial={{ x: -260 }}
              animate={{ x: 0 }}
              exit={{ x: -260 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-64 max-w-[85vw] h-full z-10"
            >
              {sidebarContent}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
