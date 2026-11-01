import type { SVGProps } from "react";
import type { SocialKey } from "@/types";

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

const base = (size = 18): SVGProps<SVGSVGElement> => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
});

export const ArrowUpRight = ({ size, ...p }: IconProps) => (
  <svg {...base(size)} {...p}><path d="M7 17 17 7M8 7h9v9" /></svg>
);
export const ArrowRight = ({ size, ...p }: IconProps) => (
  <svg {...base(size)} {...p}><path d="M5 12h14M13 6l6 6-6 6" /></svg>
);
export const ArrowLeft = ({ size, ...p }: IconProps) => (
  <svg {...base(size)} {...p}><path d="M19 12H5M11 6l-6 6 6 6" /></svg>
);
export const ChevronDown = ({ size, ...p }: IconProps) => (
  <svg {...base(size)} {...p}><path d="m6 9 6 6 6-6" /></svg>
);
export const Check = ({ size, ...p }: IconProps) => (
  <svg {...base(size)} {...p}><path d="M20 6 9 17l-5-5" /></svg>
);
export const CodeIcon = ({ size, ...p }: IconProps) => (
  <svg {...base(size)} {...p}><path d="m8 7-5 5 5 5M16 7l5 5-5 5M13.5 5l-3 14" /></svg>
);
export const LayersIcon = ({ size, ...p }: IconProps) => (
  <svg {...base(size)} {...p}><path d="m12 3 9 5-9 5-9-5 9-5Z" /><path d="m3 12 9 5 9-5M3 16l9 5 9-5" /></svg>
);
export const RocketIcon = ({ size, ...p }: IconProps) => (
  <svg {...base(size)} {...p}>
    <path d="M14 4c3-1.5 6-1 6-1s.5 3-1 6l-6 6-5-5 6-6Z" />
    <path d="m9 10-4 .5L3 13l4 1M14 15l-.5 4L11 21l-1-4" />
    <circle cx="15.5" cy="8.5" r="1.3" />
    <path d="M6 18c-1 1-1.5 3-1.5 3s2-.5 3-1.5" />
  </svg>
);
export const Quote = ({ size = 40, ...p }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden {...p}>
    <path d="M9.6 5C5.9 6.4 3.5 9.4 3.5 13.6V19h6.6v-6.5H6.8c.1-2.6 1.6-4.6 4-5.7L9.6 5Zm10.4 0c-3.7 1.4-6.1 4.4-6.1 8.6V19h6.6v-6.5h-3.3c.1-2.6 1.6-4.6 4-5.7L20 5Z" />
  </svg>
);

export const GitHub = ({ size, ...p }: IconProps) => (
  <svg {...base(size)} {...p}>
    <path d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21" />
  </svg>
);
export const LinkedIn = ({ size, ...p }: IconProps) => (
  <svg {...base(size)} {...p}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);
export const Instagram = ({ size, ...p }: IconProps) => (
  <svg {...base(size)} {...p}>
    <rect x="2.5" y="2.5" width="19" height="19" rx="5" />
    <circle cx="12" cy="12" r="4.2" />
    <circle cx="17.5" cy="6.5" r=".6" fill="currentColor" />
  </svg>
);
export const Fiverr = ({ size, ...p }: IconProps) => (
  <svg {...base(size)} {...p}>
    <circle cx="12" cy="12" r="10" />
    <path d="M9.5 17v-6.5M8 10.5h3.5M11.5 8.5c0-1.3.8-1.9 2-1.9M14.5 17v-6.5" />
    <circle cx="14.5" cy="8" r=".5" fill="currentColor" />
  </svg>
);
export const Mail = ({ size, ...p }: IconProps) => (
  <svg {...base(size)} {...p}>
    <rect x="2.5" y="4.5" width="19" height="15" rx="2" />
    <path d="m3 6 9 7 9-7" />
  </svg>
);

export const socialIcons: Record<SocialKey, (p: IconProps) => React.ReactElement> = {
  github: GitHub,
  linkedin: LinkedIn,
  instagram: Instagram,
  fiverr: Fiverr,
  email: Mail,
};
