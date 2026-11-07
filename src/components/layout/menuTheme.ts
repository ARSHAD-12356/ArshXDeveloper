import { useTheme } from "@/components/providers/Theme";

/**
 * Colour sets for the full-screen menu.
 *
 * `light` is the default; `dark` (the original black/teal design) is used while the site's
 * dark mode is on. See useMenuTheme below.
 */
export const MENU_THEMES = {
  dark: {
    panel: "text-white selection:bg-[#22d3ee] selection:text-black",
    base: "bg-[#08100d]",
    bg: "bg-[#050706]",
    /** Leading edge of the opening curtain. */
    curtain: "bg-[#0f2a22]",
    glowA: "rgba(5,150,105,0.16)",
    glowB: "rgba(20,184,166,0.13)",
    arcs: ["border-teal-500/[0.09]", "border-teal-500/[0.13]", "border-teal-500/[0.18]"],
    socialsLabel: "text-white/50",
    socialLink: "text-white/80 hover:text-white",
    githubIcon: "text-white",
    divider: "bg-white/15",
    rowBorder: "border-white/[0.08]",
    arrow:
      "border-white/20 text-white group-hover:border-[#22d3ee] group-hover:text-[#22d3ee] group-hover:shadow-[0_0_16px_rgba(34,211,238,0.35)] group-hover:bg-[#22d3ee]/10",
    label: "text-white group-hover:text-[#22d3ee]",
    accent: "text-[#22d3ee]",
    num: "text-white/40 group-hover:text-white/80",
    badge: "border-white/25 bg-white/[0.04] text-white",
    name: "text-white",
    role: "text-white/50",
    pill: "border-emerald-500/30 bg-[#071711] shadow-[0_0_15px_rgba(16,185,129,0.18)]",
    pillText: "text-white/90",
    /** Header's close (X) button while the menu is open. */
    closeButton: "border-white/20 bg-transparent hover:border-white/60 hover:bg-white/[0.06]",
    closeBar: "bg-white",
  },
  light: {
    panel: "text-[#0b0d0c] selection:bg-[#0891b2] selection:text-white",
    /** Tint the whole screen fades to first, so the dark page never shows through. */
    base: "bg-[#eaf3ef]",
    bg: "bg-[#f5f6f4]",
    curtain: "bg-[#d4efe4]",
    glowA: "rgba(52,211,153,0.20)",
    glowB: "rgba(103,232,249,0.22)",
    arcs: ["border-teal-600/[0.10]", "border-teal-600/[0.14]", "border-teal-600/[0.20]"],
    socialsLabel: "text-black/45",
    socialLink: "text-black/70 hover:text-black",
    githubIcon: "text-black",
    divider: "bg-black/15",
    rowBorder: "border-black/[0.08]",
    arrow:
      "border-black/15 text-[#0b0d0c] group-hover:border-[#0891b2] group-hover:text-[#0891b2] group-hover:shadow-[0_0_16px_rgba(8,145,178,0.25)] group-hover:bg-[#0891b2]/[0.08]",
    label: "text-[#0b0d0c] group-hover:text-[#0891b2]",
    accent: "text-[#0891b2]",
    num: "text-black/35 group-hover:text-black/70",
    badge: "border-black/15 bg-white text-[#0b0d0c]",
    name: "text-[#0b0d0c]",
    role: "text-black/50",
    pill: "border-emerald-500/35 bg-white shadow-[0_6px_18px_-10px_rgba(16,185,129,0.45)]",
    pillText: "text-black/80",
    closeButton: "border-black/15 bg-white hover:border-black/40",
    closeBar: "bg-[#0b0d0c]",
  },
} as const;

export type MenuThemeName = keyof typeof MENU_THEMES;

/** The menu follows the site theme toggle: light by default, the original dark design in dark mode. */
export function useMenuTheme() {
  const { theme } = useTheme();
  return MENU_THEMES[theme];
}
