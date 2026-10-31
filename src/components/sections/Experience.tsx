"use client";

import { motion, useScroll, useSpring } from "framer-motion";
import { useRef } from "react";
import { timeline } from "@/data/site";
import { cn, EASE_OUT_EXPO } from "@/lib/utils";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { TimelineEntry } from "@/types";

export function Experience() {
  const listRef = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: listRef, offset: ["start 0.75", "end 0.6"] });
  const fill = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 });

  return (
    <section id="experience" aria-labelledby="experience-title" className="relative py-28 md:py-40">
      <div className="container-x">
        <SectionHeading
          id="experience-title"
          index="02"
          eyebrow="Experience & Education"
          title={["The path", "so far"]}
          description="Roles, teams and classrooms that shaped how I approach engineering problems."
        />

        <ol ref={listRef} className="relative">
          {/* Track + scroll-linked progress */}
          <span aria-hidden className="absolute bottom-0 left-[7px] top-2 w-px bg-line md:left-[calc(25%+7px)]" />
          <motion.span
            aria-hidden
            style={{ scaleY: fill }}
            className="absolute bottom-0 left-[7px] top-2 w-px origin-top bg-gradient-to-b from-accent via-accent-2 to-accent md:left-[calc(25%+7px)]"
          />
          {timeline.map((entry, i) => (
            <TimelineItem key={`${entry.role}-${entry.org}-${i}`} entry={entry} index={i} />
          ))}
        </ol>
      </div>
    </section>
  );
}

function TimelineItem({ entry, index }: { entry: TimelineEntry; index: number }) {
  return (
    <motion.li
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -15% 0px" }}
      transition={{ duration: 0.9, ease: EASE_OUT_EXPO, delay: index * 0.12 }}
      className="group relative grid gap-3 pb-16 pl-10 last:pb-0 md:grid-cols-4 md:gap-0 md:pl-0"
    >
      <div className="md:pr-12 md:pt-1 md:text-right">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted">{entry.period}</p>
        <p
          className={cn(
            "mt-2 inline-block rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em]",
            entry.kind === "education" ? "border-accent-2/40 text-accent-2" : "border-accent/40 text-accent",
          )}
        >
          {entry.kind}
        </p>
      </div>

      {/* Node */}
      <span aria-hidden className="absolute left-0 top-1.5 flex h-[15px] w-[15px] items-center justify-center md:left-1/4">
        <span className="absolute h-full w-full rounded-full border border-line-strong bg-ink transition-colors duration-500 group-hover:border-accent" />
        <span className="relative h-[5px] w-[5px] rounded-full bg-fg transition-transform duration-500 group-hover:scale-150 group-hover:bg-accent" />
      </span>

      <div className="md:col-span-3 md:pl-14">
        <h3 className="font-display text-2xl font-semibold tracking-tight transition-colors duration-500 group-hover:text-accent md:text-4xl">
          {entry.role}
        </h3>
        <p className="mt-2 text-sm text-muted">
          {entry.org}
          {entry.location && <span className="text-dim"> &middot; {entry.location}</span>}
        </p>
        {entry.summary && <p className="mt-5 max-w-2xl leading-relaxed text-fg/80">{entry.summary}</p>}
        {entry.highlights && (
          <ul className="mt-5 space-y-2">
            {entry.highlights.map((h) => (
              <li key={h} className="flex gap-3 text-sm text-muted">
                <span aria-hidden className="mt-2 h-px w-4 shrink-0 bg-accent" />
                {h}
              </li>
            ))}
          </ul>
        )}
      </div>
    </motion.li>
  );
}