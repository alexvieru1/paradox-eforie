"use client";

import { motion } from "motion/react";
import { base } from "@/components/motion/transitions";

interface RevealProps {
  children: React.ReactNode;
  /** Seconds to delay the reveal, for staggering siblings. */
  delay?: number;
  className?: string;
}

/** Fades its children up once when they scroll into view. */
export function Reveal({ children, delay = 0, className }: RevealProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ ...base, delay }}
    >
      {children}
    </motion.div>
  );
}
