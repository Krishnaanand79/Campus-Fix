---
name: frontend-design
description: Design system skill for frontend. Activate when building UI components, pages, or any visual elements. Provides exact color tokens, typography scale, spacing grid, component patterns, and craft rules. Read references/DESIGN.md before writing any CSS or JSX.
---

# frontend Design System

You are building UI for **frontend**. Light-themed, cool palette, sans-serif typography (sans-serif), compact density on a 4px grid.

## Design Philosophy

- **Layered depth** — use shadow tokens to create a sense of physical layering. Each elevation level has a specific shadow.
- **Gradient accents** — gradients are used thoughtfully for emphasis, not decoration.
- **compact density** — 4px base grid. Every dimension is a multiple of 4.
- **cool palette** — the color temperature runs cool, matching the sans-serif typography.
- **Restrained accent** — `#06b6d4` is the only pop of color. Used exclusively for CTAs, links, focus rings, and active states.
- **Subtle motion** — transitions smooth state changes. Keep durations under 300ms, use ease-out curves.
- **Lucide icons** — use Lucide for all iconography. Do not mix icon libraries.

## Color System

### Core Palette

| Role | Token | Hex | Use |
|------|-------|-----|-----|
| Background | `--background` | `#f8fafc` | Page/app background |
| Surface | `--surface` | `#6366f1` | Cards, panels, modals |
| Text Primary | `--text-primary` | `#0f172a` | Headings, body text |
| Text Muted | `--text-muted` | `#94a3b8` | Captions, placeholders |
| Accent | `--accent` | `#06b6d4` | CTAs, links, focus rings |

### Status Colors

| Status | Hex | Use |
|--------|-----|-----|
| Success | `#10b981` | Confirmations, positive trends |
| Warning | `#f59e0b` | Caution states, pending items |
| Danger | `#f43f5e` | Errors, destructive actions |

### Extended Palette

- **brand-violet:** `#8b5cf6` — Core brand color
- **brand-primary:** `#4f46e5` — Brand color for logo, CTAs, and primary emphasis
- **brand-darkBg:** `#0b0f19` — Core brand color
- **brand-primaryDark:** `#3730a3` — Brand color for logo, CTAs, and primary emphasis
- **brand-accentLight:** `#22d3ee` — Core brand color
- **brand-teal:** `#14b8a6` — Core brand color

### CSS Variable Tokens

```css
--bg-primary: #F8FAFC;
--bg-card: rgba(255,255,255,0.88);
--border-card: rgba(226,232,240,0.85);
--text-primary: #0F172A;
--text-muted: #64748B;
```

## Typography

### Font Stack


### Type Scale

| Role | Family | Size | Weight |
|------|--------|------|--------|

### Typography Rules

- All text uses **sans-serif** — never add another font family
- Max 3-4 font sizes per screen
- Headings: weight 600-700, body: weight 400
- Use color and opacity for text hierarchy, not additional font sizes
- Line height: 1.5 for body, 1.2 for headings

## Spacing & Layout

### Base Grid: 4px

Every dimension (margin, padding, gap, width, height) must be a multiple of **4px**.

### Spacing Scale

`2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 24, 28` px

### Spacing as Meaning

| Spacing | Use |
|---------|-----|
| 4-8px | Tight: related items (icon + label, avatar + name) |
| 12-16px | Medium: between groups within a section |
| 24-32px | Wide: between distinct sections |
| 48px+ | Vast: major page section breaks |

### Border Radius

Scale: `4px, 5px, 8px, 12px, 16px, 24px`
Default: `12px`

### Container

Max-width: `1024px`, centered with auto margins.

### Breakpoints

| Name | Value |
|------|-------|
| sm | 640px |
| md | 768px |
| lg | 1024px |
| xl | 1280px |
| 2xl | 1536px |

Mobile-first: design for small screens, layer on responsive overrides.

## Component Patterns

### Card

```css
.card {
  background: #6366f1;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 0 0 3px rgba(99,102,241,0.25);
}
```

```html
<div class="card">
  <h3>Card Title</h3>
  <p>Card content goes here.</p>
</div>
```

### Button

```css
/* Primary */
.btn-primary {
  background: #06b6d4;
  color: #0f172a;
  border-radius: 12px;
  padding: 8px 16px;
  font-weight: 500;
  transition: opacity 150ms ease;
}
.btn-primary:hover { opacity: 0.9; }

/* Ghost */
.btn-ghost {
  background: transparent;
  border: 1px solid #cccccc;
  color: #0f172a;
  border-radius: 12px;
  padding: 8px 16px;
}
```

```html
<button class="btn-primary">Get Started</button>
<button class="btn-ghost">Learn More</button>
```

### Input

```css
.input {
  background: #f8fafc;
  border: 1px solid #cccccc;
  border-radius: 12px;
  padding: 8px 12px;
  color: #0f172a;
  font-size: 14px;
}
.input:focus { border-color: #06b6d4; outline: none; }
```

```html
<input class="input" type="text" placeholder="Search..." />
```

### Badge / Chip

```css
.badge {
  display: inline-flex;
  align-items: center;
  padding: 4px 8px;
  border-radius: 9999px;
  font-size: 12px;
  font-weight: 500;
  background: #6366f1;
  color: #94a3b8;
}
```

```html
<span class="badge">New</span>
<span class="badge">Beta</span>
```

### Modal / Dialog

```css
.modal-backdrop { background: rgba(0, 0, 0, 0.6); }
.modal {
  background: #6366f1;
  border-radius: 24px;
  padding: 24px;
  max-width: 480px;
  width: 90vw;
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.36);
}
```

```html
<div class="modal-backdrop">
  <div class="modal">
    <h2>Dialog Title</h2>
    <p>Dialog content.</p>
    <button class="btn-primary">Confirm</button>
    <button class="btn-ghost">Cancel</button>
  </div>
</div>
```

### Table

```css
.table { width: 100%; border-collapse: collapse; }
.table th {
  text-align: left;
  padding: 8px 12px;
  font-weight: 500;
  font-size: 12px;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-bottom: 1px solid #cccccc;
}
.table td {
  padding: 12px;
  border-bottom: 1px solid #cccccc;
}
```

```html
<table class="table">
  <thead><tr><th>Name</th><th>Status</th><th>Date</th></tr></thead>
  <tbody>
    <tr><td>Item One</td><td>Active</td><td>Jan 1</td></tr>
    <tr><td>Item Two</td><td>Pending</td><td>Jan 2</td></tr>
  </tbody>
</table>
```

### Navigation

```css
.nav {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
}
.nav-link {
  color: #94a3b8;
  padding: 8px 12px;
  border-radius: 12px;
  transition: color 150ms;
}
.nav-link:hover { color: #0f172a; }
.nav-link.active { color: #06b6d4; }
```

```html
<nav class="nav">
  <a href="/" class="nav-link active">Home</a>
  <a href="/about" class="nav-link">About</a>
  <a href="/pricing" class="nav-link">Pricing</a>
  <button class="btn-primary" style="margin-left: auto">Get Started</button>
</nav>
```

### Extracted Components

These components were found in the codebase:

**StatusChangeModal** (`src/components/admin/StatusChangeModal.jsx`)
- Variants: `UNDER_REVIEW`
- Props: `issue`, `isOpen`, `onClose`, `onSuccess`
- Styles: `bg-black/60`, `rounded-3xl`, `p-4`, `text-slate-400`, `backdrop-blur-sm`

**WorkerAssignmentModal** (`src/components/admin/WorkerAssignmentModal.jsx`)
- Props: `issue`, `isOpen`, `onClose`, `onSuccess`
- Styles: `bg-black/60`, `rounded-3xl`, `p-4`, `text-slate-400`, `backdrop-blur-sm`

**Badge** (`src/components/common/Badge.jsx`)
- Props: `status`
- Styles: `rounded-full`, `ml-1`, `font-mono`, `opacity-80`

**CategoryIcons** (`src/components/common/CategoryIcons.jsx`)
- Props: `category`, `className`
- Styles: `rounded-full`, `backdrop-blur-sm`

**DemoSwitcher** (`src/components/common/DemoSwitcher.jsx`)
- Styles: `bg-indigo-500/10`, `rounded-xl`, `gap-1.5`, `text-left`, `shadow-sm`

**Footer** (`src/components/common/Footer.jsx`)
- Styles: `bg-gradient-to-br`, `border-t`, `mt-16`, `font-extrabold`, `shadow-glowBrand`

**Navbar** (`src/components/common/Navbar.jsx`)
- Variants: `User`
- Styles: `bg-gradient-to-br`, `border-b`, `mx-auto`, `font-extrabold`, `shadow-glowBrand`

**NotificationDropdown** (`src/components/common/NotificationDropdown.jsx`)
- Styles: `bg-gradient-to-r`, `rounded-xl`, `p-2`, `text-rose-500`, `shadow-glowBrand`

**DuplicateWarningModal** (`src/components/feed/DuplicateWarningModal.jsx`)
- Props: `isOpen`, `duplicates`, `onUpvoteExisting`, `onProceedAnyway`, `onClose`
- Styles: `bg-black/60`, `rounded-3xl`, `p-4`, `text-slate-400`, `backdrop-blur-sm`

**IssueCard** (`src/components/feed/IssueCard.jsx`)
- Props: `issue`, `onUpvoteChange`
- Styles: `bg-slate-900/20`, `rounded-3xl`, `gap-1.5`, `text-white`, `drop-shadow`

## Animation & Motion

This project uses **subtle motion**. Transitions smooth state changes without calling attention.

### CSS Animations

- `animate-fadeIn`
- `animate-pulse`
- `animate-pulse-subtle`
- `animate-spin`

### Motion Tokens

- **Duration scale:** `300ms`
- **Animated properties:** `border-color`

### Motion Guidelines

- **Duration:** Use values from the duration scale above. Short (300ms) for micro-interactions, long (300ms) for page transitions
- **Easing:** `ease-out` for enters, `ease-in` for exits
- **Direction:** Elements enter from bottom/right, exit to top/left
- **Reduced motion:** Always respect `prefers-reduced-motion` — disable animations when set

## Dark Mode

This project supports **light and dark mode** via CSS variables.

### Token Mapping

| Variable | Light | Dark |
|----------|-------|------|
| `--bg-primary` | `#F8FAFC` | `#0B0F19` |
| `--bg-card` | `rgba(255, 255, 255, 0.88)` | `rgba(15, 23, 42, 0.75)` |
| `--border-card` | `rgba(226, 232, 240, 0.85)` | `rgba(255, 255, 255, 0.08)` |
| `--text-primary` | `#0F172A` | `#F8FAFC` |
| `--text-muted` | `#64748B` | `#94A3B8` |

### Implementation

- Toggle via `.dark` class on `<html>` or `[data-theme="dark"]`
- Always use CSS variables for colors — never hardcode hex values
- Test both modes for contrast and readability

## Depth & Elevation

### Shadow Tokens

- Raised (cards, buttons): `0 0 0 3px rgba(99,102,241,0.25)`
- **glass** (Overlay (modals, dialogs)): `0 8px 32px 0 rgba(0, 0, 0, 0.36)`
- **glassLight** (Overlay (modals, dialogs)): `0 8px 30px 0 rgba(148, 163, 184, 0.12)`
- **glowBrand** (Overlay (modals, dialogs)): `0 0 25px -5px rgba(79, 70, 229, 0.45)`
- **glowCyan** (Overlay (modals, dialogs)): `0 0 25px -5px rgba(6, 182, 212, 0.45)`
- **glowEmerald** (Overlay (modals, dialogs)): `0 0 25px -5px rgba(16, 185, 129, 0.45)`

### Z-Index Scale

`0, 1`

Use these exact values — never invent z-index values.

## Anti-Patterns (Never Do)

- **No zebra striping** — tables and lists use borders for separation
- **No invented colors** — every hex value must come from the palette above
- **No arbitrary spacing** — every dimension is a multiple of 4px
- **No arbitrary border-radius** — use the scale: 4px, 5px, 8px, 12px, 16px, 24px
- **No opacity for disabled states** — use muted colors instead

## Workflow

1. **Read** `references/DESIGN.md` before writing any UI code
2. **Pick colors** from the Color System section — never invent new ones
3. **Set typography** — project font only, using the type scale
4. **Build layout** on the 4px grid — check every margin, padding, gap
5. **Match components** to patterns above before creating new ones
6. **Apply elevation** — use shadow tokens
7. **Validate** — every value traces back to a design token. No magic numbers.

## Brand Spec

- **Brand color:** `#06b6d4`

## Quick Reference

```
Background:     #f8fafc
Surface:        #6366f1
Text:           #0f172a / #94a3b8
Accent:         #06b6d4
Border:         (not extracted)
Font:           sans-serif
Spacing:        4px grid
Radius:         12px
Frameworks:     Tailwind CSS, React
Icons:          Lucide
Components:     26 detected
```

## When to Trigger

Activate this skill when:
- Creating new components, pages, or visual elements for frontend
- Writing CSS, Tailwind classes, styled-components, or inline styles
- Building page layouts, templates, or responsive designs
- Reviewing UI code for design consistency
- The user mentions "frontend" design, style, UI, or theme
- Generating mockups, wireframes, or visual prototypes

---

# Full Reference Files

> Every output file is embedded below. Claude has full design system context from /skills alone.

## Design System Tokens (DESIGN.md)

# frontend DESIGN.md

> Auto-generated design system — reverse-engineered via static analysis by skillui.
> Frameworks: Tailwind CSS 3.4.19 + React 19.2.8
> Colors: 17 · Fonts: 0 · Components: 26
> Icon library: Lucide · State: not detected
> Primary theme: light · Dark mode toggle: yes · Motion: subtle

---

## 1. Visual Theme & Atmosphere

This is a **light-themed** interface with a cool, approachable feel. The light background emphasizes content clarity. Typography uses **sans-serif** throughout — a clean, modern choice that maintains consistency. Spacing follows a **4px base grid** (compact density), with scale: 2, 4, 6, 8, 10, 12, 14, 16px. The accent color **#06b6d4** anchors interactive elements (buttons, links, focus rings). Motion is subtle — smooth transitions (150-300ms) ease state changes without drawing attention.

---

## 2. Color Palette & Roles

| Token | Hex | Role | Use |
|---|---|---|---|
| brand-lightBg | `#f8fafc` | background | Page background, darkest surface |
| brand-primaryLight | `#6366f1` | surface | Card and panel backgrounds |
| border-card | `#e2e8f0` | surface | Card and panel backgrounds |
| text-primary | `#0f172a` | text-primary | Headings and body text |
| text-muted | `#94a3b8` | text-muted | Captions, placeholders, secondary info |
| text-muted | `#64748b` | text-muted | Captions, placeholders, secondary info |
| brand-accent | `#06b6d4` | accent | CTAs, links, focus rings, active states |
| brand-sky | `#0284c7` | accent | CTAs, links, focus rings, active states |
| brand-rose | `#f43f5e` | danger | Error states, destructive actions |
| brand-emerald | `#10b981` | success | Success states, positive indicators |
| brand-amber | `#f59e0b` | warning | Warning states, caution indicators |
| brand-violet | `#8b5cf6` | info | Informational highlights |
| brand-primary | `#4f46e5` | unknown | Palette color |
| brand-darkBg | `#0b0f19` | unknown | Palette color |
| brand-primaryDark | `#3730a3` | unknown | Palette color |
| brand-accentLight | `#22d3ee` | unknown | Palette color |
| brand-teal | `#14b8a6` | unknown | Palette color |

### Dark Mode Token Mapping

| Variable | Light | Dark |
|---|---|---|
| `--bg-primary` | `#F8FAFC` | `#0B0F19` |
| `--bg-card` | `rgba(255, 255, 255, 0.88)` | `rgba(15, 23, 42, 0.75)` |
| `--border-card` | `rgba(226, 232, 240, 0.85)` | `rgba(255, 255, 255, 0.08)` |
| `--text-primary` | `#0F172A` | `#F8FAFC` |
| `--text-muted` | `#64748B` | `#94A3B8` |

### CSS Variable Tokens

```css
--bg-primary: #F8FAFC;
--bg-card: rgba(255,255,255,0.88);
--border-card: rgba(226,232,240,0.85);
--text-primary: #0F172A;
--text-muted: #64748B;
```


---

## 3. Typography Rules

No typography tokens detected.

---

## 4. Component Stylings

### Layout (7)

**CategoryIcons** — `src/components/common/CategoryIcons.jsx`
- Props: `category`, `className`
- Key Styles: `rounded-full`, `backdrop-blur-sm`

```tsx
<span className={`inline-flex items-center rounded-full border backdrop-blur-sm ${config.lightBg} ${sizeClasses}`}>
      <span className={size === 'xs' ? 'w-3 h-3' : size === 'lg' ? 'w-4 h-4' : 'w-3.5 h-3.5'}>
        {config.svg}
      </span>
      <span>{category}</span>
    </span>
```

**Footer** — `src/components/common/Footer.jsx`
- Key Styles: `rounded-xl`, `border-slate-200/70`, `bg-gradient-to-br`, `mt-16`, `text-lg`, `font-extrabold`, `shadow-glowBrand`
- Animation: tw-animate-pulse, tw-transitions: transition-colors

```tsx
<footer className="w-full glass-panel border-t border-slate-200/70 dark:border-slate-800/80 mt-16 py-10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Col 1: Brand & Vision */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl overflow-hidden p-0.5 bg-gradient-to-br from-indigo-500 via-blue-500 to-cyan-400 shadow-glowBrand">
                <img src="/logo.svg" alt="CampusFix" className="w-full h-full object-contain" />
              </div>
              <span className="font-extrabold text-lg bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 dark:from-indigo-400 dark:via-sky-400 dark:to-cyan-300 bg-clip-text text-transparent">
                CampusFix
              </span>
```

**DuplicateWarningModal** — `src/components/feed/DuplicateWarningModal.jsx`
- Props: `isOpen`, `duplicates`, `onUpvoteExisting`, `onProceedAnyway`, `onClose`
- Key Styles: `rounded-3xl`, `border-indigo-500/40`, `bg-black/60`, `p-4`, `text-base`, `font-bold`, `backdrop-blur-sm`, `hover:text-slate-600`
- Animation: tw-animate-fadeIn, tw-transitions: transition-all

```tsx
<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="glass-panel rounded-3xl max-w-xl w-full p-6 sm:p-7 relative border border-indigo-500/40 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800/50"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2.5 text-indigo-600 dark:text-cyan-400 mb-2">
          <div className="p-2 rounded-xl bg-indigo-500/20">
            <AlertCircle className="w-5 h-5" />
```

**IssueFilterBar** — `src/components/feed/IssueFilterBar.jsx`
- Props: `search`, `setSearch`, `category`, `setCategory`, `block`, `setBlock`, `status`, `setStatus` (+3 more)
- Key Styles: `rounded-3xl`, `border-slate-200/70`, `p-4`, `text-xs`, `font-semibold`, `shadow-glass`, `focus:ring-2`
- Animation: tw-transitions: transition-all

```tsx
<div className="glass-panel rounded-3xl p-4 sm:p-5 mb-6 space-y-4 border border-slate-200/70 dark:border-slate-800/80 shadow-glass">
      {/* Top Search & Filter Bar */}
      <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
        {/* Search Bar */}
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e
```

**BeforeAfterViewer** — `src/components/issues/BeforeAfterViewer.jsx`
- Props: `proof`, `originalImages`
- Key Styles: `rounded-3xl`, `border-emerald-500/30`, `bg-emerald-500/5`, `p-6`, `text-sm`, `font-bold`, `shadow-glass`
- State: useState

```tsx
<div className="glass-card rounded-3xl p-6 sm:p-7 border border-emerald-500/30 dark:border-emerald-500/20 bg-emerald-500/5 shadow-glass">
      <div className="flex items-center justify-between gap-4 mb-5">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-500">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100">
              Work Completed & Proof of Resolution
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Verified physical evidence submitted by the assigned maintenance technician
```

**IssueTimeline** — `src/components/issues/IssueTimeline.jsx`
- Variants: `System`
- Props: `timeline`, `currentStatus`
- Key Styles: `rounded-3xl`, `border-slate-200/70`, `bg-indigo-500/10`, `p-6`, `text-base`, `font-bold`, `shadow-glass`

```tsx
<div className="glass-card rounded-3xl p-6 sm:p-7 border border-slate-200/70 dark:border-slate-800/80 shadow-glass">
      <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-6 flex items-center justify-between">
        <span>Issue Lifecycle & Audit Trail</span>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-cyan-400 border border-indigo-500/20">
          Current: {currentStatus}
        </span>
      </h3>

      <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-gradient-to-b before:from-indigo-500 before:via-sky-500 before:to-emerald-500">
        {timeline.map((event, index
```

**AdminAnalyticsPage** — `src/pages/AdminAnalyticsPage.jsx`
- Props: `w.ratingsCount`
- Key Styles: `rounded-full`, `border-4`, `bg-indigo-500/15`, `mx-auto`, `text-sm`, `font-bold`, `shadow-glass`
- Animation: tw-animate-spin, tw-transitions: transition-all, duration-500
- State: useState

```tsx
<div className="max-w-6xl mx-auto px-4 py-16 text-center text-slate-400">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm">Calculating campus infrastructure metrics and worker scorecards...</p>
      </div>
```

### Navigation (9)

**DemoSwitcher** — `src/components/common/DemoSwitcher.jsx`
- Key Styles: `rounded-xl`, `border-indigo-500/30`, `bg-indigo-500/10`, `gap-1.5`, `text-xs`, `font-semibold`, `shadow-sm`, `hover:bg-indigo-500/20`
- Animation: tw-transitions: transition-all
- State: useState

```tsx
<div className="relative inline-block text-left">
      <button
        onClick={(
```

**Navbar** — `src/components/common/Navbar.jsx`
- Variants: `User`
- Key Styles: `rounded-xl`, `border-slate-200/70`, `bg-gradient-to-br`, `mx-auto`, `text-lg`, `font-extrabold`, `shadow-glowBrand`, `group-hover:scale-105`
- Animation: tw-animate-fadeIn, tw-transitions: transition-colors, transition-transform, transition-all, hover-transforms
- State: useState

```tsx
<header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-200/70 dark:border-slate-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 group shrink-0">
          <div className="relative w-9 h-9 rounded-xl overflow-hidden p-0.5 bg-gradient-to-br from-indigo-500 via-blue-500 to-cyan-400 shadow-glowBrand group-hover:scale-105 transition-transform">
            <img src="/logo.svg" alt="CampusFix Logo" className="w-full h-full object-contain" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 dark:from-indigo-400 dark:via-sky-400 dark:to-cyan-300 bg-clip-text text-transparent">
                CampusFix
              </span>
```

**IssueCard** — `src/components/feed/IssueCard.jsx`
- Props: `issue`, `onUpvoteChange`
- Key Styles: `rounded-3xl`, `border-slate-200/70`, `bg-slate-900/20`, `gap-1.5`, `text-xs`, `font-semibold`, `drop-shadow`, `hover:border-indigo-500/50`
- Animation: tw-transitions: transition-all, duration-300, transition-transform, duration-500, transition-colors, hover-transforms
- State: useState

```tsx
<div className="glass-card rounded-3xl overflow-hidden flex flex-col justify-between group border border-slate-200/70 dark:border-slate-800/80 hover:border-indigo-500/50 hover:shadow-glowBrand transition-all duration-300">
      <div>
        {/* Thumbnail Banner (if image exists
```

**HomeFeedPage** — `src/pages/HomeFeedPage.jsx`
- Variants: `All`
- Key Styles: `rounded-3xl`, `border-slate-200/70`, `bg-indigo-500/15`, `mx-auto`, `text-xs`, `font-bold`, `shadow-glass`, `hover:opacity-95`
- Animation: tw-animate-pulse, tw-animate-spin, tw-transitions: transition-all
- State: useState

**IssueDetailPage** — `src/pages/IssueDetailPage.jsx`
- Variants: `Reporter`, `General`, `Worker`
- Props: `priority`, `priorityScore`
- Key Styles: `rounded-full`, `border-4`, `bg-indigo-600`, `mx-auto`, `text-sm`, `font-bold`, `shadow-md`, `hover:text-indigo-600`
- Animation: tw-animate-spin, tw-animate-pulse-subtle, tw-transitions: transition-colors, transition-all
- State: useState

```tsx
<div className="max-w-4xl mx-auto px-4 py-16 text-center text-slate-400">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm">Loading complaint details and verification proof...</p>
      </div>
```

**LandingPage** — `src/pages/LandingPage.jsx`
- Props: `user?.role`
- Key Styles: `rounded-full`, `border-indigo-500/30`, `bg-gradient-to-tr`, `space-y-20`, `text-xs`, `font-bold`, `blur-3xl`, `pointer-events-none`
- Animation: tw-animate-spin, tw-animate-pulse, tw-transitions: transition-all, transition-colors, transition-transform

```tsx
<div className="space-y-20 pb-16 overflow-hidden">
      {/* 1. HERO SECTION */}
      <section className="relative pt-6 sm:pt-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Ambient background glow accents */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[650px] h-[380px] bg-gradient-to-tr from-indigo-500/20 via-sky-500/15 to-cyan-500/10 blur-3xl rounded-full pointer-events-none -z-10" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Typography & CTAs */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Pill Tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-indigo-500/15 text-indigo-600 dark:text-cyan-400 border border-indigo-500/30 backdrop-blur-md shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
```

**NotFoundPage** — `src/pages/NotFoundPage.jsx`
- Key Styles: `rounded-3xl`, `border-stone-200/70`, `bg-amber-500/10`, `px-4`, `text-3xl`, `font-extrabold`, `shadow-glass`, `hover:opacity-95`
- Animation: tw-transitions: transition-all

```tsx
<div className="min-h-[70vh] flex items-center justify-center px-4 py-16 text-center">
      <div className="glass-panel rounded-3xl p-8 max-w-md w-full border border-stone-200/70 dark:border-stone-800/80 shadow-glass space-y-4">
        <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-500 w-14 h-14 mx-auto flex items-center justify-center">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-extrabold text-stone-900 dark:text-stone-100">404</h1>
        <p className="text-sm font-semibold text-stone-700 dark:text-stone-300">
          Page Not Found
        </p>
        <p className="text-xs text-stone-500 dark:text-stone-400">
          The campus maintenance resource or page you are looking for does not exist or has been relocated.
        </p>
```

**UserDashboardPage** — `src/pages/UserDashboardPage.jsx`
- Variants: `User`
- Props: `myIssues.length`
- Key Styles: `rounded-3xl`, `border-slate-200/70`, `bg-indigo-500/15`, `mx-auto`, `text-xl`, `font-extrabold`, `shadow-glass`, `hover:opacity-95`
- Animation: tw-transitions: transition-all
- State: useState

```tsx
<div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Profile Banner */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-200/70 dark:border-slate-800/80 shadow-glass flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4 text-center sm:text-left">
          <img
            src={
              user?.avatar ||
              `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(user?.name || 'User'
```

*...and 1 more navigation components.*

### Data Display (3)

**StatusChangeModal** — `src/components/admin/StatusChangeModal.jsx`
- Variants: `UNDER_REVIEW`
- Props: `issue`, `isOpen`, `onClose`, `onSuccess`
- Key Styles: `rounded-3xl`, `border-slate-200/70`, `bg-black/60`, `p-4`, `text-base`, `font-bold`, `backdrop-blur-sm`, `hover:text-slate-600`
- Animation: tw-animate-fadeIn
- State: useState

```tsx
<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="glass-panel rounded-3xl max-w-md w-full p-6 relative border border-slate-200/70 dark:border-slate-800/80 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800/50"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2.5 text-indigo-600 dark:text-cyan-400 mb-2">
          <div className="p-2 rounded-xl bg-indigo-500/20">
            <Sliders className="w-5 h-5" />
```

**Badge** — `src/components/common/Badge.jsx`
- Props: `status`
- Key Styles: `rounded-full`, `ml-1`, `text-xs`, `font-mono`, `opacity-80`
- Animation: tw-animate-pulse, tw-animate-pulse-subtle

```tsx
<span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border backdrop-blur-md ${current.bg}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${current.dot}`}></span>
      {current.label}
    </span>
```

**AdminDashboardPage** — `src/pages/AdminDashboardPage.jsx`
- Key Styles: `rounded-3xl`, `border-slate-200/70`, `bg-indigo-500/15`, `mx-auto`, `text-xs`, `font-bold`, `shadow-glass`, `hover:opacity-95`
- Animation: tw-animate-spin, tw-transitions: transition-colors, transition-opacity, hover-transforms
- State: useState

```tsx
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header Banner */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-200/70 dark:border-slate-800/80 shadow-glass flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/15 text-indigo-600 dark:text-cyan-400 border border-indigo-500/30 mb-2">
            <Shield className="w-3.5 h-3.5" />
            <span>Campus Operations & Estate Directorate</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100">
            Maintenance Command Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
```

### Data Input (6)

**WorkerAssignmentModal** — `src/components/admin/WorkerAssignmentModal.jsx`
- Props: `issue`, `isOpen`, `onClose`, `onSuccess`
- Key Styles: `rounded-3xl`, `border-slate-200/70`, `bg-black/60`, `p-4`, `text-base`, `font-bold`, `backdrop-blur-sm`, `hover:text-slate-600`
- Animation: tw-animate-fadeIn, tw-transitions: transition-all
- State: useState

```tsx
<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="glass-panel rounded-3xl max-w-xl w-full p-6 sm:p-7 relative border border-slate-200/70 dark:border-slate-800/80 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800/50"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2.5 text-indigo-600 dark:text-cyan-400 mb-2">
          <div className="p-2 rounded-xl bg-indigo-500/20">
            <UserCheck className="w-5 h-5" />
```

**VerificationModal** — `src/components/verification/VerificationModal.jsx`
- Props: `issue`, `isOpen`, `onClose`, `onSuccess`
- Key Styles: `rounded-3xl`, `border-slate-200/70`, `bg-black/60`, `p-4`, `text-lg`, `font-bold`, `backdrop-blur-sm`, `hover:text-slate-600`
- Animation: tw-animate-fadeIn, tw-transitions: transition-all, transition-transform, transition-colors, hover-transforms
- State: useState

```tsx
<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="glass-panel rounded-3xl max-w-lg w-full p-6 sm:p-7 relative border border-slate-200/70 dark:border-slate-800/80 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800/50"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="mb-5">
          <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
            Reporter Verification Required
```

**ProofUploadModal** — `src/components/worker/ProofUploadModal.jsx`
- Props: `task`, `isOpen`, `onClose`, `onSuccess`
- Key Styles: `rounded-3xl`, `border-slate-200/70`, `bg-black/60`, `p-4`, `text-base`, `font-bold`, `backdrop-blur-sm`, `hover:text-slate-600`
- Animation: tw-animate-fadeIn, tw-transitions: transition-colors
- State: useState

```tsx
<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="glass-panel rounded-3xl max-w-lg w-full p-6 sm:p-7 relative border border-slate-200/70 dark:border-slate-800/80 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800/50"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2.5 text-emerald-600 dark:text-emerald-400 mb-2">
          <div className="p-2 rounded-xl bg-emerald-500/20">
            <ShieldCheck className="w-5 h-5" />
```

**LoginPage** — `src/pages/LoginPage.jsx`
- Key Styles: `rounded-3xl`, `border-slate-200/70`, `bg-gradient-to-br`, `px-4`, `text-xl`, `font-black`, `shadow-2xl`
- Animation: tw-transitions: transition-all, hover-transforms
- State: useState

```tsx
<div className="min-h-[85vh] flex items-center justify-center px-4 py-10">
      <div className="max-w-xl w-full glass-panel rounded-3xl p-6 sm:p-9 border border-slate-200/70 dark:border-slate-800/80 shadow-2xl space-y-7 relative">
        {/* Header */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2 group mb-1">
            <div className="w-10 h-10 rounded-2xl overflow-hidden p-0.5 bg-gradient-to-br from-indigo-500 via-blue-500 to-cyan-400 shadow-glowBrand">
              <img src="/logo.svg" alt="CampusFix" className="w-full h-full object-contain" />
            </div>
            <span className="font-black text-xl tracking-tight bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 dark:from-indigo-400 dark:via-sky-400 dark:to-cyan-300 bg-clip-text text-transparent">
              CampusFix
            </span>
          </Link>
```

**RegisterPage** — `src/pages/RegisterPage.jsx`
- Props: `name`, `email`, `password`, `role`, `department`, `phone`
- Key Styles: `rounded-3xl`, `border-slate-200/70`, `bg-gradient-to-br`, `px-4`, `text-2xl`, `font-extrabold`, `shadow-glass`, `cursor-pointer`
- Animation: tw-transitions: transition-all, hover-transforms
- State: useState

```tsx
<div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full glass-panel rounded-3xl p-6 sm:p-8 border border-slate-200/70 dark:border-slate-800/80 shadow-glass space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex w-12 h-12 rounded-2xl overflow-hidden p-0.5 bg-gradient-to-br from-indigo-500 via-blue-500 to-cyan-400 shadow-glowBrand">
            <img src="/logo.svg" alt="CampusFix" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">
            Create CampusFix Account
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Join your university maintenance & operations network
          </p>
```

**ReportIssuePage** — `src/pages/ReportIssuePage.jsx`
- Key Styles: `rounded-full`, `border-indigo-500/30`, `bg-indigo-500/15`, `mx-auto`, `text-xs`, `font-bold`, `shadow-glass`, `focus:ring-2`
- Animation: tw-transitions: transition-all, transition-colors, hover-transforms
- State: useState

```tsx
<div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/15 text-indigo-600 dark:text-cyan-400 border border-indigo-500/30 mb-2">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>New Campus Maintenance Ticket</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100">
          Report an Infrastructure Problem
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Detailed location and clear descriptions allow technicians to diagnose and repair issues rapidly.
```

### Feedback (1)

**NotificationDropdown** — `src/components/common/NotificationDropdown.jsx`
- Key Styles: `rounded-xl`, `border-slate-200/70`, `bg-gradient-to-r`, `p-2`, `text-sm`, `font-bold`, `shadow-glowBrand`, `hover:text-indigo-600`
- Animation: tw-animate-pulse, tw-transitions: transition-all
- State: useState, useRef



---

## 5. Layout Principles

- **Base spacing unit:** 4px
- **Spacing scale:** 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 24, 28
- **Border radius:** 4px, 5px, 8px, 12px, 16px, 24px
- **Max content width:** 1024px
- **Grid usage:** `grid-cols-1`, `grid-cols-2`, `col-span-2`, `grid-cols-4`
- **Container:** Tailwind `container` class with responsive padding

**Spacing as Meaning:**
| Spacing | Use |
|---|---|
| 4-8px | Tight: related items within a group |
| 12-16px | Medium: between groups |
| 24-32px | Wide: between sections |
| 48px+ | Vast: major section breaks |


---

## 6. Depth & Elevation

### Raised — cards, buttons, interactive elements

- `0 0 0 3px rgba(99,102,241,0.25)`

### Overlay — full-screen overlays, top-level dialogs

- **glass:** `0 8px 32px 0 rgba(0, 0, 0, 0.36)`
- **glassLight:** `0 8px 30px 0 rgba(148, 163, 184, 0.12)`
- **glowBrand:** `0 0 25px -5px rgba(79, 70, 229, 0.45)`

### Z-Index Scale

`0, 1`



---

## 7. Animation & Motion

This project uses **subtle motion**. Transitions smooth state changes without demanding attention.

### CSS Animations

- `@keyframes animate-fadeIn`
- `@keyframes animate-pulse`
- `@keyframes animate-pulse-subtle`
- `@keyframes animate-spin`

### Animated Components

- **StatusChangeModal**: tw-animate-fadeIn
- **WorkerAssignmentModal**: tw-animate-fadeIn, tw-transitions: transition-all
- **Badge**: tw-animate-pulse, tw-animate-pulse-subtle
- **DemoSwitcher**: tw-transitions: transition-all
- **Footer**: tw-animate-pulse, tw-transitions: transition-colors

### Motion Guidelines

- Duration: 150-300ms for micro-interactions, 300-500ms for page transitions
- Easing: `ease-out` for enters, `ease-in` for exits
- Always respect `prefers-reduced-motion`


---

## 8. Do's and Don'ts

### Do's

- Use `#06b6d4` for interactive elements (buttons, links, focus rings)
- Use `#f8fafc` as the primary page background
- Follow the **4px** spacing grid for all margins, padding, and gaps
- Use the defined shadow tokens for elevation — see Section 6
- Use border-radius from the scale: 4px, 5px, 8px, 12px, 16px
- Reuse existing components from Section 4 before creating new ones
- Use **Lucide** for all icons
- Always use CSS variables for colors — never hardcode hex
- Test both light and dark modes for contrast

### Don'ts

- Don't introduce colors outside this palette — extend the design tokens first
- Don't use arbitrary spacing values — stick to multiples of 4px
- Don't create custom box-shadow values outside the system tokens
- Don't use arbitrary border-radius values — pick from the defined scale
- Don't duplicate component patterns — check Section 4 first
- Don't mix icon libraries — consistency matters


---

## 9. Responsive Behavior

| Name | Value | Source |
|---|---|---|
| sm | 640px | tailwind |
| md | 768px | tailwind |
| lg | 1024px | tailwind |
| xl | 1280px | tailwind |
| 2xl | 1536px | tailwind |

**Approach:** Mobile-first using Tailwind responsive prefixes (`sm:`, `md:`, `lg:`, `xl:`, `2xl:`).
Always design for mobile first, then layer on responsive overrides.


---

## 10. Agent Prompt Guide

Use these as starting points when building new UI:

### Build a Card

```
Background: #6366f1
Border: 1px solid var(--border)
Radius: 12px
Padding: 16px
Font: sans-serif
Use shadow tokens from Section 6.
```

### Build a Button

```
Primary: bg #06b6d4, text white
Ghost: bg transparent, border var(--border)
Padding: 8px 16px
Radius: 12px
Hover: opacity 0.9 or lighter shade
Focus: ring with #06b6d4
```

### Build a Page Layout

```
Background: #f8fafc
Max-width: 1024px, centered
Grid: 4px base
Responsive: mobile-first, breakpoints from Section 9
```

### Build a Stats Card

```
Surface: #6366f1
Label: #94a3b8 (muted, 12px, uppercase)
Value: #0f172a (primary, 24-32px, bold)
Status: use success/warning/danger from Section 2
```

### Build a Form

```
Input bg: #f8fafc
Input border: 1px solid var(--border)
Focus: border-color #06b6d4
Label: #94a3b8 12px
Spacing: 16px between fields
Radius: 12px
```

### General Component

```
1. Read DESIGN.md Sections 2-6 for tokens
2. Colors: only from palette
3. Font: sans-serif, type scale from Section 3
4. Spacing: 4px grid
5. Components: match patterns from Section 4
6. Elevation: shadow tokens
```

