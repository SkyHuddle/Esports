# DESIGN.md — Esports Draft Games

> Source of truth: `app/src/styles/sister-tokens.css`, `app/src/index.css`,
> `app/tailwind.config.js`. Every value below is what ships in code. If you
> change a token, update this file.

## 1. Visual Theme & Atmosphere

A **dark premium editorial** esports platform built around the result, the
draft pick, and the share card. The register is **Stripe / Linear / Vercel /
VLR.gg / HLTV**: restraint, sharp hierarchy, thin borders, soft shadows,
controlled accents, precise spacing, high data density.

The base is a **flat neutral graphite** with the faintest cool tint, never pure
black, never violet. The UI recedes so the data and records read as the
subject. **Anton** carries every display lockup (scores, records, game titles)
in uppercase at maximum impact; **Space Grotesk** runs all UI chrome and body;
**JetBrains Mono** sets tabular numbers. Accent color is functional and earned,
never decorative.

**Physical scene:** a fan checks their daily run at 11pm on their phone, screen
brightness low, a tournament stream muted in another tab. The screen must be
immediately legible, feel expensive against the dark, and be worth a
screenshot.

**Key characteristics:**
- Flat graphite surfaces in a 4-level stack — no atmospheric glow, no mesh blobs
- **Soft directional shadows** for depth — never colored bloom, never a glow
- **Thin hairline borders** do the structural work on dark
- **Anton** for all display type; **Space Grotesk 400** body — the weight jump *is* the hierarchy
- One **restrained accent per game** (amber / gold / steel); gold is the win state
- Pill CTAs (`9999px`); cards and containers use a single radius scale (6–20px)
- Left-aligned editorial layout, compact spacing on an 8px base unit
- A near-invisible top wash + faint masked grid give texture without arcade glow

### Hard reset from the previous direction
The earlier system used violet-tinted near-black, glowing radial "mesh"
backgrounds, gold/amber `text-shadow` glows, gradient-filled accent cards, and
heavy bloom shadows. **All of that is removed.** Flat graphite, soft shadows,
hairline borders, restrained accents.

---

## 2. Color Palette & Roles

### Surface stack (darkest → elevated)
| Token | Hex | Level | Use |
|---|---|---|---|
| `--kb-bg-deep` | `#0a0b0d` | L0 | Page background, deepest |
| `--kb-bg-base` | `#0f1013` | L1 | Sections, sticky / brand bars |
| `--kb-bg-card` | `#15161a` | L2 | Cards, containers |
| `--kb-bg-elev` | `#1c1e23` | L3 | Elevated panels, hover, modals |
| `--kb-bg-inset` | `#0c0d10` | — | Recessed wells, inputs, tracks |

### Fills (sparing — not glassmorphism)
| Token | Value | Use |
|---|---|---|
| `--kb-fill` | `rgba(255,255,255,0.035)` | Quiet tertiary button / chip fill |
| `--kb-fill-strong` | `rgba(255,255,255,0.06)` | Hover fill |

### Borders
| Token | Value | Use |
|---|---|---|
| `--kb-border` | `rgba(255,255,255,0.08)` | Default card / control border |
| `--kb-border-strong` | `rgba(255,255,255,0.14)` | Hover / active / focus border |
| `--kb-hairline` | `rgba(255,255,255,0.045)` | Dividers, rules, stat-strip edges |

> `--kb-glass` / `--kb-glass-strong` exist only as legacy aliases of the two
> fills above so older class names keep working. There is no glassmorphism by
> default.

### Text ramp (warm off-white — never `#ffffff`)
| Token | Hex | Role |
|---|---|---|
| `--kb-fg` | `#ece8dd` | Primary text |
| `--kb-fg-soft` | `#b4afa3` | Body copy, secondary |
| `--kb-fg-mute` | `#797568` | Labels, metadata |
| `--kb-fg-faint` | `#4f4c46` | Disabled, placeholder |

### Brand accents (restrained, one per game)
| Token | Hex | Role |
|---|---|---|
| `--kb-amber` | `#f5631a` | Ring Chase / CoD identity, daily / urgency |
| `--kb-amber-hot` | `#ff7e3a` | Amber hover only |
| `--kb-gold` | `#e8b842` | Win state, championships, prestige (Golden Road / LoL) |
| `--kb-gold-deep` | `#b08a2e` | Second-tier OVR, dim gold |
| `--kb-steel` | `#7fa5c9` | Major Run / CS2 identity |
| `--kb-steel-dim` | `rgba(127,165,201,0.10)` | Steel tint fill |

### Semantic
| Token | Hex | Role |
|---|---|---|
| `--kb-crimson` | `#e8485c` | Errors, blocked, exit |
| `--kb-green` | `#34c98a` | Victory, win streaks, live dot |

> The Tailwind `kb.*` palette in `tailwind.config.js` mirrors these exact hex /
> rgba values so utilities like `text-kb-gold`, `bg-kb-card`, `border-kb-border`
> stay in sync with the CSS variables. Accent tints on bespoke cards are built
> with `color-mix(in srgb, <accent> N%, var(--kb-bg-card))` — flat tint, no
> gradient.

---

## 3. Typography

### Font families
| Role | Token | Family | Fallback |
|---|---|---|---|
| Display | `--kb-display` | **Anton** | `'Oswald', 'Arial Narrow', system-ui` |
| UI / Body | `--kb-ui` | **Space Grotesk** | `system-ui, sans-serif` |
| Mono / Data | `--kb-mono` | **JetBrains Mono** | `ui-monospace, monospace` |

Loaded in `app/index.html`. Anton is single-weight (400). Space Grotesk ships
400/500/600/700. JetBrains Mono uses `font-feature-settings: 'tnum'` for tabular
numbers (`.kb-mono`).

### Type scale (tokens, px)
| Token | Size | Use |
|---|---|---|
| `--kb-text-micro` | 10px | Badges, pill tags, chip text |
| `--kb-text-label` | 11px | Uppercase metadata, stat labels |
| `--kb-text-sm` | 13px | Secondary UI |
| `--kb-text-body` | 14px | Body copy |
| `--kb-text-md` | 16px | Emphasized body |

Display sizes are set per-context with Anton and live above the token scale
(roughly 24–36px card / section titles, ~48–72px game titles via `clamp()`,
~64–96px hero scores / records).

### Tracking helpers
| Token | Value | Use |
|---|---|---|
| `--kb-tracking-label` | `0.22em` | Uppercase labels (`.kb-label`) |
| `--kb-tracking-eyebrow` | `0.32em` | Sport eyebrows (`.kb-eyebrow`) |

Utility classes: `.font-display` (Anton, uppercase, `0.01em`), `.kb-eyebrow`
(10px / 0.32em / 600), `.kb-label` (11px / 0.22em / 600 / muted), `.kb-mono`.

### Typography laws
- **Anton is uppercase only.** Never titlecase Anton.
- **Compact range.** Body tops out at 16px; most UI labels are 10–11px.
- **Weight contrast is the hierarchy.** Anton display vs Space Grotesk 400 body.
  Don't insert medium-weight headers that flatten the contrast.
- **No gradient text** (`background-clip: text`).
- **No em dashes in copy.** Use commas, colons, or periods.

---

## 4. Component Stylings

### CTAs (pill, `9999px`)
States: default / hover / active / disabled (+ keyboard focus ring §6).

- **`kb-cta-gold`** — bg `--kb-gold`, text `#100b02`, `--kb-shadow-cta`. Hover
  `brightness(1.05)`; active `translateY(0.5px)` + `brightness(0.98)`.
- **`kb-cta-amber`** — bg `--kb-amber`, text `#160a04`, same shape / states.
- **`kb-cta-steel`** — bg `--kb-steel`, text `#07101a`, same shape / states.
- **`kb-cta-glass`** (tertiary, quiet outline) — `--kb-fill` bg + `--kb-border`;
  hover `--kb-fill-strong` + `--kb-border-strong`. No blur fill.
- Disabled: `opacity` reduced, no pointer events. `.kb-cta-icon` is the trailing
  circular arrow that nudges `+2px` on group hover.

### Cards (`.kb-card`)
- Background `--kb-bg-card`, `1px solid --kb-border`, radius `--kb-r-md` (12px),
  `box-shadow: --kb-shadow-card`, `overflow: hidden`.
- **Hover** (`.kb-card-hover`): border → `--kb-border-strong`, bg → `--kb-bg-elev`.
- **Accent variants** raise only the border, no bloom:
  `kb-card-accent-gold` / `-amber` / `-steel` set the border to the accent at
  ~22% alpha.
- Bespoke accent cards (PlayerCard, TeamBanner, TeamRosterCard) use a flat
  `color-mix` accent tint (~6–9%) over `--kb-bg-card` and an accent-tinted
  border. No gradients, **no side-stripe accents.**

### Inputs (`.kb-input`)
- Recessed: bg `--kb-bg-inset`, `1px solid --kb-border`, radius `--kb-r-sm`.
- Placeholder `--kb-fg-faint`. Hover → `--kb-border-strong`. Focus → border
  `rgba(255,255,255,0.28)` (no extra ring on inputs).

### Chips (`.kb-chip`)
- Pill, 10px / 500, `2px 8px`, `--kb-border` + `--kb-fill`, text `--kb-fg-soft`.
- Tone variants `kb-chip-gold` / `-amber` / `-steel`: accent border (~28–30%),
  accent fill (~10–12%), accent text.

### Stats strip
- Flex row, equal `flex-1` cells, `w-px` `--kb-hairline` dividers, top+bottom
  hairline borders (not a card). Anton ~24px numbers (gold when highlighted),
  `.kb-label` style 10–11px uppercase labels.

### Leaderboard (DailyLeaderboard)
- Rendered in a `kb-card` (amber accent). Header: medal + "Today's board" +
  your rank.
- Rows: `--kb-fill` background, hairline borders, compact `text-xs`. Rank glyph
  is Anton tabular; **#1 only** is gold. The current-user row is highlighted
  with an amber fill + amber border (no other cheese for top 3). Record is Anton
  tabular, right-aligned; a small gold trophy marks a perfect run.
- Footer line states the ranking order.

### Progress / round track (DraftScreen)
- Segmented bars, one per round. Done = `--kb-gold`; active = gold at ~50%;
  empty = `rgba(255,255,255,0.12)`. Never a bare "1 / 4" text counter.

### Brand bar (`.kb-brand-bar`)
- Solid, quiet: `color-mix` of `--kb-bg-deep` at 88% + `blur(8px)`, single
  `--kb-hairline` bottom divider.

### Backgrounds (utilities)
- `.mesh-bg-ring` / `.mesh-bg-cs` / `.mesh-bg-lol` are now **flat graphite**
  (`--kb-bg-deep`) with one near-invisible white top wash (`~0.022`). The names
  are kept for compatibility; they no longer render colored mesh glow.
- `.grid-bg` is a faint editorial grid (`~0.018` lines, 44px) masked to fade
  out — texture, not a glowing field.
- `.kb-grain` (optional `::after`) adds ~2.5% SVG noise to kill banding.
- `.glow-ring` is intentionally inert (`text-shadow: none`); win emphasis comes
  from color + weight only.

### Loading / skeleton
- `.kb-skeleton` is a graphite shimmer (card → elev → card). Route loader is a
  pulsing gold dot + a muted "Loading" label.

---

## 5. Layout & Spacing

### Spacing scale (8px base)
| Token | Value |
|---|---|
| `--kb-space-xs` | 4px |
| `--kb-space-sm` | 8px |
| `--kb-space-md` | 16px |
| `--kb-space-lg` | 24px |
| `--kb-space-xl` | 40px |
| `--kb-space-2xl` | 64px |

### Page structure
- Game screens: `max-w-lg mx-auto` (512px), single column, mobile-first.
- Hub: `max-w-2xl mx-auto` for a slightly wider editorial landing.
- `px-5` (20px) horizontal padding on mobile, `px-8` on larger.
- **Left-aligned content.** Only result scores and CTA labels center.

### Rhythm
- ~40px between major sections, 8–10px between list cards, ~20px header → first
  CTA. Compact by default; breathing room is earned (post-result), not a default.

### Radii — one scale, no mismatches
| Token | Value | Use |
|---|---|---|
| `--kb-r-xs` | 6px | Tiny chips / inner elements |
| `--kb-r-sm` | 8px | Inputs, small controls |
| `--kb-r-md` | 12px | Default card |
| `--kb-r-lg` | 16px | Large cards, banners |
| `--kb-r-xl` | 20px | Hero / share card |
| `--kb-r-pill` | 9999px | CTAs and pills only |

---

## 6. Depth, Elevation, Focus & Motion

### Shadows — soft, directional, dark (depth, not glow)
| Token | Value | Use |
|---|---|---|
| `--kb-shadow-sm` | `0 1px 2px rgba(0,0,0,0.4)` | Small lift |
| `--kb-shadow-card` | `0 1px 2px rgba(0,0,0,0.35), 0 10px 28px -16px rgba(0,0,0,0.8)` | Card |
| `--kb-shadow-pop` | `0 2px 4px rgba(0,0,0,0.4), 0 18px 44px -20px rgba(0,0,0,0.85)` | Modal / popover |
| `--kb-shadow-cta` | `0 1px 2px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.16)` | CTA |
| `--kb-shadow-gold` / `--kb-shadow-amber` | `0 8px 24px -16px rgba(0,0,0,0.8)` | Legacy aliases — a deeper directional shadow, **not** a glow |

**Shadow law:** all shadow color is `rgba(0,0,0,…)`. No colored shadows, no
`0 0 Npx` bloom anywhere.

### Focus
- `--kb-focus: 0 0 0 2px var(--kb-bg-deep), 0 0 0 4px rgba(255,255,255,0.28)`.
- Applied globally on `:focus-visible` (keyboard only), accent-neutral so it
  reads on any surface.

### Z-index scale
| Token | Value | Use |
|---|---|---|
| `--kb-z-base` | 1 | Content |
| `--kb-z-sticky` | 20 | Sticky sub-headers |
| `--kb-z-brandbar` | 40 | Top brand bar |
| `--kb-z-overlay` | 50 | Overlays |
| `--kb-z-modal` | 60 | Modals / confirmations |

### Motion — ease-out only, no bounce / elastic
| Token | Value |
|---|---|
| `--kb-ease-out` | `cubic-bezier(0.22, 1, 0.36, 1)` |
| `--kb-ease-std` | `cubic-bezier(0.4, 0, 0.2, 1)` |
| `--kb-dur-fast` | 120ms |
| `--kb-dur` | 200ms |
| `--kb-dur-slow` | 360ms |

`--kb-ease-spring` is a legacy alias of `--kb-ease-out` (no springiness).
Transitions are short and restrained: hover, selected, slot fill, progress,
result reveal, leaderboard highlight, route fades. A global
`prefers-reduced-motion: reduce` block collapses animation / transition
durations to ~0.

---

## 7. Do's and Don'ts

### Do
- Use **Anton uppercase** for every score, record, and game title.
- **Left-align** content — editorial identity, not centered app widgets.
- Use **flat graphite surfaces** with **hairline borders** and **soft, dark
  directional shadows**.
- Tint accent cards with a flat `color-mix` (~6–9%) + an accent-tinted border.
- Use the **single radius scale** (6 / 8 / 12 / 16 / 20 / pill).
- Use **pill CTAs** for primary actions; show explicit hover / active / focus /
  disabled states.
- Keep accents restrained: gold = win, amber = CoD / daily, steel = CS2.
- Show how-to-play steps **inline** for new players.
- Differentiate games by **sport label** (`Call of Duty Esports` /
  `League of Legends` / `Counter-Strike 2`), not only by accent color.

### Don't
- **No glow / bloom** — no glowing mesh backgrounds, no `0 0 Npx` shadows, no
  colored shadows, no `text-shadow` glow on records.
- **No neon / oversaturated arcade orange** spread across surfaces.
- **No gradient text** (`background-clip: text`).
- **No side-stripe borders** (colored `border-left/right > 1px` on cards).
- **No glassmorphism as default** — translucency / blur is reserved for the
  brand bar and overlay sheets, used sparingly.
- **No gradient-filled accent cards** — flat tint only.
- **No `#000` / `#fff`** — surfaces tint graphite, text is warm off-white.
- **No SaaS hero-metric template**, no identical card grids, no
  modal-as-first-thought.
- **No em dashes in copy** — commas, colons, periods only.
- **No bounce / elastic motion** — ease-out only; respect reduced motion.

---

## 8. Responsive Behavior

- **Primary target:** 375–430px mobile (iPhone SE → Pro Max).
- **Secondary:** 768px+ tablet / desktop — same single-column game screens with
  more breathing room; the hub widens to `max-w-2xl`.
- Display type scales with `clamp()` (e.g. hub headline `clamp(48px, 13vw,
  84px)`); game titles ~48 → 72px.
- Section padding `px-5` (mobile) → `px-8` (larger).
- **Minimum touch target 44×44px.** Tables / leaderboards stay legible on mobile
  via compact rows and truncation.

---

## 9. Game Identities

### Ring Chase (Call of Duty)
- Sport label: "Call of Duty Esports"
- Identity accent: `--kb-amber` (`#f5631a`) for the eyebrow and daily row
- Win accent: `--kb-gold` for rings and championship moments
- Character: aggressive, warm, championship gravity

### Golden Road (League of Legends)
- Sport label: "League of Legends"
- Accent: `--kb-gold` (`#e8b842`) for prestige and stages
- Character: prestigious, historical, Worlds legacy

### Major Run (Counter-Strike 2)
- Sport label: "Counter-Strike 2"
- Identity accent: `--kb-steel` (`#7fa5c9`)
- Win accent: `--kb-gold` for Major wins
- Character: tactical, precise, bracket-clinical

---

## 10. Agent Quick Reference

### Values
- Page bg: `#0a0b0d` (deep) · card `#15161a` · elevated `#1c1e23` · inset `#0c0d10`
- Primary text: `#ece8dd` (warm off-white) · muted `#797568` · faint `#4f4c46`
- Win accent: `#e8b842` (gold) · CoD / daily: `#f5631a` (amber) · CS2: `#7fa5c9` (steel)
- Error `#e8485c` · success `#34c98a`
- Border `rgba(255,255,255,0.08)` · hairline `rgba(255,255,255,0.045)` · radius 12px default
- Card shadow `0 1px 2px rgba(0,0,0,0.35), 0 10px 28px -16px rgba(0,0,0,0.8)` (soft, dark)
- Motion: `cubic-bezier(0.22, 1, 0.36, 1)`, 120 / 200 / 360ms, ease-out only

### Component prompts
- "HomeScreen hero: left-aligned. Sport label in `.kb-eyebrow` accent color,
  game title in Anton via `clamp()`, then a 13px `text-kb-soft` tagline. Stats
  strip below with hairline top+bottom borders and `w-px` dividers."
- "Card: `.kb-card` (flat `--kb-bg-card`, `--kb-border`, radius 12px,
  `--kb-shadow-card`). For an accent card, tint with
  `color-mix(in srgb, <accent> 7%, var(--kb-bg-card))` and an accent-tinted
  border. No gradient, no glow, no side stripe."
- "Primary CTA: pill, `kb-cta-gold`, Space Grotesk 600, trailing `.kb-cta-icon`
  arrow. Provide hover / active / focus / disabled."
- "Leaderboard row: `--kb-fill` bg, hairline border, Anton tabular rank (#1 gold
  only), Anton record right-aligned; current user gets an amber fill + amber
  border."
- "Result reveal: centered. Label in `.kb-label`, Anton ~80px record (gold on
  win, else `--kb-fg`) with an ease-out spring-in, then the run title in 13px
  `text-kb-soft`. No text glow."
