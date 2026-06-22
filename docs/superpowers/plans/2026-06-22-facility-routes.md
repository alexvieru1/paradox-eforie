# Facility Routes (Terasă & Plajă) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add dedicated `/terasa` and `/plaja` pages completing the set of 5 brand units, reusing the existing Direction A design system.

**Architecture:** Two new top-level static server-component routes (`app/terasa/page.tsx`, `app/plaja/page.tsx`) that compose existing leaf components (`Gallery`, `Reveal`, `PhotoPlaceholder`, `Eyebrow`, `SiteFooter`, `MobileCallBar`). All copy/data is added to `lib/content.ts`. The homepage Terasa/Plaja sections gain "Află mai multe →" links. `MobileCallBar` gains optional props so it works on pages without a `#rezerva` section.

**Tech Stack:** Next.js 16 (App Router), React 19, TypeScript, Tailwind v4, `motion/react`, `lucide-react`.

## Global Constraints

- **No test framework exists** — verification per task is `pnpm typecheck` (clean), `pnpm lint` (clean), `pnpm build` (succeeds). These replace unit-test steps.
- **Repo is NOT git-initialized** — there are no commit steps. Each task ends at a passing verification gate. (If `git init` is run later, commit per task.)
- **All copy lives in `lib/content.ts`** — never hardcode Romanian strings in components. Use „…" quotes; the correct term is **„vouchere de vacanță"** (not „tichete").
- **Server by default.** Only existing leaf components carry `"use client"` (`gallery`, `reveal`). New page files stay server components.
- **Motion:** import from `motion/react`; reuse `Reveal`; animate transform/opacity only. App is wrapped in `<MotionConfig reducedMotion="user">`.
- **Icons:** `lucide-react` only. No emoji.
- **Placeholders:** photography/map use `PhotoPlaceholder` / striped blocks with mono captions — not final assets.
- **Tokens only:** `cream #FBF6EE`, `sand #F2E7D6`, `sea #1E3D52`, `terracotta #C0633F` (hover `#A8512F` = `terracotta-dk`), `body #5A4E40`, `muted #7A6E5E`, `faint #A08A6A`, `voucher #1F8A5B`, `surface`, `line`. Fonts: `font-display` (Newsreader), `font-sans` (Mulish). Eyebrows: 12px uppercase tracking `0.21em` terracotta bold.
- **Plaja hero gradient (literal, inline style):** `linear-gradient(110deg,#2E4257 0%,#7E5E72 42%,#C77A6A 70%,#E89B6C 100%)` with the stripe + dark overlay from `components/sections/plaja.tsx`.
- **Conversion paths:** Terasă = tap-to-call („Rezervă o masă", `contact.phoneHref`), NO booking partners / NO `BookingBlock`. Plajă = soft CTA to `/#cazare`, NO booking partners.
- Content max-width `1240px`; section padding pattern `px-5 sm:px-8 lg:px-16`.

---

### Task 1: Extend content data model in `lib/content.ts`

**Files:**
- Modify: `lib/content.ts` (add interfaces near `GalleryItem` ~line 44; replace the `terasa` export ~lines 161-166; replace the `plaja` export ~lines 168-172)

**Interfaces:**
- Consumes: existing `GalleryItem` (`{ id: string; caption: string }`), `contact`.
- Produces:
  - `MenuItem` = `{ name: string; price: string; desc?: string }`
  - `MenuCategory` = `{ category: string; items: MenuItem[] }`
  - `HoursEntry` = `{ label: string; value: string }`
  - `terasa` object with added fields: `href: string`, `more: string`, `address: string`, `intro: string[]`, `gallery: GalleryItem[]`, `menu: MenuCategory[]`, `hours: HoursEntry[]`, `reserve: { eyebrow: string; heading: string; body: string; cta: string }`. Existing `eyebrow/heading/body/tags` retained.
  - `plaja` object with added fields: `href: string`, `more: string`, `address: string`, `gallery: GalleryItem[]`, `cta: { eyebrow: string; heading: string; body: string; label: string; href: string }`. Existing `eyebrow/heading/body` retained.

- [ ] **Step 1: Add the new interfaces** after the `GalleryItem` interface (after line 48).

```ts
export interface MenuItem {
  name: string;
  price: string;
  /** Optional one-line description. */
  desc?: string;
}

export interface MenuCategory {
  category: string;
  items: MenuItem[];
}

export interface HoursEntry {
  label: string;
  value: string;
}
```

- [ ] **Step 2: Replace the `terasa` export** (current lines 161-166) with the extended object.

```ts
export const terasa = {
  eyebrow: "Terasa Paradox",
  heading: "Mâncare proaspătă, gust de vacanță",
  body: "O bucătărie variată, cu preparate proaspete la prețuri accesibile — de la micul dejun în familie până la cina cu vin, sub stele, pe Ion Movilă 25.",
  tags: ["Mic dejun", "Pește proaspăt", "Prețuri accesibile", "Terasă în aer liber"],
  href: "/terasa",
  more: "Află mai multe",
  address: "Ion Movilă 25, Eforie Sud",
  intro: [
    "Terasa Paradox este locul unde se adună familia la masă, pe Ion Movilă 25 — la doi pași de plajă. Bucătărie proaspătă, porții generoase și prețuri prietenoase, într-o atmosferă relaxată, în aer liber.",
    "De dimineață servim mic dejun, iar seara terasa se aprinde pentru cină — pește proaspăt, preparate la grătar și un pahar de vin sub stele. Te primim cu drag, fără rezervare sau cu o masă rezervată la telefon.",
  ],
  gallery: [
    { id: "t1", caption: "foto · terasa seara" },
    { id: "t2", caption: "foto · pește proaspăt la grătar" },
    { id: "t3", caption: "foto · mic dejun în familie" },
    { id: "t4", caption: "foto · preparate de sezon" },
    { id: "t5", caption: "foto · atmosfera în aer liber" },
    { id: "t6", caption: "foto · desert de casă" },
  ],
  menu: [
    {
      category: "Mic dejun",
      items: [
        { name: "Omletă cu brânză și verdețuri", price: "18 lei", desc: "ouă proaspete, brânză de Eforie, pâine prăjită" },
        { name: "Clătite cu gem de casă", price: "16 lei" },
        { name: "Platou continental", price: "24 lei", desc: "mezeluri, brânzeturi, legume, ou fiert" },
      ],
    },
    {
      category: "Pește & fructe de mare",
      items: [
        { name: "Pește proaspăt la grătar", price: "preț de piață", desc: "în funcție de captura zilei" },
        { name: "Midii marinare", price: "42 lei" },
        { name: "Saramură de crap", price: "38 lei" },
      ],
    },
    {
      category: "De la grătar",
      items: [
        { name: "Mici de casă (5 buc.)", price: "22 lei" },
        { name: "Ceafă de porc", price: "32 lei" },
        { name: "Piept de pui la grătar", price: "28 lei" },
      ],
    },
    {
      category: "Desert & băuturi",
      items: [
        { name: "Papanași cu smântână și dulceață", price: "20 lei" },
        { name: "Limonadă de casă", price: "12 lei" },
        { name: "Vin de casă (250 ml)", price: "14 lei" },
      ],
    },
  ],
  hours: [
    { label: "Luni – Vineri", value: "08:00 – 23:00" },
    { label: "Sâmbătă – Duminică", value: "08:00 – 24:00" },
    { label: "Sezon", value: "mai – septembrie" },
  ],
  reserve: {
    eyebrow: "Rezervă o masă",
    heading: "Te așteptăm pe terasă",
    body: "Vino direct sau sună-ne să-ți pregătim o masă — răspundem cu drag și te ajutăm cu orice.",
    cta: "Rezervă o masă",
  },
};
```

- [ ] **Step 3: Replace the `plaja` export** (current lines 168-172) with the extended object.

```ts
export const plaja = {
  eyebrow: "Plaja Paradox",
  heading: "Plaja noastră, cu cele mai frumoase apusuri",
  body: "Nisip fin, șezlonguri, și marea la doi pași. Dimineața liniște pentru copii, seara cerul se colorează peste apă — momentul preferat al oaspeților noștri.",
  href: "/plaja",
  more: "Află mai multe",
  address: "Eforie Sud, jud. Constanța",
  gallery: [
    { id: "p1", caption: "foto · plaja la apus" },
    { id: "p2", caption: "foto · șezlonguri și umbrele" },
    { id: "p3", caption: "foto · nisip fin dimineața" },
    { id: "p4", caption: "foto · copii la mare" },
    { id: "p5", caption: "foto · marea liniștită" },
    { id: "p6", caption: "foto · apus peste apă" },
  ],
  cta: {
    eyebrow: "Cazare lângă plajă",
    heading: "Stai la câțiva pași de mare",
    body: "Toate unitățile Paradox sunt aproape de plajă — alege-ți cazarea și bucură-te de apusuri în fiecare seară.",
    label: "Vezi cazarea",
    href: "/#cazare",
  },
};
```

- [ ] **Step 4: Verify the data compiles.**

Run: `pnpm typecheck`
Expected: no errors.

---

### Task 2: Add optional props to `MobileCallBar`

The bar currently hardcodes `href="#rezerva"`, which exists only on cazare pages. Terasă uses a `#program` section; Plajă has no reserve section and should point to `/#cazare`. Defaults must preserve current cazare-page behavior.

**Files:**
- Modify: `components/sections/mobile-call-bar.tsx`

**Interfaces:**
- Produces: `MobileCallBar({ reserveHref?: string; reserveLabel?: string })` — defaults `reserveHref = "#rezerva"`, `reserveLabel = "Rezervă"`. Existing call sites with no props are unaffected.

- [ ] **Step 1: Replace the component signature and the first anchor** to use the props.

```tsx
import { Phone } from "lucide-react";
import { contact } from "@/lib/content";

/** Fixed bottom action bar shown on mobile detail pages. */
export function MobileCallBar({
  reserveHref = "#rezerva",
  reserveLabel = "Rezervă",
}: {
  reserveHref?: string;
  reserveLabel?: string;
} = {}) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-[45] flex gap-2.5 bg-cream/95 p-3.5 shadow-[0_-2px_16px_rgba(0,0,0,.12)] backdrop-blur lg:hidden">
      <a
        href={reserveHref}
        className="flex flex-1 items-center justify-center rounded-[11px] bg-sea py-3.5 text-[15px] font-bold text-cream"
      >
        {reserveLabel}
      </a>
      <a
        href={contact.phoneHref}
        className="flex flex-1 items-center justify-center gap-2 rounded-[11px] bg-terracotta py-3.5 text-[15px] font-bold text-white"
      >
        <Phone className="size-4" /> Sună
      </a>
    </div>
  );
}
```

- [ ] **Step 2: Verify nothing broke** (cazare page still calls `<MobileCallBar />` with no props).

Run: `pnpm typecheck`
Expected: no errors.

---

### Task 3: Build the Terasă page (`app/terasa/page.tsx`)

**Files:**
- Create: `app/terasa/page.tsx`

**Interfaces:**
- Consumes: `terasa`, `contact` from `@/lib/content`; `Gallery`, `SiteFooter`, `MobileCallBar`; `PhotoPlaceholder`, `Eyebrow` from primitives; `Phone`, `Clock`, `MapPin`, `Waves`, `UtensilsCrossed` from `lucide-react`.
- Produces: default-exported `TerasaPage` server component at route `/terasa`.

- [ ] **Step 1: Create the file** with the full page.

```tsx
import Link from "next/link";
import { Phone, Clock, MapPin, UtensilsCrossed } from "lucide-react";
import { Gallery } from "@/components/sections/gallery";
import { SiteFooter } from "@/components/sections/site-footer";
import { MobileCallBar } from "@/components/sections/mobile-call-bar";
import { PhotoPlaceholder, Eyebrow } from "@/components/ui/primitives";
import { terasa, contact } from "@/lib/content";

export const metadata = {
  title: "Terasa Paradox · Eforie Sud",
  description: terasa.body,
};

export default function TerasaPage() {
  return (
    <main className="pb-24 lg:pb-0">
      {/* breadcrumb + title */}
      <div className="mx-auto max-w-[1240px] px-5 pb-2 pt-[clamp(80px,12vh,120px)] sm:px-8 lg:px-16">
        <nav className="mb-4 text-[13px] text-faint">
          <Link href="/" className="hover:text-terracotta">Paradox</Link> ·{" "}
          <span className="text-body">Terasă</span>
        </nav>
        <Eyebrow className="mb-3">{terasa.eyebrow}</Eyebrow>
        <h1 className="font-display text-[clamp(34px,5.5vw,60px)] font-medium leading-[1.02] tracking-[-1px] text-sea">
          {terasa.heading}
        </h1>
        <p className="mt-2.5 text-base text-muted">{terasa.address}</p>
      </div>

      <Gallery images={terasa.gallery} />

      {/* intro */}
      <section className="mx-auto max-w-[1240px] px-5 pb-[clamp(40px,6vh,72px)] sm:px-8 lg:px-16">
        <div className="max-w-[68ch]">
          {terasa.intro.map((p, i) => (
            <p key={i} className="mb-4 text-[17px] leading-[1.75] text-body">
              {p}
            </p>
          ))}
          <div className="mt-2 flex flex-wrap gap-2.5">
            {terasa.tags.map((t) => (
              <span
                key={t}
                className="rounded-full bg-sand px-[15px] py-2 text-[13px] font-semibold text-body"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* menu highlights */}
      <section className="bg-sand px-5 py-[clamp(48px,7vh,80px)] sm:px-8 lg:px-16">
        <div className="mx-auto max-w-[1240px]">
          <Eyebrow className="mb-3">Meniul nostru</Eyebrow>
          <h2 className="mb-8 font-display text-[clamp(26px,3.5vw,40px)] font-medium tracking-[-0.4px] text-sea">
            Preparate proaspete, gust de vacanță
          </h2>
          <div className="grid gap-3.5 md:grid-cols-2">
            {terasa.menu.map((cat) => (
              <div
                key={cat.category}
                className="rounded-2xl bg-surface p-6 shadow-[0_1px_3px_rgba(60,40,20,.08)]"
              >
                <div className="mb-4 flex items-center gap-3">
                  <span className="flex size-[34px] flex-none items-center justify-center rounded-[9px] bg-sand text-terracotta">
                    <UtensilsCrossed className="size-4" />
                  </span>
                  <h3 className="font-display text-[22px] font-medium tracking-[-0.2px] text-sea">
                    {cat.category}
                  </h3>
                </div>
                <ul className="flex flex-col gap-3.5">
                  {cat.items.map((item) => (
                    <li key={item.name}>
                      <div className="flex items-baseline justify-between gap-3">
                        <span className="text-[15px] font-semibold text-[#3a2e22]">
                          {item.name}
                        </span>
                        <span className="flex-none text-[15px] font-bold text-terracotta">
                          {item.price}
                        </span>
                      </div>
                      {item.desc && (
                        <p className="mt-0.5 text-[13px] leading-snug text-faint">
                          {item.desc}
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* program / hours + reserve */}
      <section
        id="program"
        className="mx-auto max-w-[1240px] px-5 py-[clamp(48px,7vh,80px)] sm:px-8 lg:px-16"
      >
        <div className="grid items-center gap-[clamp(28px,5vw,56px)] lg:grid-cols-2">
          <div>
            <Eyebrow className="mb-3">Program</Eyebrow>
            <h2 className="mb-6 font-display text-[clamp(26px,3.5vw,40px)] font-medium tracking-[-0.4px] text-sea">
              Când te așteptăm
            </h2>
            <div className="flex flex-col gap-3">
              {terasa.hours.map((h) => (
                <div
                  key={h.label}
                  className="flex items-center gap-4 rounded-2xl bg-surface p-5 shadow-[0_1px_3px_rgba(60,40,20,.08)]"
                >
                  <span className="flex size-11 flex-none items-center justify-center rounded-full bg-sand text-terracotta">
                    <Clock className="size-5" />
                  </span>
                  <div className="flex flex-1 items-baseline justify-between gap-3">
                    <span className="text-[15px] text-body">{h.label}</span>
                    <span className="font-bold text-sea">{h.value}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-[18px] bg-sea p-[clamp(28px,5vw,44px)] text-cream">
            <div className="mb-3 text-xs font-bold uppercase tracking-[0.21em] text-[#9fb6c6]">
              {terasa.reserve.eyebrow}
            </div>
            <h3 className="mb-3.5 font-display text-[clamp(24px,3vw,34px)] font-medium leading-[1.1]">
              {terasa.reserve.heading}
            </h3>
            <p className="mb-7 max-w-[40ch] text-base leading-relaxed text-[#bfd0dc]">
              {terasa.reserve.body}
            </p>
            <a
              href={contact.phoneHref}
              className="inline-flex items-center gap-2.5 rounded-full bg-terracotta px-[26px] py-3.5 text-[15px] font-bold text-white transition-transform hover:-translate-y-0.5"
            >
              <Phone className="size-4" /> {terasa.reserve.cta} · {contact.phone}
            </a>
          </div>
        </div>
      </section>

      {/* location */}
      <section className="bg-sand px-5 py-[clamp(48px,7vh,80px)] sm:px-8 lg:px-16">
        <div className="mx-auto grid max-w-[1240px] items-center gap-[clamp(28px,5vw,56px)] lg:grid-cols-2">
          <div>
            <Eyebrow className="mb-3">Locație</Eyebrow>
            <h2 className="mb-[18px] font-display text-[clamp(26px,3.5vw,40px)] font-medium tracking-[-0.4px] text-sea">
              La doi pași de plajă
            </h2>
            <p className="mb-6 max-w-[42ch] text-base leading-relaxed text-body">
              Terasa Paradox se află pe Ion Movilă 25, în centrul stațiunii Eforie
              Sud — la câteva minute de mers de mare și de unitățile de cazare.
            </p>
            <div className="flex items-center gap-3 text-[15px] text-[#3a2e22]">
              <span className="flex size-9 flex-none items-center justify-center rounded-full bg-surface text-terracotta">
                <MapPin className="size-4" />
              </span>
              {terasa.address}
            </div>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-[18px] shadow-[0_12px_32px_rgba(60,40,20,.12)]">
            <PhotoPlaceholder label="hartă · Google Maps embed" className="absolute inset-0" stripe="#e6decb" />
          </div>
        </div>
      </section>

      <SiteFooter />
      <MobileCallBar reserveHref="#program" reserveLabel="Rezervă masă" />
    </main>
  );
}
```

- [ ] **Step 2: Verify the route compiles and renders.**

Run: `pnpm typecheck && pnpm lint && pnpm build`
Expected: typecheck clean, lint clean, build succeeds with `/terasa` in the route list.

---

### Task 4: Build the Plajă page (`app/plaja/page.tsx`)

**Files:**
- Create: `app/plaja/page.tsx`

**Interfaces:**
- Consumes: `plaja` from `@/lib/content`; `Gallery`, `SiteFooter`, `MobileCallBar`; `PhotoPlaceholder`, `Eyebrow`; `ArrowRight`, `MapPin` from `lucide-react`.
- Produces: default-exported `PlajaPage` server component at route `/plaja`.

- [ ] **Step 1: Create the file** with the full page. The hero reuses the literal gradient + stripe + dark overlay from `components/sections/plaja.tsx`.

```tsx
import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import { Gallery } from "@/components/sections/gallery";
import { SiteFooter } from "@/components/sections/site-footer";
import { MobileCallBar } from "@/components/sections/mobile-call-bar";
import { PhotoPlaceholder, Eyebrow } from "@/components/ui/primitives";
import { plaja } from "@/lib/content";

export const metadata = {
  title: "Plaja Paradox · Eforie Sud",
  description: plaja.body,
};

export default function PlajaPage() {
  return (
    <main className="pb-24 lg:pb-0">
      {/* hero band */}
      <section className="relative flex min-h-[72vh] items-end overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(110deg,#2E4257 0%,#7E5E72 42%,#C77A6A 70%,#E89B6C 100%)",
          }}
        >
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "repeating-linear-gradient(122deg,rgba(255,255,255,.05) 0 2px,transparent 2px 26px)",
            }}
          />
          <span className="absolute bottom-3.5 left-3.5 font-mono text-[11px] text-white/55">
            [ foto · Plaja Paradox la apus — full bleed ]
          </span>
        </div>
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(0deg,rgba(20,30,45,.6) 0%,rgba(20,30,45,.08) 70%)",
          }}
        />
        <div className="relative z-10 mx-auto w-full max-w-[1240px] px-5 pb-[clamp(40px,7vh,72px)] pt-[clamp(120px,20vh,200px)] sm:px-8 lg:px-16">
          <nav className="mb-4 text-[13px] text-white/70">
            <Link href="/" className="hover:text-[#fbe9cf]">Paradox</Link> ·{" "}
            <span className="text-white">Plajă</span>
          </nav>
          <Eyebrow className="mb-4 text-[#fbe9cf]">{plaja.eyebrow}</Eyebrow>
          <h1 className="mb-5 max-w-[16ch] font-display text-[clamp(34px,6vw,68px)] font-medium leading-[1.04] tracking-[-0.5px] text-[#fff8ee] text-balance">
            {plaja.heading}
          </h1>
          <p className="max-w-[46ch] text-[clamp(16px,2vw,20px)] leading-relaxed text-[#f4e6d4]">
            {plaja.body}
          </p>
        </div>
      </section>

      <Gallery images={plaja.gallery} />

      {/* location + CTA to cazare */}
      <section className="bg-sand px-5 py-[clamp(48px,7vh,80px)] sm:px-8 lg:px-16">
        <div className="mx-auto grid max-w-[1240px] items-center gap-[clamp(28px,5vw,56px)] lg:grid-cols-2">
          <div>
            <Eyebrow className="mb-3">Locație</Eyebrow>
            <h2 className="mb-[18px] font-display text-[clamp(26px,3.5vw,40px)] font-medium tracking-[-0.4px] text-sea">
              Marea, la doi pași
            </h2>
            <p className="mb-6 max-w-[42ch] text-base leading-relaxed text-body">
              Plaja Paradox este în centrul stațiunii Eforie Sud, cu nisip fin și
              cele mai frumoase apusuri de pe litoral.
            </p>
            <div className="mb-7 flex items-center gap-3 text-[15px] text-[#3a2e22]">
              <span className="flex size-9 flex-none items-center justify-center rounded-full bg-surface text-terracotta">
                <MapPin className="size-4" />
              </span>
              {plaja.address}
            </div>

            <div className="rounded-[18px] bg-surface p-6 shadow-[0_1px_3px_rgba(60,40,20,.08)]">
              <Eyebrow className="mb-2">{plaja.cta.eyebrow}</Eyebrow>
              <h3 className="mb-2.5 font-display text-[clamp(20px,2.5vw,28px)] font-medium tracking-[-0.2px] text-sea">
                {plaja.cta.heading}
              </h3>
              <p className="mb-5 max-w-[44ch] text-[15px] leading-relaxed text-body">
                {plaja.cta.body}
              </p>
              <Link
                href={plaja.cta.href}
                className="inline-flex items-center gap-2 rounded-full bg-terracotta px-[26px] py-3.5 text-[15px] font-bold text-white transition-transform hover:-translate-y-0.5"
              >
                {plaja.cta.label} <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-[18px] shadow-[0_12px_32px_rgba(60,40,20,.12)]">
            <PhotoPlaceholder label="hartă · Google Maps embed" className="absolute inset-0" stripe="#e6decb" />
          </div>
        </div>
      </section>

      <SiteFooter />
      <MobileCallBar reserveHref="/#cazare" reserveLabel="Vezi cazarea" />
    </main>
  );
}
```

- [ ] **Step 2: Verify the route compiles and renders.**

Run: `pnpm typecheck && pnpm lint && pnpm build`
Expected: typecheck clean, lint clean, build succeeds with `/plaja` in the route list.

---

### Task 5: Add "Află mai multe →" links to the homepage sections

**Files:**
- Modify: `components/sections/terasa.tsx`
- Modify: `components/sections/plaja.tsx`

**Interfaces:**
- Consumes: `terasa.href`, `terasa.more`, `plaja.href`, `plaja.more` from Task 1; `ArrowRight` from `lucide-react`; `Link` from `next/link`.

- [ ] **Step 1: In `components/sections/terasa.tsx`** add the imports and the link. Update the imports at the top:

```tsx
import Link from "next/link";
import { Phone, ArrowRight } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { PhotoPlaceholder, Eyebrow } from "@/components/ui/primitives";
import { terasa, contact } from "@/lib/content";
```

- [ ] **Step 2: In `components/sections/terasa.tsx`** wrap the existing „Rezervă o masă" anchor and add the „Află mai multe" link beside it. Replace the single `<a …>Rezervă o masă</a>` (lines ~37-42) with:

```tsx
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
              <a
                href={contact.phoneHref}
                className="inline-flex items-center gap-2.5 rounded-full bg-sea px-[26px] py-3.5 text-[15px] font-bold text-cream transition-transform hover:-translate-y-0.5"
              >
                <Phone className="size-4" /> Rezervă o masă
              </a>
              <Link
                href={terasa.href}
                className="inline-flex items-center gap-1.5 text-[15px] font-bold text-terracotta transition-colors hover:text-terracotta-dk"
              >
                {terasa.more} <ArrowRight className="size-4" />
              </Link>
            </div>
```

- [ ] **Step 3: In `components/sections/plaja.tsx`** add imports. Replace the top imports with:

```tsx
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { Eyebrow } from "@/components/ui/primitives";
import { plaja } from "@/lib/content";
```

- [ ] **Step 4: In `components/sections/plaja.tsx`** add the link after the body paragraph (after the `<p>…{plaja.body}</p>` closing tag, before `</Reveal>`):

```tsx
        <Link
          href={plaja.href}
          className="mt-7 inline-flex items-center gap-1.5 rounded-full bg-[#fff8ee]/95 px-[22px] py-3 text-[15px] font-bold text-sea transition-transform hover:-translate-y-0.5"
        >
          {plaja.more} <ArrowRight className="size-4" />
        </Link>
```

- [ ] **Step 5: Final verification — full Definition of Done.**

Run: `pnpm typecheck && pnpm lint && pnpm build`
Expected: all clean; routes `/`, `/terasa`, `/plaja`, `/cazare/[unit]` all build. Then visually confirm on mobile + desktop: homepage Terasa/Plaja sections show „Află mai multe →"; `/terasa` shows menu + hours + tap-to-call (no booking partners); `/plaja` shows the sunset hero + gallery + CTA to `/#cazare`; reduced motion respected.

---

## Notes for the implementer

- Do NOT add a `BookingBlock` to either page — the conversion paths are tap-to-call (Terasă) and the soft cazare CTA (Plajă), per the spec.
- Do NOT change `header.tsx` nav or homepage section anchors — linking is via the section „Află mai multe" links only.
- Keep new page files as server components (no `"use client"`).
- `terracotta-dk` is the `#A8512F` hover token already defined in `globals.css`.
