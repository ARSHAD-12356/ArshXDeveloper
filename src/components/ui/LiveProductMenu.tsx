"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useId, useRef, useState } from "react";
import type { ProjectLink } from "@/types";
import { cn, EASE_OUT_EXPO } from "@/lib/utils";
import { ArrowUpRight, ChevronDown } from "./Icons";

interface LiveProductMenuProps {
  links: ProjectLink[];
  accent?: string;
  label?: string;
  placement?: "top" | "bottom";
  className?: string;
}

/** Accessible "Live Product" dropdown listing a project deployment links. */
export function LiveProductMenu({ links, accent = "#3ddc97", label = "Live Product", placement = "top", className }: LiveProductMenuProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const menuId = useId();

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const onMenuKey = (e: React.KeyboardEvent) => {
    if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
    e.preventDefault();
    const items = itemRefs.current.filter(Boolean) as HTMLAnchorElement[];
    const idx = items.indexOf(document.activeElement as HTMLAnchorElement);
    const next = e.key === "ArrowDown" ? (idx + 1) % items.length : (idx - 1 + items.length) % items.length;
    items[next]?.focus();
  };

  return (
    <div ref={rootRef} className={cn("relative inline-block", className)} onKeyDown={onMenuKey}>
      <button
        ref={buttonRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((o) => !o)}
        className="group relative flex items-center gap-3 overflow-hidden rounded-full border border-line-strong bg-white/[0.03] py-2.5 pl-4 pr-3 text-sm font-medium backdrop-blur-md transition-colors hover:border-white/40"
      >
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-pulse-ring rounded-full" style={{ background: accent }} />
          <span className="relative inline-flex h-2 w-2 rounded-full" style={{ background: accent }} />
        </span>
        {label}
        <ChevronDown size={16} className={cn("transition-transform duration-300", open && "rotate-180")} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            id={menuId}
            role="menu"
            initial={{ opacity: 0, y: placement === "top" ? 8 : -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: placement === "top" ? 8 : -8, scale: 0.97 }}
            transition={{ duration: 0.25, ease: EASE_OUT_EXPO }}
            className={cn(
              "absolute left-0 z-30 min-w-60 origin-bottom-left overflow-hidden rounded-2xl border border-line-strong bg-ink-2/95 p-1.5 shadow-2xl shadow-black/60 backdrop-blur-xl",
              placement === "top" ? "bottom-full mb-3" : "top-full mt-3 origin-top-left",
            )}
          >
            {links.map((link, i) => (
              <a
                key={link.label}
                ref={(el) => {
                  itemRefs.current[i] = el;
                }}
                role="menuitem"
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                className="group/item flex items-center justify-between gap-6 rounded-xl px-3.5 py-3 transition-colors hover:bg-white/[0.06] focus-visible:bg-white/[0.06]"
              >
                <span className="flex flex-col">
                  <span className="text-sm font-medium text-fg">{link.label}</span>
                  {link.hint && <span className="text-xs text-dim">{link.hint}</span>}
                </span>
                <ArrowUpRight
                  size={16}
                  className="text-muted transition-transform duration-300 group-hover/item:-translate-y-0.5 group-hover/item:translate-x-0.5 group-hover/item:text-fg"
                />
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
