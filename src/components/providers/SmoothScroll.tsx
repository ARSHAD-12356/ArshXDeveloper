"use client";

import { useRouter } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useMemo, type ReactNode } from "react";
import { clearProjectReturn } from "@/lib/projectReturn";

interface ScrollApi {
  scrollTo: (target: string | number | HTMLElement, opts?: { offset?: number; immediate?: boolean }) => void;
  stop: () => void;
  start: () => void;
}

const ScrollContext = createContext<ScrollApi | null>(null);

export function useSmoothScroll() {
  const ctx = useContext(ScrollContext);
  if (!ctx) throw new Error("useSmoothScroll must be used inside <SmoothScroll>");
  return ctx;
}

const HEADER_OFFSET = -24;

/**
 * High-performance native scroll provider:
 * Preserves 100% native browser compositor scrolling for trackpad and mouse wheel,
 * completely eliminating wheel event hijacking, artificial RAF delays, and frame drops.
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const router = useRouter();

  const scrollTo = useCallback<ScrollApi["scrollTo"]>((target, opts = {}) => {
    const offset = opts.offset ?? HEADER_OFFSET;
    // "instant", because "auto" would follow the smooth scrolling set on <html> in CSS.
    const behavior = opts.immediate ? "instant" : "smooth";
    if (typeof target === "number") {
      window.scrollTo({ top: target, behavior });
      return;
    }
    const el = typeof target === "string" ? document.querySelector<HTMLElement>(target) : target;
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY + offset;
      window.scrollTo({ top, behavior });
    } else if (typeof target === "string" && window.location.pathname !== "/") {
      // Sections live on the home page, so from any other page go there first.
      clearProjectReturn();
      router.push(`/${target}`, { scroll: false });
    }
  }, [router]);

  const api = useMemo<ScrollApi>(
    () => ({
      scrollTo,
      stop: () => {
        document.body.style.overflow = "hidden";
      },
      start: () => {
        document.body.style.overflow = "";
      },
    }),
    [scrollTo],
  );

  // Route in-page anchor navigation through native smooth scroll
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey) return;
      const anchor = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]');
      if (!anchor) return;
      const hash = anchor.getAttribute("href");
      if (!hash || hash === "#") return;
      const target = document.querySelector<HTMLElement>(hash);
      if (!target) {
        if (window.location.pathname === "/") return;
        e.preventDefault();
        scrollTo(hash);
        return;
      }
      e.preventDefault();
      scrollTo(hash === "#top" ? 0 : target);
      history.replaceState(null, "", hash);
    };
    document.addEventListener("click", onClick, { passive: false });
    return () => document.removeEventListener("click", onClick);
  }, [scrollTo]);

  return <ScrollContext.Provider value={api}>{children}</ScrollContext.Provider>;
}
