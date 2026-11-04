"use client";

import { useEffect, useRef } from "react";

const TYPE_MS = 72;
const ERASE_MS = 34;
const HOLD_MS = 1800;
const GAP_MS = 260;

/** The role text's green. Same gradient as "GREAT" in the contact heading. */
export const ROLE_GRADIENT = "bg-gradient-to-r from-[#00d294] via-[#00c785] to-[#00c5d6]";

/**
 * Types each role letter by letter, holds it, erases it and moves on to the next, forever.
 * The text is set straight on the DOM, so the page doesn't re-render for each letter, and the
 * loop waits while the line is off screen. With reduced motion only the first role is shown.
 */
export function RoleTypewriter({
  roles,
  play,
  startDelay = 0,
}: {
  roles: readonly string[];
  play: boolean;
  startDelay?: number;
}) {
  const textRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const node = textRef.current;
    if (!play || !node) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      node.textContent = roles[0];
      return;
    }

    let role = 0;
    let count = 0;
    let erasing = false;
    let onScreen = true;
    let waiting = false;
    let timer: ReturnType<typeof setTimeout>;

    const step = () => {
      if (!onScreen) {
        waiting = true;
        return;
      }
      const word = roles[role];
      if (!erasing) {
        if (count < word.length) {
          count++;
          node.textContent = word.slice(0, count);
          timer = setTimeout(step, TYPE_MS);
        } else {
          erasing = true;
          timer = setTimeout(step, HOLD_MS);
        }
      } else if (count > 0) {
        count--;
        node.textContent = word.slice(0, count);
        timer = setTimeout(step, ERASE_MS);
      } else {
        erasing = false;
        role = (role + 1) % roles.length;
        timer = setTimeout(step, GAP_MS);
      }
    };

    const observer = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      if (onScreen && waiting) {
        waiting = false;
        step();
      }
    });
    observer.observe(node.parentElement ?? node);
    timer = setTimeout(step, startDelay);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
      node.textContent = "";
    };
  }, [play, roles, startDelay]);

  return (
    <span className="whitespace-pre">
      {/* The padding keeps tight tracking from clipping the last letter. */}
      <span ref={textRef} className={`${ROLE_GRADIENT} bg-clip-text pr-[0.04em] text-transparent`} />
      <span className="intro-caret" />
    </span>
  );
}
