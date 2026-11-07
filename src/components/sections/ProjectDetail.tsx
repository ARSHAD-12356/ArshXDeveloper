"use client";

import { motion, MotionConfig, useInView } from "framer-motion";
import Link from "next/link";
import { useRef } from "react";
import { projects } from "@/data/site";
import { useSiteReady } from "@/components/providers/Preloader";
import { ArrowLeft, ArrowUpRight } from "@/components/ui/Icons";
import { Marquee } from "@/components/ui/Marquee";
import { Media } from "@/components/ui/Media";
import { Reveal, SplitLines } from "@/components/ui/Reveal";
import { TechBadgeIcon } from "@/components/ui/TechBadgeIcon";
import { cn, EASE_OUT_EXPO } from "@/lib/utils";
import type { MediaAsset, Project } from "@/types";

const fadeUp = (play: boolean, delay: number) => ({
  initial: { opacity: 0, y: 24 },
  animate: play ? { opacity: 1, y: 0 } : undefined,
  transition: { duration: 0.95, ease: EASE_OUT_EXPO, delay },
});

const hostname = (href: string) => {
  try {
    return new URL(href).hostname.replace(/^www\./, "");
  } catch {
    return null;
  }
};

/** Case-study page for one project. Entrances wait for the loader on a direct visit. */
export function ProjectDetail({ project, index }: { project: Project; index: number }) {
  const play = useSiteReady();
  const live = project.links.find((l) => hostname(l.href));
  const site = live && hostname(live.href);
  const facts = [
    { label: "Category", value: project.category },
    { label: "Year", value: project.year },
    { label: "Tech Used", value: `${project.stack.length} Technologies` },
    ...(site ? [{ label: "Live Site", value: site }] : []),
  ];
  // The rest of the list, carrying on from this project.
  const others = [...projects.slice(index + 1), ...projects.slice(0, index)];

  return (
    <MotionConfig reducedMotion="user">
      <article id="top" aria-labelledby="project-title" className="overflow-x-clip bg-ink">
        {/* Hero */}
        <header className="container-x pt-[calc(var(--header-h)+0.75rem)] md:pt-[calc(var(--header-h)+1.5rem)]">
          <motion.div {...fadeUp(play, 0)}>
            <Link
              href="/#work"
              scroll={false}
              className="group inline-flex items-center gap-2.5 rounded-full border border-line-strong bg-white/[0.03] py-2.5 pl-3.5 pr-5 text-sm font-medium backdrop-blur-md transition-colors hover:border-white/40"
            >
              <ArrowLeft size={17} className="transition-transform duration-500 ease-out-expo group-hover:-translate-x-1" />
              Back to Projects
            </Link>
          </motion.div>

          <motion.p {...fadeUp(play, 0.08)} className="mt-8 flex flex-wrap items-center gap-3 text-label text-muted md:mt-12">
            <span className="font-mono text-accent">{String(index + 1).padStart(3, "0")}</span>
            <span className="h-px w-10 bg-line-strong" />
            <span>{project.category}</span>
          </motion.p>

          <h1 id="project-title" className="mt-4 font-display text-[clamp(2.75rem,8.5vw,8rem)] font-semibold leading-[0.98] tracking-tight md:mt-6">
            <span className="sr-only">{project.title}</span>
            <span aria-hidden className="flex flex-wrap gap-x-[0.25em]">
              {project.title.split(" ").map((word, i) => (
                <span key={word} className="block overflow-hidden pb-[0.08em]">
                  <motion.span
                    className="block"
                    initial={{ y: "105%" }}
                    animate={play ? { y: "0%" } : undefined}
                    transition={{ duration: 1.15, ease: EASE_OUT_EXPO, delay: 0.14 + i * 0.09 }}
                  >
                    {word}
                  </motion.span>
                </span>
              ))}
            </span>
          </h1>

          <div className="mt-6 flex flex-col gap-6 md:mt-10 md:flex-row md:items-end md:justify-between md:gap-16">
            <motion.p {...fadeUp(play, 0.3)} className="max-w-3xl text-base leading-relaxed text-muted md:text-lg">
              {project.description}
            </motion.p>
            {live && (
              <motion.div {...fadeUp(play, 0.38)} className="shrink-0">
                <a
                  href={live.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex h-14 w-full items-center justify-center gap-3 rounded-full bg-white px-8 text-base font-semibold text-ink transition-transform duration-500 ease-out-expo hover:-translate-y-0.5 md:w-auto"
                >
                  Visit Live Site
                  <ArrowUpRight size={18} className="transition-transform duration-500 ease-out-expo group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </a>
              </motion.div>
            )}
          </div>
        </header>

        <ProjectBanner project={project} play={play} />

        {/* Facts */}
        <dl className="container-x mt-10 grid grid-cols-2 gap-x-6 gap-y-8 md:mt-16 lg:grid-cols-4">
          {facts.map((fact, i) => (
            <Reveal key={fact.label} delay={i * 0.08} className="min-w-0 border-t border-line pt-5">
              <dt className="text-label text-dim">{fact.label}</dt>
              <dd className="mt-2.5 break-words font-display text-lg font-medium leading-snug md:text-xl">{fact.value}</dd>
            </Reveal>
          ))}
        </dl>

        {/* Problem and solution */}
        <section aria-label="Overview" className="container-x mt-20 grid gap-4 md:mt-32 md:grid-cols-2 md:gap-6">
          {[
            { label: "The Problem", text: project.problem },
            { label: "The Solution", text: project.solution },
          ].map((block, i) => (
            <Reveal key={block.label} delay={i * 0.1} className="rounded-[22px] border border-line bg-ink-2 p-6 sm:p-8 md:rounded-[32px] md:p-12">
              <h2 className="text-label text-accent">{block.label}</h2>
              <p className="mt-5 font-display text-[clamp(1.2rem,2vw,1.75rem)] font-medium leading-[1.3] tracking-[-0.01em]">{block.text}</p>
            </Reveal>
          ))}
        </section>

        {/* Features */}
        <section aria-label="Key features" className="container-x mt-20 md:mt-32">
          <div className="lg:max-w-[58%]">
            <Reveal>
              <h2 className="font-display text-title font-semibold tracking-tight">Key Features</h2>
            </Reveal>
            <ul className="mt-6 md:mt-10">
              {project.features.map((feature, i) => (
                <Reveal as="li" key={feature} delay={i * 0.07} className="flex items-baseline gap-5 border-t border-line py-5 md:gap-8 md:py-6">
                  <span className="font-mono text-sm text-accent">{String(i + 1).padStart(2, "0")}</span>
                  <span className="font-display text-lg font-medium md:text-2xl">{feature}</span>
                </Reveal>
              ))}
            </ul>
          </div>
        </section>

        {/* Recent projects */}
        <section aria-labelledby="recent-projects" className="mt-24 border-t border-line pb-24 pt-20 md:mt-36 md:pb-36 md:pt-28">
          <div className="container-x">
            <Reveal className="flex items-center gap-3 text-label text-muted">
              <span className="h-px w-10 bg-line-strong" />
              <span>More Work</span>
            </Reveal>
            <SplitLines
              id="recent-projects"
              lines={["Our Recent Projects"]}
              className="mt-4 font-display text-[clamp(2.25rem,6vw,5.5rem)] font-semibold leading-none tracking-tight"
            />

            <ul className="mt-10 grid gap-5 sm:grid-cols-2 md:mt-16 lg:grid-cols-3 lg:gap-6">
              {others.map((other, i) => (
                <Reveal as="li" key={other.id} delay={i * 0.1}>
                  <RecentProjectCard project={other} />
                </Reveal>
              ))}
            </ul>
          </div>
        </section>
      </article>
    </MotionConfig>
  );
}

function ProjectBanner({ project, play }: { project: Project; play: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref);
  const size = !project.video && project.media?.type === "image" ? project.media : undefined;
  const media: MediaAsset | undefined = project.video
    ? {
        type: "video",
        src: project.video,
        poster: project.media?.type === "image" ? project.media.src : undefined,
        alt: `${project.title} website screen recording`,
      }
    : project.media;

  return (
    <div ref={ref} className="container-x mt-10 md:mt-16" style={{ containerType: "inline-size" }}>
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.97 }}
        animate={play ? { opacity: 1, y: 0, scale: 1 } : undefined}
        transition={{ duration: 1.2, ease: EASE_OUT_EXPO, delay: 0.42 }}
        style={{
          // Screen recordings are 1920×1012.
          // Videos: full container width, height follows the 1920×1012 recording but never
          // exceeds the screen (max-height with aspect-ratio would shrink the width).
          ...(!project.video && { aspectRatio: size?.width && size.height ? `${size.width} / ${size.height}` : "16 / 9" }),
          ["--glow" as string]: project.accent,
        }}
        className={cn(
          "glow-card relative overflow-hidden rounded-[18px] bg-[#0c0c0e] p-[3px] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.9)] md:rounded-[32px]",
          // Phones: the recording's own shape. Larger screens: full screen height, small margin top and bottom.
          project.video && "h-[calc(100cqw*1012/1920)] md:h-[calc(100svh-3rem)]",
        )}
      >
        <span aria-hidden className="gradient-ring z-[2]">
          <span data-paused={String(!inView)} className="gradient-ring-spin" />
        </span>
        <div className="relative h-full w-full overflow-hidden rounded-[15px] md:rounded-[29px]">
          <Media media={media} label={project.title} accent={project.accent} priority sizes="(min-width: 1600px) 1520px, 95vw" className={project.video ? "object-cover object-top" : "object-contain object-center"} />
        </div>
      </motion.div>

      {/* Tech stack, scrolling right to left under the banner */}
      <Marquee duration={Math.max(project.stack.length * 4, 18)} className="mt-8 md:mt-12">
        {project.stack.map((tech) => (
          <span
            key={tech}
            className="mx-2 inline-flex items-center gap-3 whitespace-nowrap rounded-full border border-line-strong bg-white/[0.03] px-6 py-3.5 font-display text-lg font-medium md:mx-3 md:gap-4 md:px-9 md:py-5 md:text-2xl"
          >
            <TechBadgeIcon name={tech} className="h-5 w-5 md:h-7 md:w-7" />
            {tech}
          </span>
        ))}
      </Marquee>
    </div>
  );
}

function RecentProjectCard({ project }: { project: Project }) {
  return (
    <Link
      href={`/projects/${project.id}`}
      style={{ ["--card-accent" as string]: project.accent }}
      className="group block h-full rounded-[22px] border border-line bg-ink-2 p-3 transition-[translate,border-color,box-shadow] duration-500 ease-out-expo hover:-translate-y-1 hover:border-[var(--card-accent)] hover:shadow-[0_24px_60px_-28px_var(--card-accent)] md:p-4"
    >
      {/* Banners are about 2.1:1, so this shape shows them whole */}
      <div className="relative aspect-[21/10] overflow-hidden rounded-[14px] bg-[#0c0c0e]">
        <div className="absolute inset-0 transition-transform duration-700 ease-out-expo group-hover:scale-[1.04]">
          <Media media={project.media} label={project.title} accent={project.accent} sizes="(min-width: 1024px) 31vw, (min-width: 640px) 48vw, 92vw" />
        </div>
      </div>
      <div className="flex items-end justify-between gap-4 px-1.5 pb-1.5 pt-5">
        <div className="min-w-0">
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-muted">{project.category}</p>
          <h3 className="mt-2 font-display text-2xl font-semibold leading-tight tracking-tight">{project.title}</h3>
        </div>
        <span aria-hidden className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-line-strong transition-colors duration-300 group-hover:border-white group-hover:bg-white group-hover:text-ink">
          <ArrowUpRight size={18} className="transition-transform duration-500 ease-out-expo group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  );
}
