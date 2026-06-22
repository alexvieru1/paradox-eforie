"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Phone, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { contact, nav } from "@/lib/content";

/** Fixed header: transparent over the hero, cream + hairline once scrolled. */
export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-300",
        scrolled
          ? "bg-cream/95 shadow-[0_1px_0_rgba(0,0,0,0.06)] backdrop-blur"
          : "bg-transparent",
      )}
    >
      <div className="flex items-center justify-between px-5 py-4 sm:px-8 lg:px-16">
        <Link href="/" className="flex items-center gap-3">
          <span className="font-display text-2xl font-semibold tracking-[0.01em] text-sea">
            Paradox
          </span>
          <span className="border-l border-[#d8c3a6] pl-2.5 text-[9px] font-semibold uppercase leading-[1.3] tracking-[0.2em] text-terracotta">
            Eforie
            <br />
            Sud
          </span>
        </Link>

        {/* desktop nav */}
        <nav className="hidden items-center gap-8 text-sm font-semibold lg:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-[#3a2e22] transition-colors hover:text-terracotta"
            >
              {item.label}
            </Link>
          ))}
          <a
            href={contact.phoneHref}
            className="inline-flex items-center gap-2 rounded-full bg-terracotta px-5 py-2.5 font-bold text-cream transition-all hover:-translate-y-px hover:bg-terracotta-dk"
          >
            <Phone className="size-4" strokeWidth={2.4} />
            {contact.phone}
          </a>
        </nav>

        {/* mobile toggle */}
        <button
          type="button"
          aria-label="Meniu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="text-sea lg:hidden"
        >
          {open ? <X className="size-7" /> : <Menu className="size-7" />}
        </button>
      </div>

      {/* mobile overlay menu */}
      {open && (
        <div className="fixed inset-0 top-[64px] z-40 flex flex-col gap-1 bg-cream px-7 pb-7 pt-2 lg:hidden">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="border-b border-line py-3.5 font-display text-2xl text-sea"
            >
              {item.label}
            </Link>
          ))}
          <a
            href={contact.phoneHref}
            onClick={() => setOpen(false)}
            className="mt-4 inline-flex items-center justify-center gap-2 rounded-full bg-terracotta px-5 py-4 text-lg font-bold text-cream"
          >
            <Phone className="size-5" /> {contact.phone}
          </a>
        </div>
      )}
    </header>
  );
}
