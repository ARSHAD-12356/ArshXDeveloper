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

/** Which half of the All Projects page a project appears in. */
export type ProjectType = "development" | "analytics";

export interface Project {
  id: string;
  title: string;
  /** Defaults to "development" when left out. */
  type?: ProjectType;
  category: string;
  year: string;
  description?: string;
  problem?: string;
  solution?: string;
  stack: string[];
  /** Shown as "Key Features" on the project's detail page. */
  features: string[];
  /** Leave undefined to render the built-in mockup placeholder. */
  media?: MediaAsset;
  /** Screen recording looped in the detail page's banner in place of `media`. */
  video?: string;
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
