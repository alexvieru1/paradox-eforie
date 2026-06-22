/** Shared motion easings & durations — import these so animation feels consistent app-wide. */
export const easeOutExpo = [0.16, 1, 0.3, 1] as const;

export const fast = { duration: 0.2, ease: easeOutExpo } as const;
export const base = { duration: 0.4, ease: easeOutExpo } as const;
export const slow = { duration: 0.6, ease: easeOutExpo } as const;
