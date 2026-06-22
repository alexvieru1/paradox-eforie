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
