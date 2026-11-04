"use client";

import { motion, MotionConfig, useInView, useScroll, useTransform } from "framer-motion";
import { memo, useEffect, useRef, useState } from "react";
import { brand, footer, navLinks, profile, profileLinks } from "@/data/site";
import { BrandIcon } from "@/components/ui/BrandIcon";
import { ArrowUpRight, Check, Copy, Mail } from "@/components/ui/Icons";
import { EASE_OUT_EXPO } from "@/lib/utils";

const fadeUp = (play: boolean, delay: number, y = 22) => ({
  initial: { opacity: 0, y },
  animate: play ? { opacity: 1, y: 0 } : undefined,
  transition: { duration: 0.9, ease: EASE_OUT_EXPO, delay },
});

function ColumnHeading({ children, play, delay }: { children: string; play: boolean; delay: number }) {
  return (
    <motion.h2 {...fadeUp(play, delay)} className="font-display text-[clamp(1.05rem,min(1.5vw,2.8svh),1.6rem)] font-semibold tracking-[-0.01em]">
      {children}
      <span aria-hidden className="mt-2.5 block h-[3px] w-[3.25rem] rounded-full bg-[#00e676] short:mt-2" />
    </motion.h2>
  );
}

/** Keeps its "copied" state to itself so copying never re-renders the rest of the footer. */
function EmailRow({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="flex items-center gap-3 border-t border-white/10 pt-3.5">
      <Mail size={24} className="shrink-0 text-[#00e676]" />
      <a href={`mailto:${email}`} className="min-w-0 truncate text-[clamp(0.9rem,min(1.15vw,2.2svh),1.2rem)] transition-colors hover:text-[#00e676]">
        {email}
      </a>
      <button
        type="button"
        onClick={copy}
        aria-label={copied ? "Email address copied" : "Copy email address"}
        className="-m-1.5 shrink-0 p-1.5 text-white/60 transition-colors hover:text-white"
      >
        {copied ? <Check size={18} className="text-[#00e676]" /> : <Copy size={18} />}
      </button>
    </div>
  );
}

/** Only changes once, when the entrance fires, so scrolling never re-renders the columns. */
const Details = memo(function Details({ play }: { play: boolean }) {
  return (
    <div className="container-x grid grid-cols-1 gap-y-[clamp(1.1rem,3svh,2rem)] short:max-sm:gap-y-2.5 sm:grid-cols-[1.25fr_0.8fr_1.2fr] sm:gap-x-[clamp(1.5rem,6vw,8rem)]">
      {/* 1. Branding */}
      <motion.div {...fadeUp(play, 0)}>
        <p className="font-display text-[clamp(1.6rem,min(2.45vw,4.6svh),2.8rem)] font-bold leading-none tracking-[-0.03em]">
          {brand.name.slice(0, brand.accentIndex)}
          <span className="text-[#00e676]">{brand.name[brand.accentIndex]}</span>
          {brand.name.slice(brand.accentIndex + 1)}
          <sup className="ml-0.5 align-super text-[0.4em] font-semibold">&reg;</sup>
        </p>
        <p className="mt-[clamp(0.6rem,2svh,1.4rem)] max-w-[25rem] text-[clamp(0.9rem,min(1.2vw,2.3svh),1.25rem)] leading-[1.5] text-white/65">
          {footer.description}
        </p>
        <div className="mt-[clamp(0.6rem,2svh,1.3rem)] flex flex-wrap items-center gap-x-5 gap-y-2 text-[clamp(0.9rem,min(1.1vw,2.1svh),1.15rem)]">
          <span className="inline-flex items-center gap-2.5">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M12 21.5s7-6.3 7-11.5a7 7 0 1 0-14 0c0 5.2 7 11.5 7 11.5Z" />
              <circle cx="12" cy="10" r="2.5" />
            </svg>
            {profile.location}
          </span>
          <span aria-hidden className="h-6 w-px bg-white/15" />
          <span className="inline-flex items-center gap-2.5">
            <span aria-hidden className="h-2.5 w-2.5 rounded-full bg-[#00e676] shadow-[0_0_10px_rgba(0,230,118,0.75)]" />
            Online
          </span>
        </div>
      </motion.div>

      {/* 2. Quick links */}
      <nav aria-label="Quick links">
        <ColumnHeading play={play} delay={0.14}>Quick Links</ColumnHeading>
        <ul className="mt-[clamp(0.45rem,1.5svh,1rem)] grid grid-cols-2 gap-x-6 sm:grid-cols-1">
          {navLinks.map((l, i) => (
            <motion.li
              key={l.href}
              {...fadeUp(play, 0.2 + i * 0.07, 14)}
              className="border-b border-white/10 max-sm:[&:nth-last-child(-n+2)]:border-0 sm:last:border-0"
            >
              <a
                href={l.href}
                className="group flex items-center justify-between py-[clamp(0.3rem,1svh,0.6rem)] text-[clamp(0.9rem,min(1.15vw,2.2svh),1.2rem)] transition-colors hover:text-[#00e676]"
              >
                {l.label}
                <ArrowUpRight size={17} className="transition-transform duration-500 ease-out-expo group-hover:-translate-y-1 group-hover:translate-x-1" />
              </a>
            </motion.li>
          ))}
        </ul>
      </nav>

      {/* 3. Connect */}
      <div>
        <ColumnHeading play={play} delay={0.34}>Connect With Me</ColumnHeading>
        <ul className="mt-[clamp(0.8rem,2.6svh,1.75rem)] flex flex-wrap gap-[clamp(0.5rem,0.8vw,0.85rem)]">
          {profileLinks.map((s, i) => (
            <motion.li key={s.key} {...fadeUp(play, 0.42 + i * 0.08, 16)}>
              <a
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                data-social={s.key}
                className="footer-social flex h-[clamp(2.75rem,min(3.4vw,6svh),3.6rem)] w-[clamp(2.75rem,min(3.4vw,6svh),3.6rem)] items-center justify-center rounded-[0.8rem] border border-white/30 text-white"
              >
                <BrandIcon name={s.key} size={22} />
              </a>
            </motion.li>
          ))}
        </ul>
        <motion.div {...fadeUp(play, 0.86)} className="mt-[clamp(0.8rem,2.4svh,1.6rem)] max-w-[26rem]">
          <EmailRow email={footer.email} />
        </motion.div>
      </div>
    </div>
  );
});

const BottomBar = memo(function BottomBar({ play, year }: { play: boolean; year: number }) {
  return (
    <div className="relative bg-[#030303]">
      {/* Divider with a neon highlight at its centre */}
      <div aria-hidden className="relative h-px bg-white/15">
        <span className="absolute left-1/2 top-1/2 h-[2px] w-[min(14rem,40vw)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[linear-gradient(90deg,transparent,#00e676,transparent)] shadow-[0_0_14px_rgba(0,230,118,0.65)]" />
      </div>
      <motion.div
        {...fadeUp(play, 1.05, 14)}
        className="container-x flex flex-col items-center gap-[clamp(0.5rem,1.6svh,0.9rem)] py-[clamp(0.6rem,2.4svh,1.75rem)] text-[clamp(0.85rem,min(1.05vw,2svh),1.1rem)] lg:flex-row lg:justify-between"
      >
        <div className="flex items-center gap-3.5">
          <span aria-hidden className="flex h-[clamp(2.25rem,5.4svh,3.1rem)] w-[clamp(2.25rem,5.4svh,3.1rem)] shrink-0 items-center justify-center rounded-full border-2 border-[#00e676] font-display text-[1.25em] font-bold">
            A
          </span>
          <p>
            &copy; {year} {profile.name.toUpperCase()}. All Rights Reserved.
          </p>
        </div>
        <nav aria-label="Footer" className="flex flex-wrap items-center justify-center gap-x-[clamp(1rem,2.6vw,3rem)] gap-y-2">
          {navLinks.map((l) => (
            <a key={l.href} href={l.href} className="transition-colors hover:text-[#00e676]">
              {l.label}
            </a>
          ))}
          <span aria-hidden className="hidden h-7 w-px bg-white/20 sm:block" />
          <a
            href="#top"
            className="group inline-flex items-center gap-2 rounded-full border border-[#00e676] px-[1.3em] py-[0.55em] transition-[background-color,box-shadow] duration-300 hover:bg-[#00e676]/10 hover:shadow-[0_0_18px_rgba(0,230,118,0.35)]"
          >
            Back to Top
            <span aria-hidden className="transition-transform duration-500 ease-out-expo group-hover:-translate-y-0.5">&uarr;</span>
          </a>
        </nav>
      </motion.div>
    </div>
  );
});

/**
 * Footer scene: a giant white wordmark arrives first, then shrinks to a medium size as you
 * scroll while the footer details animate in above it. Only transform/opacity animate.
 * Scroll budget: 200svh (100svh to bring the footer up, 100svh pinned for the shrink).
 */
export function Footer() {
  const sceneRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: p } = useScroll({ target: sceneRef, offset: ["start end", "end end"] });

  // Wordmark: huge and pushed low at first (letters peek in from the bottom), then shrinks
  // into its resting place just above the bottom bar.
  const markScale = useTransform(p, [0.2, 0.85], [1.6, 1]);
  const markY = useTransform(p, [0.2, 0.85], ["8svh", "0svh"]);
  // The entrance plays once, as the wordmark is almost settled. Scrolling back up past that point
  // just fades the details away, so the growing wordmark never runs into them or replays them.
  const play = useInView(triggerRef, { once: true });
  const detailsOpacity = useTransform(p, [0.6, 0.68], [0, 1]);

  const year = new Date().getFullYear();

  return (
    <MotionConfig reducedMotion="user">
      <footer aria-label="Footer" className="relative z-10 bg-[#030303] text-white">
        <div ref={sceneRef} className="relative h-[200svh]">
          {/* Crosses the bottom of the screen at 68% of the scene's scroll progress */}
          <div ref={triggerRef} aria-hidden className="absolute inset-x-0 top-[136svh] h-px" />

          {/* overflow-clip, not hidden: focusing a link must not be able to scroll the off-screen arcs into view */}
          <div className="sticky top-0 flex h-[100svh] flex-col overflow-clip">
            <span aria-hidden className="footer-arc left-[-20vw] top-[-26.5vw]" />

            <motion.div
              style={{ opacity: detailsOpacity }}
              className="relative flex min-h-0 flex-1 flex-col justify-center pt-[clamp(1rem,var(--header-h),8svh)] short:max-sm:pt-1"
            >
              <Details play={play} />
            </motion.div>

            {/* Wordmark sits directly on top of the bottom bar, so a wrapped (taller) bar on phones never hides it */}
            <div className="flex flex-col">
              <div className="relative">
                {/* Anchored to the wordmark's bottom edge; the bottom bar paints over the rest of the circle */}
                <span aria-hidden className="footer-arc bottom-[-26.5vw] right-[-24vw]" />

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
              </div>

              <motion.div className="relative" style={{ opacity: detailsOpacity }}>
                <BottomBar play={play} year={year} />
              </motion.div>
            </div>
          </div>
        </div>
      </footer>
    </MotionConfig>
  );
}
