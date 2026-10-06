# CodeTrack Design System & Visual Architecture

This document establishes the official design system, UI/UX direction, token architecture, and code conventions for **CodeTrack**. All future pages and components must strictly adhere to this specification.

---

## 1. Overall Design Philosophy

- **Vibe & Aesthetic**: Minimalist, high-density, dark, professional, developer-focused. Inspired by polished SaaS developer platforms like Linear, Vercel, and Raycast.
- **Calm & Productive**: No gratuitous neon glow, no massive rounded bubbles, no excessive animations, and no high-contrast harsh whites.
- **Hierarchy via Surfaces**: Elevation and visual grouping are created through subtle step-ups in background surface luminance and crisp 1px borders rather than heavy drop shadows.
- **Information Density**: Clean spacing that maximizes scannability without cluttering spreadsheet-style problem trackers or stats.

---

## 2. Color System & Semantic Tokens

The color palette is built around a near-black slate-tinted canvas with restrained electric indigo/sapphire accents.

### Core Canvas & Surfaces
| Token | Variable | Value | Usage |
|---|---|---|---|
| App Background | `--bg-app` | `#090a0f` | Main canvas, deepest backdrop |
| Sidebar Background | `--bg-sidebar` | `#0d0f14` | Persistent navigation bar |
| Primary Surface | `--bg-surface-primary` | `#12151c` | Cards, panels, data containers |
| Secondary Surface | `--bg-surface-secondary` | `#171b24` | Table headers, inputs, nested panels |
| Elevated Surface | `--bg-surface-elevated` | `#1e2330` | Modals, dropdowns, popovers |
| Surface Hover | `--bg-surface-hover` | `#222836` | Interactive hover highlights |

### Borders & Dividers
| Token | Variable | Value | Usage |
|---|---|---|---|
| Subtle Border | `--border-subtle` | `rgba(255, 255, 255, 0.07)` | Standard container & row dividers |
| Muted Border | `--border-muted` | `rgba(255, 255, 255, 0.12)` | Card borders, interactive edges |
| Strong Border | `--border-strong` | `rgba(255, 255, 255, 0.20)` | Active cards, hover highlights |
| Focus Ring | `--border-focus` | `rgba(79, 107, 245, 0.60)` | Accessible keyboard focus |

### Typography & Text Hierarchy
| Token | Variable | Value | Usage |
|---|---|---|---|
| Primary Text | `--text-primary` | `#f3f5f9` | Page titles, problem names, high emphasis |
| Secondary Text | `--text-secondary` | `#9ca5b8` | Subtitles, labels, descriptions, metadata |
| Muted Text | `--text-muted` | `#646e82` | Placeholders, timestamps, keyboard shortcuts |
| Disabled Text | `--text-disabled` | `#404654` | Disabled states |

### Accent Palette (Electric Indigo / Sapphire)
| Token | Variable | Value | Usage |
|---|---|---|---|
| Primary Accent | `--accent-primary` | `#4f6bf5` | Primary CTA, active nav indicator, progress |
| Accent Hover | `--accent-hover` | `#3d5ae8` | Hover state for primary buttons |
| Accent Muted Bg | `--accent-muted` | `rgba(79, 107, 245, 0.14)` | Active tabs, tag background, soft highlights |
| Accent Border | `--accent-border` | `rgba(79, 107, 245, 0.35)` | Highlight borders |
| Accent Text | `--accent-text` | `#8ba1ff` | High-contrast accent copy |

### Semantic Status
- **Success (Accepted / AC / Online)**: `#10b981` (Bg: `rgba(16, 185, 129, 0.12)`)
- **Warning (Pending / Idle / Moderate)**: `#f59e0b` (Bg: `rgba(245, 158, 11, 0.12)`)
- **Error (Wrong Answer / Failed)**: `#ef4444` (Bg: `rgba(239, 68, 68, 0.12)`)
- **Info (Syncing / Neutral Info)**: `#0ea5e9` (Bg: `rgba(14, 165, 233, 0.12)`)

### Codeforces Rating Tiers
- **Newbie (<1200)**: `#9ca5b8`
- **Pupil (1200-1399)**: `#34d399`
- **Specialist (1400-1599)**: `#22d3ee`
- **Expert (1600-1899)**: `#60a5fa`
- **Candidate Master (1900-2199)**: `#c084fc`
- **Master (2200-2399)**: `#fbbf24`
- **Grandmaster (2400+)**: `#f87171`

---

## 3. Typography Scale

- **Sans-Serif Font**: `Geist Sans` (fallback `-apple-system, BlinkMacSystemFont, Segoe UI`)
- **Monospace Font**: `Geist Mono` / `JetBrains Mono` for problem indices, ratings, submission times, code tags.

| Role | Class | Size / Weight | Line Height |
|---|---|---|---|
| Page Title | `text-xl sm:text-2xl font-semibold` | 20px / 24px, 600 | 1.25 |
| Section Title | `text-base sm:text-lg font-semibold` | 16px / 18px, 600 | 1.35 |
| Card Title | `text-sm font-semibold` | 14px, 600 | 1.4 |
| Body Text | `text-sm font-normal` | 14px, 400 | 1.5 |
| Secondary Text | `text-xs font-normal` | 12px, 400 | 1.5 |
| Caption / Meta | `text-[11px] font-medium` | 11px, 500 | 1.4 |
| Code / Data | `font-mono text-xs` | 12px, 400 | 1.4 |

---

## 4. Spacing, Borders & Radius

- **Grid System**: 4px / 8px spacing standard (`p-1`, `p-2`, `p-3`, `p-4`, `p-6`, `gap-3`, `gap-4`, `gap-6`).
- **Corner Radii**:
  - Small elements (badges, badges inside tables): `rounded-sm` (4px)
  - Interactive inputs, buttons: `rounded-md` (6px)
  - Cards, panels, tables: `rounded-lg` (8px)
  - Large dialogs / modals: `rounded-xl` (12px)
  - Avatars, status pills: `rounded-full` (9999px)
- **Shadows**:
  - `shadow-xs`: Subtle button depth
  - `shadow-md` / `shadow-lg`: Modals & floating dropdowns
  - No blurry colored box-shadows.

---

## 5. Component Conventions

1. **Buttons** (`components/ui/button.jsx`):
   - Variants: `primary`, `secondary`, `outline`, `ghost`, `danger`, `subtle`.
   - Sizes: `xs`, `sm`, `md`, `lg`, `icon`, `iconSm`.
   - Always provide loading spinner and active scale feedback (`active:scale-[0.98]`).
2. **Badges** (`components/ui/badge.jsx`):
   - Semantic variants + `rating={rating}` prop for Codeforces difficulty badges.
3. **Cards & Panels** (`components/ui/card.jsx`):
   - Variants: `primary`, `secondary`, `elevated`, `interactive`.
   - Subcomponents: `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`.
4. **Inputs & Search** (`components/ui/input.jsx`):
   - Clean border transitions, clear focus ring (`.focus-ring`), keyboard shortcut support (`SearchInput`).
5. **Data Tables & Spreadsheets** (`components/ui/table.jsx`):
   - Sticky header support, clean row hover highlights, monospace number/status alignments, and horizontal scroll preservation.
6. **Tabs** (`components/ui/tabs.jsx`):
   - Smooth Framer Motion active indicator (`layoutId="activeTabPill"`).
7. **Status Indicators** (`components/ui/status-indicator.jsx`):
   - Dot indicator with optional subtle ping.
8. **Empty & Loading States** (`components/ui/empty-state.jsx`, `components/ui/skeleton.jsx`):
   - Standardized placeholders ensuring zero jarring layout shifts.

---

## 6. Framer Motion Animation Philosophy

- **Duration**: 150ms to 220ms (micro-interactions), 250ms to 300ms (page & modal transitions).
- **Easing**: Custom high-speed smooth curve `[0.16, 1, 0.3, 1]`.
- **Reusable variants in `@/lib/animations.js`**:
  - `fadeIn`: Simple opacity reveal.
  - `slideUp`: 8px upward entrance.
  - `scaleIn`: Scale `0.97` -> `1` for modals/popovers.
  - `staggerContainer` & `staggerItem`: List item cascades with 0.04s delta.
  - `activeTabTransition`: Spring physics without overshoot.

---

## 7. Responsive Navigation & Layout Architecture

- **Desktop (1024px+)**: Fixed 256px sidebar (collapsible to 64px icon bar), sticky 56px top header, spacious content container.
- **Tablet (640px - 1024px)**: Compact collapsible navigation, adaptive grid columns.
- **Mobile (<640px)**: Slide-over drawer menu, bottom action sheets, horizontal scrolling data tables with sticky headers.

### Navigation Structure:
```text
Problem Solving Tracker
    ├── Workspace (Track submissions & solve matrix)
    └── Find People (Lookup handles & sync stats)
Utilities
    └── YT Playlist Extractor
```

---

## 8. Code Architecture & Folder Rules

```text
├── app/
│   ├── globals.css          # Design tokens & base theme rules
│   ├── layout.js            # Root layout with Geist Sans/Mono
│   └── page.js              # Home / Showcase
├── components/
│   ├── layout/              # Persistent layout wrappers
│   │   ├── app-shell.jsx    # Unified frame (Sidebar + Header + Main)
│   │   ├── sidebar.jsx      # Navigation sidebar with collapse state
│   │   └── header.jsx       # Header bar with breadcrumbs & global search
│   └── ui/                  # Atomized design system components
│       ├── avatar.jsx
│       ├── badge.jsx
│       ├── button.jsx
│       ├── card.jsx
│       ├── empty-state.jsx
│       ├── input.jsx
│       ├── progress.jsx
│       ├── skeleton.jsx
│       ├── status-indicator.jsx
│       ├── table.jsx
│       └── tabs.jsx
├── lib/
│   ├── animations.js        # Reusable Framer Motion presets & variants
│   ├── tokens.js            # Raw JS token definitions
│   └── utils.js             # Utility functions (cn)
└── DESIGN_SYSTEM.md         # Master design system spec
```

All future feature implementation prompts must import from `@/components/ui/`, `@/components/layout/`, `@/lib/tokens`, and `@/lib/animations` rather than creating inline ad-hoc styles.
