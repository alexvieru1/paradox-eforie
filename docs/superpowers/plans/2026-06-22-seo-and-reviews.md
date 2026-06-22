# SEO + Google Reviews Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the site indexable and rich-result-eligible (metadata, JSON-LD, sitemap, robots) and display the brand's live Google reviews, without violating Google's structured-data rules.

**Architecture:** A centralized `lib/seo.ts` holds site constants, business identity, per-unit geo, and JSON-LD builders. A tiny `JsonLd` server component renders `<script type="application/ld+json">`. `lib/reviews.ts` fetches live Google reviews server-side (cached daily) with a graceful fallback. Page files add metadata/`generateMetadata` and JSON-LD; new `app/sitemap.ts`, `app/robots.ts`, `app/manifest.ts`, `app/icon.svg`, and `next.config.ts` complete the crawl/PWA surface.

**Tech Stack:** Next.js 16 (App Router, Metadata API + file conventions), React 19, TypeScript, Google Places API (New), `next/image`.

## Global Constraints

- **No test framework exists** — verification per task is `pnpm typecheck`, `pnpm lint`, `pnpm build` (all clean). These replace unit-test steps. Where a runtime check is possible (sitemap/robots/JSON-LD output), the task says how.
- **Repo IS git-initialized** — commit at the end of each task (on branch `feat/seo`).
- **Production URL:** `https://www.paradoxeforie.ro` (exact, with `www`).
- **All SEO copy lives in `lib/content.ts` / `lib/seo.ts`** — no hardcoded Romanian strings in components beyond short structural labels already established.
- **Server components only.** No `"use client"` added. `GOOGLE_PLACES_API_KEY` is server-only (never `NEXT_PUBLIC_`, never rendered to the client).
- **Compliance:** NEVER emit `aggregateRating` (Google reviews are third-party/borrowed — prohibited). The Google profile is referenced only via `sameAs`. Never fabricate ratings.
- **Keywords:** primary "cazare Eforie Sud"; secondary "cazare litoral / Marea Neagră, hotel Eforie Sud, cazare cu vouchere de vacanță, cazare aproape de Techirghiol, cazare familie litoral, restaurant Eforie Sud, plajă Eforie Sud". Woven into titles/descriptions naturally; no meta-keywords tag.
- **Resolved data (use verbatim):**
  - Place ID: `ChIJ9Zh-XnjgukARsEy1SloFkrI`
  - Legal name: `Paradox Company SRL`
  - Google profile: `https://maps.google.com/?cid=12867352970709519536`
  - Geo: `hotel-paradox` → `44.0284311, 28.6485494`; `vila-paradox` → `44.028635, 28.6521375`; `paradox-h` → `44.0216668, 28.6541900`
- **Theme colors (tokens):** sea `#1E3D52`, cream `#FBF6EE`.
- **Social `sameAs`:** Facebook, Instagram, TikTok are placeholder URLs to fill before launch.

---

### Task 1: SEO foundation module (`lib/seo.ts`)

**Files:**
- Create: `lib/seo.ts`

**Interfaces:**
- Consumes: `contact`, `units`, `type Unit` from `@/lib/content`.
- Produces:
  - `SITE_URL: string`, `SITE_NAME: string`
  - `business: { legalName; brandName; placeId; googleProfileUrl; email?; sameAs: string[] }`
  - `unitGeo: Record<string, { lat: number; lng: number }>`
  - `organizationLd(): Record<string, unknown>`
  - `hotelLd(unit: Unit): Record<string, unknown>`
  - `restaurantLd(): Record<string, unknown>`
  - `breadcrumbLd(items: { name: string; url: string }[]): Record<string, unknown>`

- [ ] **Step 1: Create `lib/seo.ts`** with constants and builders.

```ts
/** Centralized SEO config + JSON-LD builders. No hardcoded copy in components. */
import { contact, units, terasa as terasaContent, type Unit } from "@/lib/content";

export const SITE_URL = "https://www.paradoxeforie.ro";
export const SITE_NAME = "Paradox Eforie Sud";

export const business = {
  legalName: "Paradox Company SRL",
  brandName: "Paradox Eforie Sud",
  placeId: "ChIJ9Zh-XnjgukARsEy1SloFkrI",
  googleProfileUrl: "https://maps.google.com/?cid=12867352970709519536",
  /** TODO before launch: replace placeholder social URLs with the real ones. */
  sameAs: [
    "https://maps.google.com/?cid=12867352970709519536",
    "https://www.facebook.com/paradoxeforie", // PLACEHOLDER
    "https://www.instagram.com/paradoxeforie", // PLACEHOLDER
    "https://www.tiktok.com/@paradoxeforie", // PLACEHOLDER
  ],
};

/** Per-unit coordinates (resolved via Google Places). */
export const unitGeo: Record<string, { lat: number; lng: number }> = {
  "hotel-paradox": { lat: 44.0284311, lng: 28.6485494 },
  "vila-paradox": { lat: 44.028635, lng: 28.6521375 },
  "paradox-h": { lat: 44.0216668, lng: 28.654190 },
};

/** Split "Strada Oituz 4, Eforie Sud" into a schema.org PostalAddress. */
function postalAddress(address: string) {
  const street = address.split(",")[0]?.trim() ?? address;
  return {
    "@type": "PostalAddress",
    streetAddress: street,
    addressLocality: "Eforie Sud",
    addressRegion: "Constanța",
    postalCode: "905360",
    addressCountry: "RO",
  };
}

export function organizationLd(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": ["Organization", "LocalBusiness"],
    "@id": `${SITE_URL}/#organization`,
    name: SITE_NAME,
    legalName: business.legalName,
    url: SITE_URL,
    telephone: contact.phoneHref.replace("tel:", ""),
    image: `${SITE_URL}/icon.svg`,
    address: postalAddress("Eforie Sud, Constanța"),
    areaServed: "Eforie Sud",
    sameAs: business.sameAs,
  };
}

export function hotelLd(unit: Unit): Record<string, unknown> {
  const geo = unitGeo[unit.slug];
  return {
    "@context": "https://schema.org",
    "@type": unit.kind === "hotel" ? "Hotel" : "LodgingBusiness",
    "@id": `${SITE_URL}/cazare/${unit.slug}/#lodging`,
    name: unit.name,
    description: unit.blurb,
    url: `${SITE_URL}/cazare/${unit.slug}`,
    telephone: contact.phoneHref.replace("tel:", ""),
    starRating: { "@type": "Rating", ratingValue: unit.stars },
    address: postalAddress(unit.address),
    ...(geo ? { geo: { "@type": "GeoCoordinates", latitude: geo.lat, longitude: geo.lng } } : {}),
    priceRange: "€€",
    paymentAccepted: "Cash, Card, Vouchere de vacanță",
    ...(unit.amenities
      ? { amenityFeature: unit.amenities.map((a) => ({ "@type": "LocationFeatureSpecification", name: a, value: true })) }
      : {}),
    sameAs: business.sameAs,
  };
}

export function restaurantLd(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    "@id": `${SITE_URL}/terasa/#restaurant`,
    name: "Terasa Paradox",
    description: terasaContent.body,
    url: `${SITE_URL}/terasa`,
    telephone: contact.phoneHref.replace("tel:", ""),
    servesCuisine: ["Românească", "Pește și fructe de mare"],
    priceRange: "€€",
    acceptsReservations: true,
    address: postalAddress(terasaContent.address),
    geo: { "@type": "GeoCoordinates", latitude: unitGeo["vila-paradox"].lat, longitude: unitGeo["vila-paradox"].lng },
    openingHoursSpecification: [
      { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "08:00", closes: "23:00" },
      { "@type": "OpeningHoursSpecification", dayOfWeek: ["Saturday", "Sunday"], opens: "08:00", closes: "24:00" },
    ],
    sameAs: business.sameAs,
  };
}

export function breadcrumbLd(items: { name: string; url: string }[]): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: it.url.startsWith("http") ? it.url : `${SITE_URL}${it.url}`,
    })),
  };
}

/** Re-export for sitemap convenience. */
export const allUnitSlugs = units.map((u) => u.slug);
```

- [ ] **Step 2: Verify it compiles.**

Run: `pnpm typecheck`
Expected: no errors. (If `terasa.address` is missing, the prior facility-routes work added it — confirm `terasaContent.address` exists.)

- [ ] **Step 3: Commit.**

```bash
git add lib/seo.ts
git commit -m "feat(seo): add centralized SEO config and JSON-LD builders

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_012TpaxkB8TNy2DpsZ779fGZ"
```

---

### Task 2: JsonLd component + root layout metadata & Organization JSON-LD

**Files:**
- Create: `components/seo/json-ld.tsx`
- Modify: `app/layout.tsx`

**Interfaces:**
- Consumes: `SITE_URL`, `SITE_NAME`, `organizationLd` from `@/lib/seo`.
- Produces: `JsonLd({ data })` server component; expanded root `metadata`.

- [ ] **Step 1: Create `components/seo/json-ld.tsx`.**

```tsx
/** Renders one or more JSON-LD objects as a <script type="application/ld+json">. */
export function JsonLd({
  data,
}: {
  data: Record<string, unknown> | Record<string, unknown>[];
}) {
  return (
    <script
      type="application/ld+json"
      // JSON.stringify output is safe; no user input is interpolated.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
```

- [ ] **Step 2: Replace the `metadata` export in `app/layout.tsx`** with the expanded version and add imports. The new imports go beside the existing ones; the new `metadata` replaces the current `title`+`description`-only object.

```tsx
import { JsonLd } from "@/components/seo/json-ld";
import { SITE_URL, SITE_NAME, organizationLd } from "@/lib/seo";
```

```tsx
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Paradox Eforie Sud — cazare, terasă și plajă la Marea Neagră",
    template: "%s · Paradox Eforie Sud",
  },
  description:
    "Cazare în Eforie Sud la câțiva pași de plajă: Hotel Paradox, Vila Paradox și Paradox H. Terasă și plajă proprii, aproape de Techirghiol. Acceptăm vouchere de vacanță.",
  applicationName: SITE_NAME,
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    locale: "ro_RO",
    siteName: SITE_NAME,
    url: SITE_URL,
    title: "Paradox Eforie Sud — cazare la Marea Neagră",
    description:
      "Cazare, terasă și plajă în Eforie Sud, aproape de Techirghiol. Acceptăm vouchere de vacanță.",
  },
  twitter: { card: "summary_large_image" },
};
```

- [ ] **Step 3: Render the Organization JSON-LD in `app/layout.tsx`** inside `<body>`, right after the opening `<body …>` tag (before `<MotionProvider>`).

```tsx
      <body className="flex min-h-full flex-col bg-cream text-ink">
        <JsonLd data={organizationLd()} />
        <MotionProvider>
          <Header />
          {children}
        </MotionProvider>
      </body>
```

- [ ] **Step 4: Verify build and JSON-LD output.**

Run: `pnpm typecheck && pnpm lint && pnpm build`
Expected: all clean.

- [ ] **Step 5: Commit.**

```bash
git add components/seo/json-ld.tsx app/layout.tsx
git commit -m "feat(seo): root metadata, OpenGraph defaults, Organization JSON-LD

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_012TpaxkB8TNy2DpsZ779fGZ"
```

---

### Task 3: Page metadata (homepage, cazare, terasă, plajă)

**Files:**
- Modify: `app/page.tsx` (add `metadata`)
- Modify: `app/cazare/[unit]/page.tsx` (add `generateMetadata`)
- Modify: `app/terasa/page.tsx` (replace existing `metadata`)
- Modify: `app/plaja/page.tsx` (replace existing `metadata`)

**Interfaces:**
- Consumes: `unitsBySlug` from `@/lib/content`; `Metadata` from `next`.
- Produces: per-route metadata with keyword-targeted titles/descriptions and canonicals. Titles use the root template `%s · Paradox Eforie Sud` (so they are the bare page title here).

- [ ] **Step 1: Add `metadata` to `app/page.tsx`** above the `Home` component.

```tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  // Homepage keeps a full title (not templated) via absolute.
  title: { absolute: "Paradox Eforie Sud — cazare, terasă și plajă la Marea Neagră" },
  description:
    "Cazare în Eforie Sud: Hotel Paradox (3★), Vila Paradox și Paradox H, la câțiva pași de plajă și de Lacul Techirghiol. Terasă și plajă proprii. Acceptăm vouchere de vacanță.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Paradox Eforie Sud — cazare la Marea Neagră",
    description:
      "Cazare, terasă și plajă în Eforie Sud, aproape de Techirghiol. Acceptăm vouchere de vacanță.",
    url: "/",
  },
};
```

- [ ] **Step 2: Add `generateMetadata` to `app/cazare/[unit]/page.tsx`** (it currently has none). Add the import and the function above the default export.

```tsx
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ unit: string }>;
}): Promise<Metadata> {
  const { unit: slug } = await params;
  const unit = unitsBySlug[slug];
  if (!unit) return {};
  const title = `${unit.name} ${unit.stars}★ — cazare în Eforie Sud`;
  const description = `${unit.blurb} ${unit.meta}. Acceptăm vouchere de vacanță.`;
  const url = `/cazare/${unit.slug}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, type: "website" },
  };
}
```

(`unitsBySlug` is already imported in this file. If `type Metadata` import duplicates an existing one, keep a single import.)

- [ ] **Step 3: Replace the existing `metadata` in `app/terasa/page.tsx`** with a keyword-targeted version.

```tsx
export const metadata = {
  title: "Terasa Paradox — restaurant în Eforie Sud",
  description:
    "Terasa Paradox: bucătărie proaspătă, pește la grătar și prețuri accesibile, pe Ion Movilă 25 în Eforie Sud. Rezervă o masă la telefon.",
  alternates: { canonical: "/terasa" },
  openGraph: {
    title: "Terasa Paradox — restaurant în Eforie Sud",
    description: "Bucătărie proaspătă și prețuri accesibile, la doi pași de plajă în Eforie Sud.",
    url: "/terasa",
    type: "website",
  },
};
```

- [ ] **Step 4: Replace the existing `metadata` in `app/plaja/page.tsx`** with a keyword-targeted version.

```tsx
export const metadata = {
  title: "Plaja Paradox — plajă în Eforie Sud",
  description:
    "Plaja Paradox: nisip fin, șezlonguri și cele mai frumoase apusuri din Eforie Sud, la doi pași de cazare. Marea Neagră, exact cum o visezi.",
  alternates: { canonical: "/plaja" },
  openGraph: {
    title: "Plaja Paradox — plajă în Eforie Sud",
    description: "Nisip fin și apusuri superbe pe litoralul Mării Negre, în Eforie Sud.",
    url: "/plaja",
    type: "website",
  },
};
```

- [ ] **Step 5: Verify.**

Run: `pnpm typecheck && pnpm lint && pnpm build`
Expected: all clean; build lists `/`, `/terasa`, `/plaja`, `/cazare/[unit]`.

- [ ] **Step 6: Commit.**

```bash
git add app/page.tsx "app/cazare/[unit]/page.tsx" app/terasa/page.tsx app/plaja/page.tsx
git commit -m "feat(seo): keyword-targeted per-page metadata and canonicals

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_012TpaxkB8TNy2DpsZ779fGZ"
```

---

### Task 4: Page-level JSON-LD (Hotel, Restaurant, BreadcrumbList)

**Files:**
- Modify: `app/cazare/[unit]/page.tsx` (add Hotel + BreadcrumbList)
- Modify: `app/terasa/page.tsx` (add Restaurant + BreadcrumbList)

**Interfaces:**
- Consumes: `JsonLd` from `@/components/seo/json-ld`; `hotelLd`, `restaurantLd`, `breadcrumbLd` from `@/lib/seo`.

- [ ] **Step 1: In `app/cazare/[unit]/page.tsx`** add imports.

```tsx
import { JsonLd } from "@/components/seo/json-ld";
import { hotelLd, breadcrumbLd } from "@/lib/seo";
```

- [ ] **Step 2: In `app/cazare/[unit]/page.tsx`** render the JSON-LD at the top of the returned `<main>` (immediately after the opening `<main …>` tag), using the already-resolved `unit`.

```tsx
      <JsonLd
        data={[
          hotelLd(unit),
          breadcrumbLd([
            { name: "Paradox", url: "/" },
            { name: "Cazare", url: "/#cazare" },
            { name: unit.name, url: `/cazare/${unit.slug}` },
          ]),
        ]}
      />
```

- [ ] **Step 3: In `app/terasa/page.tsx`** add imports.

```tsx
import { JsonLd } from "@/components/seo/json-ld";
import { restaurantLd, breadcrumbLd } from "@/lib/seo";
```

- [ ] **Step 4: In `app/terasa/page.tsx`** render the JSON-LD at the top of the returned `<main>` (immediately after the opening `<main …>` tag).

```tsx
      <JsonLd
        data={[
          restaurantLd(),
          breadcrumbLd([
            { name: "Paradox", url: "/" },
            { name: "Terasă", url: "/terasa" },
          ]),
        ]}
      />
```

- [ ] **Step 5: Verify, then validate the JSON-LD.**

Run: `pnpm typecheck && pnpm lint && pnpm build`
Expected: all clean. Then optionally: `pnpm build && pnpm start` and view-source on `/cazare/hotel-paradox` to confirm a `Hotel` + `BreadcrumbList` script block is present and valid JSON (must NOT contain `aggregateRating`).

- [ ] **Step 6: Commit.**

```bash
git add "app/cazare/[unit]/page.tsx" app/terasa/page.tsx
git commit -m "feat(seo): Hotel/Restaurant/BreadcrumbList JSON-LD on detail pages

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_012TpaxkB8TNy2DpsZ779fGZ"
```

---

### Task 5: Sitemap + robots

**Files:**
- Create: `app/sitemap.ts`
- Create: `app/robots.ts`

**Interfaces:**
- Consumes: `SITE_URL` from `@/lib/seo`; `units` from `@/lib/content`; `MetadataRoute` from `next`.

- [ ] **Step 1: Create `app/sitemap.ts`.**

```ts
import type { MetadataRoute } from "next";
import { units } from "@/lib/content";
import { SITE_URL } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: "monthly", priority: 1 },
    { url: `${SITE_URL}/terasa`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/plaja`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
  ];
  const unitRoutes: MetadataRoute.Sitemap = units.map((u) => ({
    url: `${SITE_URL}/cazare/${u.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.9,
  }));
  return [...staticRoutes, ...unitRoutes];
}
```

- [ ] **Step 2: Create `app/robots.ts`.**

```ts
import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
```

- [ ] **Step 3: Verify and check output.**

Run: `pnpm typecheck && pnpm lint && pnpm build`
Expected: all clean; build output lists `/sitemap.xml` and `/robots.txt`.

- [ ] **Step 4: Commit.**

```bash
git add app/sitemap.ts app/robots.ts
git commit -m "feat(seo): add sitemap.xml and robots.txt

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_012TpaxkB8TNy2DpsZ779fGZ"
```

---

### Task 6: Web manifest + favicon

**Files:**
- Create: `app/manifest.ts`
- Create: `app/icon.svg`

**Interfaces:**
- Consumes: `SITE_NAME` from `@/lib/seo`; `MetadataRoute` from `next`.

- [ ] **Step 1: Create `app/manifest.ts`.**

```ts
import type { MetadataRoute } from "next";
import { SITE_NAME } from "@/lib/seo";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_NAME,
    short_name: "Paradox",
    description:
      "Cazare, terasă și plajă în Eforie Sud, pe litoralul Mării Negre. Acceptăm vouchere de vacanță.",
    start_url: "/",
    display: "standalone",
    background_color: "#FBF6EE",
    theme_color: "#1E3D52",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
```

- [ ] **Step 2: Create `app/icon.svg`** — a branded "P" placeholder favicon on the sea token. (Next serves `app/icon.svg` as the site favicon automatically.)

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
  <rect width="64" height="64" rx="14" fill="#1E3D52"/>
  <text x="50%" y="50%" dy="0.34em" text-anchor="middle"
        font-family="Georgia, 'Times New Roman', serif" font-size="40"
        font-weight="600" fill="#FBF6EE">P</text>
</svg>
```

- [ ] **Step 3: Verify.**

Run: `pnpm typecheck && pnpm lint && pnpm build`
Expected: all clean; build output lists `/manifest.webmanifest` and an icon route.

- [ ] **Step 4: Commit.**

```bash
git add app/manifest.ts app/icon.svg
git commit -m "feat(seo): add web manifest and placeholder favicon

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_012TpaxkB8TNy2DpsZ779fGZ"
```

---

### Task 7: Live Google reviews fetch (`lib/reviews.ts`) + image config

**Files:**
- Create: `lib/reviews.ts`
- Create: `next.config.ts`

**Interfaces:**
- Consumes: `business` from `@/lib/seo`; `process.env.GOOGLE_PLACES_API_KEY`.
- Produces:
  - `interface GoogleReview { author: string; rating: number; text: string; relativeTime: string; photoUri?: string; authorUri?: string }`
  - `interface GoogleReviewsData { rating: number; count: number; mapsUri: string; reviews: GoogleReview[] }`
  - `getGoogleReviews(): Promise<GoogleReviewsData | null>`

- [ ] **Step 1: Create `next.config.ts`** so `next/image` can load Google avatar hosts.

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "lh4.googleusercontent.com" },
      { protocol: "https", hostname: "lh5.googleusercontent.com" },
      { protocol: "https", hostname: "lh6.googleusercontent.com" },
    ],
  },
};

export default nextConfig;
```

- [ ] **Step 2: Create `lib/reviews.ts`.** Called only from server components. Reads the server-only key; returns `null` on any failure so callers fall back.

```ts
import { business } from "@/lib/seo";

export interface GoogleReview {
  author: string;
  rating: number;
  text: string;
  relativeTime: string;
  photoUri?: string;
  authorUri?: string;
}

export interface GoogleReviewsData {
  rating: number;
  count: number;
  mapsUri: string;
  reviews: GoogleReview[];
}

interface RawReview {
  rating?: number;
  text?: { text?: string };
  relativePublishTimeDescription?: string;
  authorAttribution?: { displayName?: string; uri?: string; photoUri?: string };
}

/**
 * Fetch live Google rating + reviews (cached ~daily). Server-only — reads
 * GOOGLE_PLACES_API_KEY (never NEXT_PUBLIC). Returns null on any failure so
 * callers can fall back to static testimonials.
 */
export async function getGoogleReviews(): Promise<GoogleReviewsData | null> {
  const key = process.env.GOOGLE_PLACES_API_KEY;
  if (!key) return null;
  try {
    const res = await fetch(
      `https://places.googleapis.com/v1/places/${business.placeId}?languageCode=ro`,
      {
        headers: {
          "X-Goog-Api-Key": key,
          "X-Goog-FieldMask":
            "rating,userRatingCount,googleMapsUri,reviews.rating,reviews.text,reviews.relativePublishTimeDescription,reviews.authorAttribution",
        },
        next: { revalidate: 86400 },
      },
    );
    if (!res.ok) return null;
    const data: {
      rating?: number;
      userRatingCount?: number;
      googleMapsUri?: string;
      reviews?: RawReview[];
    } = await res.json();
    if (typeof data.rating !== "number") return null;
    const reviews: GoogleReview[] = (data.reviews ?? []).map((r) => ({
      author: r.authorAttribution?.displayName ?? "Oaspete Google",
      rating: r.rating ?? 0,
      text: r.text?.text ?? "",
      relativeTime: r.relativePublishTimeDescription ?? "",
      photoUri: r.authorAttribution?.photoUri,
      authorUri: r.authorAttribution?.uri,
    }));
    return {
      rating: data.rating,
      count: data.userRatingCount ?? 0,
      mapsUri: data.googleMapsUri ?? business.googleProfileUrl,
      reviews,
    };
  } catch {
    return null;
  }
}
```

- [ ] **Step 3: Verify (with and without key behavior is exercised in Task 8).**

Run: `pnpm typecheck && pnpm lint && pnpm build`
Expected: all clean. (Build may call the fetcher when prerendering the homepage in Task 8; this task only adds the module + config.)

- [ ] **Step 4: Commit.**

```bash
git add lib/reviews.ts next.config.ts
git commit -m "feat(reviews): server-side Google Places reviews fetch + image config

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_012TpaxkB8TNy2DpsZ779fGZ"
```

---

### Task 8: Live reviews display in Testimonials (with fallback)

**Files:**
- Modify: `components/sections/testimonials.tsx`

**Interfaces:**
- Consumes: `getGoogleReviews`, `type GoogleReview` from `@/lib/reviews`; `testimonials` from `@/lib/content`; `Reveal`, `Eyebrow`; `next/image`; `Star` from `lucide-react`.
- Behavior: async server component. If live data has ≥1 review rated ≥4, render the Google rating badge + those reviews (up to 6). Otherwise render the existing static `testimonials` exactly as before. Never breaks if `getGoogleReviews()` returns `null`.

- [ ] **Step 1: Replace `components/sections/testimonials.tsx`** with the live-reviews version.

```tsx
import Image from "next/image";
import { Star } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { Eyebrow } from "@/components/ui/primitives";
import { testimonials } from "@/lib/content";
import { getGoogleReviews, type GoogleReview } from "@/lib/reviews";

function Stars({ count }: { count: number }) {
  return (
    <div className="mb-3.5 flex gap-0.5 text-gold" aria-label={`${count} din 5 stele`}>
      {Array.from({ length: 5 }, (_, i) => (
        <Star key={i} className="size-4" fill={i < count ? "currentColor" : "none"} strokeWidth={1.5} />
      ))}
    </div>
  );
}

/** "Recenzii" — live Google reviews with a static fallback. */
export async function Testimonials() {
  const data = await getGoogleReviews();
  const liveReviews: GoogleReview[] = (data?.reviews ?? [])
    .filter((r) => r.rating >= 4 && r.text.trim().length > 0)
    .slice(0, 6);
  const useLive = liveReviews.length > 0;

  return (
    <section id="recenzii" className="mx-auto max-w-[1240px] px-5 py-[clamp(64px,10vh,120px)] sm:px-8 lg:px-16">
      <Reveal className="mb-[clamp(36px,5vh,56px)] text-center">
        <Eyebrow className="mb-3.5">Ce spun oaspeții</Eyebrow>
        <h2 className="font-display text-[clamp(28px,4.5vw,50px)] font-medium leading-[1.08] tracking-[-0.5px] text-sea">
          Vacanțe de care ne amintim cu drag
        </h2>
        {useLive && data && (
          <a
            href={data.mapsUri}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-surface px-4 py-2 text-sm font-semibold text-sea shadow-[0_1px_3px_rgba(60,40,20,.08)] transition-transform hover:-translate-y-0.5"
          >
            <span className="font-bold">{data.rating.toFixed(1)}</span>
            <Star className="size-4 text-gold" fill="currentColor" strokeWidth={0} />
            <span className="font-normal text-faint">
              {data.count.toLocaleString("ro-RO")} recenzii pe Google
            </span>
          </a>
        )}
      </Reveal>

      <div className="grid gap-[22px] sm:grid-cols-2 lg:grid-cols-3">
        {useLive
          ? liveReviews.map((r, i) => (
              <Reveal key={`${r.author}-${i}`} delay={i * 0.08}>
                <figure className="flex h-full flex-col rounded-2xl bg-surface p-[30px] shadow-[0_1px_3px_rgba(60,40,20,.08)]">
                  <Stars count={r.rating} />
                  <blockquote className="mb-5 line-clamp-6 flex-1 font-display text-[19px] italic leading-[1.5] text-[#3a2e22]">
                    „{r.text}”
                  </blockquote>
                  <figcaption className="flex items-center gap-3">
                    {r.photoUri && (
                      <Image
                        src={r.photoUri}
                        alt=""
                        width={36}
                        height={36}
                        className="size-9 rounded-full object-cover"
                      />
                    )}
                    <span className="text-sm font-bold text-sea">
                      {r.author}{" "}
                      <span className="font-normal text-faint">· {r.relativeTime}</span>
                    </span>
                  </figcaption>
                </figure>
              </Reveal>
            ))
          : testimonials.map((t, i) => (
              <Reveal key={t.author} delay={i * 0.08}>
                <figure className="h-full rounded-2xl bg-surface p-[30px] shadow-[0_1px_3px_rgba(60,40,20,.08)]">
                  <Stars count={5} />
                  <blockquote className="mb-5 font-display text-[19px] italic leading-[1.5] text-[#3a2e22]">
                    „{t.quote}”
                  </blockquote>
                  <figcaption className="text-sm font-bold text-sea">
                    {t.author}{" "}
                    <span className="font-normal text-faint">· {t.context}</span>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verify the build prerenders with live data.**

Run: `pnpm typecheck && pnpm lint && pnpm build`
Expected: all clean. With `GOOGLE_PLACES_API_KEY` in `.env.local`, the homepage build fetches and renders live Google reviews. (If the key were absent, the build would fall back to static testimonials with no error.)

- [ ] **Step 3: Confirm the live render visually.**

Run: `pnpm start` then open `http://localhost:3000/#recenzii`.
Expected: a "4.2 ★ · 1.168 recenzii pe Google" badge linking to the Google profile, and review cards rated 4–5★ with avatars. View-source must NOT contain `aggregateRating`.

- [ ] **Step 4: Commit.**

```bash
git add components/sections/testimonials.tsx
git commit -m "feat(reviews): show live Google reviews in Testimonials with fallback

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_012TpaxkB8TNy2DpsZ779fGZ"
```

---

## Notes for the implementer

- NEVER add `aggregateRating` to any JSON-LD — Google's third-party-review policy. The rating shows only as on-page display + `sameAs`.
- `GOOGLE_PLACES_API_KEY` is server-only. Do not prefix with `NEXT_PUBLIC_`, do not render it, do not log it.
- Keep new page files as server components (no `"use client"`). `Testimonials` becoming `async` is fine — it stays a server component.
- The social URLs in `business.sameAs` are placeholders — leave the `// PLACEHOLDER` comments so they're easy to find before launch.
- Before production deploy: add `GOOGLE_PLACES_API_KEY` to Vercel env vars, drop in a real OG image at `app/opengraph-image.jpg`, and replace the social placeholders.
```
