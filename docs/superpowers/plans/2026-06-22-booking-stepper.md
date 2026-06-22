# Booking Stepper + Unified Booking Links Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an animated two-step booking wizard on the homepage (pick partner → see that partner's per-location links) and unify the underlying data so the same real per-location links power the cazare detail-page booking blocks.

**Architecture:** Real per-location booking URLs become the single source of truth on each unit (`bookingLinks`). A derived `bookingByPartner` map feeds a new client `BookingStepper` (two-step `AnimatePresence` wizard) on the homepage; the existing server `BookingBlock` is refactored to render a single unit's real links on detail pages. Sequenced additive→feature→cleanup so every task type-checks green.

**Tech Stack:** Next.js 16 (App Router), React 19, TypeScript, `motion/react`, `lucide-react`, Tailwind v4.

## Global Constraints

- **No test framework** — verification per task is `pnpm typecheck`, `pnpm lint`, `pnpm build` (all clean).
- **Repo IS git-initialized** — commit at the end of each task (branch `feat/booking-stepper`).
- **All copy + links live in `lib/content.ts`** — no hardcoded strings/links in components.
- **Server by default.** Only the new `BookingStepper` is `"use client"`. `BookingBlock` stays a server component.
- **Motion:** import from `motion/react`; reuse `easeOutExpo` from `components/motion/transitions`; animate **transform/opacity only** (no height animation in the transition). App is wrapped in `<MotionConfig reducedMotion="user">` — reduced motion is automatic.
- **Icons:** `lucide-react` only; no emoji (the `★` star glyph in text is allowed, matching existing `StarPill`).
- **Tokens + existing styles:** reuse the current booking-card look (`rounded-[18px] border border-white/15 bg-white/[0.06] p-7`, `bg-cream` rows, `text-sea`, partner color chip, `text-terracotta` arrow). No design reinterpretation.
- **External links open in a new tab:** `target="_blank" rel="noopener noreferrer"`.
- **Quotes:** „…"; term „vouchere de vacanță".
- **Booking-link coverage (real):** Hotel Paradox → booking + travelmint + litoralul; Vila Paradox → booking + litoralul (Travelmint × Vila added later as a one-line edit); Paradox H → booking + travelmint + litoralul. Real URLs are placeholders here (clearly commented) until provided; they get pasted into `content.ts` `bookingLinks` only.

---

### Task 1: Unified booking-link data model (additive)

Add the new data without removing the old fields yet, so the tree stays green.

**Files:**
- Modify: `lib/content.ts`

**Interfaces:**
- Produces:
  - `Unit.bookingLinks: Partial<Record<PartnerId, string>>` (new required field on every unit)
  - `bookingByPartner: Record<PartnerId, { slug: string; name: string; stars: 2 | 3; href: string }[]>`
  - `partnersWithLinks: PartnerId[]`

- [ ] **Step 1: Add `bookingLinks` to the `Unit` interface** (after the existing `partners: PartnerId[];` line — keep `partners` for now).

```ts
  /** Real per-partner booking URLs for this unit (single source of truth). */
  bookingLinks: Partial<Record<PartnerId, string>>;
```

- [ ] **Step 2: Add a `bookingLinks` object to each of the three units.** Insert right after each unit's `partners: [...]` line. Placeholder URLs are clearly commented — replace with the real ones later (one place).

Hotel Paradox (after `partners: ["booking", "travelmint", "litoralul"],`):

```ts
    bookingLinks: {
      booking: "https://www.booking.com", // PLACEHOLDER — Hotel Paradox on Booking.com
      travelmint: "https://www.travelmint.ro", // PLACEHOLDER — Hotel Paradox on Travelmint
      litoralul: "https://www.litoralulromanesc.ro/", // PLACEHOLDER — Hotel Paradox on Litoralul
    },
```

Vila Paradox (after `partners: ["booking", "litoralul"],`):

```ts
    bookingLinks: {
      booking: "https://www.booking.com", // PLACEHOLDER — Vila Paradox on Booking.com
      litoralul: "https://www.litoralulromanesc.ro/", // PLACEHOLDER — Vila Paradox on Litoralul
      // travelmint: added later — Travelmint × Vila Paradox
    },
```

Paradox H (after `partners: ["booking", "travelmint"],`):

```ts
    bookingLinks: {
      booking: "https://www.booking.com", // PLACEHOLDER — Paradox H on Booking.com
      travelmint: "https://www.travelmint.ro", // PLACEHOLDER — Paradox H on Travelmint
      litoralul: "https://www.litoralulromanesc.ro/", // PLACEHOLDER — Paradox H on Litoralul
    },
```

- [ ] **Step 3: Add the derived exports** immediately after the `unitsBySlug` line (`export const unitsBySlug = ...`).

```ts
/** Stepper data: for each partner, the units bookable there (with the real URL). */
export const bookingByPartner: Record<
  PartnerId,
  { slug: string; name: string; stars: 2 | 3; href: string }[]
> = (Object.keys(partners) as PartnerId[]).reduce(
  (acc, pid) => {
    acc[pid] = units
      .filter((u) => u.bookingLinks[pid])
      .map((u) => ({ slug: u.slug, name: u.name, stars: u.stars, href: u.bookingLinks[pid]! }));
    return acc;
  },
  {} as Record<PartnerId, { slug: string; name: string; stars: 2 | 3; href: string }[]>,
);

/** Partners that have at least one bookable unit (drives the stepper's step 1). */
export const partnersWithLinks: PartnerId[] = (Object.keys(partners) as PartnerId[]).filter(
  (pid) => bookingByPartner[pid].length > 0,
);
```

- [ ] **Step 4: Verify.**

Run: `pnpm typecheck && pnpm lint && pnpm build`
Expected: all clean (purely additive; existing `partners`/`BookingBlock`/`VoucherBand` untouched).

- [ ] **Step 5: Commit.**

```bash
git add lib/content.ts
git commit -m "feat(booking): add unified per-unit booking links + derived stepper data

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_012TpaxkB8TNy2DpsZ779fGZ"
```

---

### Task 2: BookingStepper component + homepage wiring

**Files:**
- Create: `components/sections/booking-stepper.tsx`
- Modify: `components/sections/voucher-band.tsx`

**Interfaces:**
- Consumes: `partners`, `partnersWithLinks`, `bookingByPartner`, `contact`, `type PartnerId` from `@/lib/content`; `easeOutExpo` from `@/components/motion/transitions`.
- Produces: `BookingStepper()` client component (no props).

- [ ] **Step 1: Create `components/sections/booking-stepper.tsx`.**

```tsx
"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, ArrowLeft, Phone } from "lucide-react";
import {
  partners,
  partnersWithLinks,
  bookingByPartner,
  contact,
  type PartnerId,
} from "@/lib/content";
import { easeOutExpo } from "@/components/motion/transitions";

/**
 * Two-step booking wizard for the homepage: step 1 picks a partner, step 2
 * reveals that partner's per-location links. Client component (interactive).
 */
export function BookingStepper() {
  const [selected, setSelected] = useState<PartnerId | null>(null);

  return (
    <div className="rounded-[18px] border border-white/15 bg-white/[0.06] p-7">
      <div className="relative min-h-[232px]">
        <AnimatePresence mode="wait" initial={false}>
          {selected === null ? (
            <motion.div
              key="partners"
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.28, ease: easeOutExpo }}
            >
              <div className="mb-3.5 text-[11px] font-bold uppercase tracking-[0.16em] text-[#9fb6c6]">
                Alege partenerul
              </div>
              <div className="flex flex-col gap-2.5">
                {partnersWithLinks.map((id) => {
                  const p = partners[id];
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setSelected(p.id)}
                      className="flex items-center justify-between gap-3 rounded-[11px] bg-cream px-4 py-3.5 text-left font-bold text-sea transition-transform hover:translate-x-0.5"
                    >
                      <span className="flex items-center gap-3">
                        <span
                          className="flex size-[30px] items-center justify-center rounded-[7px] text-sm font-extrabold text-white"
                          style={{ backgroundColor: p.color }}
                          aria-hidden
                        >
                          {p.initials}
                        </span>
                        {p.name}
                      </span>
                      <ArrowRight className="size-4 text-terracotta" />
                    </button>
                  );
                })}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="locations"
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 16 }}
              transition={{ duration: 0.28, ease: easeOutExpo }}
            >
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="mb-3.5 inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-[#9fb6c6] transition-colors hover:text-cream"
              >
                <ArrowLeft className="size-3.5" /> înapoi · {partners[selected].name}
              </button>
              <div className="flex flex-col gap-2.5">
                {bookingByPartner[selected].map((loc) => (
                  <a
                    key={loc.slug}
                    href={loc.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between gap-3 rounded-[11px] bg-cream px-4 py-3.5 font-bold text-sea transition-transform hover:translate-x-0.5"
                  >
                    <span className="flex items-center gap-3">
                      {loc.name}
                      <span className="rounded-full bg-sea px-2 py-0.5 text-[10px] font-bold tracking-wider text-white">
                        {"★".repeat(loc.stars)}
                      </span>
                    </span>
                    <ArrowRight className="size-4 text-terracotta" />
                  </a>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="my-4 flex items-center gap-3 text-xs tracking-wider text-[#7e93a3]">
        <span className="h-px flex-1 bg-white/15" />
        SAU
        <span className="h-px flex-1 bg-white/15" />
      </div>

      <a
        href={contact.phoneHref}
        className="flex flex-col items-center gap-0.5 rounded-[11px] bg-terracotta p-4 text-white transition-colors hover:bg-terracotta-dk"
      >
        <span className="text-xs font-semibold tracking-wide opacity-85">
          Sună direct, te ajutăm imediat
        </span>
        <span className="inline-flex items-center gap-2 font-display text-2xl font-semibold">
          <Phone className="size-5" /> {contact.phone}
        </span>
      </a>
    </div>
  );
}
```

- [ ] **Step 2: Wire it into `components/sections/voucher-band.tsx`.** Replace the `BookingBlock` import with the stepper import:

```tsx
import { BookingStepper } from "@/components/sections/booking-stepper";
```

- [ ] **Step 3: Replace the `<BookingBlock …/>` usage** in `voucher-band.tsx`. Change:

```tsx
        <Reveal delay={0.1}>
          <BookingBlock
            partnerIds={["booking", "travelmint", "litoralul"]}
            title="Rezervă acum"
          />
        </Reveal>
```

to:

```tsx
        <Reveal delay={0.1}>
          <BookingStepper />
        </Reveal>
```

- [ ] **Step 4: Verify, then confirm the interaction.**

Run: `pnpm typecheck && pnpm lint && pnpm build`
Expected: all clean. Then `pnpm start`, open the homepage, scroll to the voucher band: clicking a partner animates to its location links; the "← înapoi" button returns to the partner list; location links open the booking URL in a new tab.

- [ ] **Step 5: Commit.**

```bash
git add components/sections/booking-stepper.tsx components/sections/voucher-band.tsx
git commit -m "feat(booking): animated two-step booking stepper on the homepage

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_012TpaxkB8TNy2DpsZ779fGZ"
```

---

### Task 3: Refactor BookingBlock to real per-unit links + remove dead data

Now that the homepage no longer uses `BookingBlock` and the new model is in place, refactor the detail-page block to the real links and remove the obsolete `partners`/`href` fields.

**Files:**
- Modify: `components/sections/booking-block.tsx`
- Modify: `app/cazare/[unit]/page.tsx`
- Modify: `lib/content.ts`

**Interfaces:**
- Consumes: `partners`, `contact`, `type PartnerId`, `Unit.bookingLinks` from `@/lib/content`.
- Produces: `BookingBlock({ bookingLinks, title? })` — new signature replacing `partnerIds`.

- [ ] **Step 1: Replace `components/sections/booking-block.tsx`** with the per-unit version.

```tsx
import { ArrowRight, Phone } from "lucide-react";
import { partners, contact, type PartnerId } from "@/lib/content";

/**
 * Conversion block for a single unit's detail page: renders that unit's real
 * per-partner booking links (in canonical partner order) plus a tap-to-call.
 */
export function BookingBlock({
  bookingLinks,
  title = "Rezervă online la",
}: {
  bookingLinks: Partial<Record<PartnerId, string>>;
  title?: string;
}) {
  const entries = (Object.keys(partners) as PartnerId[])
    .filter((id) => bookingLinks[id])
    .map((id) => ({ partner: partners[id], href: bookingLinks[id]! }));

  return (
    <div className="rounded-[18px] border border-white/15 bg-white/[0.06] p-7">
      <div className="mb-3.5 text-[11px] font-bold uppercase tracking-[0.16em] text-[#9fb6c6]">
        {title}
      </div>

      <div className="flex flex-col gap-2.5">
        {entries.map(({ partner: p, href }) => (
          <a
            key={p.id}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between gap-3 rounded-[11px] bg-cream px-4 py-3.5 font-bold text-sea transition-transform hover:translate-x-0.5"
          >
            <span className="flex items-center gap-3">
              <span
                className="flex size-[30px] items-center justify-center rounded-[7px] text-sm font-extrabold text-white"
                style={{ backgroundColor: p.color }}
                aria-hidden
              >
                {p.initials}
              </span>
              {p.name}
            </span>
            <ArrowRight className="size-4 text-terracotta" />
          </a>
        ))}
      </div>

      <div className="my-4 flex items-center gap-3 text-xs tracking-wider text-[#7e93a3]">
        <span className="h-px flex-1 bg-white/15" />
        SAU
        <span className="h-px flex-1 bg-white/15" />
      </div>

      <a
        href={contact.phoneHref}
        className="flex flex-col items-center gap-0.5 rounded-[11px] bg-terracotta p-4 text-white transition-colors hover:bg-terracotta-dk"
      >
        <span className="text-xs font-semibold tracking-wide opacity-85">
          Sună direct, te ajutăm imediat
        </span>
        <span className="inline-flex items-center gap-2 font-display text-2xl font-semibold">
          <Phone className="size-5" /> {contact.phone}
        </span>
      </a>
    </div>
  );
}
```

- [ ] **Step 2: Update the call site in `app/cazare/[unit]/page.tsx`.** Change `<BookingBlock partnerIds={unit.partners} />` to:

```tsx
          <BookingBlock bookingLinks={unit.bookingLinks} />
```

- [ ] **Step 3: Remove the now-dead `href` from the `Partner` interface and the `partners` record** in `lib/content.ts`. Delete the interface line:

```ts
  /** Where this partner listing lives (placeholder "#"). */
  href: string;
```

and change the `partners` record to drop the `href` keys:

```ts
export const partners: Record<PartnerId, Partner> = {
  booking: { id: "booking", name: "Booking.com", initials: "B.", color: "#003580" },
  travelmint: { id: "travelmint", name: "Travelmint.ro", initials: "Tm", color: "#1fa89b" },
  litoralul: { id: "litoralul", name: "Litoralul Românesc", initials: "LR", color: "#c0633f" },
};
```

- [ ] **Step 4: Remove the now-dead `partners` field from the `Unit` interface and from all three units** in `lib/content.ts`. Delete the interface line:

```ts
  /** Variable per unit — only these partners are shown in the Rezervă block. */
  partners: PartnerId[];
```

and delete these three lines (one per unit):

```ts
    partners: ["booking", "travelmint", "litoralul"],
```
```ts
    partners: ["booking", "litoralul"],
```
```ts
    partners: ["booking", "travelmint"],
```

- [ ] **Step 5: Verify.**

Run: `pnpm typecheck && pnpm lint && pnpm build`
Expected: all clean. `grep -rn "partnerIds\|\.partners\b\|p\.href" app components lib` returns nothing (all dead references gone). Detail page (`/cazare/hotel-paradox`) booking block renders the unit's real per-partner links opening in a new tab.

- [ ] **Step 6: Commit.**

```bash
git add components/sections/booking-block.tsx "app/cazare/[unit]/page.tsx" lib/content.ts
git commit -m "refactor(booking): BookingBlock uses real per-unit links; drop dead partner fields

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_012TpaxkB8TNy2DpsZ779fGZ"
```

---

## Notes for the implementer

- The booking URLs in `content.ts` `bookingLinks` are clearly-commented placeholders. The real 8 URLs get pasted there (one place). Adding Travelmint × Vila Paradox later is a single new key on `vila-paradox.bookingLinks` — no component change.
- `BookingStepper` is the only `"use client"` file; `BookingBlock` stays a server component.
- Do not animate height; the `min-h-[232px]` panel absorbs the per-step height difference. Transform/opacity only.
- Keep the partner order canonical (the order of keys in the `partners` record: booking → travelmint → litoralul) — both `bookingByPartner` and `BookingBlock` derive from `Object.keys(partners)`.
```
