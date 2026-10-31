"use client";

import { useScroll } from "framer-motion";
import { useRef } from "react";
import { Hero } from "./Hero";
import { About } from "./About";

/**
 * Hero is pinned (sticky) while the About panel scrolls up and covers it.
 * Both are driven by a single scroll progress so the motion stays in sync.
 */
export function HeroAbout() {
  const aboutRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: aboutRef, offset: ["start end", "start start"] });

  return (
    <div className="relative">
      <Hero coverProgress={scrollYProgress} />
      <div ref={aboutRef} className="relative z-10">
        <About />
      </div>
    </div>
  );
}