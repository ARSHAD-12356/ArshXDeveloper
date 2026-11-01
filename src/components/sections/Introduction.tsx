"use client";

import Image from "next/image";
import { Fragment, type ReactNode, type SVGProps } from "react";
import { motion, MotionConfig } from "framer-motion";
import { introduction } from "@/data/site";
import { cn, EASE_OUT_EXPO } from "@/lib/utils";
import { useSiteReady } from "@/components/providers/Preloader";
import { ArrowUpRight, CodeIcon, LayersIcon, RocketIcon } from "@/components/ui/Icons";

const MINT = "#1fcf8a";

const fadeUp = (ready: boolean, delay: number) => ({
  initial: { opacity: 0, y: 24 },
  animate: ready ? { opacity: 1, y: 0 } : undefined,
  transition: { duration: 1, ease: EASE_OUT_EXPO, delay },
});

/**
 * Light "01 - Introduction" panel that sits above the dark pinned hero.
 * Headline text reuses the hero's masked slide-up reveal and per-letter hover lift.
 */
export function Introduction() {
  const ready = useSiteReady();
  const { fullName, role, heading, highlight, description, features, photo, resume } = introduction;

  return (
    <MotionConfig reducedMotion="user">
      <section
        id="intro"
        data-header-theme="intro"
        aria-labelledby="intro-name"
        className="theme-light relative isolate overflow-hidden rounded-b-[2rem] bg-white text-[#0a0a0a] md:rounded-b-[3rem] lg:flex lg:min-h-[100svh] lg:items-center"
      >
        <Backdrop />

        <div className="container-x grid w-full items-center gap-12 pb-16 pt-[calc(var(--header-h)+1.5rem)] lg:grid-cols-[1.12fr_0.88fr] lg:gap-6 lg:pb-8 lg:pt-[var(--header-h)] xl:pl-[clamp(1rem,5vw,6rem)]">
          {/* ---------- Content ---------- */}
          <div className="relative min-w-0">
            <motion.p {...fadeUp(ready, 0.15)} className="flex items-center gap-5 text-[0.8rem] font-bold uppercase tracking-[0.3em] short:text-[0.7rem]">
              <span className="font-mono tracking-normal" style={{ color: MINT }}>01</span>
              <span className="h-px w-12 bg-black/20" />
              <span className="text-[#3a3a3a]">Introduction</span>
            </motion.p>

            <motion.p
              {...fadeUp(ready, 0.25)}
              className="mt-[clamp(1.5rem,4.5svh,2.75rem)] flex items-center gap-3 text-[clamp(0.95rem,1.25vw,1.25rem)] font-semibold uppercase tracking-[0.3em] text-[#2b2b2b]"
            >
              <motion.span
                aria-hidden
                className="inline-block origin-[70%_80%] text-[1.5em] tracking-normal"
                animate={{ rotate: [0, 16, -8, 16, -4, 10, 0] }}
                transition={{ duration: 2.2, ease: "easeInOut", delay: 1.2, repeat: Infinity, repeatDelay: 3 }}
              >
                👋
              </motion.span>
              Hello, I&apos;m
            </motion.p>

            <h1
              id="intro-name"
              className="mt-2 font-display text-[clamp(2.6rem,5.2vw,5.4rem)] font-bold leading-[1.02] tracking-[-0.035em] short:text-[clamp(2.4rem,4.4vw,4.4rem)]"
            >
              <span className="sr-only">{fullName}, {role}</span>
              <MaskLine delay={0.3}>
                <Letters text={fullName} hoverClass="hover:text-[#1fcf8a]" />
                <span className="inline-block" style={{ color: "#18c964" }}>.</span>
              </MaskLine>
            </h1>

            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={ready ? { opacity: 1, scale: 1 } : undefined}
              transition={{ duration: 1, ease: EASE_OUT_EXPO, delay: 0.55 }}
              className="mt-[clamp(0.75rem,2svh,1.25rem)] inline-flex origin-left items-center gap-3 rounded-full border-2 bg-white/70 px-6 py-2.5 shadow-[0_8px_30px_-14px_rgba(31,207,138,0.6)] backdrop-blur-sm short:py-2"
              style={{ borderColor: "#5fe0ad" }}
            >
              <CodeIcon size={22} style={{ color: MINT }} />
              <span className="text-[clamp(1.05rem,1.35vw,1.4rem)] font-semibold tracking-[-0.01em]">{role}</span>
            </motion.div>

            <h2 className="mt-[clamp(1.25rem,3.6svh,2.25rem)] max-w-[44rem] font-display text-[clamp(1.45rem,2.15vw,2.3rem)] font-bold leading-[1.2] tracking-[-0.02em] short:text-[clamp(1.35rem,1.85vw,1.95rem)]">
              <MaskLine delay={0.5}>
                <Letters text={heading[0]} hoverClass="hover:text-[#1fcf8a]" />
              </MaskLine>
              <MaskLine delay={0.62}>
                <Letters text={heading[1]} hoverClass="hover:text-[#1fcf8a]" />{" "}
                <span className="relative inline-block whitespace-nowrap" style={{ color: MINT }}>
                  <motion.span
                    aria-hidden
                    className="absolute inset-x-0 bottom-[0.08em] -z-10 h-[0.32em] origin-left rounded-full"
                    style={{ backgroundColor: "rgba(31,207,138,0.16)" }}
                    initial={{ scaleX: 0 }}
                    animate={ready ? { scaleX: 1 } : undefined}
                    transition={{ duration: 1.1, ease: EASE_OUT_EXPO, delay: 1.35 }}
                  />
                  <Letters text={highlight} hoverClass="hover:text-[#0a0a0a]" />
                </span>
              </MaskLine>
            </h2>

            <motion.p
              {...fadeUp(ready, 0.8)}
              className="mt-[clamp(1rem,2.6svh,1.6rem)] max-w-[42rem] text-[clamp(1rem,1.2vw,1.22rem)] leading-[1.6] text-[#555] short:leading-[1.5]"
            >
              {description}
            </motion.p>

            <ul className="mt-[clamp(1.25rem,3.4svh,2.25rem)] flex flex-wrap items-center gap-x-7 gap-y-4">
              {features.map((label, i) => {
                const Icon = FEATURE_ICONS[i];
                return (
                  <motion.li key={label} {...fadeUp(ready, 0.9 + i * 0.08)} className="flex items-center gap-7">
                    {i > 0 && <span aria-hidden className="hidden h-6 w-px bg-black/20 sm:block" />}
                    <span className="group flex items-center gap-3">
                      <span
                        className="flex h-11 w-11 items-center justify-center rounded-full transition-transform duration-500 ease-out-expo group-hover:-translate-y-0.5 group-hover:scale-110 short:h-10 short:w-10"
                        style={{ backgroundColor: "rgba(31,207,138,0.1)", color: MINT }}
                      >
                        <Icon size={22} />
                      </span>
                      <span className="text-[clamp(0.95rem,1.05vw,1.06rem)] font-semibold tracking-[-0.01em]">{label}</span>
                    </span>
                  </motion.li>
                );
              })}
            </ul>

            <motion.div {...fadeUp(ready, 1.1)} className="mt-[clamp(1.5rem,4.4svh,2.75rem)] flex flex-wrap items-center gap-4 sm:gap-8">
              <a
                href="#work"
                className="group relative inline-flex h-[3.6rem] items-center gap-3 overflow-hidden rounded-full border-2 bg-[#06100b] px-9 text-[1.05rem] font-semibold text-white shadow-[0_14px_34px_-14px_rgba(31,207,138,0.75)] transition-[translate,box-shadow] duration-500 ease-out-expo hover:-translate-y-0.5 hover:shadow-[0_20px_44px_-14px_rgba(31,207,138,0.95)] short:h-[3.2rem]"
                style={{ borderColor: MINT }}
              >
                <span
                  aria-hidden
                  className="absolute inset-y-0 -left-1/2 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/25 to-transparent transition-[left] duration-700 ease-out-expo group-hover:left-[120%]"
                />
                View My Work
                <ArrowUpRight size={18} className="transition-transform duration-500 ease-out-expo group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>
              <a
                href={resume}
                download
                className="group inline-flex h-[3.6rem] items-center gap-3 rounded-full border border-black/25 bg-white px-9 text-[1.05rem] font-semibold text-[#0a0a0a] transition-[translate,border-color,background-color] duration-500 ease-out-expo hover:-translate-y-0.5 hover:border-black/60 hover:bg-[#f2fcf7] short:h-[3.2rem]"
              >
                <DownloadIcon size={19} className="transition-transform duration-500 ease-out-expo group-hover:translate-y-0.5" />
                Download Resume
              </a>
            </motion.div>
          </div>

          {/* ---------- Portrait ---------- */}
          <div className="order-first flex justify-center lg:order-none lg:justify-end lg:pr-[4%]">
            <Portrait src={photo} alt={`${fullName}, ${role}`} />
          </div>
        </div>
      </section>
    </MotionConfig>
  );
}

/** Same reveal as the hero headline: each line rises out of an overflow mask. */
function MaskLine({ children, delay }: { children: ReactNode; delay: number }) {
  const ready = useSiteReady();
  return (
    <span aria-hidden className="block overflow-hidden pb-[0.1em]">
      <motion.span
        className="block"
        initial={{ y: "105%" }}
        animate={ready ? { y: "0%" } : undefined}
        transition={{ duration: 1.3, ease: EASE_OUT_EXPO, delay }}
      >
        {children}
      </motion.span>
    </span>
  );
}

/** Splits text into hoverable letters, keeping each word unbreakable so lines wrap cleanly. */
function Letters({ text, hoverClass }: { text: string; hoverClass: string }) {
  const words = text.split(" ");
  return words.map((word, i) => (
    <Fragment key={i}>
      <span className="inline-block whitespace-nowrap">
        {word.split("").map((char, j) => (
          <span
            key={j}
            className={cn(
              "inline-block origin-bottom transition-[translate,scale,color] duration-300 ease-out-expo hover:-translate-y-[0.06em] hover:scale-y-[1.12]",
              hoverClass,
            )}
          >
            {char}
          </span>
        ))}
      </span>
      {i < words.length - 1 && " "}
    </Fragment>
  ));
}

function Portrait({ src, alt }: { src: string; alt: string }) {
  const ready = useSiteReady();
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92 }}
      animate={ready ? { opacity: 1, scale: 1 } : undefined}
      transition={{ duration: 1.4, ease: EASE_OUT_EXPO, delay: 0.35 }}
      className="relative aspect-square w-[min(78vw,360px)] sm:w-[min(60vw,420px)] lg:w-[min(32vw,560px,calc(100svh-290px))]"
    >
      {/* Soft glow */}
      <div
        aria-hidden
        className="absolute -inset-[16%] -z-10 rounded-full blur-2xl"
        style={{ background: "radial-gradient(circle, rgba(31,207,138,0.22) 0%, rgba(31,207,138,0.06) 45%, transparent 70%)" }}
      />

      {/* Outer faint ring, gently floating */}
      <motion.div
        aria-hidden
        className="absolute -inset-[8%] rounded-full border"
        style={{ borderColor: "rgba(31,207,138,0.18)" }}
        animate={{ scale: [1, 1.015, 1] }}
        transition={{ duration: 6, ease: "easeInOut", repeat: Infinity }}
      />

      {/* Accent ring with an orbiting node */}
      <motion.div
        aria-hidden
        className="absolute -inset-[2.5%] rounded-full border-[3px]"
        style={{ borderColor: "#3ddba0" }}
        animate={{ rotate: [0, 22, 0] }}
        transition={{ duration: 9, ease: "easeInOut", repeat: Infinity }}
      >
        <span
          className="absolute left-[85.4%] top-[14.6%] flex h-[6.5%] w-[6.5%] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-[3px] bg-white shadow-[0_0_18px_rgba(31,207,138,0.6)]"
          style={{ borderColor: MINT }}
        >
          <span className="h-[38%] w-[38%] rounded-full" style={{ backgroundColor: MINT }} />
        </span>
      </motion.div>

      {/* Thin inner ring */}
      <div aria-hidden className="absolute inset-[1.2%] rounded-full border" style={{ borderColor: "rgba(31,207,138,0.25)" }} />

      {/* Photo disc */}
      <div
        className="absolute inset-[2.5%] overflow-hidden rounded-full bg-[#fdfbed]"
      >
        <Image
          src={src}
          alt={alt}
          fill
          priority
          sizes="(min-width: 1024px) 560px, 80vw"
          className="object-cover object-[50%_0%]"
        />
      </div>

      {/* Floating availability badge */}
      <motion.div
        initial={{ opacity: 0, x: 24 }}
        animate={ready ? { opacity: 1, x: 0 } : undefined}
        transition={{ duration: 1, ease: EASE_OUT_EXPO, delay: 1.1 }}
        className="absolute bottom-[4%] right-[-8%] sm:right-[-10%] lg:right-[-6%]"
      >
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 4.5, ease: "easeInOut", repeat: Infinity }}
          className="flex items-center gap-3 rounded-[1.6rem] border border-white bg-white/90 px-4 py-3 shadow-[0_18px_40px_-16px_rgba(10,40,25,0.35)] backdrop-blur-md sm:gap-4 sm:px-6 sm:py-3.5"
        >
          <span className="relative flex h-4 w-4 sm:h-5 sm:w-5">
            <span className="absolute inline-flex h-full w-full animate-pulse-ring rounded-full [animation-duration:2.6s]" style={{ backgroundColor: "#22d07a" }} />
            <span className="relative inline-flex h-full w-full rounded-full shadow-[0_0_14px_2px_rgba(34,208,122,0.55)]" style={{ backgroundColor: "#22d07a" }} />
          </span>
          <span className="text-[0.78rem] font-bold uppercase leading-[1.15] tracking-[0.04em] text-[#0a0a0a] sm:text-[0.98rem]">
            Available
            <br />
            for work
          </span>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

function Backdrop() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_78%_45%,rgba(31,207,138,0.08),transparent_55%),radial-gradient(ellipse_at_10%_100%,rgba(31,207,138,0.07),transparent_45%)]" />
      {/* Large thin arcs */}
      <div className="absolute -right-[22vw] -top-[52vw] h-[78vw] w-[78vw] rounded-full border" style={{ borderColor: "rgba(31,207,138,0.22)" }} />
      <div className="absolute -right-[30vw] -top-[60vw] h-[94vw] w-[94vw] rounded-full border" style={{ borderColor: "rgba(31,207,138,0.08)" }} />
      <div
        className="absolute -bottom-[22vw] -left-[20vw] h-[34vw] w-[34vw] rounded-full border"
        style={{ borderColor: "rgba(31,207,138,0.22)", background: "radial-gradient(circle at 70% 30%, rgba(31,207,138,0.07), transparent 65%)" }}
      />
    </div>
  );
}

/* ---------- Icons (match the site's 1.6 stroke style) ---------- */
type IconProps = SVGProps<SVGSVGElement> & { size?: number };

const icon = (size = 20): SVGProps<SVGSVGElement> => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
});

const LaptopIcon = ({ size, ...p }: IconProps) => (
  <svg {...icon(size)} {...p}><rect x="4" y="5" width="16" height="11" rx="1.5" /><path d="M2 19h20" /></svg>
);
const DownloadIcon = ({ size, ...p }: IconProps) => (
  <svg {...icon(size)} {...p}><path d="M12 4v11M7 10l5 5 5-5M5 20h14" /></svg>
);

const FEATURE_ICONS = [LaptopIcon, LayersIcon, RocketIcon];
