"use client";

import { AnimatePresence, motion } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useSmoothScroll } from "@/components/providers/SmoothScroll";
import { clearProjectReturn } from "@/lib/projectReturn";

interface MenuDrawerProps {
  open: boolean;
  onClose: () => void;
  onExitComplete?: () => void;
}

const MENU_ITEMS = [
  { label: "HOME", num: "01", href: "#top" },
  { label: "ABOUT", num: "02", href: "#about" },
  { label: "PROJECTS", num: "03", href: "#work" },
  { label: "SKILLS", num: "04", href: "#skills" },
  { label: "EXPERIENCE", num: "05", href: "#experience" },
  { label: "CONTACT", num: "06", href: "#contact" },
];

// Origin coordinates aligned with the circular menu/close button in Header (top-right)
const ORIGIN = "at calc(100% - clamp(1rem,4vw,4rem) - 1.75rem) calc(var(--header-h) / 2)";

export function MenuDrawer({ open, onClose, onExitComplete }: MenuDrawerProps) {
  const { stop, start, scrollTo } = useSmoothScroll();
  const panelRef = useRef<HTMLDivElement>(null);
  const [, setActiveItem] = useState<string>("HOME");

  // Lock body scroll and handle keyboard accessibility while open
  useEffect(() => {
    if (!open) return;
    stop();
    document.body.style.overflow = "hidden";
    const previouslyFocused = document.activeElement as HTMLElement | null;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") return onClose();
      if (e.key !== "Tab" || !panelRef.current) return;
      const focusables = panelRef.current.querySelectorAll<HTMLElement>("a, button");
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last?.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      // NOTE: Overflow lock is cleared in onExitComplete so the exit animation remains 100% smooth without layout jump
      previouslyFocused?.focus({ preventScroll: true });
    };
  }, [open, onClose, stop]);

  const pathname = usePathname();
  const router = useRouter();

  const handleNav = (href: string, label: string) => {
    setActiveItem(label);
    onClose();
    window.setTimeout(() => {
      if (pathname !== "/") {
        // This header unmounts with the page, so the exit animation's unlock may never run.
        document.body.style.overflow = "";
        start();
        clearProjectReturn();
        router.push(href === "#top" ? "/" : `/${href}`, { scroll: href === "#top" });
        return;
      }
      scrollTo(href === "#top" ? 0 : href);
      history.replaceState(null, "", href);
    }, 350);
  };

  const handleExitComplete = () => {
    document.body.style.overflow = "";
    start();
    onExitComplete?.();
  };

  return (
    <AnimatePresence onExitComplete={handleExitComplete}>
      {open && (
        <motion.div
          ref={panelRef}
          id="site-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
          initial={{ clipPath: `circle(0% ${ORIGIN})`, opacity: 0.85 }}
          animate={{ clipPath: `circle(150% ${ORIGIN})`, opacity: 1 }}
          exit={{
            clipPath: `circle(0% ${ORIGIN})`,
            opacity: 0.3,
            transition: {
              clipPath: { duration: 0.55, ease: [0.32, 0, 0.24, 1] },
              opacity: { duration: 0.45, ease: "easeIn", delay: 0.1 },
            },
          }}
          transition={{
            clipPath: { duration: 0.85, ease: [0.3, 0.85, 0.25, 1] },
            opacity: { duration: 0.55, ease: "easeOut" },
          }}
          className="fixed inset-0 z-[100] flex flex-col justify-between overflow-x-hidden overflow-y-auto bg-[#050706] text-white selection:bg-[#22d3ee] selection:text-black"
        >
          {/* Ambient Lighting & Visual Effects matching reference */}
          {/* Deep green radial glow on middle-right */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute right-[-5%] top-[25%] h-[65vmax] w-[65vmax] rounded-full bg-emerald-600/[0.09] blur-[150px]"
          />

          {/* Teal ambient glow on bottom-left */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-[15%] -left-[10%] h-[45vmax] w-[45vmax] rounded-full bg-teal-500/[0.08] blur-[140px]"
          />

          {/* Concentric ambient circular arcs in bottom-left corner */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-36 -left-36 h-[520px] w-[520px] rounded-full border border-teal-500/[0.09]"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-20 -left-20 h-[380px] w-[380px] rounded-full border border-teal-500/[0.13]"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-6 -left-6 h-[250px] w-[250px] rounded-full border border-teal-500/[0.18]"
          />

          {/* Glowing radar/beacon orb in upper-right region (matching reference image) */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute right-[15%] top-[14%] hidden md:flex h-9 w-9 items-center justify-center rounded-full border border-emerald-400/35 bg-emerald-950/40 shadow-[0_0_20px_rgba(16,185,129,0.35)]"
          >
            <span className="h-2 w-2 rounded-full bg-white shadow-[0_0_8px_#34d399]" />
          </div>

          <div className="relative z-10 flex min-h-full w-full flex-col justify-between">
            {/* Top Bar: Socials (Left) + Top-Right Spacer matching Header MenuButton */}
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8, transition: { duration: 0.25, ease: "easeIn" } }}
              transition={{ duration: 0.5, ease: [0.3, 0.85, 0.25, 1], delay: 0.18 }}
              className="container-x relative flex min-h-[var(--header-h)] items-center justify-between gap-6"
            >
              {/* Horizontal Social Links Row */}
              <div className="flex items-center gap-2.5 sm:gap-4 text-xs sm:text-[13px] flex-wrap">
                <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-white/50 mr-1 sm:mr-2">
                  SOCIALS
                </span>

                {/* GitHub */}
                <a
                  href="https://github.com/ARSHAD-12356"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-1.5 text-white/80 transition-colors hover:text-white"
                >
                  <svg className="h-3.5 w-3.5 fill-current text-white transition-transform group-hover:scale-110" viewBox="0 0 24 24">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
                  </svg>
                  <span>GitHub</span>
                </a>

                <span className="h-3 w-px bg-white/15" aria-hidden="true" />

                {/* LinkedIn */}
                <a
                  href="https://www.linkedin.com/in/md-arshad-raza-b5097722a/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-1.5 text-white/80 transition-colors hover:text-white"
                >
                  <span className="flex h-3.5 w-3.5 items-center justify-center rounded-[3px] bg-[#0077b5] text-white">
                    <svg className="h-2.5 w-2.5 fill-current" viewBox="0 0 24 24">
                      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.07v8.37h2.78Z" />
                    </svg>
                  </span>
                  <span>LinkedIn</span>
                </a>

                <span className="h-3 w-px bg-white/15" aria-hidden="true" />

                {/* Instagram */}
                <a
                  href="https://www.instagram.com/firarsh1551?vrfl=Nmh1eDFyczN2cXUz"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-1.5 text-white/80 transition-colors hover:text-white"
                >
                  <span className="flex h-3.5 w-3.5 items-center justify-center rounded-[4px] bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] text-white">
                    <svg className="h-2 w-2 stroke-current fill-none stroke-[2.2]" viewBox="0 0 24 24">
                      <rect width="18" height="18" x="3" y="3" rx="5" />
                      <circle cx="12" cy="12" r="3.5" />
                      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
                    </svg>
                  </span>
                  <span>Instagram</span>
                </a>

                <span className="h-3 w-px bg-white/15" aria-hidden="true" />

                {/* Fiverr */}
                <a
                  href="https://www.fiverr.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-1.5 text-white/80 transition-colors hover:text-white"
                >
                  <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#00b22d] text-white font-bold text-[8px] leading-none">
                    fi
                  </span>
                  <span>Fiverr</span>
                </a>

                <span className="h-3 w-px bg-white/15" aria-hidden="true" />

                {/* Email */}
                <a
                  href="mailto:arshuarshad1551@gmail.com"
                  className="group inline-flex items-center gap-1.5 text-white/80 transition-colors hover:text-white"
                >
                  <span className="flex h-3.5 w-3.5 items-center justify-center rounded-[3px] bg-[#ea4335] text-white">
                    <svg className="h-2 w-2 fill-current" viewBox="0 0 24 24">
                      <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                    </svg>
                  </span>
                  <span>Email</span>
                </a>
              </div>

              {/* Spacer matching Header MenuButton */}
              <div aria-hidden="true" className="h-12 w-12 sm:h-13 sm:w-13 md:h-14 md:w-14 shrink-0 pointer-events-none" />
            </motion.div>

            {/* Main Navigation List: 6 Rows with smooth staggered cascade */}
            <nav aria-label="Main navigation" className="container-x my-auto py-6 sm:py-8 md:py-10">
              <ul className="flex flex-col">
                {MENU_ITEMS.map((item, i) => {
                  const isHome = item.label === "HOME";
                  return (
                    <motion.li
                      key={item.label}
                      initial={{ opacity: 0, y: 22 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4, transition: { duration: 0.2, ease: "easeIn" } }}
                      transition={{
                        duration: 0.55,
                        ease: [0.3, 0.85, 0.25, 1],
                        delay: 0.22 + i * 0.055,
                      }}
                      className="relative border-b border-white/[0.08]"
                    >
                      <a
                        href={item.href}
                        onClick={(e) => {
                          e.preventDefault();
                          handleNav(item.href, item.label);
                        }}
                        className="group flex items-center justify-between py-3.5 sm:py-4 md:py-5 lg:py-6 transition-all duration-300 focus-visible:outline-none"
                      >
                        {/* Left Side: Circular Arrow + Large Nav Title */}
                        <div className="flex items-center gap-4 sm:gap-6 md:gap-8 lg:gap-10">
                          {/* Circular Outlined Arrow */}
                          <span
                            aria-hidden="true"
                            className="flex h-9 w-9 sm:h-10 sm:w-10 md:h-12 md:w-12 shrink-0 items-center justify-center rounded-full border border-white/20 text-white transition-all duration-300 group-hover:border-[#22d3ee] group-hover:text-[#22d3ee] group-hover:shadow-[0_0_16px_rgba(34,211,238,0.35)] group-hover:bg-[#22d3ee]/10"
                          >
                            <svg
                              className="h-4 w-4 sm:h-5 sm:w-5 transition-transform duration-300 group-hover:translate-x-0.5"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.8"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M5 12h14M13 5l7 7-7 7" />
                            </svg>
                          </span>

                          {/* Large Nav Label */}
                          <span className="font-display text-[clamp(2.1rem,5vw,4.75rem)] font-extrabold uppercase leading-[0.92] tracking-tight text-white transition-all duration-300 group-hover:translate-x-2 sm:group-hover:translate-x-3 group-hover:text-[#22d3ee]">
                            {isHome ? (
                              <>
                                <span>HO</span>
                                <span className="text-[#22d3ee] transition-colors">ME</span>
                              </>
                            ) : (
                              item.label
                            )}
                          </span>
                        </div>

                        {/* Right Side: Consistent 2-digit number */}
                        <span className="font-mono text-xs sm:text-sm md:text-base font-medium tracking-widest text-white/40 transition-colors duration-300 group-hover:text-white/80">
                          {item.num}
                        </span>
                      </a>
                    </motion.li>
                  );
                })}
              </ul>
            </nav>

            {/* Bottom Row: Profile & Role (Left) + Available for Work Pill (Right) */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8, transition: { duration: 0.25, ease: "easeIn" } }}
              transition={{ duration: 0.5, ease: [0.3, 0.85, 0.25, 1], delay: 0.54 }}
              className="container-x flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between py-6 sm:py-8"
            >
              {/* Profile info with 'A' circular badge */}
              <div className="flex items-center gap-3.5">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/25 bg-white/[0.04] font-bold text-sm text-white">
                  A
                </span>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-white tracking-wide leading-snug">
                    Md Arshad Raza
                  </span>
                  <span className="text-xs text-white/50 tracking-normal leading-snug">
                    Full Stack Developer & Data Analyst
                  </span>
                </div>
              </div>

              {/* Status Pill: Available for Work */}
              <div className="inline-flex self-start sm:self-auto items-center gap-2.5 rounded-full border border-emerald-500/30 bg-[#071711] px-4 py-2 shadow-[0_0_15px_rgba(16,185,129,0.18)]">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#10b981] opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-[#10b981] shadow-[0_0_8px_#10b981]" />
                </span>
                <span className="font-sans text-[11px] sm:text-xs font-bold uppercase tracking-[0.14em] text-white/90">
                  AVAILABLE FOR WORK
                </span>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}