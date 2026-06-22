import { Reveal } from "@/components/motion/reveal";
import { Eyebrow } from "@/components/ui/primitives";
import { testimonials } from "@/lib/content";

/** "Recenzii" — guest testimonials. */
export function Testimonials() {
  return (
    <section id="recenzii" className="mx-auto max-w-[1240px] px-5 py-[clamp(64px,10vh,120px)] sm:px-8 lg:px-16">
      <Reveal className="mb-[clamp(36px,5vh,56px)] text-center">
        <Eyebrow className="mb-3.5">Ce spun oaspeții</Eyebrow>
        <h2 className="font-display text-[clamp(28px,4.5vw,50px)] font-medium leading-[1.08] tracking-[-0.5px] text-sea">
          Vacanțe de care ne amintim cu drag
        </h2>
      </Reveal>

      <div className="grid gap-[22px] sm:grid-cols-2 lg:grid-cols-3">
        {testimonials.map((t, i) => (
          <Reveal key={t.author} delay={i * 0.08}>
            <figure className="h-full rounded-2xl bg-surface p-[30px] shadow-[0_1px_3px_rgba(60,40,20,.08)]">
              <div className="mb-3.5 text-base tracking-[2px] text-gold">★★★★★</div>
              <blockquote className="mb-5 font-display text-[19px] italic leading-[1.5] text-[#3a2e22]">
                „{t.quote}”
              </blockquote>
              <figcaption className="text-sm font-bold text-sea">
                {t.author}{" "}
                <span className="font-normal text-faint">· {t.context}</span>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
