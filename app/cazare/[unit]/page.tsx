import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  Wifi,
  Car,
  Snowflake,
  Coffee,
  Heart,
  Tv,
  Umbrella,
  Clock,
  Waves,
  MapPin,
} from "lucide-react";
import { Gallery } from "@/components/sections/gallery";
import { BookingBlock } from "@/components/sections/booking-block";
import { SiteFooter } from "@/components/sections/site-footer";
import { MobileCallBar } from "@/components/sections/mobile-call-bar";
import { PhotoPlaceholder, StarPill, VoucherPill } from "@/components/ui/primitives";
import { units, unitsBySlug, type GalleryItem } from "@/lib/content";

export function generateStaticParams() {
  return units.map((u) => ({ unit: u.slug }));
}

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

const AMENITY_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  "Wi-Fi gratuit": Wifi,
  Parcare: Car,
  "Aer condiționat": Snowflake,
  "Mic dejun": Coffee,
  "Prietenos cu familia": Heart,
  TV: Tv,
  "Aproape de plajă": Umbrella,
  Recepție: Clock,
};

export default async function UnitPage({
  params,
}: {
  params: Promise<{ unit: string }>;
}) {
  const { unit: slug } = await params;
  const unit = unitsBySlug[slug];
  if (!unit) notFound();

  const gallery: GalleryItem[] =
    unit.gallery ??
    Array.from({ length: 6 }, (_, i) => ({
      id: `g${i + 1}`,
      caption: `foto · ${unit.name} ${i + 1}`,
    }));

  return (
    <main className="pb-24 lg:pb-0">
      {/* breadcrumb + title */}
      <div className="mx-auto max-w-[1240px] px-5 pb-2 pt-[clamp(80px,12vh,120px)] sm:px-8 lg:px-16">
        <nav className="mb-4 text-[13px] text-faint">
          <Link href="/" className="hover:text-terracotta">Paradox</Link> ·{" "}
          <Link href="/#cazare" className="hover:text-terracotta">Cazare</Link> ·{" "}
          <span className="text-body">{unit.name}</span>
        </nav>
        <div className="mb-2.5 flex items-center gap-3">
          <StarPill stars={unit.stars} />
          <span className="rounded-full bg-voucher/15 px-3 py-1.5 text-xs font-bold text-voucher">
            Acceptă vouchere de vacanță
          </span>
        </div>
        <h1 className="font-display text-[clamp(34px,5.5vw,60px)] font-medium leading-[1.02] tracking-[-1px] text-sea">
          {unit.name}
        </h1>
        <p className="mt-2.5 text-base text-muted">
          {unit.address} · {unit.meta}
        </p>
      </div>

      <Gallery images={gallery} />

      {/* intro + quick facts */}
      <section className="mx-auto grid max-w-[1240px] gap-[clamp(28px,5vw,64px)] px-5 pb-[clamp(40px,6vh,72px)] sm:px-8 lg:grid-cols-2 lg:px-16">
        <div>
          <h2 className="mb-4 font-display text-[clamp(24px,3vw,34px)] font-medium tracking-[-0.3px] text-sea">
            Liniște, în mijlocul stațiunii
          </h2>
          {(unit.description ?? [unit.blurb]).map((p, i) => (
            <p key={i} className="mb-4 text-[17px] leading-[1.75] text-body">
              {p}
            </p>
          ))}
        </div>
        <div className="flex flex-col gap-3.5">
          {unit.distances.map((d, i) => (
            <div
              key={d.label}
              className="flex items-center gap-4 rounded-2xl bg-surface p-5 shadow-[0_1px_3px_rgba(60,40,20,.08)]"
            >
              <span className="flex size-11 flex-none items-center justify-center rounded-full bg-sand text-terracotta">
                {i === 0 ? <Waves className="size-5" /> : <MapPin className="size-5" />}
              </span>
              <div>
                <div className="font-bold text-sea">
                  {d.value === "✓" ? d.label : `${d.value} ${d.label}`}
                </div>
              </div>
            </div>
          ))}
          <div className="flex items-center gap-4 rounded-2xl bg-surface p-5 shadow-[0_1px_3px_rgba(60,40,20,.08)]">
            <span className="flex size-11 flex-none items-center justify-center rounded-full bg-sand text-terracotta">
              <MapPin className="size-5" />
            </span>
            <div>
              <div className="font-bold text-sea">{unit.address.split(",")[0]}</div>
              <div className="text-[13px] text-faint">Eforie Sud, jud. Constanța</div>
            </div>
          </div>
        </div>
      </section>

      {/* amenities */}
      {unit.amenities && (
        <section className="bg-sand px-5 py-[clamp(48px,7vh,80px)] sm:px-8 lg:px-16">
          <div className="mx-auto max-w-[1240px]">
            <div className="mb-3 text-xs font-bold uppercase tracking-[0.21em] text-terracotta">
              Facilități
            </div>
            <h2 className="mb-8 font-display text-[clamp(26px,3.5vw,40px)] font-medium tracking-[-0.4px] text-sea">
              Tot ce-ți trebuie pentru o vacanță fără griji
            </h2>
            <div className="grid grid-cols-2 gap-3.5 md:grid-cols-4">
              {unit.amenities.map((a) => {
                const Icon = AMENITY_ICONS[a] ?? Heart;
                return (
                  <div
                    key={a}
                    className="flex items-center gap-3 rounded-xl bg-surface px-5 py-4 shadow-[0_1px_2px_rgba(60,40,20,.06)]"
                  >
                    <span className="flex size-[34px] flex-none items-center justify-center rounded-[9px] bg-sand text-terracotta">
                      <Icon className="size-4" />
                    </span>
                    <span className="text-[15px] font-semibold text-[#3a2e22]">{a}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* location */}
      <section className="mx-auto max-w-[1240px] px-5 py-[clamp(48px,7vh,80px)] sm:px-8 lg:px-16">
        <div className="grid items-center gap-[clamp(28px,5vw,56px)] lg:grid-cols-2">
          <div>
            <div className="mb-3 text-xs font-bold uppercase tracking-[0.21em] text-terracotta">
              Locație
            </div>
            <h2 className="mb-[18px] font-display text-[clamp(26px,3.5vw,40px)] font-medium tracking-[-0.4px] text-sea">
              La doi pași de tot
            </h2>
            <p className="mb-6 max-w-[42ch] text-base leading-relaxed text-body">
              În centrul stațiunii Eforie Sud — marea, lacul, parcul și terasa,
              toate la câteva minute de mers pe jos.
            </p>
            <div className="flex flex-col gap-3">
              {unit.distances.map((d, i) => (
                <div key={d.label} className="flex items-center gap-3 text-[15px] text-[#3a2e22]">
                  <span
                    className="size-2.5 flex-none rounded-full"
                    style={{ backgroundColor: i === 0 ? "#C0633F" : "#1E3D52" }}
                  />
                  {d.value === "✓" ? (
                    d.label
                  ) : (
                    <>
                      <strong className="font-bold">{d.value}</strong> {d.label}
                    </>
                  )}
                </div>
              ))}
              <div className="flex items-center gap-3 text-[15px] text-[#3a2e22]">
                <span className="size-2.5 flex-none rounded-full bg-voucher" />
                {unit.address}
              </div>
            </div>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-[18px] shadow-[0_12px_32px_rgba(60,40,20,.12)]">
            <PhotoPlaceholder label="hartă · Google Maps embed" className="absolute inset-0" stripe="#e6decb" />
          </div>
        </div>
      </section>

      {/* Rezervă */}
      <section id="rezerva" className="bg-sea px-5 pb-[clamp(72px,7vh,88px)] pt-[clamp(48px,7vh,88px)] text-cream sm:px-8 lg:px-16">
        <div className="mx-auto grid max-w-[1080px] items-center gap-10 lg:grid-cols-2">
          <div>
            <div className="mb-3.5 text-xs font-bold uppercase tracking-[0.21em] text-[#9fb6c6]">
              Rezervă la {unit.name}
            </div>
            <h2 className="mb-4 font-display text-[clamp(28px,4vw,46px)] font-medium leading-[1.08]">
              Alege cum preferi să rezervi
            </h2>
            <p className="mb-5 max-w-[40ch] text-base leading-relaxed text-[#bfd0dc]">
              Suntem listați la partenerii de mai jos, sau ne poți suna direct —
              răspundem cu drag și te ajutăm să găsești camera potrivită.
            </p>
            <VoucherPill full />
          </div>
          <BookingBlock partnerIds={unit.partners} />
        </div>
      </section>

      <SiteFooter />
      <MobileCallBar />
    </main>
  );
}
