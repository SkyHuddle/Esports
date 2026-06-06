# Design: Esports Draft Games

## Color strategy: Committed
One saturated warm-gold accent carries the brand. Deep violet-near-black background. Typography drives hierarchy more than color.

## Palette
- Background deep: #07060a (violet-tinted black)
- Background base: #0d0b12
- Background card: #16131c
- Background elevated: #1e1a26
- Foreground: #f4f0e6 (warm off-white, never pure white)
- Foreground soft: #c8c2b4
- Foreground muted: #7a7480
- Foreground faint: #4d4856
- Gold: #e8b842 (brand accent — wins, records, highlights)
- Amber: #ff6a1f (daily, CTAs, urgency)
- Crimson: #ff3d5e (errors, exits, losses)
- Green: #00d17a (victories, positive streaks)
- Border: rgba(255,255,255,0.08)
- Hairline: rgba(255,255,255,0.05)

## Typography
- Display: Anton (headlines, records, scores, numbers that matter)
- UI: Space Grotesk (body, labels, UI copy)
- Mono: JetBrains Mono (scores, ratings, codes)
- Scale:
  - Hero record: 5xl–8xl Anton, tabular-nums
  - Section title: 3xl–4xl Anton
  - Card headline: xl–2xl Anton
  - Body: sm (14px) Space Grotesk
  - Label: 10px uppercase tracking-widest
  - Micro: 9px uppercase tracking-wider
- Line length: cap body at 52ch

## Elevation system
- Level 0 (page bg): #07060a
- Level 1 (card bg): #16131c — 1px rgba(255,255,255,0.08) border
- Level 2 (elevated card): #1e1a26 — same border, stronger shadow
- Level 3 (overlay/modal): #24202e — border + backdrop-blur(16px)

## Spacing
- Page padding: px-5 (mobile), px-8 (desktop)
- Section gap: mb-8
- Component gap: gap-3 or gap-4
- Tight: gap-2
- Pill badges: px-2.5 py-0.5

## Radius
- Cards: 16px (md), 22px (lg), 28px (xl)
- Badges/pills: 9999px
- Buttons: 9999px (full-pill CTAs)

## Motion
- Entry: fade + y-16 → y-0, duration 0.35–0.5s, ease-out-expo (0.16,1,0.3,1)
- Score reveal: spring, stiffness 320, damping 22
- No bounce, no elastic, no layout animations

## Components
- kb-card: Level 1 card, `background: #16131c`, 1px border, shadow-card
- kb-card-accent-gold: Level 1 + gold border tint
- KbCtaButton gold: filled gold, dark text, h-14 pill
- KbCtaButton amber: filled amber, dark text, h-14 pill
- KbCtaButton glass: glass bg, white border, white text
- Chip/badge: pill, bg + border matching tone (gold/amber/glass)

## Game identities
- Ring Chase (CoD): gold primary, warm amber accents — championship gravity
- Golden Road (LoL): gold primary, slightly cooler — prestige of a Worlds run
- Major Run (CS2): gold primary, steel-blue/silver secondary — tactical, clinical
