"use client";

import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, type MouseEvent } from "react";
import type { Project } from "@/types";
import { LiveProductMenu } from "@/components/ui/LiveProductMenu";
import { Media } from "@/components/ui/Media";
import { ArrowUpRight } from "@/components/ui/Icons";
import { TechBadgeIcon } from "@/components/ui/TechBadgeIcon";
import { ViewAllProjectsButton } from "@/components/ui/ViewAllProjectsButton";
import { saveProjectReturn } from "@/lib/projectReturn";
import { ProcessOrbit } from "./ProcessOrbit";

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
  const router = useRouter();
  const detailHref = `/projects/${project.id}`;

  // The whole card opens the detail page; its own links and buttons keep doing their own thing.
  const openDetail = (e: MouseEvent<HTMLElement>) => {
    if ((e.target as Element).closest("a, button")) return;
    saveProjectReturn();
    router.push(detailHref);
  };
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
  // View All: takes the cards' place in the centre as they shrink away, then stays there.
  const ctaOpacity = useTransform(finale, [0.48, 0.68], [0, 1]);
  const ctaScale = useTransform(finale, [0.48, 0.72], [0.82, 1]);
  const ctaPointer = useTransform(finale, (v) => (v > 0.5 ? "auto" : "none"));

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
        onClick={openDetail}
        aria-labelledby={`${project.id}-title`}
        // Opaque dark card: the cursor skips its colour probe here and the hidden splash idles.
        data-cursor-surface="dark"
        data-splash-off=""
        style={{ scale, top: `${index * 26}px`, ["--glow" as string]: project.accent }}
        className="glow-card relative flex h-auto cursor-pointer will-change-transform w-full max-w-[1240px] origin-top flex-col overflow-hidden rounded-[22px] bg-ink-2 shadow-[0_-30px_80px_-20px_rgba(0,0,0,0.9)] md:h-[min(78svh,820px)] md:flex-row md:rounded-[32px]"
      >
        {/* Continuously rotating gradient border */}
        <span aria-hidden className="gradient-ring z-[25]">
          <span ref={borderRef} data-paused="true" className="gradient-ring-spin" />
        </span>

        {/* Media */}
        <Link
          href={detailHref}
          onClick={saveProjectReturn}
          aria-label={`View ${project.title} project details`}
          className="group relative order-1 flex shrink-0 items-center justify-center p-3 sm:p-6 md:order-2 md:flex-[1.45] md:p-8 md:pl-2 overflow-hidden"
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
        </Link>

        {/* Info */}
        <div className="relative z-10 order-2 flex flex-1 flex-col px-4 pb-4 pt-1 sm:p-8 md:order-1 md:max-w-[520px] md:p-12 short:md:p-8">
          <div className="flex items-center justify-between gap-4">
            <span
              aria-label={`Project ${index + 1} of ${total}`}
              className="font-display text-[clamp(2.5rem,min(6.5vw,11svh),6rem)] font-extrabold leading-[0.85] tracking-[-0.04em] text-fg"
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

          <p className="mt-4 hidden text-label text-muted sm:block md:mt-8 short:md:mt-4">{project.category}</p>
          <h3 id={`${project.id}-title`} className="mt-3 font-display text-[clamp(1.85rem,4.5vw,4.25rem)] sm:mt-2 font-semibold leading-[0.95] tracking-tight short:text-[clamp(1.75rem,3.2vw,2.75rem)]">
            <Link href={detailHref} onClick={saveProjectReturn} className="transition-colors hover:text-accent">
              {project.title}
            </Link>
          </h3>

          <div className="mt-4 hidden space-y-3 text-sm leading-relaxed sm:block md:mt-8 md:text-[0.95rem] short:md:mt-4 short:md:text-sm">
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

          <ul aria-label="Tech stack" className="mt-3 flex flex-wrap gap-1.5 sm:mt-4 md:mt-6 md:gap-2 short:md:mt-4">
            {project.stack.map((t) => (
              <li key={t} className="inline-flex items-center gap-1.5 rounded-full border border-line px-2.5 py-1 text-[11px] text-fg/80 md:px-3 md:text-xs">
                <TechBadgeIcon name={t} />
                <span>{t}</span>
              </li>
            ))}
          </ul>

          <div className="mt-auto flex flex-wrap items-center gap-3 pt-4 sm:pt-5">
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

      </motion.div>

      {isLast && <ProcessOrbit progress={finale} />}

      {/* Centre stage after the stack: the button appears where the cards shrink into */}
      {isLast && (
        <div className="pointer-events-none absolute inset-x-0 top-0 z-40 flex h-[100svh] items-center justify-center px-4">
          <motion.div style={{ opacity: ctaOpacity, scale: ctaScale, pointerEvents: ctaPointer }} className="will-change-transform">
            <ViewAllProjectsButton size="lg" />
          </motion.div>
        </div>
      )}
    </div>
  );
}
