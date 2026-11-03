"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { useEffect, useState } from "react";
import { brand, profile } from "@/data/site";
import { cn, EASE_OUT_EXPO } from "@/lib/utils";
import { useSiteReady } from "@/components/providers/Preloader";
import { AvailabilityBadge } from "@/components/ui/AvailabilityBadge";
import { MenuDrawer } from "./MenuDrawer";

/** Scroll position where the pinned brand card has been fully covered by the next section. */
const brandCardEnd = () => {
  const pin = document.querySelector<HTMLElement>("[data-header-hide]");
  return pin ? pin.offsetHeight - window.innerHeight : 0;
};

export function Header() {
  const ready = useSiteReady();
  const [open, setOpen] = useState(false);
  const [menuClosing, setMenuClosing] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [light, setLight] = useState(false);
  const [intro, setIntro] = useState(false);
  const [onBrand, setOnBrand] = useState(true);
  const [label, setLabel] = useState("");
  const { scrollY } = useScroll();

  const isMenuVisible = open || menuClosing;

  // Glass background once scrolled; tuck away while scrolling down, return on scroll up.
  // Also flips to dark-on-light while a light section sits under the header bar.
  const syncTheme = () => {
    const probe = 44;
    const under = (el: HTMLElement) => {
      const r = el.getBoundingClientRect();
      return r.top <= probe && r.bottom >= probe;
    };
    let onLight = false;
    let nextLabel = "";
    document.querySelectorAll<HTMLElement>("[data-header-theme=light]").forEach((el) => {
      if (under(el)) {
        onLight = true;
        nextLabel = el.dataset.headerLabel ?? "";
      }
    });
    // A dark section layered over a light one (e.g. sliding up across it) takes precedence.
    document.querySelectorAll<HTMLElement>("[data-header-theme=dark]").forEach((el) => {
      if (under(el)) {
        onLight = false;
        nextLabel = "";
      }
    });
    setLight(onLight);
    setLabel(nextLabel);
    // The light introduction panel keeps the badge and uses an outlined menu button.
    let onIntro = false;
    document.querySelectorAll<HTMLElement>("[data-header-theme=intro]").forEach((el) => {
      if (under(el)) onIntro = true;
    });
    setIntro(onIntro);
    // The full-screen brand card shows no header until the next panel has reached the top.
    const brandCard = document.querySelector<HTMLElement>("[data-header-hide]");
    setOnBrand(!!brandCard && under(brandCard) && !onIntro);
  };

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    // Measured from the end of the brand card, which takes up the first screen of scrolling.
    const start = brandCardEnd();
    setScrolled(y > start + 40);
    setHidden(y > prev && y > start + 400);
    // Next frame, so sections moved by scroll-linked transforms are read in their new position.
    requestAnimationFrame(syncTheme);
  });

  // Scroll events don't fire on first paint, so resolve the theme for the initial position too.
  useEffect(() => {
    const start = brandCardEnd();
    setScrolled(window.scrollY > start + 40);
    syncTheme();
    // Re-checked at reveal, when the page's layout has certainly settled.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready]);

  const handleToggle = () => {
    if (open) {
      setOpen(false);
      setMenuClosing(true);
    } else {
      setOpen(true);
      setMenuClosing(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setMenuClosing(true);
  };

  const handleExitComplete = () => {
    setMenuClosing(false);
  };

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={!ready || (onBrand && !isMenuVisible) ? { y: -100, opacity: 0 } : { y: hidden && !isMenuVisible ? "-110%" : 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: EASE_OUT_EXPO }}
        className="fixed inset-x-0 top-0 z-[110]"
      >
        <div
          className={cn(
            "border-b transition-[background-color,border-color] duration-500",
            isMenuVisible
              ? "border-transparent bg-transparent"
              : intro
                ? cn("text-ink", scrolled ? "border-black/5 bg-white/75 backdrop-blur-[6px]" : "border-transparent bg-transparent")
                : light
                ? "border-transparent bg-transparent text-ink"
                : scrolled
                  ? "border-line bg-ink/80 backdrop-blur-[6px]"
                  : "border-transparent bg-transparent",
          )}
        >
          <div className="container-x relative flex h-[var(--header-h)] items-center justify-between gap-6">
            {/* Brand Logo: fades smoothly when menu overlay opens */}
            <div className={cn("transition-opacity duration-400", isMenuVisible ? "opacity-0 pointer-events-none" : "opacity-100")}>
              <a
                href="#top"
                aria-label={`${profile.name} - back to top`}
                className="font-display text-[1.15rem] font-extrabold uppercase tracking-tight sm:text-2xl md:text-[1.75rem]"
              >
                <span className="block leading-none">
                  {brand.name.slice(0, brand.accentIndex)}
                  <span className="text-[#00d879]">{brand.name[brand.accentIndex]}</span>
                  {brand.name.slice(brand.accentIndex + 1)}
                  <sup className="ml-0.5 text-[0.45em] font-semibold">&reg;</sup>
                </span>
                <AnimatePresence>
                  {label && (
                    <motion.span
                      key={label}
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.35, ease: EASE_OUT_EXPO }}
                      className="mt-1 block font-serif text-[0.62rem] font-bold leading-none tracking-[0.06em]"
                    >
                      {label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </a>
            </div>

            <AnimatePresence>
              {profile.available && (!light || intro) && !isMenuVisible && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  className={
                    intro
                      ? // Phones have no room to center it, so here it sits between the logo and the menu.
                        "theme-light flex max-[359px]:hidden sm:absolute sm:left-1/2 sm:-translate-x-1/2"
                      : "absolute left-1/2 hidden -translate-x-1/2 sm:flex"
                  }
                >
                  <AvailabilityBadge light={intro} />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Seamless Hamburger <-> Close (X) button with smooth morph animation */}
            <MenuButton open={open} light={light} intro={intro} onClick={handleToggle} />
          </div>
        </div>
      </motion.header>

      <MenuDrawer open={open} onClose={handleClose} onExitComplete={handleExitComplete} />
    </>
  );
}

/**
 * Animated circular button that smoothly transforms between 3-line Hamburger and Close (X).
 * Preserves button position, circular border, and centers the lines with cubic-bezier easing.
 */
function MenuButton({ open, light, intro, onClick }: { open: boolean; light: boolean; intro: boolean; onClick: () => void }) {
  const bar = intro && !open ? "bg-ink" : "bg-white";
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={open ? "Close menu" : "Open menu"}
      aria-expanded={open}
      aria-controls="site-menu"
      className={cn(
        "group relative flex h-12 w-12 sm:h-13 sm:w-13 md:h-14 md:w-14 shrink-0 items-center justify-center rounded-full border transition-all duration-400 ease-[cubic-bezier(0.25,1,0.35,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400",
        open
          ? "border-white/20 bg-transparent hover:border-white/60 hover:bg-white/[0.06]"
          : intro
            ? "border-black/10 bg-white shadow-[0_6px_18px_-12px_rgba(0,0,0,0.3)] hover:border-black/40"
            : light
            ? "border-ink bg-ink hover:bg-ink/85"
            : "border-line-strong bg-ink/40 backdrop-blur-md hover:border-white/60 hover:bg-white/[0.06]",
      )}
    >
      <div className="relative flex h-5 w-5 items-center justify-center pointer-events-none">
        {/* Top bar: translates to center and rotates 45deg */}
        <span
          className={cn(
            "absolute h-[1.8px] w-5 rounded-full transition-all duration-400 ease-[cubic-bezier(0.25,1,0.35,1)] origin-center",
            bar,
            open ? "translate-y-0 rotate-45" : "-translate-y-[6px] rotate-0"
          )}
        />
        {/* Middle bar: collapses width and fades out */}
        <span
          className={cn(
            "absolute h-[1.8px] rounded-full transition-all duration-300 ease-[cubic-bezier(0.25,1,0.35,1)] origin-center",
            bar,
            open ? "w-0 opacity-0" : "w-5 opacity-100 group-hover:w-3.5 ml-auto"
          )}
        />
        {/* Bottom bar: translates to center and rotates -45deg */}
        <span
          className={cn(
            "absolute h-[1.8px] w-5 rounded-full transition-all duration-400 ease-[cubic-bezier(0.25,1,0.35,1)] origin-center",
            bar,
            open ? "translate-y-0 -rotate-45" : "translate-y-[6px] rotate-0"
          )}
        />
      </div>
    </button>
  );
}