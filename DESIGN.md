# DESIGN.md — Esports Draft Games

## 1. Visual Theme & Atmosphere

A dark-canvas competitive gaming platform built around the dramatic reveal — the score, the draft pick, the run result. The aesthetic sits between **Spotify's immersive content-first darkness**, **Raycast's precision dark product chrome**, and **Nike's athletic typographic force**. The UI recedes to make the results and data the hero; every color choice is functional, never decorative.

The dominant surfaces are **near-black with violet undertones** (`#07060a` deep, `#0d0b12` base, `#16131c` card) creating a tiered darkness. **Anton** is used exclusively for scores, records, and game titles at maximum weight — towering uppercase lockups that communicate championship gravity. **Space Grotesk** handles all UI chrome. Gold (`#e8b842`) is the singular win-state accent — precise and earned, never decorative.

**Physical scene:** A fan checks their daily Ring Chase run at 11pm on their phone, screen brightness low, headphones in, tournament stream muted in a background tab. The UI must be immediately legible, feel premium against the dark, and make them screenshot and share without thinking.

**Key characteristics:**
- Near-black violet-tinted surfaces in a 4-level stack — UI disappears so data can glow
- **Anton** for all display type: scores, records, game titles — zero decoration, pure impact
- **Single brand accent** per game: Gold for wins and championships, Amber for daily/urgency, Steel for CS2
- Pill CTAs (`border-radius: 9999px`) — rounded, touch-optimized like Spotify
- Cards use **8px–14px radius** (tighter than most systems) with 1px hairline borders — precise, not bubbly
- **Heavy shadows** (`0 4px 24px rgba(0,0,0,0.55)`) for elevated cards — light shadows are invisible on dark
- Section rhythm: **8px base unit**, 24px between components, 40px between sections
- Typography lives in a **compact 10px–56px range** — never expand beyond unless it's a hero score

---

## 2. Color Palette & Roles

### Brand accent
| Token | Hex | Role |
|---|---|---|
| `--kb-gold` | `#e8b842` | Win state, championships, highlights, primary CTA text |
| `--kb-amber` | `#ff6a1f` | Daily mode, urgency, secondary CTAs, fire/energy |
| `--kb-steel` | `#8ba7c7` | CS2 / Major Run identity accent |

### Semantic
| Token | Hex | Role |
|---|---|---|
| `--kb-crimson` | `#ff3d5e` | Errors, blocked, exit |
| `--kb-green` | `#00d17a` | Victory, win streaks |

### Surface stack (darkest → elevated)
| Token | Hex | Level | Use |
|---|---|---|---|
| `--kb-bg-deep` | `#07060a` | 0 | Page background, deepest |
| `--kb-bg-base` | `#0d0b12` | 1 | Sections, dividers |
| `--kb-bg-card` | `#16131c` | 2 | Cards, containers |
| `--kb-bg-elev` | `#1e1a26` | 3 | Elevated panels, hover states |

### Text
| Token | Hex | Role |
|---|---|---|
| `--kb-fg` | `#f4f0e6` | Primary text (warm off-white — never `#ffffff`) |
| `--kb-fg-soft` | `#c8c2b4` | Secondary text, body copy |
| `--kb-fg-mute` | `#7a7480` | Labels, metadata |
| `--kb-fg-faint` | `#4d4856` | Disabled, placeholder |

### Border / Glass
| Token | Value | Use |
|---|---|---|
| `--kb-border` | `rgba(255,255,255,0.09)` | Default card border |
| `--kb-border-strong` | `rgba(255,255,255,0.17)` | Focus, active borders |
| `--kb-hairline` | `rgba(255,255,255,0.055)` | Dividers, rules |
| `--kb-glass` | `rgba(255,255,255,0.045)` | Subtle glass fills |

### Shadows
| Token | Value | Use |
|---|---|---|
| `--kb-shadow-card` | `0 1px 3px rgba(0,0,0,0.4), 0 6px 20px -6px rgba(0,0,0,0.5)` | Card lift |
| `--kb-shadow-gold` | `0 2px 10px -2px rgba(232,184,66,0.15)` | Gold-accent cards |
| `--kb-shadow-amber` | `0 2px 10px -2px rgba(255,106,31,0.16)` | Amber-accent cards |

**Shadow law (from Spotify):** On dark backgrounds, shadows must be heavy (≥0.35 opacity) to read. Never use thin hairline shadows on dark cards — use the full `--kb-shadow-card` stack.

---

## 3. Typography Rules

### Font families
| Role | Family | Fallback |
|---|---|---|
| Display | **Anton** | `'Oswald', 'Arial Narrow', system-ui` |
| UI / Body | **Space Grotesk** | `system-ui, sans-serif` |
| Mono / Data | **JetBrains Mono** | `ui-monospace, monospace` |

### Hierarchy

| Role | Font | Size | Weight | Letter-spacing | Notes |
|---|---|---|---|---|---|
| Hero score / record | Anton | 64–80px | 400 (Anton is single-weight) | 0 | Season records, Major bracket results |
| Game title | Anton | 52–64px | 400 | 0 | HomeScreen H1 |
| Section title | Anton | 28–36px | 400 | 0 | Result screens, card headers |
| Card headline | Anton | 20–24px | 400 | 0 | Player name, team name |
| Sport eyebrow | Space Grotesk | 10px | 600 | 0.3em | Uppercase, tracked — "Call of Duty Esports" |
| Body | Space Grotesk | 14px | 400 | 0 | Descriptions, how-to-play |
| Label | Space Grotesk | 11px | 600 | 0.2em | Uppercase metadata, stat labels |
| Micro | Space Grotesk | 9–10px | 500 | 0.2em | Badges, pill tags |
| Data / OVR | JetBrains Mono | varies | 400 | `font-feature-settings: 'tnum'` | Tabular numbers |

**Typography laws:**
- **Anton is uppercase only.** Never titlecase Anton.
- **Compact range:** Body tops out at 15px. UI labels are 10–11px. This is a game, not an article.
- **Weight contrast:** The dramatic shift between Anton (single heavy display) and Space Grotesk 400 body IS the hierarchy. Don't insert medium-weight Space Grotesk headers — they kill the contrast.
- **No em dashes.** Use colons, pipes, or hyphens.

---

## 4. Component Stylings

### CTAs

**Primary gold (`kb-cta-gold`)**
- Background: `var(--kb-gold)` / Text: `#0a0806` / Font: Space Grotesk 600 0.02em
- Radius: 9999px / Height: 56px / Padding: 0 24px
- Shadow: `0 1px 3px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.22)`
- Hover: `filter: brightness(1.06)`

**Secondary amber (`kb-cta-amber`)**
- Same shape, `var(--kb-amber)` background, same text color

**Glass tertiary (`kb-cta-glass`)**
- Background: `rgba(255,255,255,0.07)` / Border: `1px solid rgba(255,255,255,0.12)` / Text: `var(--kb-fg)`
- Radius: 9999px / Height: 56px

**Daily row button** (custom component in HomeScreens)
- NOT a generic CTA pill. A custom row card with calendar icon, daily number, constraint chip, and chevron
- Border: `1px solid rgba(255,106,31,0.35)` / Background: `rgba(255,106,31,0.07)` / Radius: 16px

### Cards (`kb-card`)
- Background: `var(--kb-bg-card)` (`#16131c`)
- Border: `1px solid rgba(255,255,255,0.09)`
- Radius: **14px** (`--kb-r-md`) or **18px** (`--kb-r-lg`)
- Shadow: `var(--kb-shadow-card)`
- Overflow: `hidden` — always

**Gold accent card:** adds `border-color: rgba(232,184,66,0.25)`, shadow extends with `--kb-shadow-gold`

**TeamBanner card:**
- Background: `linear-gradient(135deg, {accent}14 0%, var(--kb-bg-card) 100%)`
- Border: `1px solid {accent}26`
- Radius: 18px

**PlayerCard / TeamRosterCard:**
- Same gradient background pattern
- No side-stripe accents — banned
- OVR number: Anton, 28–32px, colored by tier
- Avatar box: 48px, rounded-xl, accent tint bg

### Stats strip (HomeScreen)
- Layout: flex row with `flex-1` equal-width cells, `w-px bg-kb-hairline` dividers
- Border: `1px solid rgba(255,255,255,0.055)` on top and bottom (not a card wrapper)
- Padding: 14px vertical
- Numbers: Anton 24px, `var(--kb-gold)` if highlighted else `var(--kb-fg)`
- Labels: Space Grotesk 10px uppercase tracking-wider `var(--kb-fg-mute)`

### Badges / Chips
- Tier badge: 9px Space Grotesk 500, uppercase, `px-2 py-0.5 rounded-full border`
- Gold tier: `bg-kb-gold/15 text-kb-gold border-kb-gold/25`
- Amber/underdog: `bg-kb-amber/12 text-kb-amber border-kb-amber/25`
- Default: `bg-kb-glass text-kb-soft border-kb-border`

### Progress tracker (DraftScreen header)
- Segmented track: N circles/squares for N rounds
- Filled: `var(--kb-gold)` / Active: amber outline / Empty: `var(--kb-hairline)` fill
- NEVER just "1 / 4" text

---

## 5. Layout Principles

### Spacing scale (8px base)
| Token | Value |
|---|---|
| xs | 4px |
| sm | 8px |
| md | 16px |
| lg | 24px |
| xl | 40px |
| xxl | 64px |
| section | 96px (mobile: 48px) |

### Page structure
- `max-w-lg mx-auto` (512px) — mobile-first single column
- `px-5` horizontal page padding
- Left-aligned content (NOT center-aligned) — editorial, like ESPN/sheepesports/The Verge
- Section titles left-aligned, body text left-aligned

### Section rhythm (from PlayStation)
- Between major sections: 40px gap
- Between cards in a list: 8–10px gap
- Between header and first CTA: 20px

### Whitespace philosophy
- **Compact by default** — this is a game, not a magazine
- Breathing room is earned by context (post-result screen) not by default padding
- Never center-align content on a full page — editorial pages left-align

---

## 6. Depth & Elevation

| Level | Surface | Border | Shadow | Use |
|---|---|---|---|---|
| 0 | `#07060a` | none | none | Page background |
| 1 | `#16131c` | `rgba(255,255,255,0.09)` | `--kb-shadow-card` | Cards, containers |
| 2 | `#1e1a26` | `rgba(255,255,255,0.12)` | heavier card shadow | Elevated panels, modals |
| 3 | `rgba(0,0,0,0.7) blur(16px)` | `rgba(255,255,255,0.09)` | heavy | Overlay dialogs |

**Shadow law:** Never use light shadows on dark surfaces. `rgba(0,0,0,0.4)` minimum for card base shadow. The `--kb-shadow-card` stack (two-layer) is mandatory for all card elements.

---

## 7. Do's and Don'ts

### Do
- Use **Anton uppercase** for every score, record, game title — never mixed-case
- Left-align content — editorial identity, not app-widget centering
- Use pill CTAs (9999px radius) for primary actions
- Use **tighter card radius** (14–18px) — the 28px radius previously used made cards feel like a children's app
- Use **heavy shadows** on cards (`--kb-shadow-card`) — light shadows disappear on dark
- Make the daily row a **custom informative card**, not a disabled pill
- Show stats inline (strip with dividers), not in a 3-col icon-card grid
- Show how-to-play steps **inline for new players** — never behind an accordion
- Differentiate games by their **sport identity label** (`Call of Duty Esports` / `Counter-Strike 2` / `League of Legends`), not just by accent color

### Don't
- **No gradient text** (`background-clip: text`) — banned
- **No side-stripe borders** (`border-left` accent > 1px on cards) — banned
- **No glassmorphism as default** — glass is rare and purposeful
- **No `text-center` on entire pages** — only for scores in results and CTA labels
- **No icon + number + label grid for stats** — use the stats strip pattern instead
- **No accordion to hide "how it works"** — show steps inline
- **No SaaS dashboard widgets** (hero-metric template: big number + small label + gradient) — banned
- **No identical card grids** — vary card weight by importance
- **No "Screenshot to share on X, Reddit, or Discord"** — if share works, the button is enough
- **No "Final standings"** generic labels — use the game name

---

## 8. Responsive Behavior

- **Primary target:** 375–430px mobile (iPhone SE through iPhone Pro Max)
- **Secondary:** 768–1024px tablet — same layout, more breathing room
- Font scale: Hero score 80px mobile → 96px tablet+
- Game title: 60px mobile → 72px tablet+
- Section padding: `px-5` (20px) mobile, `px-8` (32px) tablet
- Min touch target: 44×44px (WCAG AA minimum)

---

## 9. Game Identities

### Ring Chase (Call of Duty)
- Sport label: "Call of Duty Esports"
- Accent: `var(--kb-amber)` (#ff6a1f) for sport identifier
- Win accent: `var(--kb-gold)` for rings and championship moments
- Character: aggressive, warm, championship gravity

### Golden Road (League of Legends)
- Sport label: "League of Legends"
- Accent: `var(--kb-gold)` (#e8b842) for prestige and stages
- Character: prestigious, historical, Worlds legacy

### Major Run (Counter-Strike 2)
- Sport label: "Counter-Strike 2"
- Accent: `var(--kb-steel)` (#8ba7c7) for CS2 identity
- Win accent: `var(--kb-gold)` for Major wins
- Character: tactical, precise, bracket-clinical

---

## 10. Agent Prompt Guide

### Quick reference
- Background: `#07060a` (deep) / `#16131c` (card)
- Primary text: `#f4f0e6` (warm off-white)
- Secondary text: `#7a7480` (muted)
- Win accent: `#e8b842` (gold)
- Daily accent: `#ff6a1f` (amber)
- CS2 accent: `#8ba7c7` (steel)
- Card border: `rgba(255,255,255,0.09)` / radius: 14–18px

### Component prompts
- "Create a HomeScreen hero: left-align, `Call of Duty Esports` in 10px uppercase tracking-[0.32em] amber text, followed by `Ring Chase` in Anton 60px, then a 13px muted tagline. Stats strip below with hairline borders."
- "Create a stats strip: flex row, three cells with `flex-1`, `w-px bg-kb-hairline` vertical dividers, top+bottom `1px solid rgba(255,255,255,0.055)` borders. Anton 24px numbers, 10px uppercase Space Grotesk labels."
- "Create a Daily row button: 16px radius, border `rgba(255,106,31,0.35)`, bg `rgba(255,106,31,0.07)`. Calendar icon + 'Daily #N' in 14px Space Grotesk 600 + constraint chip pill + ChevronRight icon."
- "Create a PlayerCard: 14px radius, `linear-gradient(135deg, {accent}0c 0%, var(--kb-bg-card) 100%)` background, 1px border. 48px avatar square with accent tint. Anton 20px player name. Anton 28px OVR right-aligned in tier color."
- "Create a result score reveal: center layout, `Season record` in 10px uppercase muted label, Anton 80px gold record number spring-animated, then `runTitle` in 14px soft text."
