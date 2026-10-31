"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { navLinks, profile, socials } from "@/data/site";
import { ArrowUpRight } from "@/components/ui/Icons";
import { LocalTime } from "@/components/ui/LocalTime";

const colophon = ["Built with: Next.js / Framer Motion / Lenis", "Typeface: Inter / Inter Tight", "Styled with: Tailwind CSS"];

/**
 * Footer scene: a giant white wordmark arrives first, then shrinks to a medium size as you
 * scroll while the footer details fade in above it. Only transform/opacity animate.
 * Scroll budget: 200svh (100svh to bring the footer up, 100svh pinned for the shrink).
 */
export function Footer() {
  const sceneRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: p } = useScroll({ target: sceneRef, offset: ["start end", "end end"] });

  // Wordmark: huge and pushed low at first (letters peek in from the bottom), then shrinks
  // into its resting place just above the bottom bar.
  const markScale = useTransform(p, [0.2, 0.85], [1.6, 1]);
  const markY = useTransform(p, [0.2, 0.85], ["8svh", "0svh"]);
  // Details arrive once the wordmark is almost settled.
  const infoOpacity = useTransform(p, [0.68, 0.9], [0, 1]);
  const infoY = useTransform(p, [0.68, 0.9], [32, 0]);

  const year = new Date().getFullYear();
  const channels = socials;

  return (
    <footer aria-label="Footer" className="relative z-10 bg-black text-white">
      <div ref={sceneRef} className="relative h-[200svh]">
        <div className="sticky top-0 h-[100svh] overflow-hidden">
          {/* Details */}
          <motion.div
            style={{ opacity: infoOpacity, y: infoY }}
            className="container-x grid grid-cols-2 gap-x-8 gap-y-8 pt-[calc(var(--header-h)+1rem)] text-[11px] uppercase tracking-[0.08em] md:grid-cols-3 md:pt-[calc(var(--header-h)+2svh)] md:text-xs"
          >
            <div>
              <h2 className="font-bold tracking-[0.2em]">Identification</h2>
              <ul className="mt-5 space-y-1.5 text-white/60">
                <li className="text-white">{profile.name}</li>
                <li>{profile.role}</li>
                <li>
                  {profile.location} &middot; <LocalTime timeZone={profile.timezone} />
                </li>
              </ul>
            </div>

            <nav aria-label="Channels">
              <h2 className="font-bold tracking-[0.2em]">Channels</h2>
              <ul className="mt-5 space-y-1.5">
                {channels.map((s) => (
                  <li key={s.key}>
                    <a
                      href={s.href}
                      target={s.key === "email" ? undefined : "_blank"}
                      rel="noopener noreferrer"
                      className="group inline-flex items-center gap-1 transition-colors hover:text-accent"
                    >
                      {s.label}
                      <ArrowUpRight size={12} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="col-span-2 md:col-span-1">
              <h2 className="font-bold tracking-[0.2em]">Colophon</h2>
              <ul className="mt-5 space-y-1.5 text-white/60">
                {colophon.map((line) => (
                  <li key={line}>{line}</li>
                ))}
                <li className="font-bold text-white">{year}</li>
              </ul>
            </div>
          </motion.div>

          {/* Wordmark sits directly on top of the bottom bar, so a wrapped (taller) bar on phones never hides it */}
          <div className="absolute inset-x-0 bottom-0 flex flex-col">
          {/* Giant wordmark: SVG text stretched to an exact width so it always spans the screen */}
          <motion.div
            style={{ scale: markScale, y: markY }}
            className="flex origin-bottom justify-center pb-[2svh] will-change-transform sm:pb-[3svh]"
          >
            <svg viewBox="0 0 1000 205" role="img" aria-label={`${profile.name}`} className="w-[min(94vw,195svh)] overflow-visible">
              <text
                x="0"
                y="170"
                textLength="935"
                lengthAdjust="spacingAndGlyphs"
                className="fill-white font-display uppercase"
                fontSize="226"
                fontWeight={800}
              >
                {profile.name}
              </text>
              <circle cx="976" cy="30" r="19" fill="none" stroke="white" strokeWidth="4" />
              <text x="976" y="42" textAnchor="middle" className="fill-white font-display" fontSize="30" fontWeight={700}>
                R
              </text>
            </svg>
          </motion.div>

          {/* Bottom bar */}
          <motion.div
            style={{ opacity: infoOpacity }}
            className="container-x relative flex flex-col gap-3 border-t border-white/10 py-5 text-[11px] uppercase tracking-[0.12em] text-white/50 sm:flex-row sm:items-center sm:justify-between"
          >
            <p>
              &copy; {year} {profile.name}. All rights reserved.
            </p>
            <nav aria-label="Footer" className="flex flex-wrap gap-x-5 gap-y-2">
              {navLinks.map((l) => (
                <a key={l.href} href={l.href} className="transition-colors hover:text-white">
                  {l.label}
                </a>
              ))}
              <a href="#top" className="group inline-flex items-center gap-1 text-white transition-colors hover:text-accent">
                Back to top
                <ArrowUpRight size={12} className="-rotate-45 transition-transform group-hover:-translate-y-0.5" />
              </a>
            </nav>
          </motion.div>
          </div>
        </div>
      </div>
    </footer>
  );
}