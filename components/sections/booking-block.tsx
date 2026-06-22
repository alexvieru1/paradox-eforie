import { ArrowRight, Phone } from "lucide-react";
import { partners, contact, type PartnerId } from "@/lib/content";

/**
 * The conversion block. Renders a VARIABLE list of booking partners
 * (only the ones passed in) plus a prominent tap-to-call.
 * Used on the homepage trust band and on every accommodation detail page.
 */
export function BookingBlock({
  partnerIds,
  title = "Rezervă online la",
}: {
  partnerIds: PartnerId[];
  title?: string;
}) {
  return (
    <div className="rounded-[18px] border border-white/15 bg-white/[0.06] p-7">
      <div className="mb-3.5 text-[11px] font-bold uppercase tracking-[0.16em] text-[#9fb6c6]">
        {title}
      </div>

      <div className="flex flex-col gap-2.5">
        {partnerIds.map((id) => {
          const p = partners[id];
          return (
            <a
              key={p.id}
              href={p.href}
              className="flex items-center justify-between gap-3 rounded-[11px] bg-cream px-4 py-3.5 font-bold text-sea transition-transform hover:translate-x-0.5"
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
            </a>
          );
        })}
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
