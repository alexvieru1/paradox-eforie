# Facility routes — Terasă & Plajă

**Date:** 2026-06-22
**Status:** Approved, ready for planning

## Goal

Complete the set of 5 brand units with their own pages. The 3 accommodations
already have `app/cazare/[unit]/page.tsx` detail pages. This adds dedicated
routes for the two remaining facilities — the restaurant (Terasa Paradox) and
the beach (Plaja Paradox) — reusing the existing Direction A design system. No
redesign, no restructuring of existing routes.

## Scope

- **In:** `/terasa` page, `/plaja` page, supporting data in `lib/content.ts`,
  "Află mai multe →" links from the homepage Terasa/Plaja sections.
- **Out:** Changes to cazare detail pages, header nav (stays anchors), homepage
  section structure beyond adding the two links, any booking engine.

## Routes

Two new top-level static server-component routes:

- `app/terasa/page.tsx`
- `app/plaja/page.tsx`

Server by default. The only client boundaries are existing leaf components
(`Gallery`, `Reveal`); the pages themselves stay server components.

## Terasă page (`/terasa`)

Mirrors the rhythm of the cazare detail template, adapted for a restaurant
(no stars, no voucher booking partners).

1. **Breadcrumb + title** — `Paradox · Terasă`, eyebrow + display heading +
   address line (Ion Movilă 25). Same container/spacing as cazare page header.
2. **Gallery** — reuse `components/sections/gallery.tsx` (lightbox + keyboard)
   with placeholder food/terrace captions from `terasa.gallery`.
3. **Menu highlights** — categories rendered as card groups; each item has
   name, price, optional short description. Driven by new `terasa.menu` data.
   On `bg-sand` like the cazare amenities section.
4. **Program / hours** — opening-hours block plus a prominent
   **„Rezervă o masă"** tap-to-call CTA (`contact.phoneHref`). This is the only
   conversion path — no booking partners, no `BookingBlock`.
5. **Location/map** — `PhotoPlaceholder` map + address block, reusing the
   cazare location two-column pattern.
6. `SiteFooter` + `MobileCallBar`.

## Plajă page (`/plaja`)

1. **Hero band** — full-bleed sunset-gradient opener reusing the look of the
   homepage `Plaja` section (same literal multi-stop gradient + dark overlay),
   with eyebrow + display heading + body.
2. **Gallery** — `Gallery` with placeholder beach/sunset captions from
   `plaja.gallery`.
3. **Location/map + CTA** — `PhotoPlaceholder` map + address, plus a soft CTA
   linking to `/#cazare` (the cazare units). No booking partners for a beach.
4. `SiteFooter` + `MobileCallBar`.

## Homepage wiring

Least-disruptive linking (chosen): keep all existing homepage anchors and
header nav untouched. Add an „Află mai multe →" link in:

- `components/sections/terasa.tsx` → `/terasa`
- `components/sections/plaja.tsx` → `/plaja`

Styled to fit each section (terracotta link on the sand Terasa section; light
link on the gradient Plaja section). Uses `next/link`.

## Data model (`lib/content.ts`)

Extend the existing flat objects — do **not** introduce a unified facility type
(the three shapes differ enough that a shared abstraction would be forced).

**`terasa`** — add:
- `breadcrumb` / `intro` copy as needed for the page header
- `address: "Ion Movilă 25, Eforie Sud"`
- `gallery: GalleryItem[]` — placeholder captions
- `hours` — structured opening hours (e.g. label + value pairs)
- `menu` — `{ category: string; items: { name: string; price: string;
  desc?: string }[] }[]`
- existing `eyebrow`, `heading`, `body`, `tags` stay.

**`plaja`** — add:
- `gallery: GalleryItem[]` — placeholder captions
- `cta` — copy + target (`/#cazare`) for the soft CTA
- existing `eyebrow`, `heading`, `body` stay.

Reuse the existing `GalleryItem` interface. All new strings live here; no
hardcoded Romanian copy in components. Use „…" quotes and the term
„vouchere de vacanță" where vouchers are mentioned.

## Constraints honored

- All copy in `lib/content.ts`; components string-free.
- Server by default; client only at existing leaves.
- Motion via `Reveal` / `motion/react`, `easeOutExpo`; transform/opacity only.
- Icons from `lucide-react`; no emoji.
- Photography/map are `PhotoPlaceholder` placeholders, not final assets.
- Tokens-only colors/fonts (cream/sand/sea/terracotta/…, Newsreader/Mulish).
- Gradient reused literally for the Plaja hero (Tailwind can't express it).

## Definition of done

- `pnpm typecheck`, `pnpm lint` clean; `pnpm build` succeeds.
- `/terasa` and `/plaja` render and match Direction A on mobile + desktop.
- Terasa conversion is tap-to-call („Rezervă o masă"); no booking partners.
- Plaja CTA points to `/#cazare`; no booking partners.
- Homepage Terasa/Plaja sections link to the new pages via „Află mai multe →".
- Reduced motion respected; voucher wording correct where present.
