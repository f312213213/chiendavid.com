# Design System — chiendavid.com

A warm, editorial travel journal with polaroid aesthetics, grain textures, and purposeful motion.

---

## Color Tokens

Defined as CSS custom properties on `:root`, mapped to Tailwind via `@theme inline`.

| Token          | Light          | Dark           | Tailwind Class     |
|----------------|----------------|----------------|--------------------|
| `--background` | `#faf9f7`      | `#161413`      | `bg-background`    |
| `--foreground` | `#1a1a1a`      | `#f5f0eb`      | `text-foreground`  |
| `--muted`      | `#6b6560`      | `#9a928b`      | `text-muted`       |
| `--border`     | `#e8e4df`      | `#2e2a27`      | `border-border`    |
| `--accent`     | `#d95030`      | `#e8634a`      | `text-accent`      |

**Theme switching**: System preference by default (`prefers-color-scheme`), with explicit `.light`/`.dark` class overrides on `<html>`. Persisted in `localStorage('theme')`.

---

## Typography

| Role        | Font                | Tailwind        | Usage                              |
|-------------|---------------------|-----------------|--------------------------------------|
| Sans (body) | Exo 2 (Google)      | `font-sans`     | All body text, UI, captions          |
| Display     | Nabla (Google)      | `font-nabla`    | Hero title, error page codes         |

### Scale (recurring sizes)

| Size                   | Where used                                      |
|------------------------|--------------------------------------------------|
| `text-[9px]`–`text-[11px]` | Tooltip captions, badges, micro labels       |
| `text-xs`              | Subtitles, dates, footer, theme button           |
| `text-[10px]`          | Polaroid location label, view indicator          |
| `text-[13px]`          | Dialog date, image caption                       |
| `text-[15px]`          | Dialog description body                          |
| `text-sm`              | Nav links, buttons                               |
| `text-base`–`text-lg`  | Card titles, body text                           |
| `text-xl`–`text-3xl`   | Dialog title, error headings                     |
| `text-[4.5rem]`→`[14rem]` | Hero title (responsive clamp)                |

### Weight patterns

- **`font-light`** — Descriptive body text, taglines
- **`font-normal`** — Dialog location label
- **`font-semibold`** — Titles, nav links, buttons, card titles (dialog)
- **`font-bold`** — Subtitle, card titles (polaroid), badges, tracking labels

### Tracking patterns

- `tracking-[0.3em]` — Hero subtitle (widest)
- `tracking-[0.2em]` — Tooltip location label
- `tracking-[0.15em]` — View indicator, dialog location, badges
- `tracking-wider` / `tracking-widest` — Buttons, polaroid location
- `tracking-wide` — Theme button
- `tracking-tight` — Titles, headings

---

## Spacing & Layout

### Page gutters (responsive)

```
px-6         → md:px-12    → lg:px-20
```

### Content max-widths

| Container  | Class          | Usage                      |
|------------|----------------|----------------------------|
| Page       | `max-w-7xl`    | Hero content, grid, footer |
| Hero map   | `max-w-4xl`    | Dot map overlay            |
| Error page | `max-w-3xl`    | Error/404 content          |
| Body text  | `max-w-md`     | Error description           |
| Card       | `max-w-sm`     | Non-featured grid items    |

### Vertical rhythm

- Hero bottom padding: `pb-12 md:pb-32 lg:pb-40`
- Section gaps: `gap-8 md:gap-10 lg:gap-12` (grid)
- Content stacks: `gap-6` (hero content), `gap-4` (footer)

---

## Components

### Primary Button

```
px-5 py-2.5 text-sm font-semibold uppercase tracking-wider
border-2 bg-accent border-accent text-white
hover:opacity-85 transition-all duration-200
hover:-translate-y-0.5 active:scale-95
```

Used in: hero nav, error page, 404 page.

### Secondary Link

```
text-sm font-semibold uppercase tracking-wider
text-muted/60 hover:text-accent transition-colors duration-200
```

Used in: hero nav.

### Theme Toggle Button

```
text-xs font-medium tracking-wide uppercase
px-3 py-1.5 border border-border text-muted
hover:opacity-70 transition-all duration-200 cursor-pointer
```

### Overlay Control (close/nav arrows)

```
w-9 h-9 flex items-center justify-center rounded-full
bg-black/30 backdrop-blur-sm text-white/70
hover:bg-black/50 hover:text-white transition-all cursor-pointer
```

Used in: dialog close button, image navigation arrows.

### Polaroid Card

Composite component with layered visual effects:

| Layer              | Utility / Class     | Effect                                           |
|--------------------|---------------------|--------------------------------------------------|
| Container          | `polaroid-card`     | Transition on transform, box-shadow, border-color |
| Body               | `polaroid-body`     | `color-mix()` background, layered box-shadows     |
| Grain overlay      | `polaroid-grain`    | SVG fractal noise texture at 3.5% opacity         |
| Image vignette     | `polaroid-vignette` | Inset box-shadow darkening edges                  |
| Tape strip         | `polaroid-tape`     | Semi-transparent beige with blur                  |

**Hover behavior** (defined in globals.css):
- Card lifts 12px, rotation resets to 0deg
- Body shadow deepens, border turns accent
- Image saturates from 0.85 → 1.1
- Image scales 1.05x

### Polaroid Card Sizes

| Variant   | Image aspect | Title size            | Map width        |
|-----------|-------------|----------------------|------------------|
| Featured  | `2/1`       | `text-lg md:text-2xl` | `w-40 md:w-52`  |
| Standard  | `4/3`       | `text-base md:text-lg`| `w-40 md:w-28`  |

### Trip Detail Dialog

Two-panel layout: image (1.8fr) + content (1fr) on desktop, stacked on mobile.

- **Backdrop**: `bg-black/90` with fade-in animation
- **Popup**: Full viewport on mobile, `inset-8 lg:inset-12` on desktop, `rounded-lg`
- **Image panel**: Crossfade transitions, blurred background fill (desktop), swipe support (mobile)
- **Content panel**: Scrollable, grain overlay, dot map pinned to bottom (desktop)
- **Navigation**: Arrow buttons (desktop), swipe (mobile), keyboard arrows, dash indicators

### Dot Map

Two modes:
- **Hero (HeroDotMap)**: Interactive, clustered pins with HTML tooltip previews
- **Card (DotMap)**: Static, single-pin, decorative

Pin anatomy: outer glow circle (pulsing) + inner solid dot, both `fill-accent`.

### Hero Tooltip (Map Hover)

Mini polaroid card with:
- Connector line from pin to card
- Accent edge strip (3px)
- Dark card body (`bg-foreground/90`) with backdrop blur
- Staggered reveal animations (line → card → image → captions)
- Cluster badge showing `+N` count

---

## Animation System

### Entrance animations

| Utility        | Keyframe          | Duration | Easing                          |
|----------------|-------------------|----------|----------------------------------|
| `animate-in`   | `fade-up`         | 0.8s     | `cubic-bezier(0.16, 1, 0.3, 1)` |
| `dialog-backdrop` | `dialog-backdrop-in` | 0.2s | `ease-out`                    |
| `dialog-popup`    | `dialog-popup-in`    | 0.35s | `cubic-bezier(0.16, 1, 0.3, 1)` |
| `project-tooltip` | `tooltip-in`        | 0.15s | `ease-out`                     |

### Stagger delays

```
delay-1 → 0.1s    delay-2 → 0.2s    delay-3 → 0.4s
delay-4 → 0.6s    delay-5 → 0.9s
```

Used with `animate-in` for cascading hero entrance.

### Scroll reveal

Managed by `ScrollReveal` component (IntersectionObserver). Elements with `.scroll-reveal` start invisible and translate-y, then fade in when revealed.

```
Initial:  opacity-0 translate-y-8, duration-700
Revealed: opacity-100 translate-y-0
```

**Skip on reload**: If `scrollY > 300` on load, `.no-intro` class disables entrance animations.

### Continuous animations

- `pin-pulse`: 3s breathing (opacity + radius) on map pins, staggered by `:nth-child`
- `pin-highlight-flash`: 1.2s accent box-shadow burst when a trip card is scrolled to

### Tooltip sequence (HeroDotMap)

```
0.00s  tooltip-line     → connector draws outward
0.06s  tooltip-card-in  → card scales in with bounce
0.12s  tooltip-img-reveal → image clips open bottom-to-top
0.18s  tooltip-caption-in → location label fades up
0.24s  tooltip-caption-in → title fades up
0.30s  tooltip-caption-in → date fades up
```

### Shared easing

- **Primary**: `cubic-bezier(0.16, 1, 0.3, 1)` — used across most animations (expo-out)
- **Subtle**: `ease-out` — simpler transitions (hover states, dialog backdrop)

### Reduced motion

All scroll reveals, card transitions, pin pulses, and image filters are disabled under `prefers-reduced-motion: reduce`.

---

## Textures & Effects

### Grain overlay (global)

SVG `feTurbulence` noise applied via `body::before`, fixed position, 6% opacity, z-9999. Creates a film-grain feel across the entire page.

### Polaroid grain

Separate SVG noise on card bodies at 3.5% opacity. Tiled at 200px.

### Color-mix background

Polaroid body uses `color-mix(in srgb, var(--foreground) 4%, var(--background))` — a near-background tint that shifts correctly in both themes.

### Selection highlight

`::selection` uses accent background with white text.

---

## Responsive Breakpoints

Standard Tailwind breakpoints used throughout:

| Prefix | Min-width | Key changes                                    |
|--------|-----------|------------------------------------------------|
| (base) | 0         | Single column, centered text, stacked layouts  |
| `md:`  | 768px     | 2-col grid, left-aligned hero, dot map visible |
| `lg:`  | 1024px    | 3-col grid, wider gutters, larger dialog inset |
| `xl:`  | 1280px    | Larger hero title                              |

---

## Error Pages (404 / 500)

Shared layout pattern:
```
min-h-[100dvh] flex items-center justify-center
max-w-3xl mx-auto text-center
```

Content stack with staggered `animate-in`:
1. `delay-1` — Large Nabla error code
2. `delay-2` — Heading
3. `delay-3` — Description
4. `delay-4` — Primary button (back/retry)
