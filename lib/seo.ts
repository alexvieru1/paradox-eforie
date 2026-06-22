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
