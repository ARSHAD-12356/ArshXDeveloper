"use client";

import { motion, type Variants } from "framer-motion";
import type { ElementType, ReactNode } from "react";
import { EASE_OUT_EXPO } from "@/lib/utils";

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  as?: "div" | "li" | "section" | "p" | "span";
}

/** Fade + rise when the element enters the viewport (once). */
export function Reveal({ children, className, delay = 0, y = 32, as = "div" }: RevealProps) {
  const Tag = motion[as] as typeof motion.div;
  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 0.9, ease: EASE_OUT_EXPO, delay }}
    >
      {children}
    </Tag>
  );
}

const lineVariants: Variants = {
  hidden: { y: "110%" },
  show: ({ i, delay }: { i: number; delay: number }) => ({
    y: "0%",
    transition: { duration: 1.1, ease: EASE_OUT_EXPO, delay: delay + i * 0.08 },
  }),
};

interface SplitLinesProps {
  lines: readonly string[];
  className?: string;
  lineClassName?: string;
  as?: ElementType;
  id?: string;
  /** Animate on mount (hero) instead of on scroll into view. */
  immediate?: boolean;
  delay?: number;
}

/** Masked line-by-line slide up, the classic editorial headline reveal. */
export function SplitLines({ lines, className, lineClassName, as: Tag = "h2", id, immediate, delay = 0 }: SplitLinesProps) {
  const trigger = immediate
    ? { animate: "show" }
    : { whileInView: "show", viewport: { once: true, margin: "0px 0px -10% 0px" } };
  return (
    <Tag id={id} className={className}>
      <span className="sr-only">{lines.join(" ")}</span>
      <motion.span aria-hidden initial="hidden" {...trigger} className="block">
        {lines.map((line, i) => (
          <span key={i} className="block overflow-hidden pb-[0.06em]">
            <motion.span
              custom={{ i, delay }}
              variants={lineVariants}
              className={`block will-change-transform ${lineClassName ?? ""}`}
            >
              {line}
            </motion.span>
          </span>
        ))}
      </motion.span>
    </Tag>
  );
}
