import { cn } from "@/lib/utils";

export function AvailabilityBadge({
  className,
  label = "Available for work",
  light = false,
}: {
  className?: string;
  label?: string;
  /** Solid white pill for light panels, compact enough to share a phone header with the logo. */
  light?: boolean;
}) {
  return (
    <span
      className={cn(
        "flex items-center rounded-full border",
        light
          ? "gap-1.5 border-black/10 bg-white px-2.5 py-1.5 shadow-[0_6px_18px_-12px_rgba(0,0,0,0.3)] sm:gap-2.5 sm:px-4 sm:py-2"
          : "gap-2.5 border-line bg-white/[0.03] px-3.5 py-1.5 backdrop-blur-md",
        className,
      )}
    >
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-pulse-ring rounded-full bg-accent" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-accent shadow-[0_0_12px_2px] shadow-accent/70" />
      </span>
      <span
        className={cn(
          "whitespace-nowrap uppercase",
          light
            ? "text-[8px] font-bold tracking-[0.1em] text-[#17191b] sm:text-[11px] sm:tracking-[0.16em]"
            : "text-[10px] font-semibold tracking-[0.25em] text-fg/90",
        )}
      >
        {label}
      </span>
    </span>
  );
}
