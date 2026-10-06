"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  CheckCheck,
  Trash2,
  ExternalLink,
  Code2,
  Sparkles,
  Award,
  CircleDot,
  CheckCircle,
} from "lucide-react";
import {
  getNotifications,
  markNotificationsRead,
  clearNotifications,
  getBookmarks,
  addNotification,
} from "@/lib/storage";
import { cn } from "@/lib/utils";

export function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const dropdownRef = useRef(null);

  const loadNotifs = () => {
    setNotifications(getNotifications());
  };

  useEffect(() => {
    loadNotifs();

    const handleUpdate = () => loadNotifs();
    window.addEventListener("orbit_notifications_updated", handleUpdate);
    return () => {
      window.removeEventListener("orbit_notifications_updated", handleUpdate);
    };
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Subtle background check for bookmarked solvers' new problems (throttled)
  useEffect(() => {
    const checkNewSubmissions = async () => {
      const bookmarks = getBookmarks();
      if (bookmarks.length === 0) return;

      // Check one random bookmarked solver occasionally
      const randomSolver = bookmarks[Math.floor(Math.random() * bookmarks.length)];
      if (!randomSolver?.handle) return;

      try {
        const res = await fetch(`/api/codeforces/submissions/${encodeURIComponent(randomSolver.handle)}`);
        if (res.ok) {
          const data = await res.json();
          const currentCount = data.totalSolved || 0;
          const lastCount = randomSolver.lastKnownSolvedCount || 0;

          if (lastCount > 0 && currentCount > lastCount) {
            const diff = currentCount - lastCount;
            addNotification({
              title: `New Problems Solved by ${randomSolver.handle}`,
              message: `${randomSolver.handle} solved ${diff} new ${diff === 1 ? "problem" : "problems"} on Codeforces.`,
              handle: randomSolver.handle,
              type: "solve",
            });
          }
        }
      } catch {
        // silent fail on background check
      }
    };

    const interval = setInterval(checkNewSubmissions, 45000); // every 45s
    return () => clearInterval(interval);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleToggleOpen = () => {
    if (!isOpen && unreadCount > 0) {
      markNotificationsRead();
    }
    setIsOpen(!isOpen);
  };

  const timeAgo = (timestamp) => {
    if (!timestamp) return "Just now";
    const diff = Math.floor((Date.now() - timestamp) / 1000);
    if (diff < 60) return "Just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        type="button"
        onClick={handleToggleOpen}
        aria-label="View notifications"
        className="relative p-2 rounded-xl text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-white/[0.06] transition-colors cursor-pointer focus-ring"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400" />
          </span>
        )}
      </button>

      {/* Flyout Glass Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.96 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-[var(--bg-surface-elevated)] backdrop-blur-2xl border border-[var(--border-muted)] shadow-2xl shadow-black/80 z-50 overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="p-3.5 px-4 border-b border-[var(--border-subtle)] flex items-center justify-between bg-white/[0.02]">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[var(--text-primary)]">Notifications</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                  {notifications.length}/10 Max
                </span>
              </div>

              {notifications.length > 0 && (
                <button
                  type="button"
                  onClick={() => clearNotifications()}
                  className="text-[11px] text-[var(--text-muted)] hover:text-rose-400 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Clear</span>
                </button>
              )}
            </div>

            {/* Notifications List */}
            <div className="max-h-80 overflow-y-auto divide-y divide-white/[0.04]">
              {notifications.length > 0 ? (
                notifications.map((n) => (
                  <div
                    key={n.id}
                    className={cn(
                      "p-3.5 px-4 hover:bg-white/[0.03] transition-colors flex items-start gap-3",
                      !n.read && "bg-indigo-500/[0.05]"
                    )}
                  >
                    <div className="mt-0.5 p-1.5 rounded-lg bg-white/[0.05] text-[var(--accent-text)] border border-white/[0.08] shrink-0">
                      {n.type === "solve" ? (
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                      ) : n.type === "bookmark" ? (
                        <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                      ) : (
                        <CircleDot className="w-3.5 h-3.5 text-cyan-400" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0 space-y-0.5">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-xs font-semibold text-[var(--text-primary)] truncate">
                          {n.title}
                        </p>
                        <span className="text-[10px] text-[var(--text-muted)] shrink-0 font-mono">
                          {timeAgo(n.timestamp)}
                        </span>
                      </div>
                      <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">
                        {n.message}
                      </p>

                      {n.handle && (
                        <Link
                          href={`/tracker/${encodeURIComponent(n.handle)}`}
                          onClick={() => setIsOpen(false)}
                          className="inline-flex items-center gap-1 text-[11px] font-medium text-[var(--accent-text)] hover:underline pt-1"
                        >
                          <span>Open {n.handle}&apos;s Tracker</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </Link>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center text-xs text-[var(--text-muted)] space-y-1">
                  <Bell className="w-5 h-5 mx-auto opacity-30 mb-1" />
                  <p>No new notifications</p>
                  <p className="text-[11px] text-[var(--text-muted)]/70">
                    Activity from bookmarked solvers will appear here.
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
