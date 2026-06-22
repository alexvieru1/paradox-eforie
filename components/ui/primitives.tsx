import { cn } from "@/lib/utils";

/** Striped placeholder block standing in for client photography. */
export function PhotoPlaceholder({
  label,
  className,
  stripe = "#e7d5bc",
  stripe2 = "rgba(0,0,0,0.04)",
}: {
  label: string;
  className?: string;
  stripe?: string;
  stripe2?: string;
}) {
  return (
    <div
      role="img"
      aria-label={label}
      className={cn("relative overflow-hidden", className)}
      style={{
        backgroundImage: `repeating-linear-gradient(135deg, ${stripe} 0 14px, ${stripe2} 14px 28px)`,
      }}
    >
      <span className="absolute inset-0 flex items-center justify-center px-4 text-center font-mono text-[11px] text-faint">
        [ {label} ]
      </span>
    </div>
  );
}

/** Star-rating pill (★★★ / ★★). */
export function StarPill({ stars }: { stars: number }) {
  return (
    <span className="inline-flex rounded-full bg-sea px-3 py-1 text-xs font-bold tracking-wider text-white">
      {"★".repeat(stars)}
    </span>
  );
}

/** Green "Vouchere ✓" badge. */
export function VoucherPill({ full = false }: { full?: boolean }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-voucher/95 px-2.5 py-1 text-[11px] font-bold text-white">
      {full ? "Acceptăm vouchere de vacanță" : "Vouchere"} ✓
    </span>
  );
}

/** Small uppercase section eyebrow. */
export function Eyebrow({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "text-xs font-bold uppercase tracking-[0.21em] text-terracotta",
        className,
      )}
    >
      {children}
    </div>
  );
}
