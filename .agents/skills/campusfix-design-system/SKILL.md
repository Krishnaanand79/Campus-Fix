---
name: campusfix-design-system
description: Design system guidelines, color tokens, glassmorphism patterns, and component conventions for CampusFix web application.
---

# CampusFix Design System

## Overview
CampusFix utilizes a modern **Electric Indigo & Vivid Cyan Glassmorphism** design system with deep-space slate backgrounds. It departs completely from warm-brown/sepia tones in favor of crystalline, high-tech, and accessible UI aesthetics.

---

## 1. Color Palette & Semantics

### Primary Brand
- **Electric Indigo**:
  - `brand-500`: `#6366F1` (CSS `var(--brand-primary)`)
  - `brand-600`: `#4F46E5` (CSS `var(--brand-primary-hover)`)
  - `brand-400`: `#818CF8` (accent highlights)
- **Vivid Cyan**:
  - `accent-cyan`: `#06B6D4` / `#22D3EE` (CSS `var(--brand-cyan)`)
- **Gradients**:
  - Primary Brand Gradient: `bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500`
  - Glow Highlights: `shadow-[0_0_25px_rgba(79,70,229,0.35)]` and `shadow-[0_0_25px_rgba(6,182,212,0.35)]`

### Canvas & Backgrounds
- **Dark Mode**:
  - Page Background: `#0B0F19` (`dark:bg-[#0B0F19]`)
  - Glass Card Background: `rgba(15, 23, 42, 0.75)` with `backdrop-blur-xl`
  - Border Glass: `rgba(255, 255, 255, 0.08)` to `rgba(99, 102, 241, 0.2)`
- **Light Mode**:
  - Page Background: `#F8FAFC` (`bg-slate-50`)
  - Card Background: `rgba(255, 255, 255, 0.85)` with `backdrop-blur-xl`
  - Border Glass: `rgba(226, 232, 240, 0.8)`

### Status & Priority Palette
- **Reported / New**: Sky Blue (`bg-sky-500/10 text-sky-400 border-sky-500/20`)
- **Acknowledged / Queued**: Purple / Indigo (`bg-indigo-500/10 text-indigo-400 border-indigo-500/20`)
- **In Progress / Assigned**: Amber / Orange (`bg-amber-500/10 text-amber-400 border-amber-500/20`)
- **Resolved / Proof Uploaded**: Emerald Green (`bg-emerald-500/10 text-emerald-400 border-emerald-500/20`)
- **Critical / Emergency**: Rose / Coral (`bg-rose-500/10 text-rose-400 border-rose-500/20`)

---

## 2. Typography
- **Font Family**: Plus Jakarta Sans, Inter, system-ui, sans-serif
- **Headings**: High contrast font weight (`font-extrabold` or `font-bold`), tight tracking (`tracking-tight`), often paired with gradient text (`bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent`).
- **Body**: `text-slate-600 dark:text-slate-300`, line-height relaxed for optimal legibility.

---

## 3. Glassmorphism & Elevation Utilities

### Glass Card
```css
.glass-card {
  background: rgba(15, 23, 42, 0.65);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.5);
}
```

### Interactive Hover Effects
- Cards elevate with `-translate-y-1` or `-translate-y-0.5`.
- Border transitions smoothly: `border-slate-800 hover:border-indigo-500/40`.
- Ambient glow activation on hover.

---

## 4. Component Standards

### StatusBadge & PriorityBadge
- Must always include an animated or glowing dot indicator (`w-1.5 h-1.5 rounded-full animate-pulse`).
- Semantic rounded pill layout: `px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide border`.

### Buttons
- **Primary**: `bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-semibold shadow-lg shadow-indigo-500/25 active:scale-95 transition-all duration-200`.
- **Secondary / Ghost**: `bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 border border-slate-700/60 hover:border-indigo-500/30`.

### Form Controls
- Glass inputs with subtle slate border:
  `bg-slate-900/60 border border-slate-700/80 text-white placeholder-slate-500 rounded-xl focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition-all`.

---

## 5. SkillUI Integration

Static analysis and token extraction can be refreshed at any time using:
```bash
skillui --dir ./frontend
```
This generates:
- `frontend-design/DESIGN.md`: High-level design breakdown and color analysis.
- `frontend-design/frontend-design.skill`: Skill package containing token representations for AI agents.
