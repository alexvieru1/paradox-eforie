import { Reveal } from "@/components/motion/reveal";
import { BookingStepper } from "@/components/sections/booking-stepper";
import { voucherBand } from "@/lib/content";

/**
 * Voucher trust band + a homepage echo of the Rezervă block
 * (all three partners — homepage is brand-level, not unit-level).
 */
export function VoucherBand() {
  return (
    <section className="bg-sea px-5 py-[clamp(48px,7vh,88px)] text-cream sm:px-8 lg:px-16">
      <div className="mx-auto grid max-w-[1000px] items-center gap-10 lg:grid-cols-2">
        <Reveal>
          <div>
            <div className="mb-[18px] inline-flex items-center gap-2 rounded-full bg-voucher/20 px-3.5 py-1.5 text-xs font-bold text-[#7fd3a6]">
              ★ {voucherBand.badge}
            </div>
            <h2 className="mb-3.5 font-display text-[clamp(26px,3.5vw,40px)] font-medium leading-[1.1]">
              {voucherBand.heading}
            </h2>
            <p className="max-w-[42ch] text-base leading-relaxed text-[#bfd0dc]">
              {voucherBand.body}
            </p>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <BookingStepper />
        </Reveal>
      </div>
    </section>
  );
}
