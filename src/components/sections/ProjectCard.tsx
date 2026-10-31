"use client";

import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useEffect, useRef } from "react";
import type { Project } from "@/types";
import { LiveProductMenu } from "@/components/ui/LiveProductMenu";
import { Media } from "@/components/ui/Media";
import { ArrowUpRight } from "@/components/ui/Icons";
import {
  siMongodb,
  siNodedotjs,
  siRazorpay,
  siReact,
  siShopify,
  siTailwindcss,
} from "simple-icons";
import { ProcessOrbit } from "./ProcessOrbit";
import { ViewAllProjectsButton } from "@/components/ui/ViewAllProjectsButton";

interface ProjectCardProps {
  project: Project;
  index: number;
  total: number;
  /** Scroll progress of the whole stack (0..1). */
  progress: MotionValue<number>;
  /** Slice of `progress` during which this card scales down. */
  range: [number, number];
  targetScale: number;
  /** 0 -> 1 after the last card: every card shrinks into the centre while the process ring turns in. */
  finale: MotionValue<number>;
}

export function ProjectCard({ project, index, total, progress, range, targetScale, finale }: ProjectCardProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLElement>(null);
  const borderRef = useRef<HTMLSpanElement>(null);
  const goldRef = useRef<HTMLSpanElement>(null);
  // Borders keep spinning on every card that is on screen (including cards peeking out
  // behind the stack) and pause only when the card leaves the viewport. The spin is a
  // GPU rotate, so running several at once costs no repaints. No React renders involved.
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => {
      const paused = String(!entry.isIntersecting);
      if (borderRef.current) borderRef.current.dataset.paused = paused;
      if (goldRef.current) goldRef.current.dataset.paused = paused;
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);


  // Recede as later cards stack on top.
  const scale = useTransform(progress, range, [1, targetScale]);
  const isLast = index === total - 1;
  const dim = useTransform(progress, range, [0, isLast ? 0 : 0.55]);

  // Finale: all cards shrink together toward the viewport centre, then fade out.
  const finaleScale = useTransform(finale, [0, 0.7], [1, 0.04]);
  const finaleOpacity = useTransform(finale, [0.55, 0.72], [1, 0]);
  const finalePointer = useTransform(finale, (v) => (v > 0.55 ? "none" : "auto"));

  const primary = project.links[0];
  const num = String(index + 1).padStart(3, "0");

  return (
    <div ref={wrapRef} className="sticky top-0 h-[80svh]">
      <motion.div
        style={{ scale: finaleScale, opacity: finaleOpacity, pointerEvents: finalePointer }}
        className="absolute inset-x-0 top-0 flex flex-col items-center justify-start h-[100svh] px-[clamp(0.75rem,3vw,4rem)] pt-[7svh] will-change-transform"
      >
      <motion.article
        ref={cardRef}
        aria-labelledby={`${project.id}-title`}
        style={{ scale, top: `${index * 26}px`, ["--glow" as string]: project.accent }}
        className="glow-card relative flex h-[min(80svh,860px)] will-change-transform w-full max-w-[1240px] origin-top flex-col overflow-hidden rounded-[22px] bg-ink-2 shadow-[0_-30px_80px_-20px_rgba(0,0,0,0.9)] md:h-[min(78svh,820px)] md:flex-row md:rounded-[32px]"
      >
        {/* Continuously rotating gradient border */}
        <span aria-hidden className="gradient-ring z-[25]">
          <span ref={borderRef} data-paused="true" className="gradient-ring-spin" />
        </span>

        {/* Media */}
        <a
          href={primary?.href ?? "#"}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Open ${project.title}`}
          className="group relative order-1 flex h-[42%] shrink-0 items-center justify-center p-4 sm:p-6 md:order-2 md:h-auto md:flex-[1.45] md:p-8 md:pl-2 overflow-hidden"
        >
          <div
            style={{
              aspectRatio:
                project.media?.type === "image" && project.media.width && project.media.height
                  ? `${project.media.width} / ${project.media.height}`
                  : "16 / 9",
            }}
            className="relative w-full max-h-full overflow-hidden rounded-[16px] border border-white/10 bg-[#0c0c0e] shadow-[0_20px_50px_rgba(0,0,0,0.8)] md:rounded-[20px]"
          >
            <Media
              media={project.media}
              label={`${project.title} - media slot`}
              accent={project.accent}
              priority={index === 0}
              sizes="(min-width: 768px) 60vw, 100vw"
              className="object-contain object-center"
            />
          </div>
        </a>

        {/* Info */}
        <div className="relative z-10 order-2 flex flex-1 flex-col p-5 sm:p-8 md:order-1 md:max-w-[520px] md:p-12 short:md:p-8">
          <div className="flex items-center justify-between gap-4">
            <span
              aria-label={`Project ${index + 1} of ${total}`}
              className="font-display text-[clamp(3rem,min(6.5vw,11svh),6rem)] font-extrabold leading-[0.85] tracking-[-0.04em] text-fg"
            >
              {num}
            </span>
            {primary && (
              <a
                href={primary.href}
                target="_blank"
                rel="noopener noreferrer"
                className="relative inline-flex overflow-hidden rounded-full p-[2px] transition-transform duration-300 hover:scale-105"
              >
                {/* Rotating gold gradient (GPU rotate, no repaint) peeking out as a 2px ring */}
                <span
                  ref={goldRef}
                  aria-hidden
                  data-paused="true"
                  className="gold-spin absolute left-1/2 top-1/2 aspect-square w-[130%] -translate-x-1/2 -translate-y-1/2"
                />
                <span className="relative rounded-full bg-black px-5 py-2.5 font-sans text-[11px] font-bold uppercase tracking-[0.12em] text-white md:px-6 md:py-3 md:text-xs">
                  Live Project
                </span>
              </a>
            )}
          </div>

          <p className="mt-4 text-label text-muted md:mt-8 short:md:mt-4">{project.category}</p>
          <h3 id={`${project.id}-title`} className="mt-2 font-display text-[clamp(2rem,4.5vw,4.25rem)] font-semibold leading-[0.95] tracking-tight short:text-[clamp(1.75rem,3.2vw,2.75rem)]">
            {project.title}
          </h3>

          <div className="mt-4 space-y-3 text-sm leading-relaxed md:mt-8 md:text-[0.95rem] short:md:mt-4 short:md:text-sm">
            {project.description ? (
              <p className="line-clamp-4 text-muted sm:line-clamp-none short:line-clamp-3">
                {project.description}
              </p>
            ) : (
              <>
                {project.problem && (
                  <p className="hidden text-muted sm:block short:hidden">
                    <span className="text-fg">Problem. </span>
                    {project.problem}
                  </p>
                )}
                {project.solution && (
                  <p className="line-clamp-3 text-muted sm:line-clamp-none short:line-clamp-2">
                    <span className="text-fg">Solution. </span>
                    {project.solution}
                  </p>
                )}
              </>
            )}
          </div>

          <ul aria-label="Tech stack" className="mt-4 flex flex-wrap gap-1.5 md:mt-6 md:gap-2 short:md:mt-4">
            {project.stack.map((t) => (
              <li key={t} className="inline-flex items-center gap-1.5 rounded-full border border-line px-2.5 py-1 text-[11px] text-fg/80 md:px-3 md:text-xs">
                <TechBadgeIcon name={t} />
                <span>{t}</span>
              </li>
            ))}
          </ul>

          <div className="mt-auto flex flex-wrap items-center gap-3 pt-5">
            <LiveProductMenu links={project.links} accent={project.accent} placement="top" />
            {primary && (
              <a
                href={primary.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 px-2 py-2.5 text-sm text-muted transition-colors hover:text-fg"
              >
                Visit
                <ArrowUpRight size={15} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>
            )}
          </div>
        </div>

        {/* Darkens the card as the next one covers it */}
        <motion.div aria-hidden style={{ opacity: dim }} className="pointer-events-none absolute inset-0 z-20 bg-black will-change-[opacity]" />
      </motion.article>

      {isLast && (
        <motion.div
          style={{ scale, top: `${index * 26}px` }}
          className="relative flex justify-center w-full pt-4 sm:pt-6 md:pt-7 pb-4 shrink-0 z-30"
        >
          <ViewAllProjectsButton />
        </motion.div>
      )}
      </motion.div>

      {isLast && <ProcessOrbit progress={finale} />}
    </div>
  );
}

function TechBadgeIcon({ name }: { name: string }) {
  if (name === "Shopify") {
    return (
      <svg className="h-3.5 w-3.5 shrink-0" viewBox="0 0 24 24" fill="#95BF47" aria-hidden="true">
        <path d={siShopify.path} />
      </svg>
    );
  }
  if (name === "Shiprocket") {
    return (
      <svg className="h-3.5 w-3.5 shrink-0" viewBox="0 0 24 24" fill="#8B5CF6" aria-hidden="true">
        <path d="M13.13 2.5a.75.75 0 0 0-.85-.14 11.05 11.05 0 0 0-4.7 4.7.75.75 0 0 0 .14.85l1.6 1.6-4.57 4.58a2.5 2.5 0 0 0 0 3.53l.35.36a2.5 2.5 0 0 0 3.54 0l4.57-4.58 1.6 1.6a.75.75 0 0 0 .86.14 11.05 11.05 0 0 0 4.7-4.7.75.75 0 0 0-.15-.85l-7.04-7.09zm1.06 6.36a1.25 1.25 0 1 1 1.77-1.77 1.25 1.25 0 0 1-1.77 1.77z" />
      </svg>
    );
  }
  if (name === "Razorpay") {
    return (
      <svg className="h-3.5 w-3.5 shrink-0" viewBox="0 0 24 24" fill="#0C8CE9" aria-hidden="true">
        <path d={siRazorpay.path} />
      </svg>
    );
  }
  if (name === "React.js" || name === "React") {
    return (
      <svg className="h-3.5 w-3.5 shrink-0" viewBox="0 0 24 24" fill="#61DAFB" aria-hidden="true">
        <path d={siReact.path} />
      </svg>
    );
  }
  if (name === "Node.js" || name === "Node") {
    return (
      <svg className="h-3.5 w-3.5 shrink-0" viewBox="0 0 24 24" fill="#5FA04E" aria-hidden="true">
        <path d={siNodedotjs.path} />
      </svg>
    );
  }
  if (name === "MongoDB") {
    return (
      <svg className="h-3.5 w-3.5 shrink-0" viewBox="0 0 24 24" fill="#47A248" aria-hidden="true">
        <path d={siMongodb.path} />
      </svg>
    );
  }
  if (name === "Tailwind CSS" || name === "Tailwind") {
    return (
      <svg className="h-3.5 w-3.5 shrink-0" viewBox="0 0 24 24" fill="#38BDF8" aria-hidden="true">
        <path d={siTailwindcss.path} />
      </svg>
    );
  }
  return null;
}