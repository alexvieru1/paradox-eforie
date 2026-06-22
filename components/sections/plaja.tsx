import { Reveal } from "@/components/motion/reveal";
import { Eyebrow } from "@/components/ui/primitives";
import { plaja } from "@/lib/content";

/** "Plaja Paradox" — full-bleed beach band (placeholder gradient). */
export function Plaja() {
  return (
    <section id="plaja" className="relative flex min-h-[78vh] items-center overflow-hidden">
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
            "linear-gradient(90deg,rgba(20,30,45,.55) 0%,rgba(20,30,45,.1) 70%)",
        }}
      />
      <Reveal className="relative z-10 max-w-[780px] px-5 sm:px-8 lg:px-16">
        <Eyebrow className="mb-4 text-[#fbe9cf]">{plaja.eyebrow}</Eyebrow>
        <h2 className="mb-5 font-display text-[clamp(32px,5.5vw,64px)] font-medium leading-[1.04] tracking-[-0.5px] text-[#fff8ee] text-balance">
          {plaja.heading}
        </h2>
        <p className="max-w-[46ch] text-[clamp(16px,2vw,20px)] leading-relaxed text-[#f4e6d4]">
          {plaja.body}
        </p>
      </Reveal>
    </section>
  );
}
