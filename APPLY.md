# Apply these changes to your repo

These files realign the codebase with **Direction A** of the approved design (the previous build used a different palette/fonts and was missing the booking-partner conversion model, testimonials, EU banner, and detail page).

## 1. Copy over (overwrite existing)
Copy the contents of this folder into your repo root, overwriting:

```
app/globals.css
app/layout.tsx
app/page.tsx
app/cazare/[unit]/page.tsx        ← new route (accommodation detail)
components/site/header.tsx        ← new
components/ui/primitives.tsx      ← new
components/sections/hero.tsx
components/sections/cazare.tsx     ← new (replaces offerings)
components/sections/terasa.tsx     ← new
components/sections/plaja.tsx      ← new
components/sections/testimonials.tsx ← new
components/sections/voucher-band.tsx ← new
components/sections/booking-block.tsx ← new (the Rezervă block)
components/sections/gallery.tsx    ← replaced (now hero + thumbnails + lightbox)
components/sections/mobile-call-bar.tsx ← new
components/sections/site-footer.tsx
components/motion/*                ← unchanged (included for completeness)
lib/content.ts                     ← REPLACED (new data shape)
lib/utils.ts                       ← unchanged
package.json                       ← adds lucide-react
CLAUDE.md                          ← design-aware guidance
```

## 2. Delete these now-obsolete files
The new `lib/content.ts` changes the data shape, so the old sections won't compile. Remove:

```
components/sections/offerings.tsx
components/sections/offering-card.tsx
components/sections/intro.tsx
components/sections/location.tsx
```

## 3. Install + verify
```bash
pnpm install      # picks up lucide-react
pnpm typecheck
pnpm lint
pnpm build
pnpm dev          # http://localhost:3000  and  /cazare/hotel-paradox
```

## What changed vs. the previous build
- **Palette:** sage/pine/gold → warm cream / deep-sea-blue / terracotta / sand (+ green voucher, gold stars).
- **Type:** Fraunces + Inter → **Newsreader + Mulish**.
- **Homepage:** added the 3-card *Cazare* section (star + voucher pills, distances), *Terasa*, full-bleed *Plaja*, *Recenzii* testimonials, a voucher trust band with the booking-partner block, and a footer with the **EU-grant compliance banner**.
- **Conversion model:** new data-driven `BookingBlock` — variable partner list per unit (Booking.com / Travelmint.ro / Litoralul Românesc) + prominent tap-to-call. No booking engine.
- **New detail page** `/cazare/[unit]`: gallery with keyboard lightbox, amenities, location block, Rezervă block, and a mobile sticky call/booking bar.
- All copy moved to `lib/content.ts`; „tichete" → „vouchere de vacanță".
