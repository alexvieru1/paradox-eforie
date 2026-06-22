"use client";

import { MotionConfig } from "motion/react";

/** App-wide motion config. Respects the user's reduced-motion preference. */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
