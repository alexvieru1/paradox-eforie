import Image from "next/image";
import { Star } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { Eyebrow } from "@/components/ui/primitives";
import { testimonials } from "@/lib/content";
import { getGoogleReviews, type GoogleReview } from "@/lib/reviews";

function Stars({ count }: { count: number }) {
  return (
    <div className="mb-3.5 flex gap-0.5 text-gold" aria-label={`${count} din 5 stele`}>
      {Array.from({ length: 5 }, (_, i) => (
        <Star key={i} className="size-4" fill={i < count ? "currentColor" : "none"} strokeWidth={1.5} />
      ))}
    </div>
  );
}

/** "Recenzii" — live Google reviews with a static fallback. */
export async function Testimonials() {
  const data = await getGoogleReviews();
  const liveReviews: GoogleReview[] = (data?.reviews ?? [])
    .filter((r) => r.rating >= 4 && r.text.trim().length > 0)
    .slice(0, 6);
  const useLive = liveReviews.length > 0;

  return (
    <section id="recenzii" className="mx-auto max-w-[1240px] px-5 py-[clamp(64px,10vh,120px)] sm:px-8 lg:px-16">
      <Reveal className="mb-[clamp(36px,5vh,56px)] text-center">
        <Eyebrow className="mb-3.5">Ce spun oaspeții</Eyebrow>
        <h2 className="font-display text-[clamp(28px,4.5vw,50px)] font-medium leading-[1.08] tracking-[-0.5px] text-sea">
          Vacanțe de care ne amintim cu drag
        </h2>
        {useLive && data && (
          <a
            href={data.mapsUri}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-surface px-4 py-2 text-sm font-semibold text-sea shadow-[0_1px_3px_rgba(60,40,20,.08)] transition-transform hover:-translate-y-0.5"
          >
            <span className="font-bold">{data.rating.toFixed(1)}</span>
            <Star className="size-4 text-gold" fill="currentColor" strokeWidth={0} />
            <span className="font-normal text-faint">
              {data.count.toLocaleString("ro-RO")} recenzii pe Google
            </span>
          </a>
        )}
      </Reveal>

      <div className="grid gap-[22px] sm:grid-cols-2 lg:grid-cols-3">
        {useLive
          ? liveReviews.map((r, i) => (
              <Reveal key={`${r.author}-${i}`} delay={i * 0.08}>
                <figure className="flex h-full flex-col rounded-2xl bg-surface p-[30px] shadow-[0_1px_3px_rgba(60,40,20,.08)]">
                  <Stars count={r.rating} />
                  <blockquote className="mb-5 line-clamp-6 flex-1 font-display text-[19px] italic leading-[1.5] text-[#3a2e22]">
                    {`„${r.text}”`}
                  </blockquote>
                  <figcaption className="flex items-center gap-3">
                    {r.photoUri && (
                      <Image
                        src={r.photoUri}
                        alt=""
                        width={36}
                        height={36}
                        className="size-9 rounded-full object-cover"
                      />
                    )}
                    <span className="text-sm font-bold text-sea">
                      {r.author}{" "}
                      <span className="font-normal text-faint">· {r.relativeTime}</span>
                    </span>
                  </figcaption>
                </figure>
              </Reveal>
            ))
          : testimonials.map((t, i) => (
              <Reveal key={t.author} delay={i * 0.08}>
                <figure className="h-full rounded-2xl bg-surface p-[30px] shadow-[0_1px_3px_rgba(60,40,20,.08)]">
                  <Stars count={5} />
                  <blockquote className="mb-5 font-display text-[19px] italic leading-[1.5] text-[#3a2e22]">
                    {`„${t.quote}”`}
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
