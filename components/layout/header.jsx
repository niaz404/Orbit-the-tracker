"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Menu } from "lucide-react";
import { SearchInput } from "@/components/ui/input";
import { StatusIndicator } from "@/components/ui/status-indicator";
import { NotificationBell } from "@/components/notifications/notification-bell";

export function Header({ onMobileMenuToggle, title = "Workspace" }) {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState("");

  const handleGlobalSearch = (e) => {
    if (e.key === "Enter" && searchValue.trim()) {
      router.push(`/find-people`);
    }
  };

  return (
    <header className="h-[60px] border-b border-[var(--border-subtle)] bg-[#06070a]/60 backdrop-blur-2xl sticky top-0 z-20 flex items-center justify-between px-4 sm:px-6">
      {/* Left: Mobile Drawer Trigger & Breadcrumbs */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMobileMenuToggle}
          className="p-2 rounded-xl text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-white/[0.06] md:hidden cursor-pointer transition-colors"
          aria-label="Open navigation sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2">
          <span className="text-xs text-[var(--text-muted)] hidden sm:inline font-medium">Orbit /</span>
          <h1 className="text-sm font-semibold text-[var(--text-primary)] tracking-tight">
            {title}
          </h1>
        </div>
      </div>

      {/* Center/Right: Quick Search, Notifications & Status */}
      <div className="flex items-center gap-3">
        <div className="hidden sm:block w-64 md:w-80">
          <SearchInput
            placeholder="Search handle or tool..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyDown={handleGlobalSearch}
            shortcut="⌘K"
          />
        </div>

        <div className="flex items-center gap-2 pl-2 border-l border-[var(--border-subtle)]">
          <NotificationBell />
          <StatusIndicator status="active" label="Orbit Ready" className="hidden lg:inline-flex" />
        </div>
      </div>
    </header>
  );
}
