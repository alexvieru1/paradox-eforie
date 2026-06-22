# CLAUDE.md — Paradox (Eforie Sud)

Guidance for Claude Code in this repo. **The design is fixed** — match it; don't reinterpret it.

## What this is
A Romanian-language, photography-forward, **mobile-first** marketing site for a family-run seaside hospitality brand in Eforie Sud. **No booking engine** — every conversion path leads to external booking partners (Booking.com, Travelmint.ro, Litoralul Românesc) or the phone `0742 064 046`. All units accept **vouchere de vacanță** (surface the badge everywhere).

Brand units: Hotel Paradox (3★), Vila Paradox (2★), Paradox H (2★), Terasa Paradox (restaurant), Plaja Paradox (beach).

## Design system — Direction A (warm golden-hour). DO NOT change these.
Tokens live in `app/globals.css` via Tailwind v4 `@theme` (this project has **no `tailwind.config.ts`**). Utility names: `bg-cream`, `text-sea`, `bg-terracotta`, `text-body`, `bg-sand`, `text-voucher`, etc.

| Token | Hex | Use |
|---|---|---|
| cream | `#FBF6EE` | page background |
| sand | `#F2E7D6` | alt sections, icon chips |
| sea | `#1E3D52` | headings / primary |
| terracotta | `#C0633F` (hover `#A8512F`) | accent, CTAs, links, eyebrows |
| body / muted / faint | `#5A4E40` / `#7A6E5E` / `#A08A6A` | text tiers |
| voucher | `#1F8A5B` | voucher badge |
| gold | `#E0A33F` | review stars |
| footer | `#16293A` | footer bg |

Hero/beach use a literal multi-stop sunset gradient via inline `style` (Tailwind can't express it):
`linear-gradient(180deg,#F6C98A,#E89B6C,#C77A6A,#7E5E72,#2E4257)`.

**Type:** display = **Newsreader** (`font-display`, Newsreader, weight ~500, tight tracking, italic for quotes); body/UI = **Mulish** (`font-sans`). Both via `next/font/google` in `app/layout.tsx`. Do NOT reintroduce Fraunces/Inter. Eyebrows: 12px, uppercase, tracking ~0.21em, terracotta, bold. Sizes use `clamp()`.

Radii: cards `rounded-2xl`/`[18px]`, pills `rounded-full`. Card shadow rest `0 1px 3px rgba(60,40,20,.08)`, hover `0 18px 40px rgba(60,40,20,.14)` + `-translate-y-1`. Content max-width `1240px`.

## Architecture (already in place — extend, don't restructure)
```
app/
  layout.tsx                 # fonts, <Header/>, <MotionProvider>
  page.tsx                   # homepage: Hero→Cazare→Terasa→Plaja→Testimonials→VoucherBand→Footer
  cazare/[unit]/page.tsx     # accommodation detail (async params: await params)
components/
  site/header.tsx            # fixed header, scroll state, mobile menu (client)
  sections/*.tsx             # one component per section
  motion/{reveal,transitions,motion-provider}.tsx
  ui/primitives.tsx          # PhotoPlaceholder, StarPill, VoucherPill, Eyebrow
lib/content.ts               # ALL copy + structured data (units, partners, testimonials…)
```

## Hard rules
- **All copy lives in `lib/content.ts`** — never hardcode Romanian strings in components. Use „…” quotes; correct term is **„vouchere de vacanță”** (not „tichete”).
- **The Rezervă block is data-driven.** `BookingBlock` takes `partnerIds` and renders only those partners (each unit lists a different subset in `content.ts`) plus a prominent tap-to-call. Never a single hardcoded booking button.
- **Server by default.** Only `"use client"` where needed: `header`, `gallery` (lightbox + keyboard), `reveal`, `motion-provider`. Keep boundaries at the leaves.
- **Motion:** import from `motion/react`; reuse `easeOutExpo` from `components/motion/transitions.ts`; section reveals via `<Reveal>` (`whileInView`, `once:true`); lightbox via `AnimatePresence`. Animate transform/opacity only. App is wrapped in `<MotionConfig reducedMotion="user">`.
- **Icons:** `lucide-react` (run `pnpm install` after pulling — it's a new dep). No emoji.
- **Photography/logo/map/EU logos are placeholders** (`PhotoPlaceholder`, striped blocks with mono captions). Swap for client assets via `next/image`; don't ship the placeholders.
- The **EU-grant footer banner** is a funding-compliance requirement — keep it; only its text/logos are placeholders.

## Definition of done
`pnpm typecheck` clean · `pnpm lint` clean · `pnpm build` succeeds · homepage + Hotel Paradox detail match the design on mobile and desktop · Rezervă partner list is data-driven · voucher badge present · reduced-motion respected.

## Avoid
- `framer-motion` import (use `motion/react`), Fraunces/Inter, sage/green palette.
- Whole-page client components; hardcoded copy or partner lists.
- Animating layout properties in hot paths; inventing colors/fonts not in the tokens.
