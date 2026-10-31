"use client";

import { motion, useTransform, type MotionValue } from "framer-motion";
import { process } from "@/data/site";

// Ring geometry in SVG units (viewBox 0 0 200 200, centre 100,100).
const R = 80;
// Angle of each word's centre, measured clockwise from the ring's leftmost point.
const WORD_ANGLES = [17, 66, 114, 163];
// Small dots sit between the words.
const DOT_ANGLES = [41.5, 90, 138.5];
const DOT_RADIUS = R + 4;

const point = (deg: number, r: number) => {
  const a = (deg * Math.PI) / 180;
  // Rounded so server and browser trig produce identical markup (avoids hydration mismatch).
  const round = (n: number) => Math.round(n * 1000) / 1000;
  return { x: round(100 - r * Math.cos(a)), y: round(100 - r * Math.sin(a)) };
};

interface ProcessOrbitProps {
  /** 0 -> 1 across the finale scroll. */
  progress: MotionValue<number>;
}

/**
 * ANALYZE - DESIGN - BUILD - DELIVER set on a large circle. Scroll rotates the ring
 * counter-clockwise into place while the project cards shrink away in the centre.
 * Only `rotate` and `opacity` change, so the whole effect runs on the compositor.
 */
export function ProcessOrbit({ progress }: ProcessOrbitProps) {
  const rotate = useTransform(progress, [0.02, 0.85], [140, 0]);
  const opacity = useTransform(progress, [0, 0.08], [0, 1]);

  return (
    <motion.div aria-hidden style={{ opacity }} className="pointer-events-none absolute inset-x-0 top-0 z-30 h-[100svh] overflow-hidden">
      <motion.svg
        viewBox="0 0 200 200"
        style={{ rotate }}
        className="absolute left-1/2 top-[74svh] h-[min(144svh,125vw)] w-[min(144svh,125vw)] -translate-x-1/2 -translate-y-1/2 overflow-visible will-change-transform md:top-[88svh] md:h-[min(144svh,92vw)] md:w-[min(144svh,92vw)]"
      >
        <defs>
          {/* Starts at the left point and runs clockwise over the top, so text on the upper arc reads upright. */}
          <path id="process-orbit" d={`M ${100 - R},100 A ${R},${R} 0 1,1 ${100 + R},100 A ${R},${R} 0 1,1 ${100 - R},100`} />
        </defs>
        {process.map((step, i) => (
          <text key={step.title} className="fill-white font-display uppercase" fontSize="11" fontWeight={800} letterSpacing="0.6">
            <textPath href="#process-orbit" startOffset={`${(WORD_ANGLES[i] / 360) * 100}%`} textAnchor="middle">
              {step.title}
            </textPath>
          </text>
        ))}
        {DOT_ANGLES.map((deg) => {
          const p = point(deg, DOT_RADIUS);
          return <circle key={deg} cx={p.x} cy={p.y} r={1.1} className="fill-white" />;
        })}
      </motion.svg>
    </motion.div>
  );
}