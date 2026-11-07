import { siMongodb, siNextdotjs, siNodedotjs, siRazorpay, siReact, siShopify, siTailwindcss } from "simple-icons";
import { cn } from "@/lib/utils";

const SHIPROCKET =
  "M13.13 2.5a.75.75 0 0 0-.85-.14 11.05 11.05 0 0 0-4.7 4.7.75.75 0 0 0 .14.85l1.6 1.6-4.57 4.58a2.5 2.5 0 0 0 0 3.53l.35.36a2.5 2.5 0 0 0 3.54 0l4.57-4.58 1.6 1.6a.75.75 0 0 0 .86.14 11.05 11.05 0 0 0 4.7-4.7.75.75 0 0 0-.15-.85l-7.04-7.09zm1.06 6.36a1.25 1.25 0 1 1 1.77-1.77 1.25 1.25 0 0 1-1.77 1.77z";

const ICONS: Record<string, { path: string; fill: string }> = {
  Shopify: { path: siShopify.path, fill: "#95BF47" },
  Shiprocket: { path: SHIPROCKET, fill: "#8B5CF6" },
  Razorpay: { path: siRazorpay.path, fill: "#0C8CE9" },
  "React.js": { path: siReact.path, fill: "#61DAFB" },
  React: { path: siReact.path, fill: "#61DAFB" },
  "Next.js": { path: siNextdotjs.path, fill: "#FFFFFF" },
  "Node.js": { path: siNodedotjs.path, fill: "#5FA04E" },
  Node: { path: siNodedotjs.path, fill: "#5FA04E" },
  MongoDB: { path: siMongodb.path, fill: "#47A248" },
  "Tailwind CSS": { path: siTailwindcss.path, fill: "#38BDF8" },
  Tailwind: { path: siTailwindcss.path, fill: "#38BDF8" },
};

export function TechBadgeIcon({ name, className }: { name: string; className?: string }) {
  const icon = ICONS[name];
  if (!icon) return null;
  return (
    <svg className={cn("h-3.5 w-3.5 shrink-0", className)} viewBox="0 0 24 24" fill={icon.fill} aria-hidden="true">
      <path d={icon.path} />
    </svg>
  );
}
