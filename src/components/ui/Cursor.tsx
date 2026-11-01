"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useRef } from "react";
import { useFinePointer } from "@/hooks/useMediaQuery";

/** How often the surface under the pointer is re-read while moving or scrolling. */
const SURFACE_CHECK_MS = 90;
/** Every RGB channel must reach this for a background to count as white-ish; coloured buttons don't. */
const LIGHT_CHANNEL_MIN = 180;

/**
 * Reads computed colours in any format (rgb, oklab, color-mix results) by painting them on a
 * single pixel. Results are cached, as a page only uses a handful of background colours.
 */
function createColorReader() {
  const ctx = document.createElement("canvas").getContext("2d", { willReadFrequently: true });
  const cache = new Map<string, Uint8ClampedArray>();
  return (color: string) => {
    let rgba = cache.get(color);
    if (!rgba && ctx) {
      ctx.clearRect(0, 0, 1, 1);
      ctx.fillStyle = color;
      ctx.fillRect(0, 0, 1, 1);
      rgba = ctx.getImageData(0, 0, 1, 1).data;
      cache.set(color, rgba);
    }
    return rgba;
  };
}

/** True when the first solid background under the point is white-ish. */
function isOnLightSurface(x: number, y: number, readColor: ReturnType<typeof createColorReader>) {
  for (const el of document.elementsFromPoint(x, y)) {
    const style = getComputedStyle(el);
    if (parseFloat(style.opacity) < 0.5) continue;
    const rgba = readColor(style.backgroundColor);
    if (!rgba || rgba[3] < 128) continue;
    return Math.min(rgba[0], rgba[1], rgba[2]) >= LIGHT_CHANNEL_MIN;
  }
  return false;
}

/**
 * High-performance dual cursor:
 * - The primary dot tracks the pointer instantly with zero lag (1:1 hardware responsiveness).
 * - The outer trailing ring uses smooth spring physics for the elegant trailing aesthetic.
 * - Hardware-accelerated styling eliminates GPU blend-mode stalls across cards, images, and buttons.
 * - White on dark surfaces, the theme green on white ones, switched without re-rendering.
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

    const readColor = createColorReader();
    let lastCheck = 0;
    let checkTimer: ReturnType<typeof setTimeout> | undefined;
    const checkSurface = () => {
      lastCheck = performance.now();
      const light = isOnLightSurface(x.get(), y.get(), readColor);
      if (rootRef.current) rootRef.current.dataset.surface = light ? "light" : "dark";
    };
    // Throttled, with a trailing check so the colour is right once movement or scrolling stops.
    const scheduleCheck = () => {
      if (checkTimer) return;
      const wait = Math.max(0, SURFACE_CHECK_MS - (performance.now() - lastCheck));
      checkTimer = setTimeout(() => {
        checkTimer = undefined;
        checkSurface();
      }, wait);
    };

    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setVisible(true);
      scheduleCheck();
    };
    const leave = () => setVisible(false);
    const down = () => ringScale.set(0.8);
    const up = () => ringScale.set(1);

    window.addEventListener("pointermove", move, { passive: true });
    html.addEventListener("pointerleave", leave);
    window.addEventListener("pointerdown", down);
    window.addEventListener("pointerup", up);
    window.addEventListener("scroll", scheduleCheck, { passive: true });
    return () => {
      if (checkTimer) clearTimeout(checkTimer);
      window.removeEventListener("scroll", scheduleCheck);
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
      className="group pointer-events-none fixed inset-0 z-[100] opacity-0 transition-opacity duration-200"
    >
      {/* Smooth trailing outer ring */}
      <motion.div
        className="absolute left-0 top-0 h-9 w-9 rounded-full border border-white/60 shadow-[0_0_10px_rgba(255,255,255,0.2)] transition-[border-color,box-shadow] duration-200 will-change-transform group-data-[surface=light]:border-[#0f9d63]/70 group-data-[surface=light]:shadow-[0_0_10px_rgba(15,157,99,0.25)]"
        style={{ x: ringX, y: ringY, translateX: "-50%", translateY: "-50%", scale: ringScale }}
      />
      {/* Instant 1:1 zero-latency center pointer dot */}
      <motion.div
        className="absolute left-0 top-0 h-2 w-2 rounded-full bg-white shadow-[0_0_6px_rgba(255,255,255,0.8)] transition-[background-color,box-shadow] duration-200 will-change-transform group-data-[surface=light]:bg-[#0f9d63] group-data-[surface=light]:shadow-[0_0_6px_rgba(15,157,99,0.7)]"
        style={{ x, y, translateX: "-50%", translateY: "-50%" }}
      />
    </div>
  );
}