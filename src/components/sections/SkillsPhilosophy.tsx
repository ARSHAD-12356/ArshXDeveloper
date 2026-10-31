"use client";

import { motion, useMotionValueEvent, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { philosophy } from "@/data/site";
import { cn } from "@/lib/utils";
import { ArrowUpRight } from "@/components/ui/Icons";
import { Marquee } from "@/components/ui/Marquee";
import { TechIcon } from "@/components/ui/TechIcon";

// Starting window (percent insets of the stage) for the small "peek" box in the centre.
const BOX = { top: 34, right: 39.5, bottom: 34, left: 38.5 };
const HEADER_LABEL = "Skills & Philosophy";
const easeInCubic = (v: number) => v * v * v;

/**
 * A white panel rises over the pinned process ring. A thick black arc draws toward the centre,
 * meets a small framed "window" onto the section, and the window then grows (slowly, then
 * suddenly) until the section fills the screen.
 *
 * Scroll budget (260svh): 0 - 0.385 panel rises, 0.4 - 0.82 window grows, then a short hold.
 * A further 100svh keeps the stage pinned (drifting up slowly) while "More about me" slides over it.
 */
export function SkillsPhilosophy() {
  const trackRef = useRef<HTMLDivElement>(null);
  const exitRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  // Stage size in px, so the arc is drawn in real pixels (keeps the stroke solid and even).
  const [size, setSize] = useState({ w: 1440, h: 800 });
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setSize({ w: e.contentRect.width, h: e.contentRect.height }));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const { w, h } = size;
  const arc = `M ${w * 0.14} ${-h * 0.02} Q ${w * 0.16} ${h * 0.4} ${(w * BOX.left) / 100} ${h * 0.5}`;
  const { scrollYProgress: p } = useScroll({ target: trackRef, offset: ["start end", "end end"] });
  // Exit: the pinned stage drifts up slower than the page while the next section covers it.
  const { scrollYProgress: exit } = useScroll({ target: exitRef, offset: ["start end", "end end"] });
  const stageY = useTransform(exit, [0, 1], ["0%", "-35%"]);

  // Arc draws in while the panel rises, ending exactly at the window's left edge.
  const pathLength = useTransform(p, [0.03, 0.385], [0.3, 1]);
  // Window fades in after the panel is half way up.
  const boxOpacity = useTransform(p, [0.2, 0.26], [0, 1]);
  // Growth: slow at first, then rushes to full screen.
  const grow = useTransform(p, [0.4, 0.82], [0, 1], { ease: easeInCubic });
  const inset = (side: keyof typeof BOX) => useTransform(grow, (g) => `${BOX[side] * (1 - g)}%`);
  const top = inset("top");
  const right = inset("right");
  const bottom = inset("bottom");
  const left = inset("left");
  const clipPath = useTransform(grow, (g) => {
    const k = 1 - g;
    return `inset(${BOX.top * k}% ${BOX.right * k}% ${BOX.bottom * k}% ${BOX.left * k}%)`;
  });
  const frameFade = useTransform(grow, [0.9, 1], [1, 0]);
  const frameOpacity = useTransform([boxOpacity, frameFade], ([a, b]) => (a as number) * (b as number));

  // Tell the header which section it sits on once the window has opened (no React render).
  useMotionValueEvent(p, "change", (v) => {
    if (stageRef.current) stageRef.current.dataset.headerLabel = v > 0.8 ? HEADER_LABEL : "";
  });

  return (
    <section id="skills" aria-labelledby="skills-title" className="relative z-20 -mt-[100svh]">
      <div className="relative h-[360svh]">
        <div ref={trackRef} aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[260svh]" />
        <div ref={exitRef} aria-hidden className="pointer-events-none absolute inset-x-0 top-[260svh] h-[100svh]" />
        <motion.div
          ref={stageRef}
          data-header-theme="light"
          style={{ y: stageY }}
          className="sticky top-0 h-[100svh] overflow-hidden bg-white text-ink will-change-transform"
        >
          {/* Thick arc sweeping toward the window */}
          <svg aria-hidden viewBox={`0 0 ${w} ${h}`} className="absolute inset-0 z-10 h-full w-full overflow-visible">
            <motion.path d={arc} fill="none" stroke="#0a0a0a" strokeWidth={7} strokeLinecap="round" style={{ pathLength }} />
          </svg>

          {/* The section itself, revealed through a growing clip window */}
          <motion.div style={{ clipPath, opacity: boxOpacity }} className="absolute inset-0 z-20 bg-white will-change-[clip-path]">
            <SkillsContent />
          </motion.div>

          {/* Thin frame tracing the window edge */}
          <motion.div
            aria-hidden
            style={{ top, right, bottom, left, opacity: frameOpacity }}
            className="pointer-events-none absolute z-30 border-[1.5px] border-ink"
          />
        </motion.div>
      </div>
    </section>
  );
}

function SkillsContent() {
  return (
    <div className="flex h-full flex-col justify-between pt-[calc(var(--header-h)+2svh)]">
      <div className="container-x md:pl-[18%]">
        <h2 id="skills-title" className="sr-only">
          Skills and philosophy
        </h2>
        <blockquote className="font-display text-[clamp(1.9rem,min(5.4vw,9.5svh),5.75rem)] font-extrabold uppercase leading-[1.02] tracking-tight">
          {philosophy.quoteLines.map((line, i) => (
            <span key={line} className="md:block">
              {i === 0 && "\u201C"}
              {line}
              {i === philosophy.quoteLines.length - 1 ? "\u201D" : " "}
            </span>
          ))}
        </blockquote>
        <p className="mt-[clamp(0.75rem,2svh,1.5rem)] text-sm text-ink/70">- {philosophy.author}</p>
      </div>

      <ul className="border-t border-ink">
        {philosophy.skills.map((group) => (
          <SkillRow key={group.label} label={group.label} items={group.items} />
        ))}
      </ul>
    </div>
  );
}

/**
 * A row that turns into a black marquee of logos + names while hovered (or tapped / focused),
 * then settles back to its label. Fixed height, so nothing below it shifts.
 */
function SkillRow({ label, items }: { label: string; items: string[] }) {
  const [active, setActive] = useState(false);
  // Repeat the list so one copy is always wider than the screen (seamless loop).
  const loop = [...items, ...items];

  return (
    <li
      className="relative h-[clamp(3.25rem,9.5svh,4.75rem)] overflow-hidden border-b border-ink last:border-b-0"
      onPointerEnter={(e) => e.pointerType === "mouse" && setActive(true)}
      onPointerLeave={(e) => e.pointerType === "mouse" && setActive(false)}
    >
      <button
        type="button"
        aria-expanded={active}
        aria-label={`${label}: ${items.join(", ")}`}
        onClick={() => setActive((v) => !v)}
        onFocus={() => setActive(true)}
        onBlur={() => setActive(false)}
        className="container-x flex h-full w-full items-center text-left md:pl-[10%]"
      >
        <span
          className={cn(
            "flex items-center gap-3 font-display text-[clamp(1rem,1.5vw,1.35rem)] font-extrabold uppercase tracking-tight transition-[opacity,translate] duration-500 ease-out-expo",
            active && "-translate-y-3 opacity-0",
          )}
        >
          {label}
          <ArrowUpRight size={18} />
        </span>
      </button>

      {/* Black band slides up over the label */}
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-0 flex items-center bg-ink text-white transition-[translate,opacity] duration-500 ease-out-expo",
          active ? "translate-y-0 opacity-100" : "translate-y-full opacity-0",
        )}
      >
        <Marquee duration={items.length * 3.2} fade={false} pauseOnHover={false} className="w-full">
            {loop.map((item, i) => (
              <span key={`${item}-${i}`} className="flex items-center gap-4 px-[clamp(1.25rem,2.6vw,2.75rem)]">
                <TechIcon name={item} onDark className="h-[clamp(1.5rem,3.6svh,2rem)] hover:scale-100" />
                <span className="whitespace-nowrap font-display text-[clamp(0.95rem,1.35vw,1.25rem)] font-extrabold uppercase tracking-tight">
                  {item}
                </span>
              </span>
            ))}
        </Marquee>
      </div>
    </li>
  );
}