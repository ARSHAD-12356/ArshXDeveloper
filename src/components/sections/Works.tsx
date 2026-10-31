"use client";

import { useScroll } from "framer-motion";
import { useRef } from "react";
import { process, projects } from "@/data/site";
import { Marquee } from "@/components/ui/Marquee";
import { Reveal } from "@/components/ui/Reveal";
import { ProjectCard } from "./ProjectCard";

const MARQUEE_TEXT = "Selected Works";

/**
 * Selected works: sticky cards that stack and recede as the next one slides over.
 * After the last card, a finale stretch keeps every card pinned while they shrink into the
 * centre and the ANALYZE / DESIGN / BUILD / DELIVER ring rotates in around them.
 */
export function Works() {
  const trackRef = useRef<HTMLDivElement>(null);
  const finaleRef = useRef<HTMLDivElement>(null);
  const total = projects.length;
  // Card stacking is measured over the cards only, so the finale does not change its timing.
  const { scrollYProgress } = useScroll({ target: trackRef, offset: ["start start", "end end"] });
  // Starts the moment the last card locks in place (its wrapper is 80svh tall).
  const { scrollYProgress: finale } = useScroll({ target: finaleRef, offset: ["start 0.8", "end end"] });

  return (
    <section id="work" aria-labelledby="work-title" className="relative pt-28 md:pt-40">
      <h2 id="work-title" className="sr-only">
        {MARQUEE_TEXT}
      </h2>

      <div className="container-x mb-10 flex flex-col gap-6 md:mb-14 md:flex-row md:items-end md:justify-between">
        <Reveal className="flex items-center gap-3 text-label text-muted">
          <span className="font-mono text-accent">03</span>
          <span className="h-px w-10 bg-line-strong" />
          <span>Selected Works</span>
        </Reveal>
        <Reveal delay={0.15} className="max-w-md text-base leading-relaxed text-muted">
          <p>
            Products I designed, engineered and shipped - each one built around a real problem and measured by the
            result.
          </p>
        </Reveal>
      </div>

      {/* White title band: one continuous line scrolling forever */}
      <Reveal y={60} className="relative z-10 bg-white py-5 text-ink md:py-7">
        <Marquee duration={30} fade={false}>
          {Array.from({ length: 4 }).map((_, i) => (
            <span
              key={i}
              aria-hidden
              className="flex items-center whitespace-nowrap font-display text-display font-semibold uppercase"
            >
              <span className="px-[0.35em]">{MARQUEE_TEXT}</span>
              <span className="inline-block h-[0.06em] w-[1.1em] bg-ink" />
            </span>
          ))}
        </Marquee>
      </Reveal>

      <div className="relative">
        {/* Invisible track spanning just the card wrappers (80svh each) */}
        <div ref={trackRef} aria-hidden className="pointer-events-none absolute inset-x-0 top-0" style={{ height: `${total * 80}svh` }} />

        {projects.map((project, i) => (
          <ProjectCard
            key={project.id}
            project={project}
            index={i}
            total={total}
            progress={scrollYProgress}
            range={[i / total, 1]}
            targetScale={1 - (total - i) * 0.04}
            finale={finale}
          />
        ))}

        {/* Finale stretch: cards stay pinned (sticky) while this scrolls past */}
        <div ref={finaleRef} aria-labelledby="philosophy-title" className="relative h-[220svh]">
          {/* Nav target lands on the finished ring */}
          <span id="philosophy" aria-hidden className="absolute inset-x-0 bottom-[100svh]" />
          <div className="sr-only">
            <h2 id="philosophy-title">Philosophy and process</h2>
            <ol>
              {process.map((step) => (
                <li key={step.title}>
                  {step.title}: {step.summary}
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* Hold: the finished ring stays pinned while the next section slides up over it */}
        <div aria-hidden className="h-[100svh]" />
      </div>
    </section>
  );
}