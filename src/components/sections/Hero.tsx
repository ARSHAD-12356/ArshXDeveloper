"use client";

import { motion, useMotionValue, useTransform, type MotionValue } from "framer-motion";
import { profile, socials } from "@/data/site";
import { EASE_OUT_EXPO } from "@/lib/utils";
import { ArrowUpRight } from "@/components/ui/Icons";

interface HeroProps {
  /** 0 -> 1 while the next section slides up over the pinned hero. */
  coverProgress?: MotionValue<number>;
}

export function Hero({ coverProgress }: HeroProps) {
  const fallback = useMotionValue(0);
  const progress = coverProgress ?? fallback;
  // The hero stays pinned; its content recedes (slower than the page) while the next panel covers it.
  const y = useTransform(progress, [0, 1], ["0%", "-12%"]);
  const scale = useTransform(progress, [0, 1], [1, 0.88]);
  const opacity = useTransform(progress, [0, 0.9], [1, 0.25]);
  const shade = useTransform(progress, [0, 1], [0, 0.7]);

  return (
    <section
      id="top"
      aria-label="Introduction"
      className="sticky top-0 isolate flex h-[100svh] min-h-[540px] flex-col overflow-hidden pb-6 pt-[calc(var(--header-h)+1rem)] md:pb-10 md:pt-[calc(var(--header-h)+1.75rem)]"
    >
      {/* Darkens the pinned hero as the next section slides over it */}
      <motion.div aria-hidden style={{ opacity: shade }} className="pointer-events-none absolute inset-0 z-20 bg-black will-change-[opacity]" />
      {/* Ambient glows under the cursor splash (promoted to GPU layer) */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden transform-gpu">
        <div className="absolute -left-[10%] top-[10%] h-[50vmax] w-[50vmax] rounded-full bg-accent-2/10 blur-[80px]" />
        <div className="absolute -right-[15%] bottom-[-20%] h-[45vmax] w-[45vmax] rounded-full bg-accent/[0.07] blur-[80px]" />
      </div>

      <motion.div style={{ y, opacity, scale }} className="container-x relative flex h-full flex-col justify-between origin-bottom-left will-change-[transform,opacity]">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: EASE_OUT_EXPO, delay: 0.2 }}
          className="flex flex-wrap items-center gap-3 text-label text-muted"
        >
          <span className="font-mono text-accent">{"//"}</span>
          {profile.role}
          <span className="h-px w-8 bg-line-strong" />
          {profile.tagline}
        </motion.p>

        <h1 className="font-display text-hero max-sm:text-[14.4vw] max-sm:leading-[1.04] my-auto origin-left font-bold uppercase transform scale-x-[1.08] sm:scale-x-[1.16]">
          <span className="sr-only">
            {profile.headline.join(" ")} - {profile.name}, {profile.role}
          </span>
          {profile.headline.map((line, i) => (
            <span key={line} aria-hidden className="block overflow-hidden pb-[0.04em]">
              <motion.span
                className="block"
                initial={{ y: "105%" }}
                animate={{ y: "0%" }}
                transition={{ duration: 1.3, ease: EASE_OUT_EXPO, delay: 0.25 + i * 0.12 }}
              >
                {line.split("").map((char, j) =>
                  char === " " ? (
                    <span key={j}>&nbsp;</span>
                  ) : (
                    <span
                      key={j}
                      className="inline-block origin-bottom transition-[translate,scale,color] duration-300 ease-out-expo hover:-translate-y-[0.04em] hover:scale-y-[1.12] hover:text-accent"
                    >
                      {char}
                    </span>
                  ),
                )}
              </motion.span>
            </span>
          ))}
        </h1>

        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: EASE_OUT_EXPO, delay: 0.7 }}
            className="max-w-md text-sm font-semibold uppercase leading-relaxed tracking-wide text-fg/90 md:text-[0.95rem]"
          >
            {profile.intro}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: EASE_OUT_EXPO, delay: 0.9 }}
            className="flex items-center gap-6 self-end md:self-auto"
          >
            <a
              href="#work"
              className="group hidden items-center gap-3 rounded-full border border-line-strong px-6 py-4 text-sm font-medium transition-colors hover:border-white hover:bg-white hover:text-ink sm:flex"
            >
              View Projects
              <ArrowUpRight size={16} className="rotate-90 transition-transform group-hover:translate-y-0.5" />
            </a>
            <ContactBadge />
          </motion.div>
        </div>
      </motion.div>

      {/* Vertical social rail */}
      <motion.nav
        aria-label="Social"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, ease: EASE_OUT_EXPO, delay: 1 }}
        className="absolute right-[clamp(1rem,2.5vw,2.5rem)] top-1/2 hidden -translate-y-1/2 flex-col items-center gap-6 lg:flex"
      >
        <span className="h-16 w-px bg-line-strong" />
        {socials
          .filter((s) => s.key !== "fiverr")
          .map((s) => (
            <a
              key={s.key}
              href={s.href}
              target={s.key === "email" ? undefined : "_blank"}
              rel="noopener noreferrer"
              className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted transition-colors [writing-mode:vertical-rl] hover:text-accent"
            >
              {s.label}
            </a>
          ))}
        <span className="h-16 w-px bg-line-strong" />
      </motion.nav>

      <motion.div
        aria-hidden
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-dim md:flex"
      >
        Scroll
        <span className="relative h-10 w-px overflow-hidden bg-line">
          <motion.span
            className="absolute inset-x-0 top-0 h-1/2 bg-fg"
            animate={{ y: ["-100%", "200%"] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          />
        </span>
      </motion.div>
    </section>
  );
}

/**
 * Rotating circular "Get in touch" call to action.
 * Fixed in place (no magnetic pull). On hover the inner disc spins while it grows
 * to fill the space inside the text ring, then spins back down on leave.
 */
function ContactBadge() {
  const text = "Get in touch \u2022 Get in touch \u2022 ";
  return (
    <a
      href="#contact"
      aria-label="Get in touch"
      className="group relative flex h-28 w-28 shrink-0 items-center justify-center rounded-full md:h-32 md:w-32"
    >
      <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full animate-spin-slow" aria-hidden>
        <defs>
          <path id="badge-circle" d="M50,50 m-38,0 a38,38 0 1,1 76,0 a38,38 0 1,1 -76,0" />
        </defs>
        <circle cx="50" cy="50" r="49" fill="none" stroke="rgba(255,255,255,.18)" strokeWidth=".6" />
        <text className="fill-fg text-[9.4px] font-semibold uppercase tracking-[0.18em]">
          <textPath href="#badge-circle">{text}</textPath>
        </text>
      </svg>

      {/* Spinner arc that sweeps outward ahead of the fill */}
      <span
        aria-hidden
        className="absolute h-12 w-12 rounded-full border-2 border-fg border-b-transparent border-l-transparent opacity-0 transition-[scale,rotate,opacity] duration-700 ease-out-expo group-hover:rotate-[540deg] group-hover:scale-[1.55] group-hover:opacity-100 md:h-14 md:w-14"
      />

      {/* White disc: grows from its small size to fill the inner area while rotating */}
      <span className="relative flex h-12 w-12 items-center justify-center rounded-full bg-fg text-ink transition-[scale,rotate] delay-75 duration-700 ease-out-expo group-hover:rotate-[360deg] group-hover:scale-[1.5] md:h-14 md:w-14">
        <ArrowUpRight size={20} className="transition-[rotate] duration-700 ease-out-expo group-hover:rotate-45" />
      </span>
    </a>
  );
}