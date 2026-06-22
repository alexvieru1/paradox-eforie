import type { Metadata } from "next";
import { Hero } from "@/components/sections/hero";
import { Cazare } from "@/components/sections/cazare";
import { Terasa } from "@/components/sections/terasa";
import { Plaja } from "@/components/sections/plaja";
import { Testimonials } from "@/components/sections/testimonials";
import { VoucherBand } from "@/components/sections/voucher-band";
import { SiteFooter } from "@/components/sections/site-footer";

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

export default function Home() {
  return (
    <>
      <Hero />
      <Cazare />
      <Terasa />
      <Plaja />
      <Testimonials />
      <VoucherBand />
      <SiteFooter />
    </>
  );
}
