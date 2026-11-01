"use client";

import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { useSmoothScroll } from "@/components/providers/SmoothScroll";
import { CodeIcon } from "@/components/ui/Icons";
import { SpaceCanvas } from "@/components/ui/SpaceCanvas";

/** How long the loader plays at minimum, so it never just flashes on a fast connection. */
const MIN_DURATION = 5000;
const MIN_DURATION_REDUCED = 900;
/** Slow networks: stop waiting on assets after this and reveal anyway. */
const MAX_ASSET_WAIT = 12000;
/** Progress holds here, inside "Loading Assets", until fonts and page assets have really loaded. */
const ASSET_HOLD = 88;
const COMPLETE_HOLD = 350;
const EXIT_DURATION = 900;

const STEPS = [
  { label: "Initializing", from: 0 },
  { label: "Preparing UI", from: 30 },
  { label: "Loading Assets", from: 75 },
  { label: "Almost Ready", from: 90 },
];

type Phase = "loading" | "exit" | "done";

const SiteReadyContext = createContext(true);

/** False while the loader covers the page; entrance animations wait for this. */
export const useSiteReady = () => useContext(SiteReadyContext);

export function PreloaderProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  return (
    <SiteReadyContext.Provider value={ready}>
      <Preloader onReveal={() => setReady(true)} />
      {children}
    </SiteReadyContext.Provider>
  );
}

const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2);
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

function Preloader({ onReveal }: { onReveal: () => void }) {
  const [phase, setPhase] = useState<Phase>("loading");
  const [step, setStep] = useState(0);
  const { stop, start } = useSmoothScroll();

  const fillRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const percentRef = useRef<HTMLSpanElement>(null);
  const linkRefs = useRef<(HTMLSpanElement | null)[]>([]);

  // Progress is painted straight to the DOM each frame so React never re-renders at 60fps.
  useEffect(() => {
    stop();
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const minDuration = reduced ? MIN_DURATION_REDUCED : MIN_DURATION;

    const paint = (p: number) => {
      if (fillRef.current) fillRef.current.style.transform = `translate3d(${p - 100}%, 0, 0)`;
      if (glowRef.current) glowRef.current.style.transform = `scaleX(${p / 100})`;
      if (percentRef.current) percentRef.current.textContent = `${Math.round(p)}%`;
      linkRefs.current.forEach((link, i) => {
        if (!link) return;
        const t = clamp01((p - STEPS[i].from) / (STEPS[i + 1].from - STEPS[i].from));
        link.style.transform = `scaleX(${t})`;
      });
    };

    let assetsLoaded = false;
    const pageLoaded = new Promise<void>((resolve) => {
      if (document.readyState === "complete") resolve();
      else window.addEventListener("load", () => resolve(), { once: true });
    });
    Promise.all([document.fonts.ready, pageLoaded]).then(() => {
      assetsLoaded = true;
    });

    const timers: number[] = [];
    const startedAt = performance.now();
    let progress = 0;
    let raf = 0;

    const tick = (now: number) => {
      const elapsed = now - startedAt;
      const timed = easeInOut(Math.min(elapsed / minDuration, 1)) * 100;
      const cap = assetsLoaded || elapsed > MAX_ASSET_WAIT ? 100 : ASSET_HOLD;
      const target = Math.min(timed, cap);
      progress += (target - progress) * 0.14;
      if (target === 100 && progress > 99.6) progress = 100;
      paint(progress);

      if (progress === 100) {
        setStep(STEPS.length);
        timers.push(
          window.setTimeout(() => {
            setPhase("exit");
            onReveal();
          }, COMPLETE_HOLD),
          window.setTimeout(() => {
            setPhase("done");
            start();
          }, COMPLETE_HOLD + EXIT_DURATION),
        );
        return;
      }

      let current = 0;
      STEPS.forEach((s, i) => {
        if (progress >= s.from) current = i;
      });
      setStep(current);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      timers.forEach(clearTimeout);
      start();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (phase === "done") return null;

  return (
    <div id="preloader" data-phase={phase} role="status" className="preloader fixed inset-0 z-[150] overflow-hidden bg-black text-white">
      <span className="sr-only">Loading portfolio</span>
      {/* Without JS nothing could dismiss the loader, so never show it. */}
      <noscript>
        <style>{"#preloader{display:none}"}</style>
      </noscript>

      {/* Painted layers, cut from the design so they can each move on their own */}
      <div aria-hidden className="sl-plate">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/loader/space-base.webp" alt="" fetchPriority="high" className="absolute inset-0 h-full w-full" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/loader/nebula-tl.webp" alt="" className="sl-layer sl-nebula-tl" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/loader/nebula-r.webp" alt="" className="sl-layer sl-nebula-r" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/loader/galaxy.webp" alt="" className="sl-layer sl-galaxy" />
        <span className="sl-flare" />
      </div>

      <SpaceCanvas />

      <div aria-hidden className="sl-stage">
        {/* ---------- Orbital ring + logo ---------- */}
        <div className="sl-ring">
          <span className="sl-ring-glow" />
          <span className="sl-disc" />
          <OrbitalMarks />
          <span className="sl-ring-line" />
          <div className="sl-orbit">
            <div className="sl-comet">
              <span className="sl-trail" />
            </div>
            <span className="sl-head" />
          </div>
          <div className="sl-logo">
            <span>ARSH</span>
            <span className="sl-logo-x">X</span>
            <span>CODER</span>
            <span className="sl-logo-reg">&reg;</span>
          </div>
        </div>

        <p className="sl-title">
          <span className="sl-title-word">LOADING</span>
          <span className="sl-title-word sl-title-green">PORTFOLIO</span>
          <span>...</span>
        </p>

        {/* ---------- Progress ---------- */}
        <div className="sl-progress">
          <div className="sl-bar-wrap">
            <div ref={glowRef} className="sl-bar-glow" />
            <div className="sl-bar">
              <div ref={fillRef} className="sl-bar-fill">
                <div className="sl-bar-stripes">
                  <span />
                </div>
              </div>
            </div>
          </div>
          <span ref={percentRef} className="sl-percent">0%</span>
        </div>

        {/* ---------- Stages ---------- */}
        <ol className="sl-steps">
          {STEPS.map((s, i) => {
            const state = i < step ? "done" : i === step ? "active" : "pending";
            return (
              <li key={s.label} data-state={state} className="sl-step">
                {i < STEPS.length - 1 && (
                  <span className="sl-link">
                    <span
                      ref={(el) => {
                        linkRefs.current[i] = el;
                      }}
                      className="sl-link-fill"
                    />
                  </span>
                )}
                <span className="sl-dot">
                  <StepIcon index={i} />
                  <svg className="sl-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                </span>
                <span className="sl-label">{s.label}</span>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}

const polar = (r: number, deg: number) => {
  const a = ((deg - 90) * Math.PI) / 180;
  return { cx: (250 + r * Math.cos(a)).toFixed(2), cy: (250 + r * Math.sin(a)).toFixed(2) };
};
const range = (from: number, to: number, step: number) => {
  const out: number[] = [];
  for (let d = from; d <= to; d += step) out.push(d);
  return out;
};

/** The fine arcs and dotted tracks surrounding the main ring. */
function OrbitalMarks() {
  return (
    <svg viewBox="0 0 500 500" className="sl-marks" fill="none">
      {/* Secondary outline: strong from the top, thinning out clockwise */}
      <circle cx="250" cy="250" r="211" stroke="#1fa56c" strokeOpacity=".75" strokeWidth="1.1" pathLength="360" strokeDasharray="72 288" transform="rotate(-90 250 250)" />
      <circle cx="250" cy="250" r="211" stroke="#1fa56c" strokeOpacity=".28" strokeWidth="1" pathLength="360" strokeDasharray="60 300" transform="rotate(-18 250 250)" />
      {/* Outermost hairline across the top */}
      <circle cx="250" cy="250" r="237" stroke="#1c8a5c" strokeOpacity=".42" strokeWidth=".9" pathLength="360" strokeDasharray="66 294" transform="rotate(-128 250 250)" />
      {/* Dotted tracks */}
      {range(-96, -2, 2).map((d) => (
        <circle key={`a${d}`} {...polar(204, d)} r="1" fill="#2fe394" opacity={(0.9 * (d + 110)) / 110} />
      ))}
      {range(-152, -98, 3).map((d) => (
        <circle key={`b${d}`} {...polar(222, d)} r=".8" fill="#2fe394" opacity=".28" />
      ))}
      {range(58, 134, 2.5).map((d) => (
        <circle key={`c${d}`} {...polar(226, d)} r=".85" fill="#2fe394" opacity=".32" />
      ))}
    </svg>
  );
}

function StepIcon({ index }: { index: number }) {
  if (index === 1) return <CodeIcon size={24} strokeWidth={2.2} className="sl-icon" />;
  if (index === 2) {
    return (
      <svg className="sl-icon" width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2.5 22 8l-10 5.5L2 8l10-5.5Z" />
        <path d="m4.6 11.1 7.4 4.1 7.4-4.1 2.6 1.4-10 5.5-10-5.5 2.6-1.4Z" opacity=".8" />
        <path d="m4.6 15.6 7.4 4.1 7.4-4.1 2.6 1.4-10 5.5-10-5.5 2.6-1.4Z" opacity=".6" />
      </svg>
    );
  }
  if (index === 3) {
    return (
      <svg className="sl-icon" width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
        <path fillRule="evenodd" d="M21.5 2.5s.3 3.6-1.3 7.2c-1.2 2.7-3.2 4.9-5.6 6.7l-1 .7-5.7-5.7.7-1c1.8-2.4 4-4.4 6.7-5.6 3.6-1.6 6.2-2.3 6.2-2.3ZM15.8 6.6a1.7 1.7 0 1 0 0 3.4 1.7 1.7 0 0 0 0-3.4Z" />
        <path d="M7.2 10.4 3 11l-1.4 2.9 4.1.4 1.5-3.9ZM13.6 16.8l-.6 4.2-2.9 1.4-.4-4.1 3.9-1.5ZM5.6 16.2c-1.5 1-2.3 4.3-2.3 4.3s3.3-.8 4.3-2.3l-2-2Z" />
      </svg>
    );
  }
  // Initializing always reads as the check mark, as in the design
  return (
    <svg className="sl-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}
