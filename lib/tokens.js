/**
 * CodeTrack Design System Tokens
 * Defines semantic color values, surface layers, typography scale, spacing units, and radius.
 */

export const tokens = {
  // Color palette (HSL and Hex equivalents mapped to CSS variables)
  colors: {
    // Canvas & Surface Layers
    bgApp: "#090a0f", // Deep canvas (near-black with subtle cool-slate undertone)
    bgSidebar: "#0d0f14", // Sidebar base
    bgSurfacePrimary: "#12151c", // Standard container/card surface
    bgSurfaceSecondary: "#171b24", // Sub-panels, hover states, nested containers
    bgSurfaceElevated: "#1e2330", // Modals, popovers, dropdowns, floating elements
    bgSurfaceGlass: "rgba(18, 21, 28, 0.75)",

    // Borders & Dividers
    borderSubtle: "rgba(255, 255, 255, 0.07)",
    borderMuted: "rgba(255, 255, 255, 0.12)",
    borderStrong: "rgba(255, 255, 255, 0.20)",
    borderFocus: "rgba(59, 130, 246, 0.6)",

    // Text & Content Hierarchy
    textPrimary: "#f3f5f9", // Highest emphasis (headings, primary copy)
    textSecondary: "#9ca5b8", // Medium emphasis (subtitles, secondary info, labels)
    textMuted: "#646e82", // Low emphasis (meta info, timestamps, placeholders)
    textDisabled: "#404654", // Disabled interactions

    // Accent (Electric Indigo / Sapphire - refined, high-signal developer tone)
    accent: {
      DEFAULT: "#4f6bf5",
      hover: "#3d5ae8",
      muted: "rgba(79, 107, 245, 0.15)",
      border: "rgba(79, 107, 245, 0.35)",
      text: "#8ba1ff",
    },

    // Semantic Status Colors
    status: {
      success: {
        DEFAULT: "#10b981",
        bg: "rgba(16, 185, 129, 0.12)",
        border: "rgba(16, 185, 129, 0.25)",
        text: "#34d399",
      },
      warning: {
        DEFAULT: "#f59e0b",
        bg: "rgba(245, 158, 11, 0.12)",
        border: "rgba(245, 158, 11, 0.25)",
        text: "#fbbf24",
      },
      error: {
        DEFAULT: "#ef4444",
        bg: "rgba(239, 68, 68, 0.12)",
        border: "rgba(239, 68, 68, 0.25)",
        text: "#f87171",
      },
      info: {
        DEFAULT: "#0ea5e9",
        bg: "rgba(14, 165, 233, 0.12)",
        border: "rgba(14, 165, 233, 0.25)",
        text: "#38bdf8",
      },
    },

    // Codeforces Difficulty / Rating Tiers (Restrained developer palette)
    cfRating: {
      newbie: { text: "#9ca5b8", bg: "rgba(156, 165, 184, 0.1)", label: "Newbie (<1200)" },
      pupil: { text: "#34d399", bg: "rgba(52, 211, 153, 0.1)", label: "Pupil (1200-1399)" },
      specialist: { text: "#22d3ee", bg: "rgba(34, 211, 238, 0.1)", label: "Specialist (1400-1599)" },
      expert: { text: "#60a5fa", bg: "rgba(96, 165, 250, 0.1)", label: "Expert (1600-1899)" },
      candidateMaster: { text: "#c084fc", bg: "rgba(192, 132, 252, 0.1)", label: "Candidate Master (1900-2199)" },
      master: { text: "#fbbf24", bg: "rgba(251, 191, 36, 0.1)", label: "Master (2200-2399)" },
      grandmaster: { text: "#f87171", bg: "rgba(248, 113, 113, 0.1)", label: "Grandmaster (2400+)" },
    },
  },

  // Spacing standard (8pt grid system)
  spacing: {
    sidebarWidth: "256px",
    sidebarCollapsedWidth: "64px",
    headerHeight: "56px",
    containerPadding: "24px",
  },

  // Corner radius (restrained, modern developer aesthetics)
  radius: {
    xs: "4px",
    sm: "6px",
    md: "8px",
    lg: "12px",
    full: "9999px",
  },

  // Shadows (subtle, layered)
  shadows: {
    subtle: "0 1px 2px 0 rgba(0, 0, 0, 0.35)",
    surface: "0 4px 12px 0 rgba(0, 0, 0, 0.3)",
    elevated: "0 12px 32px 0 rgba(0, 0, 0, 0.45)",
    glowAccent: "0 0 20px -4px rgba(79, 107, 245, 0.3)",
  },
};
