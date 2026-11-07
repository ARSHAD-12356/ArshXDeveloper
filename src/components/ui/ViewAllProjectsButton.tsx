"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { saveProjectReturn } from "@/lib/projectReturn";
import { ArrowRight } from "@/components/ui/Icons";
import { allProjectsConfig } from "@/data/site";
import { cn } from "@/lib/utils";

interface ViewAllProjectsButtonProps {
  href?: string;
  label?: string;
  className?: string;
  /** "lg" is the larger centre-stage version shown after the project stack. */
  size?: "md" | "lg";
}

/**
 * The button itself never moves on hover (no magnetic pull, no lift): a moving target slips out
 * from under the pointer at its edges and flickers between hover states, which reads as shaking.
 * Hover is shown with light only: a brighter glow, a lighter fill and the arrow sliding.
 */
export function ViewAllProjectsButton({
  href = allProjectsConfig.href,
  label = allProjectsConfig.label,
  className = "",
  size = "md",
}: ViewAllProjectsButtonProps) {
  const borderRef = useRef<HTMLSpanElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const lg = size === "lg";

  // Pause GPU animation when offscreen to preserve resources
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        const paused = String(!entry.isIntersecting);
        if (borderRef.current) borderRef.current.dataset.paused = paused;
      },
      { threshold: 0.1 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={containerRef} className={cn("relative inline-flex items-center justify-center", className)}>
      <Link
        href={href}
        onClick={saveProjectReturn}
        aria-label={label}
        className="group relative inline-flex items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0a]"
      >
        {/* Animated gradient border container */}
        <span
          className={cn(
            "relative flex items-center justify-center overflow-hidden rounded-full transition-shadow duration-300",
            lg
              ? "p-[2px] shadow-[0_0_30px_-4px_rgba(34,211,238,0.35)] group-hover:shadow-[0_0_44px_rgba(168,85,247,0.5)]"
              : "p-[1.5px] shadow-[0_0_16px_-2px_rgba(34,211,238,0.25)] group-hover:shadow-[0_0_24px_rgba(168,85,247,0.35)]",
          )}
        >
          {/* Continuously rotating conic gradient peeking through the border */}
          <span ref={borderRef} aria-hidden="true" data-paused="true" className="cta-gradient-border" />

          {/* Dark button interior */}
          <span
            className={cn(
              "relative z-10 flex items-center justify-center rounded-full bg-[#0d0d12] transition-colors duration-300 group-hover:bg-[#151230]",
              lg ? "gap-4 px-9 py-4 sm:px-12 sm:py-5 md:px-14 md:py-6" : "gap-3 px-7 py-3 sm:px-8 sm:py-3.5",
            )}
          >
            <span
              className={cn(
                "font-sans font-semibold uppercase text-white/90 transition-colors duration-300 group-hover:text-white",
                lg ? "text-[13px] tracking-[0.18em] sm:text-sm md:text-base" : "text-[11px] tracking-[0.16em] sm:text-xs md:text-[13px]",
              )}
            >
              {label}
            </span>
            <ArrowRight
              size={lg ? 20 : 15}
              className="text-white/90 transition-[translate,color] duration-300 ease-out group-hover:translate-x-1.5 group-hover:text-white"
            />
          </span>
        </span>
      </Link>
    </div>
  );
}
