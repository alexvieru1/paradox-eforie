import { Hero } from "@/components/sections/hero";
import { Cazare } from "@/components/sections/cazare";
import { Terasa } from "@/components/sections/terasa";
import { Plaja } from "@/components/sections/plaja";
import { Testimonials } from "@/components/sections/testimonials";
import { VoucherBand } from "@/components/sections/voucher-band";
import { SiteFooter } from "@/components/sections/site-footer";

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
