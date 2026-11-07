"use client";

import { AnimatePresence, motion, MotionConfig } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import { projects } from "@/data/site";
import { useSiteReady } from "@/components/providers/Preloader";
import { ArrowLeft, ArrowUpRight } from "@/components/ui/Icons";
import { Media } from "@/components/ui/Media";
import { TechBadgeIcon } from "@/components/ui/TechBadgeIcon";
import { TechIcon } from "@/components/ui/TechIcon";
import { cn, EASE_OUT_EXPO } from "@/lib/utils";
import type { Project, ProjectType } from "@/types";

const SECTIONS: { key: ProjectType; label: string; blurb: string }[] = [
  {
    key: "development",
    label: "Development",
    blurb: "Websites, stores and web apps - designed, engineered and shipped to production.",
  },
  {
    key: "analytics",
    label: "Analytics",
    blurb: "Dashboards, data analysis and reporting that turn raw numbers into decisions.",
  },
];

const ANALYTICS_TOOLS = ["Python", "SQL", "Excel", "Power BI", "Tableau", "Pandas", "NumPy"];

const byType = (type: ProjectType) => projects.filter((p) => (p.type ?? "development") === type);
const pad = (n: number) => String(n).padStart(2, "0");

const fadeUp = (play: boolean, delay: number) => ({
  initial: { opacity: 0, y: 24 },
  animate: play ? { opacity: 1, y: 0 } : undefined,
  transition: { duration: 0.95, ease: EASE_OUT_EXPO, delay },
});

/** Archive of every project, split into Development and Analytics halves. */
export function AllProjects() {
  const play = useSiteReady();
  const [active, setActive] = useState<ProjectType>("development");
  // +1 = moving right (Development -> Analytics), -1 = moving left; drives the slide direction.
  const [dir, setDir] = useState(1);

  // A link like /projects#analytics opens straight on that half.
  useEffect(() => {
    if (window.location.hash === "#analytics") setActive("analytics");
  }, []);

  const select = (key: ProjectType) => {
    if (key === active) return;
    setDir(key === "analytics" ? 1 : -1);
    setActive(key);
    history.replaceState(null, "", key === "analytics" ? "#analytics" : location.pathname);
  };

  const list = byType(active);
  const section = SECTIONS.find((s) => s.key === active)!;

  return (
    <MotionConfig reducedMotion="user">
      <article id="top" aria-labelledby="all-projects-title" className="relative overflow-x-clip bg-ink">
        {/* Soft colour wash behind the heading */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-[70svh]"
          style={{
            background:
              "radial-gradient(60% 60% at 85% 0%, rgba(34,211,238,0.10), transparent 70%), radial-gradient(50% 50% at 10% 10%, rgba(16,185,129,0.08), transparent 70%)",
          }}
        />

        <header className="container-x relative pt-[calc(var(--header-h)+0.75rem)] md:pt-[calc(var(--header-h)+1.5rem)]">
          <motion.div {...fadeUp(play, 0)}>
            <Link
              href="/#work"
              scroll={false}
              className="group inline-flex items-center gap-2.5 rounded-full border border-line-strong bg-white/[0.03] py-2.5 pl-3.5 pr-5 text-sm font-medium backdrop-blur-md transition-colors hover:border-white/40"
            >
              <ArrowLeft size={17} className="transition-transform duration-500 ease-out-expo group-hover:-translate-x-1" />
              Back to Home
            </Link>
          </motion.div>

          <motion.p {...fadeUp(play, 0.08)} className="mt-8 flex items-center gap-3 text-label text-muted md:mt-12">
            <span className="font-mono text-accent">{pad(projects.length)}</span>
            <span className="h-px w-10 bg-line-strong" />
            <span>Project Archive</span>
          </motion.p>

          <h1 id="all-projects-title" className="mt-4 font-display text-[clamp(3rem,10vw,9.5rem)] font-semibold leading-[0.92] tracking-tight md:mt-6">
            <span className="sr-only">All Projects</span>
            <span aria-hidden className="flex flex-wrap items-start gap-x-[0.22em]">
              {["All", "Projects"].map((word, i) => (
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
              <motion.sup
                {...fadeUp(play, 0.45)}
                className="mt-[0.35em] font-mono text-[0.18em] font-medium tracking-normal text-accent"
              >
                ({pad(projects.length)})
              </motion.sup>
            </span>
          </h1>

          <motion.p {...fadeUp(play, 0.3)} className="mt-6 max-w-2xl text-base leading-relaxed text-muted md:mt-8 md:text-lg">
            Everything I have built, in two parts: development work that ships as real products, and analytics work that
            turns data into answers.
          </motion.p>

          {/* Two-part switch */}
          <motion.div {...fadeUp(play, 0.4)} className="mt-10 md:mt-14">
            <div role="tablist" aria-label="Project type" className="relative grid w-full max-w-xl grid-cols-2 rounded-full border border-line-strong bg-white/[0.03] p-1.5 backdrop-blur-md">
              {SECTIONS.map((s) => {
                const selected = s.key === active;
                const count = byType(s.key).length;
                return (
                  <button
                    key={s.key}
                    type="button"
                    role="tab"
                    id={`tab-${s.key}`}
                    aria-selected={selected}
                    aria-controls="projects-panel"
                    onClick={() => select(s.key)}
                    className={cn(
                      "relative z-10 flex items-center justify-center gap-2.5 rounded-full px-4 py-3 text-sm font-semibold transition-colors duration-300 sm:text-base md:py-3.5",
                      selected ? "text-ink" : "text-muted hover:text-fg",
                    )}
                  >
                    {selected && (
                      <motion.span
                        layoutId="project-type-pill"
                        aria-hidden
                        className="absolute inset-0 -z-10 rounded-full bg-white shadow-[0_8px_30px_-10px_rgba(255,255,255,0.45)]"
                        transition={{ type: "spring", stiffness: 380, damping: 34 }}
                      />
                    )}
                    {s.key === "development" ? <CodeGlyph /> : <ChartGlyph />}
                    {s.label}
                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5 font-mono text-[11px] transition-colors duration-300",
                        selected ? "bg-ink text-white" : "bg-white/[0.06] text-muted",
                      )}
                    >
                      {pad(count)}
                    </span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        </header>

        {/* Active half */}
        <section
          id="projects-panel"
          role="tabpanel"
          aria-labelledby={`tab-${active}`}
          className="container-x relative mt-10 pb-24 md:mt-14 md:pb-36"
        >
          <AnimatePresence mode="wait" custom={dir} initial={false}>
            <motion.div
              key={active}
              custom={dir}
              variants={{
                enter: (d: number) => ({ opacity: 0, x: d * 60 }),
                center: { opacity: 1, x: 0 },
                exit: (d: number) => ({ opacity: 0, x: d * -60 }),
              }}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.5, ease: EASE_OUT_EXPO }}
            >
              <div className="flex flex-col gap-3 border-t border-line pt-6 md:flex-row md:items-end md:justify-between md:pt-8">
                <h2 className="font-display text-title font-semibold tracking-tight">{section.label} Projects</h2>
                <p className="max-w-md text-sm leading-relaxed text-muted md:text-right md:text-base">{section.blurb}</p>
              </div>

              {list.length > 0 ? (
                <ul className="mt-8 grid gap-5 md:mt-12 md:grid-cols-2 md:gap-6 lg:gap-8">
                  {list.map((project, i) => (
                    <ArchiveCard key={project.id} project={project} index={projects.indexOf(project)} order={i} play={play} />
                  ))}
                </ul>
              ) : (
                <AnalyticsSoon />
              )}
            </motion.div>
          </AnimatePresence>
        </section>
      </article>
    </MotionConfig>
  );
}

function ArchiveCard({ project, index, order, play }: { project: Project; index: number; order: number; play: boolean }) {
  return (
    <motion.li
      initial={{ opacity: 0, y: 40 }}
      animate={play ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.9, ease: EASE_OUT_EXPO, delay: 0.2 + order * 0.08 }}
    >
      <Link
        href={`/projects/${project.id}`}
        style={{ ["--card-accent" as string]: project.accent }}
        data-cursor-surface="dark"
        data-splash-off=""
        className="group relative flex h-full flex-col overflow-hidden rounded-[24px] border border-line bg-ink-2 p-3 transition-[translate,border-color,box-shadow] duration-500 ease-out-expo hover:-translate-y-1.5 hover:border-[var(--card-accent)] hover:shadow-[0_30px_70px_-30px_var(--card-accent)] md:rounded-[28px] md:p-4"
      >
        {/* Banners are about 2.1:1, so this shape shows them whole */}
        <div className="relative aspect-[21/10] overflow-hidden rounded-[16px] bg-[#0c0c0e] md:rounded-[20px]">
          <div className="absolute inset-0 transition-transform duration-700 ease-out-expo group-hover:scale-[1.045]">
            <Media media={project.media} label={project.title} accent={project.accent} sizes="(min-width: 768px) 46vw, 92vw" />
          </div>
          <span className="absolute left-3 top-3 rounded-full bg-black/60 px-3 py-1 font-mono text-xs text-white backdrop-blur-md md:left-4 md:top-4">
            {String(index + 1).padStart(3, "0")}
          </span>
          <span className="absolute right-3 top-3 rounded-full bg-black/60 px-3 py-1 font-mono text-xs text-white/80 backdrop-blur-md md:right-4 md:top-4">
            {project.year}
          </span>
        </div>

        <div className="flex flex-1 flex-col px-2 pb-2 pt-5 md:px-3 md:pt-6">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-muted">{project.category}</p>
              <h3 className="mt-2 font-display text-[clamp(1.6rem,2.6vw,2.25rem)] font-semibold leading-tight tracking-tight">{project.title}</h3>
            </div>
            <span
              aria-hidden
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-line-strong transition-colors duration-300 group-hover:border-white group-hover:bg-white group-hover:text-ink"
            >
              <ArrowUpRight size={19} className="transition-transform duration-500 ease-out-expo group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </span>
          </div>

          {project.description && <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-muted md:text-[0.95rem]">{project.description}</p>}

          <ul aria-label="Tech stack" className="mt-auto flex flex-wrap gap-1.5 pt-5">
            {project.stack.map((tech) => (
              <li key={tech} className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1 text-xs text-fg/80">
                <TechBadgeIcon name={tech} />
                {tech}
              </li>
            ))}
          </ul>
        </div>
      </Link>
    </motion.li>
  );
}

/** Placeholder for the Analytics half until the first analytics project is added. */
function AnalyticsSoon() {
  const bars = [38, 62, 46, 80, 58, 92, 70];
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, ease: EASE_OUT_EXPO, delay: 0.1 }}
      className="relative mt-8 overflow-hidden rounded-[24px] border border-dashed border-line-strong bg-ink-2 md:mt-12 md:rounded-[32px]"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(60% 80% at 100% 100%, rgba(34,211,238,0.10), transparent 70%)" }}
      />
      <div className="relative grid items-center gap-10 p-6 sm:p-10 md:grid-cols-[1.1fr_1fr] md:p-14">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/[0.08] px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-emerald-300">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
            In progress
          </span>
          <h3 className="mt-6 font-display text-[clamp(1.9rem,3.4vw,3.25rem)] font-semibold leading-[1.05] tracking-tight">
            Analytics projects are on the way.
          </h3>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-muted md:text-base">
            Data dashboards, exploratory analysis and reporting case studies will land here soon.
          </p>
          <ul aria-label="Analytics tools" className="mt-7 flex flex-wrap gap-2">
            {ANALYTICS_TOOLS.map((tool) => (
              <li key={tool} className="inline-flex items-center gap-2 rounded-full border border-line px-3.5 py-1.5 text-xs text-fg/80 md:text-sm">
                <TechIcon name={tool} onDark className="h-3.5 md:h-4" />
                {tool}
              </li>
            ))}
          </ul>
          <Link
            href="/#contact"
            className="group mt-8 inline-flex items-center gap-2.5 rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-ink transition-transform duration-500 ease-out-expo hover:-translate-y-0.5"
          >
            Discuss a data project
            <ArrowUpRight size={16} className="transition-transform duration-500 ease-out-expo group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* Live-looking chart: bars breathe gently, GPU transforms only */}
        <div aria-hidden className="relative rounded-[20px] border border-line bg-black/30 p-5 md:p-7">
          <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-[0.14em] text-muted">
            <span>Insights</span>
            <span className="text-emerald-300">+24.6%</span>
          </div>
          <div className="mt-6 flex h-44 items-end gap-2.5 md:h-56 md:gap-3">
            {bars.map((h, i) => (
              <motion.span
                key={i}
                className="flex-1 origin-bottom rounded-t-[8px] bg-gradient-to-t from-cyan-500/30 to-emerald-400/80"
                style={{ height: `${h}%` }}
                animate={{ scaleY: [1, 0.82, 1] }}
                transition={{
                  scaleY: { duration: 3.2, ease: "easeInOut", repeat: Infinity, delay: 0.6 + i * 0.18 },
                }}
              />
            ))}
          </div>
          <div className="mt-4 grid grid-cols-3 gap-3">
            {["Revenue", "Users", "Retention"].map((k) => (
              <div key={k} className="rounded-xl border border-line bg-white/[0.02] px-3 py-2.5">
                <div className="h-1.5 w-8 rounded-full bg-white/15" />
                <div className="mt-2 text-[11px] text-muted">{k}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function CodeGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="m8 6-6 6 6 6M16 6l6 6-6 6" />
    </svg>
  );
}

function ChartGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M3 3v18h18M8 16v-5M13 16V8M18 16v-9" />
    </svg>
  );
}
