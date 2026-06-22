# Homepage booking stepper + unified booking links — design

**Date:** 2026-06-22
**Status:** Approved pending spec review

## Goal

On the homepage, turn the booking partner list into an animated two-step
wizard: step 1 picks a partner (Booking.com, Travelmint.ro, Litoralul
Românesc); step 2 reveals that partner's per-location booking links. Unify the
underlying data so the same real per-location links also power the existing
cazare detail-page booking blocks (currently placeholder `#`).

## Interaction (two-step wizard)

- **Step 1 — "Alege partenerul":** the partners that have ≥1 link, each a row
  with color chip + name + → arrow. Click selects a partner.
- **Step 2 — "← înapoi · {partner}":** back button + that partner's location
  links. Each link is the real booking URL, opens in a new tab, shows the unit
  name + star pill.
- **Animation:** `AnimatePresence` slide (x) + fade between the two steps,
  `easeOutExpo`, transform/opacity only. A `min-height` on the panel prevents
  layout jump. Reduced motion is respected automatically via the app-level
  `<MotionConfig reducedMotion="user">`.
- The "SAU / Sună direct" tap-to-call stays below the wizard (as today).

## Data model (`lib/content.ts`)

Replace placeholder booking data with real per-location links as the single
source of truth.

- `Partner` interface: drop the placeholder `href` field (keep `id`, `name`,
  `initials`, `color`).
- `Unit` interface: replace `partners: PartnerId[]` with
  `bookingLinks: Partial<Record<PartnerId, string>>` — only the partners that
  actually list that unit.
- Real coverage (8 links; placeholders until provided):
  - `hotel-paradox`: `{ booking, travelmint, litoralul }`
  - `vila-paradox`: `{ booking, litoralul }`  *(travelmint added later — one-line edit)*
  - `paradox-h`: `{ booking, travelmint, litoralul }`
- Add derived exports for the stepper (computed from `units`, preserving the
  partner order booking → travelmint → litoralul and the units' array order):
  - `bookingByPartner: Record<PartnerId, { slug: string; name: string; stars: 2 | 3; href: string }[]>`
  - `partnersWithLinks: PartnerId[]` — partners having ≥1 link (drives step 1).

## Components

### `BookingBlock` (detail pages — refactor)
- Currently takes `partnerIds: PartnerId[]` and links to `partner.href` (`#`).
- Change to take the unit's `bookingLinks` map (or an array derived from it) and
  render one row per present partner with the **real** href, `target="_blank"`,
  `rel="noopener noreferrer"`. Stays a **server component**. Tap-to-call
  unchanged. Detail page passes `unit.bookingLinks`.

### `BookingStepper` (homepage — new, client component)
- `"use client"`. Local state `selected: PartnerId | null`.
- Step 1 (selected === null): map `partnersWithLinks` → partner rows.
- Step 2 (selected set): back button + `bookingByPartner[selected]` → location
  link rows (real URL, new tab, star pill).
- `AnimatePresence mode="wait"`; each step is a `motion.div` keyed by step with
  `initial/animate/exit` on `x`+`opacity`, `easeOutExpo` from
  `components/motion/transitions`.
- Reuses the existing booking card styling (rounded-[18px], cream rows, partner
  color chip, sea text, terracotta arrow) on the sea VoucherBand background.

### `VoucherBand` (wiring)
- Replace `<BookingBlock partnerIds={…} title="Rezervă acum" />` with
  `<BookingStepper />`.

## Constraints honored

- All copy + links in `content.ts`; no hardcoded strings/links in components.
- Client boundary only on `BookingStepper`; `BookingBlock` stays server.
- Motion from `motion/react`, reuse `easeOutExpo`, animate transform/opacity
  only; reduced motion respected.
- `lucide-react` icons; tokens + existing card styles; no design reinterpretation.
- „…" quotes; correct term „vouchere de vacanță".

## Data to provide (scaffolded as placeholders)

The 8 booking URLs (Booking ×3, Travelmint ×2, Litoralul ×3). Travelmint × Vila
Paradox to be added later as a one-line `bookingLinks` edit.

## Definition of done

- `pnpm typecheck` / `lint` / `build` clean.
- Homepage: clicking a partner animates to its location links; back returns to
  the partner list; links open the correct booking URLs in a new tab.
- Detail-page booking blocks use the unit's real per-location links.
- Reduced motion respected; adding Travelmint × Vila later needs only a
  `content.ts` data edit (no component change).
