"use client";

import { useEffect, useRef } from "react";

interface CountUpProps {
  value: number;
  suffix?: string;
  /** Seconds to count up. */
  duration?: number;
  /** Seconds to hold the final number before counting again. */
  hold?: number;
  className?: string;
}

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

/**
 * Counts from 0 to `value`, holds, then repeats - only while on screen.
 * Updates the DOM text directly each frame, so the count never re-renders React.
 */
export function CountUp({ value, suffix = "", duration = 1.8, hold = 2.5, className }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const render = (n: number) => {
      el.textContent = `${n}${suffix}`;
    };
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      render(value);
      return;
    }

    let raf = 0;
    let timer = 0;
    let start = 0;

    const tick = (now: number) => {
      if (!start) start = now;
      const t = Math.min(1, (now - start) / (duration * 1000));
      render(Math.round(easeOutCubic(t) * value));
      if (t < 1) raf = requestAnimationFrame(tick);
      else
        timer = window.setTimeout(() => {
          start = 0;
          raf = requestAnimationFrame(tick);
        }, hold * 1000);
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(timer);
    };

    const io = new IntersectionObserver(([entry]) => {
      stop();
      if (entry.isIntersecting) {
        start = 0;
        raf = requestAnimationFrame(tick);
      }
    });
    io.observe(el);
    return () => {
      io.disconnect();
      stop();
    };
  }, [value, suffix, duration, hold]);

  return (
    <span ref={ref} className={className} aria-label={`${value}${suffix}`}>
      {value}
      {suffix}
    </span>
  );
}