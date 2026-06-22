import { Phone } from "lucide-react";
import { contact } from "@/lib/content";

/** Fixed bottom action bar shown on mobile detail pages. */
export function MobileCallBar({
  reserveHref = "#rezerva",
  reserveLabel = "Rezervă",
}: {
  reserveHref?: string;
  reserveLabel?: string;
} = {}) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-[45] flex gap-2.5 bg-cream/95 p-3.5 shadow-[0_-2px_16px_rgba(0,0,0,.12)] backdrop-blur lg:hidden">
      <a
        href={reserveHref}
        className="flex flex-1 items-center justify-center rounded-[11px] bg-sea py-3.5 text-[15px] font-bold text-cream"
      >
        {reserveLabel}
      </a>
      <a
        href={contact.phoneHref}
        className="flex flex-1 items-center justify-center gap-2 rounded-[11px] bg-terracotta py-3.5 text-[15px] font-bold text-white"
      >
        <Phone className="size-4" /> Sună
      </a>
    </div>
  );
}
