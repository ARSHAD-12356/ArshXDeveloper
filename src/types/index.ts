/** Media slot used by project cards and anywhere a swappable asset is needed. */
export type MediaAsset =
  | { type: "image"; src: string; alt: string; width?: number; height?: number }
  | { type: "video"; src: string; poster?: string; alt: string };

export type SocialKey = "github" | "linkedin" | "instagram" | "fiverr" | "email";

export interface SocialLink {
  key: SocialKey;
  label: string;
  href: string;
}

export interface NavLink {
  label: string;
  href: `#${string}`;
}

export interface ProjectLink {
  label: string;
  href: string;
  /** Short hint shown under the label, e.g. "Production" or "Source". */
  hint?: string;
}

export interface Project {
  id: string;
  title: string;
  category: string;
  year: string;
  description?: string;
  problem?: string;
  solution?: string;
  stack: string[];
  /** Leave undefined to render the built-in mockup placeholder. */
  media?: MediaAsset;
  /** Accent used for the card glow and placeholder. Any CSS color. */
  accent: string;
  links: ProjectLink[];
}

export interface TimelineEntry {
  kind: "work" | "education";
  period: string;
  role: string;
  org: string;
  location?: string;
  summary?: string;
  highlights?: string[];
}

export interface ProcessStep {
  title: string;
  summary: string;
  deliverables: string[];
}
