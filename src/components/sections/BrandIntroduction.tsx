"use client";

import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { useRef } from "react";
import { BrandReveal } from "./BrandReveal";
import { Introduction } from "./Introduction";

/** Shares of the pinned scroll: the brand transition, then a beat, then the next section covers it. */
const REVEAL_END = 0.42;
const COVER_START = 0.5;

/**
 * Pins the brand card for two screens of scrolling. The first part drives the title-to-portrait
 * transition; in the last screen the Introduction panel rises over the finished composition at
 * full width, arriving a little late. One scroll progress drives everything, and
 * nothing here re-renders while scrolling.
 */
export function BrandIntroduction() {
  const pinRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: pinRef, offset: ["start start", "end end"] });

  const linear = useTransform(scrollYProgress, [0, REVEAL_END], [0, 1]);
  // A light spring rounds off mouse-wheel steps so the scrubbed motion stays fluid.
  const sprung = useSpring(linear, { stiffness: 140, damping: 32, mass: 0.35, restDelta: 0.0005 });
  // With reduced motion the finished composition simply stays in place.
  const settled = useMotionValue(1);
  const reveal = reduced ? settled : sprung;

  const cover = useTransform(scrollYProgress, [COVER_START, 1], [0, 1]);
  const y = useTransform(cover, [0, 1], [reduced ? "0svh" : "14svh", "0svh"]);
  const opacity = useTransform(cover, [0, 0.45], [reduced ? 1 : 0.55, 1]);

  return (
    <div className="relative">
      <div ref={pinRef} data-header-hide className="h-[300svh]">
        <BrandReveal reveal={reveal} coverProgress={cover} />
      </div>
      <motion.div
        style={{ y, opacity }}
        className="relative z-10 -mt-[100svh] shadow-[0_-30px_80px_-24px_rgba(8,40,26,0.22)] will-change-transform"
      >
        <Introduction />
      </motion.div>
    </div>
  );
}
