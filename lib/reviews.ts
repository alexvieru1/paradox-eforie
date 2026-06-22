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
