import {
  siC,
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
  siNumpy,
  siPandas,
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

type IconMark = Pick<SimpleIcon, "hex" | "path">;

// simple-icons has dropped these marks, so their paths live here.
const siJava: IconMark = {
  hex: "ED8B00",
  path: "M8.851 18.56s-.917.534.653.714c1.902.218 2.874.187 4.969-.211 0 0 .552.346 1.321.646-4.699 2.013-10.633-.118-6.943-1.149M8.276 15.933s-1.028.761.542.924c2.032.209 3.636.227 6.413-.308 0 0 .384.389.987.602-5.679 1.661-12.007.13-7.942-1.218M13.116 11.475c1.158 1.333-.304 2.533-.304 2.533s2.939-1.518 1.589-3.418c-1.261-1.772-2.228-2.652 3.007-5.688 0-.001-8.216 2.051-4.292 6.573M19.33 20.504s.679.559-.747.991c-2.712.822-11.288 1.069-13.669.033-.856-.373.75-.89 1.254-.998.527-.114.828-.093.828-.093-.953-.671-6.156 1.317-2.643 1.887 9.58 1.553 17.462-.7 14.977-1.82M9.292 13.21s-4.362 1.036-1.544 1.412c1.189.159 3.561.123 5.77-.062 1.806-.152 3.618-.477 3.618-.477s-.637.272-1.098.587c-4.429 1.165-12.986.623-10.522-.568 2.082-1.006 3.776-.892 3.776-.892M17.116 17.584c4.503-2.34 2.421-4.589.968-4.285-.355.074-.515.138-.515.138s.132-.207.385-.297c2.875-1.011 5.086 2.981-.928 4.562 0-.001.07-.062.09-.118M14.401 0s2.494 2.494-2.365 6.33c-3.896 3.077-.888 4.832-.001 6.836-2.274-2.053-3.943-3.858-2.824-5.539 1.644-2.469 6.197-3.665 5.19-7.627M9.734 23.924c4.322.277 10.959-.153 11.116-2.198 0 0-.302.775-3.572 1.391-3.688.694-8.239.613-10.937.168 0-.001.553.457 3.393.639",
};
const siAzure: IconMark = {
  hex: "0078D4",
  path: "M5.483 21.3H24L14.025 4.013l-3.038 8.347 5.836 6.938L5.483 21.3zM13.23 2.7L6.105 8.677 0 19.253h5.505v.014L13.23 2.7z",
};
const siExcel: IconMark = {
  hex: "217346",
  path: "M23 1.5q.41 0 .7.3.3.29.3.7v19q0 .41-.3.7-.29.3-.7.3H7q-.41 0-.7-.3-.3-.29-.3-.7V18H1q-.41 0-.7-.3-.3-.29-.3-.7V7q0-.41.3-.7Q.58 6 1 6h5V2.5q0-.41.3-.7.29-.3.7-.3zM6 13.28l1.42 2.66h2.14l-2.38-3.87 2.34-3.8H7.46l-1.3 2.4-.05.08-.04.09-.64-1.28-.66-1.29H2.59l2.27 3.82-2.48 3.85h2.16zM14.25 21v-3H7.5v3zm0-4.5v-3.75H12v3.75zm0-5.25V7.5H12v3.75zm0-5.25V3H7.5v3zm8.25 15v-3h-6.75v3zm0-4.5v-3.75h-6.75v3.75zm0-5.25V7.5h-6.75v3.75zm0-5.25V3h-6.75v3Z",
};
const siPowerBi: IconMark = {
  hex: "F2C811",
  path: "M14.5 2h5A1.5 1.5 0 0 1 21 3.5v17a1.5 1.5 0 0 1-1.5 1.5h-5zM8.5 8h5v14h-5zM4.5 13h3v9h-3A1.5 1.5 0 0 1 3 20.5v-6A1.5 1.5 0 0 1 4.5 13z",
};
const siTableau: IconMark = {
  hex: "E97627",
  path: "M11.654.174v2.377H9.682v.58h1.972V5.51h.696V3.13h2.03v-.58h-2.03V.174zm-5.66 3.13-.002 2.205H3.9v.58h2.092v2.203h.637V6.09H8.72v-.58H6.63V3.304zm11.373 0v2.205h-2.09v.58h2.09v2.203h.637V6.09h2.09v-.58h-2.09V3.304zm-5.77 3.13-.002 3.072H8.779v.811h2.816v3.073h.81v-3.073h2.817v-.81h-2.817V6.434zM2.899 9.914v1.972H.522v.58h2.377v1.972h.58v-1.972h2.03v-.58H3.48V9.914zm17.623 0v1.972h-2.03v.58h2.03v1.972h.58v-1.972h2.376v-.58h-2.376V9.914zM5.993 15.19v2.204h-2.09v.58h2.09v2.203h.637v-2.203h2.09v-.58H6.63V15.19zm11.374 0v2.204h-2.09v.58h2.09v2.203h.637v-2.203h2.09v-.58h-2.09V15.19zm-5.713 2.99v2.377H9.682v.58h1.972v2.02h.696v-2.02h2.03v-.58h-2.03V18.18z",
};
// Statistics has no brand, so this is a plain bell curve in the site's green.
const siStatistics: IconMark = {
  hex: "00C785",
  path: "M2 20h20v1.5H2zM12 3.5c-3.5 0-4.5 10-9.5 15h19c-5-5-6-15-9.5-15z",
};

/** Maps technology names used in `src/data/site.ts` to official brand marks. Add entries here for new tech. */
const ICONS: Record<string, IconMark> = {
  Java: siJava,
  C: siC,
  NumPy: siNumpy,
  Pandas: siPandas,
  Excel: siExcel,
  "Power BI": siPowerBi,
  Tableau: siTableau,
  Statistics: siStatistics,
  Azure: siAzure,
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