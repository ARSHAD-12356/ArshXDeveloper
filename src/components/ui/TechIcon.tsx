import {
  siCss,
  siDart,
  siDocker,
  siExpress,
  siFigma,
  siFirebase,
  siFlutter,
  siGit,
  siGithub,
  siGnubash,
  siHtml5,
  siJavascript,
  siMongodb,
  siMysql,
  siNextdotjs,
  siNodedotjs,
  siNpm,
  siPostgresql,
  siPostman,
  siPrisma,
  siPython,
  siReact,
  siRedis,
  siTailwindcss,
  siTypescript,
  siVercel,
  type SimpleIcon,
} from "simple-icons";
import { cn } from "@/lib/utils";

/** Maps technology names used in `src/data/site.ts` to official brand marks. Add entries here for new tech. */
const ICONS: Record<string, SimpleIcon> = {
  TypeScript: siTypescript,
  JavaScript: siJavascript,
  Python: siPython,
  Dart: siDart,
  SQL: siMysql,
  HTML: siHtml5,
  CSS: siCss,
  React: siReact,
  "Next.js": siNextdotjs,
  "Node.js": siNodedotjs,
  Express: siExpress,
  PostgreSQL: siPostgresql,
  MongoDB: siMongodb,
  Prisma: siPrisma,
  "Tailwind CSS": siTailwindcss,
  Flutter: siFlutter,
  Firebase: siFirebase,
  Docker: siDocker,
  Redis: siRedis,
  Git: siGit,
  GitHub: siGithub,
  Postman: siPostman,
  Figma: siFigma,
  npm: siNpm,
  Vercel: siVercel,
  Bash: siGnubash,
};

export const hasTechIcon = (name: string) => name in ICONS;

/** Very dark brand colours (Next.js, GitHub, Express...) would vanish on a black band. */
function isDark(hex: string) {
  const n = parseInt(hex, 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  return 0.2126 * r + 0.7152 * g + 0.0722 * b < 60;
}

interface TechIconProps {
  name: string;
  /** "brand" = filled in the official colour, "outline" = stroked monochrome. */
  variant?: "brand" | "outline";
  /** Rendering on a dark background: near-black brand colours switch to white. */
  onDark?: boolean;
  className?: string;
}

/** Renders a technology logo; falls back to the name when no logo is registered. */
export function TechIcon({ name, variant = "brand", onDark, className }: TechIconProps) {
  const icon = ICONS[name];

  if (!icon) {
    return (
      <span
        title={name}
        className={cn(
          "font-display font-semibold uppercase leading-none tracking-tight",
          variant === "outline" ? "text-stroke" : "text-fg/80",
          className,
        )}
      >
        {name}
      </span>
    );
  }

  const fill = onDark && isDark(icon.hex) ? "#ffffff" : `#${icon.hex}`;

  return (
    <svg
      role="img"
      viewBox="0 0 24 24"
      aria-label={name}
      className={cn("aspect-square w-auto shrink-0 transition-transform duration-500 ease-out-expo hover:scale-110", className)}
      {...(variant === "brand"
        ? { fill }
        : { fill: "none", stroke: "currentColor", strokeWidth: 0.35, strokeLinejoin: "round" as const })}
    >
      <title>{name}</title>
      <path d={icon.path} />
    </svg>
  );
}