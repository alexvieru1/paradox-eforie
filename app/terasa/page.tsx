import Link from "next/link";
import { Phone, Clock, MapPin, UtensilsCrossed } from "lucide-react";
import { JsonLd } from "@/components/seo/json-ld";
import { restaurantLd, breadcrumbLd } from "@/lib/seo";
import { Gallery } from "@/components/sections/gallery";
import { SiteFooter } from "@/components/sections/site-footer";
import { MobileCallBar } from "@/components/sections/mobile-call-bar";
import { PhotoPlaceholder, Eyebrow } from "@/components/ui/primitives";
import { terasa, contact } from "@/lib/content";

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

export default function TerasaPage() {
  return (
    <main className="pb-24 lg:pb-0">
      <JsonLd
        data={[
          restaurantLd(),
          breadcrumbLd([
            { name: "Paradox", url: "/" },
            { name: "Terasă", url: "/terasa" },
          ]),
        ]}
      />
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
              {terasa.locationBody}
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
      <MobileCallBar reserveHref="#program" reserveLabel={terasa.reserve.cta} />
    </main>
  );
}
