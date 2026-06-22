"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, ArrowLeft, Phone } from "lucide-react";
import {
  partners,
  partnersWithLinks,
  bookingByPartner,
  contact,
  type PartnerId,
} from "@/lib/content";
import { easeOutExpo } from "@/components/motion/transitions";

/**
 * Two-step booking wizard for the homepage: step 1 picks a partner, step 2
 * reveals that partner's per-location links. Client component (interactive).
 */
export function BookingStepper() {
  const [selected, setSelected] = useState<PartnerId | null>(null);

  return (
    <div className="rounded-[18px] border border-white/15 bg-white/[0.06] p-7">
      <div className="relative min-h-[232px]">
        <AnimatePresence mode="wait" initial={false}>
          {selected === null ? (
            <motion.div
              key="partners"
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.28, ease: easeOutExpo }}
            >
              <div className="mb-3.5 text-[11px] font-bold uppercase tracking-[0.16em] text-[#9fb6c6]">
                Alege partenerul
              </div>
              <div className="flex flex-col gap-2.5">
                {partnersWithLinks.map((id) => {
                  const p = partners[id];
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setSelected(p.id)}
                      className="flex items-center justify-between gap-3 rounded-[11px] bg-cream px-4 py-3.5 text-left font-bold text-sea transition-transform hover:translate-x-0.5"
                    >
                      <span className="flex items-center gap-3">
                        <span
                          className="flex size-[30px] items-center justify-center rounded-[7px] text-sm font-extrabold text-white"
                          style={{ backgroundColor: p.color }}
                          aria-hidden
                        >
                          {p.initials}
                        </span>
                        {p.name}
                      </span>
                      <ArrowRight className="size-4 text-terracotta" />
                    </button>
                  );
                })}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="locations"
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 16 }}
              transition={{ duration: 0.28, ease: easeOutExpo }}
            >
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="mb-3.5 inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-[#9fb6c6] transition-colors hover:text-cream"
              >
                <ArrowLeft className="size-3.5" /> înapoi · {partners[selected].name}
              </button>
              <div className="flex flex-col gap-2.5">
                {bookingByPartner[selected].map((loc) => (
                  <a
                    key={loc.slug}
                    href={loc.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between gap-3 rounded-[11px] bg-cream px-4 py-3.5 font-bold text-sea transition-transform hover:translate-x-0.5"
                  >
                    <span className="flex items-center gap-3">
                      {loc.name}
                      <span className="rounded-full bg-sea px-2 py-0.5 text-[10px] font-bold tracking-wider text-white">
                        {"★".repeat(loc.stars)}
                      </span>
                    </span>
                    <ArrowRight className="size-4 text-terracotta" />
                  </a>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="my-4 flex items-center gap-3 text-xs tracking-wider text-[#7e93a3]">
        <span className="h-px flex-1 bg-white/15" />
        SAU
        <span className="h-px flex-1 bg-white/15" />
      </div>

      <a
        href={contact.phoneHref}
        className="flex flex-col items-center gap-0.5 rounded-[11px] bg-terracotta p-4 text-white transition-colors hover:bg-terracotta-dk"
      >
        <span className="text-xs font-semibold tracking-wide opacity-85">
          Sună direct, te ajutăm imediat
        </span>
        <span className="inline-flex items-center gap-2 font-display text-2xl font-semibold">
          <Phone className="size-5" /> {contact.phone}
        </span>
      </a>
    </div>
  );
}
