import { Phone } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { PhotoPlaceholder, Eyebrow } from "@/components/ui/primitives";
import { terasa, contact } from "@/lib/content";

/** "Terasa Paradox" — restaurant feature, two-column on sand. */
export function Terasa() {
  return (
    <section id="terasa" className="bg-sand px-5 py-[clamp(56px,9vh,104px)] sm:px-8 lg:px-16">
      <div className="mx-auto grid max-w-[1240px] items-center gap-[clamp(28px,5vw,64px)] lg:grid-cols-2">
        <Reveal>
          <PhotoPlaceholder
            label="foto · Terasa Paradox seara"
            className="aspect-[5/4] rounded-[18px] shadow-[0_16px_40px_rgba(120,80,40,.16)]"
            stripe="#e2cba8"
          />
        </Reveal>
        <Reveal delay={0.1}>
          <div>
            <Eyebrow className="mb-3.5">{terasa.eyebrow}</Eyebrow>
            <h2 className="mb-[18px] font-display text-[clamp(28px,4vw,46px)] font-medium leading-[1.08] tracking-[-0.5px] text-sea">
              {terasa.heading}
            </h2>
            <p className="mb-6 max-w-[46ch] text-[17px] leading-relaxed text-body">
              {terasa.body}
            </p>
            <div className="mb-7 flex flex-wrap gap-2.5">
              {terasa.tags.map((t) => (
                <span
                  key={t}
                  className="rounded-full bg-surface px-[15px] py-2 text-[13px] font-semibold text-body"
                >
                  {t}
                </span>
              ))}
            </div>
            <a
              href={contact.phoneHref}
              className="inline-flex items-center gap-2.5 rounded-full bg-sea px-[26px] py-3.5 text-[15px] font-bold text-cream transition-transform hover:-translate-y-0.5"
            >
              <Phone className="size-4" /> Rezervă o masă
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
