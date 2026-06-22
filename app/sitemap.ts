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
