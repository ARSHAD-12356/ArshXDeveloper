"use client";

import { useEffect, useRef } from "react";
import { ArrowRight } from "@/components/ui/Icons";
import { Magnetic } from "@/components/ui/Magnetic";
import { allProjectsConfig } from "@/data/site";

interface ViewAllProjectsButtonProps {
  href?: string;
  label?: string;
  className?: string;
}

export function ViewAllProjectsButton({
  href = allProjectsConfig.href,
  label = allProjectsConfig.label,
  className = "",
}: ViewAllProjectsButtonProps) {
  const borderRef = useRef<HTMLSpanElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

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
    <div ref={containerRef} className={`relative inline-flex items-center justify-center ${className}`}>
      <Magnetic strength={0.3}>
        <a
          href={href}
          target={allProjectsConfig.target}
          rel={allProjectsConfig.rel}
          aria-label={label}
          className="group relative inline-flex items-center justify-center rounded-full transition-transform duration-300 ease-out hover:-translate-y-[2px] active:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0a]"
        >
          {/* Animated gradient border container */}
          <span className="relative flex items-center justify-center overflow-hidden rounded-full p-[1.5px] shadow-[0_0_16px_-2px_rgba(34,211,238,0.25)] transition-shadow duration-300 group-hover:shadow-[0_0_24px_rgba(168,85,247,0.35)]">
            {/* Continuously rotating conic gradient peeking through the 1.5px border */}
            <span
              ref={borderRef}
              aria-hidden="true"
              data-paused="true"
              className="cta-gradient-border"
            />

            {/* Dark button interior */}
            <span className="relative z-10 flex items-center justify-center gap-3 rounded-full bg-[#0d0d12] px-7 py-3 sm:px-8 sm:py-3.5 transition-colors duration-300 group-hover:bg-[#131124]">
              <span className="font-sans text-[11px] sm:text-xs md:text-[13px] font-semibold uppercase tracking-[0.16em] text-white/90 transition-colors duration-300 group-hover:text-white">
                {label}
              </span>
              <ArrowRight
                size={15}
                className="text-white/90 transition-all duration-300 ease-out group-hover:translate-x-1.5 group-hover:text-white"
              />
            </span>
          </span>
        </a>
      </Magnetic>
    </div>
  );
}
