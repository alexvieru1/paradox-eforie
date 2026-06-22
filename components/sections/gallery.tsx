"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ChevronLeft, ChevronRight, X, Expand } from "lucide-react";
import type { GalleryItem } from "@/lib/content";

const STRIPES = ["#e7d5bc", "#e0ccae", "#e2d6c4", "#dfd3c0", "#e4d3b8", "#dbcbb0"];

function stripe(i: number, size = 14) {
  const c = STRIPES[i % STRIPES.length];
  return `repeating-linear-gradient(135deg, ${c} 0 ${size}px, rgba(0,0,0,0.04) ${size}px ${size * 2}px)`;
}

/** Gallery with a hero image, thumbnail strip, and a keyboard-driven lightbox. */
export function Gallery({ images }: { images: GalleryItem[] }) {
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState(false);
  const count = images.length;

  const step = useCallback(
    (d: number) => setActive((i) => (i + d + count) % count),
    [count],
  );

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, step]);

  return (
    <section className="mx-auto max-w-[1240px] px-5 pb-[clamp(40px,6vh,72px)] pt-[18px] sm:px-8 lg:px-16">
      {/* hero image */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="relative block aspect-video w-full cursor-zoom-in overflow-hidden rounded-[18px]"
        style={{ background: stripe(active) }}
        aria-label="Mărește galeria"
      >
        <span className="absolute inset-0 flex items-center justify-center font-mono text-[13px] text-faint">
          [ {images[active].caption} ]
        </span>
        <span className="absolute bottom-3.5 right-3.5 inline-flex items-center gap-1.5 rounded-full bg-[rgba(20,30,45,.7)] px-3.5 py-1.5 text-xs font-semibold text-white backdrop-blur-sm">
          <Expand className="size-3.5" /> {active + 1} / {count} · vezi galeria
        </span>
      </button>

      {/* thumbnails */}
      <div className="mt-3 grid grid-cols-6 gap-2.5">
        {images.map((img, i) => (
          <button
            key={img.id}
            type="button"
            onClick={() => setActive(i)}
            aria-label={img.caption}
            className="relative aspect-square overflow-hidden rounded-lg"
            style={{
              background: stripe(i, 8),
              outline: i === active ? "2px solid #C0633F" : "2px solid transparent",
              outlineOffset: "-2px",
            }}
          >
            {i !== active && (
              <span className="absolute inset-0 bg-cream/35" />
            )}
          </button>
        ))}
      </div>

      {/* lightbox */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-[rgba(15,22,32,.93)] p-4 sm:p-10 lg:p-14"
          >
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Închide"
              className="absolute right-5 top-5 flex size-[46px] items-center justify-center rounded-full bg-white/10 text-white"
            >
              <X className="size-6" />
            </button>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); step(-1); }}
              aria-label="Imaginea anterioară"
              className="absolute left-2.5 top-1/2 flex size-[52px] -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white sm:left-10"
            >
              <ChevronLeft className="size-7" />
            </button>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); step(1); }}
              aria-label="Imaginea următoare"
              className="absolute right-2.5 top-1/2 flex size-[52px] -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white sm:right-10"
            >
              <ChevronRight className="size-7" />
            </button>
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative aspect-video w-full max-w-[1100px] overflow-hidden rounded-[14px]"
              style={{ background: stripe(active, 18) }}
            >
              <span className="absolute inset-0 flex items-center justify-center font-mono text-sm text-[#7a6e5e]">
                [ {images[active].caption} ]
              </span>
            </div>
            <div className="absolute bottom-[22px] left-1/2 -translate-x-1/2 rounded-full bg-white/10 px-4 py-1.5 text-[13px] font-semibold tracking-wide text-white">
              {active + 1} / {count}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
