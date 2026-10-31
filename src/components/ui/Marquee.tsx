import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface MarqueeProps {
  children: ReactNode;
  reverse?: boolean;
  /** Seconds per loop. */
  duration?: number;
  className?: string;
  /** Fade the edges out with a mask. */
  fade?: boolean;
  /** Pause while the pointer is over the strip. */
  pauseOnHover?: boolean;
}

/** GPU-only infinite marquee (content duplicated once, translated -50%). Optionally pauses on hover. */
export function Marquee({ children, reverse, duration = 40, className, fade = true, pauseOnHover = true }: MarqueeProps) {
  return (
    <div
      className={cn("group relative flex overflow-hidden", fade && "[mask-image:linear-gradient(90deg,transparent,#000_10%,#000_90%,transparent)]", className)}
    >
      <div
        className={cn("flex w-max shrink-0 animate-marquee", pauseOnHover && "group-hover:[animation-play-state:paused]")}
        style={{ ["--marquee-duration" as string]: `${duration}s`, animationDirection: reverse ? "reverse" : "normal" }}
      >
        <div className="flex shrink-0 items-center">{children}</div>
        <div aria-hidden className="flex shrink-0 items-center">
          {children}
        </div>
      </div>
    </div>
  );
}