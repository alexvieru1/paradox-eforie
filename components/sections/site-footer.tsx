import { Phone } from "lucide-react";
import { contact, footer } from "@/lib/content";

/** Footer with contact, unit list, and the required EU-grant compliance banner. */
export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer id="contact" className="mt-auto bg-footer px-5 pb-7 pt-[clamp(48px,7vh,80px)] text-[#bfd0dc] sm:px-8 lg:px-16">
      <div className="mx-auto mb-12 grid max-w-[1240px] gap-10 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <div className="mb-3 font-display text-[26px] font-semibold text-cream">
            {footer.name}
          </div>
          <p className="max-w-[30ch] text-sm leading-relaxed">{footer.blurb}</p>
        </div>
        <div>
          <div className="mb-4 text-xs font-bold uppercase tracking-[0.14em] text-[#7e93a3]">
            Unitățile noastre
          </div>
          <ul className="flex flex-col gap-2.5 text-sm">
            {footer.units.map((u) => (
              <li key={u}>{u}</li>
            ))}
          </ul>
        </div>
        <div>
          <div className="mb-4 text-xs font-bold uppercase tracking-[0.14em] text-[#7e93a3]">
            Contact
          </div>
          <a
            href={contact.phoneHref}
            className="mb-3 inline-flex items-center gap-2 font-display text-2xl font-semibold text-cream"
          >
            <Phone className="size-5" /> {contact.phone}
          </a>
          <p className="text-sm leading-relaxed">{footer.location}</p>
        </div>
      </div>

      {/* EU-grant compliance banner */}
      <div className="mx-auto flex max-w-[1240px] flex-wrap items-center gap-5 rounded-[14px] border border-white/10 bg-white/[0.04] p-[22px]">
        <div
          className="relative flex h-11 w-16 flex-none items-center justify-center rounded-md"
          style={{ backgroundColor: "#003399" }}
          aria-label="Steagul Uniunii Europene (placeholder)"
        >
          <span className="text-lg tracking-[1px] text-[#ffcc00]">★★★</span>
        </div>
        <p className="min-w-[240px] max-w-[80ch] flex-1 text-xs leading-relaxed text-[#8fa3b3]">
          {footer.euGrant}{" "}
          <span className="font-mono text-[#6e8294]">{footer.euGrantTodo}</span>
        </p>
      </div>

      <div className="mx-auto mt-9 flex max-w-[1240px] flex-wrap justify-between gap-3 border-t border-white/[0.08] pt-6 text-[13px] text-[#6e8294]">
        <span>© {year} Paradox · Eforie Sud</span>
        <span>Acceptăm vouchere de vacanță</span>
      </div>
    </footer>
  );
}
