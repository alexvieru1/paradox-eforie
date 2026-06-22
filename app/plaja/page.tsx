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
