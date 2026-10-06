"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { SearchInput } from "@/components/ui/input";
import { NotificationBell } from "@/components/notifications/notification-bell";
import { Avatar } from "@/components/ui/avatar";
import { getAccountProfile } from "@/lib/storage";

export function Header({
  onMobileMenuToggle,
  title = "Workspace",
  collapsed = false,
  onToggleSidebar,
}) {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState("");
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

  const handleGlobalSearch = (e) => {
    if (e.key === "Enter" && searchValue.trim()) {
      router.push(`/find-people`);
    }
  };

  return (
    <header className="h-[60px] bg-[#06070a]/80 backdrop-blur-2xl sticky top-0 z-20 flex items-center justify-between px-4 sm:px-6">
      {/* Left: Sidebar Collapse Toggle & Breadcrumbs */}
      <div className="flex items-center gap-3">
        {/* Mobile Menu Trigger */}
        <button
          onClick={onMobileMenuToggle}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.08] md:hidden cursor-pointer transition-all active:scale-95"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Desktop Sidebar Collapse Toggle Button */}
        <button
          onClick={onToggleSidebar}
          className="hidden md:flex p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors cursor-pointer"
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <PanelLeftOpen className="w-4 h-4 text-indigo-300" />
          ) : (
            <PanelLeftClose className="w-4 h-4 text-slate-400 hover:text-indigo-300" />
          )}
        </button>

        {/* Title / Breadcrumb */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-[var(--text-muted)] hidden sm:inline font-medium">Orbit /</span>
          <h1 className="text-sm font-semibold text-[var(--text-primary)] tracking-tight">
            {title}
          </h1>
        </div>
      </div>

      {/* Center/Right: Quick Search, Notifications & Clean Borderless Profile Pic */}
      <div className="flex items-center gap-3">
        <div className="hidden sm:block w-60 md:w-72">
          <SearchInput
            placeholder="Search handle or tool..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyDown={handleGlobalSearch}
            shortcut="⌘K"
          />
        </div>

        <div className="flex items-center gap-3">
          <NotificationBell />

          {/* Clean Profile Pic (No background box, No border) */}
          <Link
            href="/settings"
            className="flex items-center gap-2 p-1 text-slate-300 hover:text-white transition-colors group cursor-pointer"
            title="Open Profile Settings"
          >
            <Avatar
              src={account.avatarUrl}
              fallback={account.displayName}
              size="sm"
              borderColor={account.avatarBorderColor || "#6366f1"}
            />
            <span className="text-xs font-medium text-slate-300 group-hover:text-white hidden md:inline truncate max-w-[120px]">
              {account.displayName || "Explorer"}
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
}
