"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import type { MediaAsset } from "@/types";
import { cn } from "@/lib/utils";

interface MediaProps {
  media?: MediaAsset;
  /** Shown in the placeholder when no media is provided. */
  label?: string;
  accent?: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
}

/**
 * Drop-in media slot. Pass an image or video asset — or nothing, to get a
 * styled browser-mockup placeholder that is ready for asset insertion.
 * Fills its parent (parent must be positioned and sized).
 */
export function Media({ media, label, accent = "#3ddc97", className, sizes = "(min-width: 1024px) 60vw, 100vw", priority }: MediaProps) {
  if (!media) return <MediaPlaceholder label={label} accent={accent} className={className} />;
  if (media.type === "video") return <AutoVideo media={media} className={className} />;
  const isContain = className?.includes("object-contain");
  return (
    <Image
      src={media.src}
      alt={media.alt}
      fill
      sizes={sizes}
      priority={priority}
      quality={82}
      style={isContain ? { objectFit: "contain", objectPosition: "center" } : undefined}
      className={cn(isContain ? "object-contain object-center" : "object-cover object-top", className)}
    />
  );
}

function AutoVideo({ media, className }: { media: Extract<MediaAsset, { type: "video" }>; className?: string }) {
  const ref = useRef<HTMLVideoElement>(null);

  // Only decode while on screen.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) el.play().catch(() => {});
      else el.pause();
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <video
      ref={ref}
      src={media.src}
      poster={media.poster}
      aria-label={media.alt}
      muted
      loop
      playsInline
      preload="metadata"
      className={cn("absolute inset-0 h-full w-full object-cover", className)}
    />
  );
}

function MediaPlaceholder({ label, accent, className }: { label?: string; accent: string; className?: string }) {
  return (
    <div
      className={cn("absolute inset-0 flex flex-col overflow-hidden bg-ink-3", className)}
      style={{ background: `radial-gradient(120% 80% at 80% 0%, ${accent}33, transparent 60%), #141414` }}
    >
      <div className="flex items-center gap-1.5 border-b border-line px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
        <span className="ml-3 h-4 flex-1 max-w-56 rounded-full bg-white/5" />
      </div>
      <div className="grid flex-1 grid-cols-[1fr_2fr] gap-4 p-6">
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-3 rounded-full bg-white/5" style={{ width: `${90 - i * 9}%` }} />
          ))}
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex-1 rounded-xl border border-line" style={{ background: `linear-gradient(135deg, ${accent}22, transparent)` }} />
          <div className="grid h-1/3 grid-cols-3 gap-4">
            <div className="rounded-xl bg-white/5" />
            <div className="rounded-xl bg-white/5" />
            <div className="rounded-xl bg-white/5" />
          </div>
        </div>
      </div>
      {label && (
        <span className="absolute bottom-4 right-5 font-mono text-[10px] uppercase tracking-[0.2em] text-white/30">{label}</span>
      )}
    </div>
  );
}
