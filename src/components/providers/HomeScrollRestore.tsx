"use client";

import { useLayoutEffect } from "react";
import { useSmoothScroll } from "@/components/providers/SmoothScroll";
import { takeProjectReturn } from "@/lib/projectReturn";

/**
 * Coming back to the home page lands straight on the right spot, with no long scroll from the top:
 * the card the visitor left from, or else the section named in the URL.
 */
export function HomeScrollRestore() {
  const { scrollTo } = useSmoothScroll();

  useLayoutEffect(() => {
    const y = takeProjectReturn();
    if (y !== null) {
      scrollTo(y, { immediate: true });
      return;
    }
    const hash = window.location.hash;
    if (hash && hash !== "#top") scrollTo(hash, { immediate: true });
  }, [scrollTo]);

  return null;
}
