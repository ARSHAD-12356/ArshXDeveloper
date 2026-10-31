"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useRef } from "react";
import { useFinePointer } from "@/hooks/useMediaQuery";

/**
 * High-performance dual cursor:
 * - The primary dot tracks the pointer instantly with zero lag (1:1 hardware responsiveness).
 * - The outer trailing ring uses smooth spring physics for the elegant trailing aesthetic.
 * - Hardware-accelerated styling eliminates GPU blend-mode stalls across cards, images, and buttons.
 */
export function Cursor() {
  const enabled = useFinePointer();
  const rootRef = useRef<HTMLDivElement>(null);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 280, damping: 28, mass: 0.5 });
  const ringY = useSpring(y, { stiffness: 280, damping: 28, mass: 0.5 });
  const ringScale = useSpring(1, { stiffness: 400, damping: 25 });

  useEffect(() => {
    if (!enabled) return;
    const html = document.documentElement;
    html.classList.add("has-custom-cursor");
    const setVisible = (v: boolean) => {
      if (rootRef.current) rootRef.current.style.opacity = v ? "1" : "0";
    };

    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setVisible(true);
    };
    const leave = () => setVisible(false);
    const down = () => ringScale.set(0.8);
    const up = () => ringScale.set(1);

    window.addEventListener("pointermove", move, { passive: true });
    html.addEventListener("pointerleave", leave);
    window.addEventListener("pointerdown", down);
    window.addEventListener("pointerup", up);
    return () => {
      html.classList.remove("has-custom-cursor");
      window.removeEventListener("pointermove", move);
      html.removeEventListener("pointerleave", leave);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
    };
  }, [enabled, x, y, ringScale]);

  if (!enabled) return null;

  return (
    <div
      ref={rootRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[100] opacity-0 transition-opacity duration-200"
    >
      {/* Smooth trailing outer ring */}
      <motion.div
        className="absolute left-0 top-0 h-9 w-9 rounded-full border border-white/60 shadow-[0_0_10px_rgba(255,255,255,0.2)] will-change-transform"
        style={{ x: ringX, y: ringY, translateX: "-50%", translateY: "-50%", scale: ringScale }}
      />
      {/* Instant 1:1 zero-latency center pointer dot */}
      <motion.div
        className="absolute left-0 top-0 h-2 w-2 rounded-full bg-white shadow-[0_0_6px_rgba(255,255,255,0.8)] will-change-transform"
        style={{ x, y, translateX: "-50%", translateY: "-50%" }}
      />
    </div>
  );
}