"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import {
  motion,
  MotionConfig,
  useMotionValue,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { useSiteReady } from "@/components/providers/Preloader";
import { brand } from "@/data/site";
import { EASE_OUT_EXPO } from "@/lib/utils";

interface BrandRevealProps {
  /** 0 -> 1 as the title shrinks to the top and the portrait rises. */
  reveal?: MotionValue<number>;
  /** 0 -> 1 while the next section slides up over this pinned screen. */
  coverProgress?: MotionValue<number>;
}

/** Where the title ends up, as a share of the screen height, and its final size. */
const FINAL = {
  wide: { titleCenter: 0.117, scaleX: 0.606, scaleY: 0.505, subtitleScale: 0.81 },
  tall: { titleCenter: 0.17, scaleX: 0.72, scaleY: 0.6, subtitleScale: 0.95 },
};
/** Gap between the title's capitals and the subtitle's center, relative to the capitals' height. */
const SUBTITLE_GAP = 0.545;
/** Bebas Neue capitals are 0.7em tall and start at the top of the 0.8em line box. */
const CAP_HEIGHT = 0.7;
const CAP_CENTER_OFFSET = 0.05;

/**
 * Full-screen brand card shown right after the loader. It plays its entrance once, then every
 * further change is tied directly to scroll: the title makes room and the portrait rises into it.
 */
export function BrandReveal({ reveal, coverProgress }: BrandRevealProps) {
  const ready = useSiteReady();
  const fallback = useMotionValue(0);
  const r = reveal ?? fallback;
  const cover = coverProgress ?? fallback;

  const groupRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);

  // Final positions depend on the rendered layout, so they're measured rather than hard-coded.
  const titleDy = useMotionValue(0);
  const subtitleDy = useMotionValue(0);
  const finalScaleX = useMotionValue(FINAL.wide.scaleX);
  const finalScaleY = useMotionValue(FINAL.wide.scaleY);
  const finalSubtitleScale = useMotionValue(FINAL.wide.subtitleScale);

  useEffect(() => {
    const measure = () => {
      const group = groupRef.current;
      const title = titleRef.current;
      const subtitle = subtitleRef.current;
      if (!group || !title || !subtitle) return;

      const final = window.innerWidth < window.innerHeight ? FINAL.tall : FINAL.wide;
      const fontSize = parseFloat(getComputedStyle(title.firstElementChild ?? title).fontSize);
      const titleBoxCenter = group.offsetTop + title.offsetTop + title.offsetHeight / 2;
      const target = window.innerHeight * final.titleCenter;
      const capOffset = CAP_CENTER_OFFSET * fontSize * final.scaleY;
      const capHeight = CAP_HEIGHT * fontSize * final.scaleY;

      titleDy.set(target - titleBoxCenter + capOffset);
      subtitleDy.set(
        target + capHeight / 2 + capHeight * SUBTITLE_GAP - (group.offsetTop + subtitle.offsetTop + subtitle.offsetHeight / 2),
      );
      finalScaleX.set(final.scaleX);
      finalScaleY.set(final.scaleY);
      finalSubtitleScale.set(final.subtitleScale);
    };

    measure();
    document.fonts.ready.then(measure);
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [titleDy, subtitleDy, finalScaleX, finalScaleY, finalSubtitleScale]);

  const titleProgress = useTransform(r, [0, 0.85], [0, 1]);
  const titleY = useTransform([titleProgress, titleDy], ([p, d]: number[]) => p * d);
  const titleScaleX = useTransform([titleProgress, finalScaleX], ([p, s]: number[]) => 1 + (s - 1) * p);
  const titleScaleY = useTransform([titleProgress, finalScaleY], ([p, s]: number[]) => 1 + (s - 1) * p);
  const subtitleY = useTransform([titleProgress, subtitleDy], ([p, d]: number[]) => p * d);
  const subtitleScale = useTransform([titleProgress, finalSubtitleScale], ([p, s]: number[]) => 1 + (s - 1) * p);
  const reflectionOpacity = useTransform(r, [0, 0.22], [1, 0]);

  const figureY = useTransform(r, [0.06, 1], ["88svh", "0svh"]);
  const figureOpacity = useTransform(r, [0.06, 0.26], [0, 1]);
  const haloScale = useTransform(r, [0.3, 1], [0.74, 1]);
  const haloOpacity = useTransform(r, [0.3, 0.95], [0, 1]);

  // The whole composition recedes while it's being covered by the next section.
  const stageY = useTransform(cover, [0, 1], ["0svh", "-14svh"]);
  const stageScale = useTransform(cover, [0, 1], [1, 0.94]);
  const stageOpacity = useTransform(cover, [0.15, 0.9], [1, 0]);
  // Dropped only once fully covered, so it can't show behind the next panel's rounded corners.
  const sectionOpacity = useTransform(cover, [0.998, 1], [1, 0]);

  return (
    <MotionConfig reducedMotion="user">
      <motion.section
        aria-label={`${brand.name}, ${brand.subtitle}`}
        style={{ opacity: sectionOpacity }}
        className="brand-reveal sticky top-0 isolate h-[100svh] overflow-hidden"
      >
        <motion.div
          aria-hidden
          className="brand-ambient"
          initial={{ opacity: 0 }}
          animate={ready ? { opacity: 1 } : undefined}
          transition={{ duration: 1.4, ease: "easeOut" }}
        />

        <motion.div style={{ y: stageY, scale: stageScale, opacity: stageOpacity }} className="brand-stage">
          {/* ---------- Portrait and halo ---------- */}
          <motion.div style={{ y: figureY, opacity: figureOpacity }} className="brand-figure">
            <motion.div aria-hidden style={{ scale: haloScale, opacity: haloOpacity }} className="brand-halo">
              <span className="brand-halo-glow" />
              <svg viewBox="0 0 620 620" className="brand-halo-ring" fill="none">
                <defs>
                  <linearGradient id="brand-ring-fade" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#11d04c" />
                    <stop offset="34%" stopColor="#11d04c" />
                    <stop offset="50%" stopColor="#4fe082" />
                    <stop offset="60%" stopColor="#4fe082" stopOpacity="0" />
                  </linearGradient>
                  <radialGradient id="brand-ring-glint">
                    <stop offset="0%" stopColor="#fff" />
                    <stop offset="35%" stopColor="#fff" stopOpacity=".85" />
                    <stop offset="100%" stopColor="#fff" stopOpacity="0" />
                  </radialGradient>
                </defs>
                <circle cx="310" cy="310" r="307" stroke="url(#brand-ring-fade)" strokeWidth="4.5" />
                <ellipse cx="74" cy="110" rx="24" ry="5" fill="url(#brand-ring-glint)" transform="rotate(-48 74 110)" />
                <ellipse cx="546" cy="110" rx="24" ry="5" fill="url(#brand-ring-glint)" transform="rotate(48 546 110)" />
              </svg>
            </motion.div>
            <Image
              src={brand.portrait}
              alt="Md Arshad Raza"
              width={1086}
              height={1449}
              priority
              // Already prepared at full size; re-encoding here would soften the face.
              unoptimized
              className="brand-portrait"
            />
          </motion.div>

          {/* ---------- Title ---------- */}
          <div aria-hidden ref={groupRef} className="brand-group">
            <motion.div
              ref={titleRef}
              style={{ y: titleY, scaleX: titleScaleX, scaleY: titleScaleY }}
              className="brand-title-wrap"
            >
              <p className="brand-title">
                {brand.name.split("").map((char, i) => (
                  <motion.span
                    key={i}
                    className={i === brand.accentIndex ? "brand-letter brand-letter-x" : "brand-letter"}
                    initial={{ opacity: 0, y: 44 }}
                    animate={ready ? { opacity: 1, y: 0 } : undefined}
                    transition={{ duration: 1.2, ease: EASE_OUT_EXPO, delay: 0.25 + i * 0.035 }}
                  >
                    {i === brand.accentIndex && (
                      <motion.span
                        className="brand-x-glow"
                        initial={{ opacity: 0 }}
                        animate={ready ? { opacity: [0, 0.8, 0.28] } : undefined}
                        transition={{ duration: 2.2, ease: "easeInOut", delay: 0.8, times: [0, 0.55, 1] }}
                      >
                        {char}
                      </motion.span>
                    )}
                    {char}
                  </motion.span>
                ))}
                <motion.span
                  className="brand-reg"
                  initial={{ opacity: 0 }}
                  animate={ready ? { opacity: 1 } : undefined}
                  transition={{ duration: 0.8, ease: "easeOut", delay: 0.75 }}
                >
                  &reg;
                </motion.span>
              </p>
            </motion.div>

            <motion.div
              ref={subtitleRef}
              style={{ y: subtitleY, scale: subtitleScale }}
              className="brand-subtitle"
            >
              <motion.span
                className="brand-rule brand-rule-left"
                initial={{ opacity: 0, scaleX: 0 }}
                animate={ready ? { opacity: 1, scaleX: 1 } : undefined}
                transition={{ duration: 1.2, ease: EASE_OUT_EXPO, delay: 1.05 }}
              />
              <motion.span
                className="brand-subtitle-text"
                initial={{ opacity: 0, y: 14 }}
                animate={ready ? { opacity: 1, y: 0 } : undefined}
                transition={{ duration: 1, ease: EASE_OUT_EXPO, delay: 0.95 }}
              >
                {brand.subtitle}
              </motion.span>
              <motion.span
                className="brand-rule brand-rule-right"
                initial={{ opacity: 0, scaleX: 0 }}
                animate={ready ? { opacity: 1, scaleX: 1 } : undefined}
                transition={{ duration: 1.2, ease: EASE_OUT_EXPO, delay: 1.05 }}
              />
            </motion.div>

            <motion.div style={{ opacity: reflectionOpacity }} className="brand-reflection-wrap">
              <motion.div
                className="brand-reflection"
                initial={{ opacity: 0 }}
                animate={ready ? { opacity: 1 } : undefined}
                transition={{ duration: 1.5, ease: "easeOut", delay: 1.3 }}
              >
                <div className="brand-reflection-text">
                  {brand.name.split("").map((char, i) => (
                    <span key={i} className={i === brand.accentIndex ? "brand-reflection-x" : undefined}>
                      {char}
                    </span>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </motion.section>
    </MotionConfig>
  );
}
