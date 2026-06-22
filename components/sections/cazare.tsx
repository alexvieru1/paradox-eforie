import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import {
  PhotoPlaceholder,
  StarPill,
  VoucherPill,
  Eyebrow,
} from "@/components/ui/primitives";
import { cazare, units } from "@/lib/content";

/** "Cazare" — the three accommodations as cards. */
export function Cazare() {
  return (
    <section id="cazare" className="mx-auto max-w-[1240px] px-5 py-[clamp(64px,10vh,120px)] sm:px-8 lg:px-16">
      <div className="mb-[clamp(32px,5vh,56px)] flex flex-wrap items-end justify-between gap-4">
        <Reveal>
          <Eyebrow className="mb-3.5">{cazare.eyebrow}</Eyebrow>
          <h2 className="max-w-[16ch] font-display text-[clamp(30px,4.5vw,52px)] font-medium leading-[1.06] tracking-[-0.5px] text-sea">
            {cazare.heading}
          </h2>
        </Reveal>
        <Reveal delay={0.08}>
          <p className="max-w-[38ch] text-base leading-relaxed text-muted">
            {cazare.intro}
          </p>
        </Reveal>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {units.map((unit, i) => (
          <Reveal key={unit.slug} delay={i * 0.08}>
            <article className="group h-full overflow-hidden rounded-2xl bg-surface shadow-[0_1px_3px_rgba(60,40,20,.08)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(60,40,20,.14)]">
              <div className="relative">
                <PhotoPlaceholder
                  label={`foto · ${unit.name}`}
                  className="aspect-[4/3]"
                />
                <span className="absolute left-3.5 top-3.5">
                  <StarPill stars={unit.stars} />
                </span>
                <span className="absolute right-3.5 top-3.5">
                  <VoucherPill />
                </span>
              </div>
              <div className="p-6">
                <h3 className="font-display text-[25px] font-semibold text-sea">
                  {unit.name}
                </h3>
                <div className="mb-3.5 mt-1.5 text-[13px] text-faint">
                  {unit.address.split(",")[0]} · {unit.meta.split("·")[0].trim()}
                </div>
                <div className="mb-5 flex flex-col gap-2 text-sm text-body">
                  {unit.distances.map((d) => (
                    <span key={d.label} className="flex items-center gap-2.5">
                      <Clock className="size-4 text-terracotta" strokeWidth={2} />
                      {d.value === "✓" ? d.label : `${d.value} ${d.label}`}
                    </span>
                  ))}
                </div>
                <Link
                  href={`/cazare/${unit.slug}`}
                  className="inline-flex items-center gap-2 text-sm font-bold text-terracotta transition-[gap] group-hover:gap-3"
                >
                  Detalii &amp; rezervare <ArrowRight className="size-4" />
                </Link>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
