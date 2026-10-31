import { cn } from "@/lib/utils";

export function AvailabilityBadge({ className, label = "Available for work" }: { className?: string; label?: string }) {
  return (
    <span className={cn("flex items-center gap-2.5 rounded-full border border-line bg-white/[0.03] px-3.5 py-1.5 backdrop-blur-md", className)}>
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-pulse-ring rounded-full bg-accent" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-accent shadow-[0_0_12px_2px] shadow-accent/70" />
      </span>
      <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-fg/90">{label}</span>
    </span>
  );
}