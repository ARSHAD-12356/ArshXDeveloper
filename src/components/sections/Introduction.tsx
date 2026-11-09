"use client";

import Image from "next/image";
import { Fragment, useRef, type ReactNode, type SVGProps } from "react";
import { motion, MotionConfig, useInView } from "framer-motion";
import { introduction, profileLinks } from "@/data/site";
import { EASE_OUT_EXPO } from "@/lib/utils";
import { useSiteReady } from "@/components/providers/Preloader";
import { BrandIcon } from "@/components/ui/BrandIcon";
import { ConstellationCanvas } from "@/components/ui/ConstellationCanvas";
import { ROLE_GRADIENT, RoleTypewriter } from "@/components/ui/RoleTypewriter";
import { ArrowUpRight, LayersIcon, RocketIcon } from "@/components/ui/Icons";

const GREEN = "#00d879";

/** ROLE_GRADIENT's colour at `t` (0-1). Letters lift on hover, which would drop them out of a parent's clipped gradient, so each carries its own colour. */
const roleGradientColor = (t: number) => {
  const [from, to, local] =
    t < 0.5 ? [[0, 210, 148], [0, 199, 133], t * 2] as const : [[0, 199, 133], [0, 197, 214], t * 2 - 1] as const;
  return `rgb(${from.map((c, i) => Math.round(c + (to[i] - c) * local)).join(" ")})`;
};

const fadeUp = (play: boolean, delay: number) => ({
  initial: { opacity: 0, y: 22 },
  animate: play ? { opacity: 1, y: 0 } : undefined,
  transition: { duration: 0.95, ease: EASE_OUT_EXPO, delay },
});

/**
 * Light "01 - Introduction" panel that rises over the pinned brand card. On phones and tablets
 * everything stacks and centres under a round portrait; from `lg` the portrait stands on the panel's bottom edge
 * at the right. Text entrances wait until the panel scrolls into view, as it's hidden until then.
 */
export function Introduction() {
  const ready = useSiteReady();
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, amount: 0.2 });
  const play = ready && inView;
  const { fullName, role, roles, heading, highlight, features, photo, resume } = introduction;

  return (
    <MotionConfig reducedMotion="user">
      <section
        ref={sectionRef}
        id="intro"
        data-header-theme="intro"
        aria-labelledby="intro-name"
        className="theme-light relative isolate min-h-[100svh] overflow-hidden rounded-b-[2rem] bg-[#fbfcfc] text-[#0a0a0a] md:rounded-b-[3rem]"
      >
        {/* Soft ambient glow behind the network, on the stacked layout only */}
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_26%_at_50%_17%,rgba(0,210,148,0.13),transparent),radial-gradient(45%_22%_at_0%_62%,rgba(0,197,214,0.07),transparent),radial-gradient(45%_22%_at_100%_78%,rgba(0,210,148,0.08),transparent)] lg:hidden" />
        <ConstellationCanvas className="pointer-events-none absolute inset-0 -z-10 h-full w-full" />

        <div className="container-x">
          <div className="flex min-h-[100svh] flex-col items-center justify-center px-2 pb-[clamp(1rem,3svh,2rem)] pt-[calc(var(--header-h)-0.5rem)] text-center sm:px-4 lg:max-w-[58%] lg:items-stretch lg:px-0 lg:pb-[3svh] lg:pt-[var(--header-h)] lg:text-left">
            <CircularPortrait play={play} src={photo} alt={`${fullName}, ${role}`} />

            <motion.p {...fadeUp(play, 0.1)} className="flex items-center gap-4 text-[0.72rem] font-bold uppercase tracking-[0.24em] lg:gap-5 lg:text-[clamp(0.7rem,1.95svh,0.86rem)]">
              <span className="font-mono tracking-normal" style={{ color: GREEN }}>01</span>
              <span className="h-px w-10 bg-black/20 lg:w-14" />
              <span className="text-[#3f4245]">Introduction</span>
            </motion.p>

            <motion.p
              {...fadeUp(play, 0.18)}
              className="mt-[clamp(0.7rem,2svh,1.5rem)] flex items-center gap-3.5 text-[0.95rem] font-semibold uppercase tracking-[0.36em] text-[#17191b] lg:mt-[clamp(1rem,4.6svh,2.5rem)] lg:text-[clamp(0.9rem,min(1.25vw,2.6svh),1.4rem)]"
            >
              <motion.span
                aria-hidden
                className="inline-block origin-[70%_80%] text-[1.55em] tracking-normal"
                initial={{ rotate: 0 }}
                animate={play ? { rotate: [0, 16, -8, 16, -4, 10, 0] } : undefined}
                transition={{ duration: 2.2, ease: "easeInOut", delay: 0.9 }}
              >
                👋
              </motion.span>
              Hello, I&apos;m
            </motion.p>

            <h1
              id="intro-name"
              className="mt-2 font-display text-[clamp(2.2rem,11vw,5rem)] font-bold leading-[1.04] tracking-[-0.045em] lg:mt-[clamp(0.2rem,1svh,0.6rem)] lg:text-[clamp(2.8rem,min(4.75vw,9.9svh),6.4rem)]"
            >
              <span className="sr-only">{fullName}, {role}</span>
              <NameReveal play={play} text={fullName} delay={0.25} />
            </h1>

            <motion.p
              {...fadeUp(play, 0.42)}
              className="mt-2 whitespace-nowrap font-display text-[clamp(1.15rem,5.6vw,2.5rem)] font-bold leading-[1.15] tracking-[-0.035em] lg:mt-[clamp(0.3rem,1.5svh,0.9rem)] lg:text-[clamp(1.35rem,min(2.1vw,4.4svh),2.8rem)]"
            >
              <span className="sr-only">I Am {role}</span>
              <span aria-hidden>
                I Am <RoleTypewriter roles={roles} play={play} startDelay={1000} />
              </span>
            </motion.p>

            {/* The supporting headline belongs to the two-column layout only. */}
            <h2 className="mt-[clamp(1rem,5svh,2.6rem)] hidden font-display font-bold leading-[1.17] tracking-[-0.035em] lg:block lg:text-[clamp(1.25rem,min(2vw,4.15svh),2.65rem)]">
              <MaskLine play={play} delay={0.48}>
                <Letters text={heading[0]} />
              </MaskLine>
              <MaskLine play={play} delay={0.58}>
                <Letters text={heading[1]} />{" "}
                <Letters text={highlight.slice(0, -1)} gradient />
                {highlight.slice(-1)}
              </MaskLine>
            </h2>

            <motion.ul {...fadeUp(play, 0.64)} className="mt-[clamp(0.8rem,2svh,1.5rem)] flex items-center justify-center gap-2.5 lg:mt-[clamp(0.7rem,3.2svh,1.7rem)] lg:justify-start lg:gap-[clamp(0.55rem,0.8vw,0.8rem)]">
              {profileLinks.map((s) => (
                <li key={s.key}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-black/10 bg-white text-[#17191b] shadow-[0_8px_22px_-14px_rgba(0,0,0,0.25)] transition-[translate,color,border-color,background-color] duration-500 ease-out-expo hover:-translate-y-0.5 hover:border-[#00d879] hover:bg-[#00d879]/10 hover:text-[#00b865] lg:h-[clamp(2.3rem,5.4svh,2.9rem)] lg:w-[clamp(2.3rem,5.4svh,2.9rem)]"
                  >
                    <BrandIcon name={s.key} size={18} />
                  </a>
                </li>
              ))}
            </motion.ul>

            <ul className="mt-[clamp(1rem,2.6svh,2rem)] grid w-full grid-cols-3 lg:mt-[clamp(0.9rem,3.8svh,2.2rem)] lg:flex lg:items-center">
              {features.map((label, i) => {
                const Icon = FEATURE_ICONS[i];
                return (
                  <motion.li
                    key={label}
                    {...fadeUp(play, 0.72 + i * 0.08)}
                    className="group relative flex flex-col items-center gap-2.5 px-1 text-center lg:flex-row lg:gap-[clamp(0.55rem,0.8vw,0.8rem)] lg:px-[clamp(0.7rem,1.9vw,2.1rem)] lg:text-left lg:first:pl-0"
                  >
                    {i > 0 && <span aria-hidden className="absolute left-0 top-1/2 h-14 w-px -translate-y-1/2 bg-black/10 lg:h-6" />}
                    <span
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#00d879]/10 transition-transform duration-500 ease-out-expo group-hover:-translate-y-0.5 group-hover:scale-105 lg:h-[clamp(2.3rem,5.4svh,2.9rem)] lg:w-[clamp(2.3rem,5.4svh,2.9rem)]"
                      style={{ color: GREEN }}
                    >
                      <Icon size={22} />
                    </span>
                    <span className="w-min text-[0.9rem] font-semibold leading-[1.2] tracking-[-0.01em] lg:w-auto lg:whitespace-nowrap lg:text-[clamp(0.85rem,min(1vw,2.1svh),1.15rem)]">
                      {label}
                    </span>
                  </motion.li>
                );
              })}
            </ul>

            <motion.div
              {...fadeUp(play, 0.96)}
              className="mt-[clamp(1rem,2.8svh,2.25rem)] flex w-full flex-col gap-3 sm:flex-row sm:justify-center sm:gap-4 lg:justify-start lg:mt-[clamp(1rem,4.2svh,2.4rem)] lg:gap-[clamp(1rem,2vw,2.2rem)]"
            >
              <a
                href="#work"
                className="group relative inline-flex h-14 w-full items-center justify-center gap-3 overflow-hidden rounded-full border-[1.5px] border-[#00d879] bg-[#06100b] px-8 text-base font-semibold text-white shadow-[0_12px_28px_-12px_rgba(0,216,121,0.7)] transition-[translate,box-shadow] duration-500 ease-out-expo hover:-translate-y-0.5 hover:shadow-[0_18px_36px_-12px_rgba(0,216,121,0.9)] sm:w-auto lg:h-[clamp(2.9rem,7.1svh,3.9rem)] lg:px-[clamp(1.8rem,2.5vw,2.8rem)]"
              >
                View My Work
                <ArrowUpRight size={18} className="transition-transform duration-500 ease-out-expo group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>
              <a
                href={resume}
                download="ArshXCoder-Resume.pdf"
                className="group inline-flex h-14 w-full items-center justify-center gap-3 rounded-full border border-black/15 bg-white px-8 text-base font-semibold text-[#0a0a0a] shadow-[0_8px_22px_-14px_rgba(0,0,0,0.25)] transition-[translate,border-color] duration-500 ease-out-expo hover:-translate-y-0.5 hover:border-black/45 sm:w-auto lg:h-[clamp(2.9rem,7.1svh,3.9rem)] lg:px-[clamp(1.8rem,2.5vw,2.8rem)]"
              >
                <DownloadIcon size={19} className="transition-transform duration-500 ease-out-expo group-hover:translate-y-0.5" />
                Download Resume
              </a>
            </motion.div>
          </div>
        </div>

        <Portrait src={photo} alt={`${fullName}, ${role}`} />
      </section>
    </MotionConfig>
  );
}

/** The same entrance as the ARSHXCODER title: each letter fades up in turn, with the dot as the last one. */
function NameReveal({ text, delay, play }: { text: string; delay: number; play: boolean }) {
  const letters = text.split("");
  const reveal = (i: number) => ({
    initial: { opacity: 0, y: 44 },
    animate: play ? { opacity: 1, y: 0 } : undefined,
    transition: { duration: 1.2, ease: EASE_OUT_EXPO, delay: delay + i * 0.035 },
  });
  return (
    <span aria-hidden className="block whitespace-nowrap pb-[0.1em]">
      {letters.map((char, i) => (
        <motion.span key={i} {...reveal(i)} className="inline-block whitespace-pre">
          {char}
        </motion.span>
      ))}
      <motion.span
        {...reveal(letters.length)}
        className="ml-[0.05em] inline-block h-[0.16em] w-[0.16em] rounded-full shadow-[0_0_0.2em_rgba(0,216,121,0.55)]"
        style={{ backgroundColor: GREEN }}
      />
    </span>
  );
}

/** Same reveal as the hero headline: each line rises out of an overflow mask. */
function MaskLine({ children, delay, play }: { children: ReactNode; delay: number; play: boolean }) {
  return (
    <span aria-hidden className="block overflow-hidden pb-[0.1em]">
      <motion.span
        className="block"
        initial={{ y: "105%" }}
        animate={play ? { y: "0%" } : undefined}
        transition={{ duration: 1.2, ease: EASE_OUT_EXPO, delay }}
      >
        {children}
      </motion.span>
    </span>
  );
}

/** Splits text into hoverable letters, keeping each word unbreakable so lines wrap cleanly. */
function Letters({ text, gradient = false }: { text: string; gradient?: boolean }) {
  const words = text.split(" ");
  let offset = 0;
  return words.map((word, i) => {
    const start = offset;
    offset += word.length + 1;
    return (
      <Fragment key={i}>
        <span className="inline-block whitespace-nowrap">
          {word.split("").map((char, j) => (
            <span
              key={j}
              style={gradient ? { color: roleGradientColor((start + j) / (text.length - 1)) } : undefined}
              className="inline-block origin-bottom transition-[translate,scale] duration-300 ease-out-expo hover:-translate-y-[0.05em] hover:scale-y-[1.08]"
            >
              {char}
            </span>
          ))}
        </span>
        {i < words.length - 1 && " "}
      </Fragment>
    );
  });
}

/** Phones and tablets: the same photo in a round frame at the top of the stacked layout, ringed with the role text's gradient. */
function CircularPortrait({ src, alt, play }: { src: string; alt: string; play: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.94 }}
      animate={play ? { opacity: 1, scale: 1 } : undefined}
      transition={{ duration: 0.95, ease: EASE_OUT_EXPO, delay: 0.05 }}
      className={`${ROLE_GRADIENT} mb-[clamp(0.9rem,2.4svh,1.75rem)] h-[clamp(11rem,min(53vw,26svh),20rem)] w-[clamp(11rem,min(53vw,26svh),20rem)] shrink-0 rounded-full p-[clamp(4px,1.1vw,7px)] shadow-[0_14px_44px_-10px_rgba(0,210,148,0.5)] lg:hidden`}
    >
      <div className="h-full w-full rounded-full bg-white p-[clamp(3px,0.9vw,5px)]">
        <Image
          src={src}
          alt={alt}
          width={432}
          height={577}
          priority
          // Served byte for byte: the photo must not be re-encoded or altered.
          unoptimized
          className="h-full w-full rounded-full bg-[#e6e9ee] object-cover object-top"
        />
      </div>
    </motion.div>
  );
}

/**
 * Shown exactly as supplied. Slides in from the right edge as a short, GPU-only move once enough of
 * its place is on screen, so it doesn't depend on how far or how evenly the page is scrolled.
 */
function Portrait({ src, alt }: { src: string; alt: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.25 });

  return (
    <div
      ref={ref}
      className="hidden aspect-[432/577] lg:absolute lg:bottom-0 lg:right-[max(2.5vw,calc((100vw-1600px)/2+2.5vw))] lg:block lg:w-[min(63.5svh,31vw)] xl:w-[min(63.5svh,38vw)]"
    >
      <motion.div
        initial={{ x: "115%", opacity: 0 }}
        animate={inView ? { x: "0%", opacity: 1 } : undefined}
        transition={{ x: { duration: 0.85, ease: EASE_OUT_EXPO }, opacity: { duration: 0.35, ease: "easeOut" } }}
        className="h-full w-full will-change-transform"
      >
        <Image
          src={src}
          alt={alt}
          width={432}
          height={577}
          priority
          // Served byte for byte: the photo must not be re-encoded or altered.
          unoptimized
          className="h-full w-full object-contain object-bottom"
        />
      </motion.div>
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
