import { ArrowRight, Phone, Check } from "lucide-react";
import { hero, contact } from "@/lib/content";
import { Eyebrow } from "@/components/ui/primitives";

/** Full-viewport sunset hero (placeholder for full-bleed photography). */
export function Hero() {
  return (
    <section
      id="top"
      className="relative flex min-h-[100svh] items-end overflow-hidden"
    >
      {/* sunset gradient backdrop */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(180deg,#F6C98A 0%,#E89B6C 30%,#C77A6A 55%,#7E5E72 78%,#2E4257 100%)",
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "repeating-linear-gradient(122deg,rgba(255,255,255,.05) 0 2px,transparent 2px 26px)",
          }}
        />
        {/* sun glow */}
        <div
          className="absolute right-[9%] top-[24%] size-[clamp(80px,11vw,150px)] rounded-full blur-[1px]"
          style={{
            backgroundImage:
              "radial-gradient(circle,#FFF1D2 0%,#FFD79A 55%,rgba(255,200,120,0) 72%)",
          }}
        />
        <span className="absolute left-3.5 top-[78px] font-mono text-[11px] tracking-wide text-white/60">
          [ foto · apus peste Marea Neagră — full bleed ]
        </span>
      </div>
      {/* bottom scrim for legibility */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(180deg,rgba(20,30,45,0) 40%,rgba(20,30,45,.55) 100%)",
        }}
      />

      <div className="relative z-10 max-w-[1000px] px-5 pb-[clamp(48px,8vh,96px)] sm:px-8 lg:px-16 [animation:fade-up_.9s_ease_both]">
        <Eyebrow className="mb-5 flex items-center gap-2.5 text-[#fbe9cf]">
          <span className="h-px w-7 bg-[#fbe9cf]" />
          {hero.eyebrow}
        </Eyebrow>

        <h1 className="max-w-[14ch] font-display text-[clamp(40px,7vw,84px)] font-medium leading-[1.02] tracking-[-1px] text-[#fff8ee] text-balance">
          {hero.title}
        </h1>

        <p className="mt-6 max-w-[52ch] text-[clamp(16px,2vw,21px)] leading-relaxed text-[#f4e6d4]">
          {hero.subline}
        </p>

        <div className="mt-9 flex flex-wrap gap-3.5">
          <a
            href="#cazare"
            className="inline-flex items-center gap-2.5 rounded-full bg-cream px-7 py-[15px] text-[15px] font-bold text-sea shadow-[0_8px_24px_rgba(0,0,0,.18)] transition-all hover:-translate-y-0.5 hover:shadow-[0_12px_30px_rgba(0,0,0,.26)]"
          >
            Vezi cazarea <ArrowRight className="size-4" />
          </a>
          <a
            href={contact.phoneHref}
            className="inline-flex items-center gap-2.5 rounded-full border border-white/50 bg-white/[0.14] px-7 py-[15px] text-[15px] font-bold text-[#fff8ee] backdrop-blur-sm transition-colors hover:bg-white/25"
          >
            <Phone className="size-4" /> Sună acum
          </a>
        </div>

        <div className="mt-[30px] inline-flex items-center gap-2.5 rounded-full bg-cream/95 px-4 py-2.5 text-[13px] font-bold text-sea">
          <span className="flex size-[18px] items-center justify-center rounded-full bg-voucher text-white">
            <Check className="size-3" strokeWidth={3} />
          </span>
          {hero.voucherBadge}
        </div>
      </div>
    </section>
  );
}
