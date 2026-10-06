"use client";

import React, { useState } from "react";
import { Sidebar } from "./sidebar";
import { Header } from "./header";

export function AppShell({ children, pageTitle = "Workspace" }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-[var(--bg-app)] text-[var(--text-primary)] flex selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Ambient Aurora Glow Lights in Backdrop */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
        <div className="absolute -top-40 left-1/4 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[140px]" />
        <div className="absolute top-1/3 -right-40 w-[500px] h-[500px] bg-purple-600/8 rounded-full blur-[160px]" />
        <div className="absolute -bottom-20 left-1/3 w-[600px] h-[600px] bg-cyan-600/6 rounded-full blur-[180px]" />
      </div>

      {/* Persistent Stationary Glass Sidebar */}
      <Sidebar
        isMobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      {/* Main Content Area — Dedicated smooth scroll container */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-y-auto overflow-x-hidden relative z-10">
        <Header
          title={pageTitle}
          onMobileMenuToggle={() => setMobileOpen(!mobileOpen)}
        />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

