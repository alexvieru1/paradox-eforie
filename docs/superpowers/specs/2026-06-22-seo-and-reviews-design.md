# SEO + Google Reviews — design

**Date:** 2026-06-22
**Status:** Approved pending spec review
**Production URL:** https://www.paradoxeforie.ro

## Goal

Make the site indexable and rich-result-eligible before go-live, centered on
"cazare" + local Eforie Sud intent, and display the brand's live Google reviews
(4.2★ / ~1.168) for social proof — without violating Google's structured-data
rules.

## Keyword strategy

Primary: **cazare Eforie Sud**. Secondary (Eforie Sud + nearby): *cazare litoral
/ Marea Neagră, hotel Eforie Sud, cazare cu vouchere de vacanță, cazare aproape
de Techirghiol, cazare familie litoral, restaurant Eforie Sud, plajă Eforie Sud*.
Woven into titles, H1s, descriptions, and JSON-LD — not a meta-keywords tag
(Google ignores it).

## Resolved business data

- Place ID: `ChIJ9Zh-XnjgukARsEy1SloFkrI`
- Legal name: **Paradox Company SRL**
- Google profile (cid): `https://maps.google.com/?cid=12867352970709519536`
- Geo (Ion Movilă 25 — Vila/Terasă): `44.028635, 28.6521375`
- Live rating: 4.2 / 1.168 (fetched at runtime; never hardcoded; not in schema)
- Other unit geo (Hotel Paradox — Str. Oituz 4; Paradox H — Dr. Cantacuzino 79):
  approximate from address within Eforie Sud, refine later.

## Architecture

Centralized SEO/config module + small server helpers; no design changes.

```
lib/
  seo.ts            # SITE_URL, business identity, geo, sameAs, Place ID,
                    # + JSON-LD builders (hotel, restaurant, organization, breadcrumb)
  reviews.ts        # server-only getGoogleReviews() (Places Place Details, cached)
components/
  seo/json-ld.tsx   # tiny server component: <script type="application/ld+json">
app/
  layout.tsx        # metadataBase, title template, default OG/Twitter, robots,
                    # Organization+LocalBusiness JSON-LD, og:locale ro_RO
  page.tsx          # homepage metadata; async reviews fetch passed to Testimonials
  cazare/[unit]/page.tsx  # generateMetadata + Hotel + BreadcrumbList JSON-LD
  terasa/page.tsx   # metadata + Restaurant + BreadcrumbList JSON-LD
  plaja/page.tsx    # metadata (+ optional TouristAttraction)
  sitemap.ts        # homepage + /terasa + /plaja + each unit
  robots.ts         # allow all, reference sitemap
  manifest.ts       # name, theme colors (#1E3D52 / #FBF6EE), icons
  icon.svg          # branded "P" favicon placeholder (swap for real logo)
next.config.ts      # images.remotePatterns for lh3.googleusercontent.com
```

## Metadata (per page)

- **Root** (`layout.tsx`): `metadataBase = SITE_URL`; title template
  `%s · Paradox Eforie Sud`; default description; OpenGraph (type website,
  `locale ro_RO`, siteName "Paradox Eforie Sud"); Twitter `summary_large_image`;
  `robots: index,follow`; `alternates.canonical`. **OG image:** wired to a slot
  but left empty (photos pending) — dropping in `app/opengraph-image.jpg` later
  is the only step.
- **Homepage**: title/description on *cazare Eforie Sud, vouchere de vacanță*.
- **/cazare/[unit]** (`generateMetadata`): e.g. "Hotel Paradox 3★ — cazare în
  Eforie Sud, 300 m de plajă"; per-unit canonical; description with unit +
  Techirghiol + vouchere.
- **/terasa**: *restaurant Eforie Sud*; **/plaja**: *plajă Eforie Sud, apusuri*.

All SEO strings live in `content.ts`/`seo.ts`, not inline in components.

## Structured data (JSON-LD)

- **Organization + LocalBusiness** (sitewide, in layout): legal name
  "Paradox Company SRL", logo, telephone (`contact.phone`), address, `sameAs`
  (Google profile + Facebook, Instagram, TikTok — placeholder URLs to fill).
- **Hotel / LodgingBusiness** per unit: name, PostalAddress, geo, `starRating`,
  `amenityFeature`, `priceRange` (generic `€€` unless provided),
  `paymentAccepted` incl. "Vouchere de vacanță", `petsAllowed` n/a, `sameAs`.
  **No `aggregateRating`** (would be borrowed Google reviews — prohibited).
- **Restaurant** (Terasă): `servesCuisine` (Romanian, seafood),
  `openingHoursSpecification` from `terasa.hours`, address, `acceptsReservations:
  true`, telephone.
- **BreadcrumbList** on detail pages, matching visible breadcrumbs.

## Reviews integration (Option A)

- `lib/reviews.ts`: server-only `getGoogleReviews()` →
  `GET https://places.googleapis.com/v1/places/{PLACE_ID}` with header
  `X-Goog-FieldMask: rating,userRatingCount,reviews,googleMapsUri`, fetched with
  `{ next: { revalidate: 86400 } }` (≈1 call/day; well within free quota).
  Returns `{ rating, count, mapsUri, reviews: {author, rating, text,
  relativeTime, photoUri}[] }`.
- **Graceful fallback:** if `GOOGLE_PLACES_API_KEY` is unset or the request
  fails, return `null`; the Testimonials section falls back to the existing
  static `testimonials` array. Page never breaks (covers local dev without key).
- **Display:** Testimonials becomes an async server component. When live data
  exists: show a "4.2 ★ · 1.168 recenzii pe Google" badge linking to `mapsUri`,
  then render fetched reviews; avatars via `next/image` (hence the remotePattern).
- **Compliance:** display only — the Google rating is **not** emitted as
  `aggregateRating`. The profile is referenced via `sameAs`.

## Environment

- `GOOGLE_PLACES_API_KEY` — server-side only (not `NEXT_PUBLIC_`), in
  `.env.local` (gitignored) and Vercel project env vars for production.
- Key is API-restricted to Places API (New) in Google Cloud.

## Data to confirm before launch (scaffolded as placeholders)

1. Facebook / Instagram / TikTok URLs (for `sameAs`) — scaffolded as placeholders
2. Exact geo for Hotel Paradox (Oituz 4) and Paradox H (Cantacuzino 79) —
   approximated otherwise
3. Price-range indicator per unit (optional; `€€` default)
4. Real OG share image / logo (photos pending)

## Constraints honored

- SEO copy in `content.ts`/`seo.ts`; no hardcoded strings in components.
- Server components only; key never reaches the browser.
- No visual/design changes; theme colors from tokens.
- No fabricated ratings; no borrowed `aggregateRating`.
- `next/image` for remote avatars via explicit `remotePatterns`.

## Definition of done

- `pnpm typecheck` / `lint` / `build` clean.
- View-source shows per-page title/description/canonical/OG and valid JSON-LD
  (passes Google Rich Results Test) on homepage, a unit page, and /terasa.
- `/sitemap.xml` and `/robots.txt` resolve and list all routes.
- Testimonials shows live Google rating + reviews when the key is present, and
  falls back to static testimonials when it is not.
- No `aggregateRating` anywhere; Google profile present via `sameAs`.
