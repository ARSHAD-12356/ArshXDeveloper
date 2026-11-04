import { siMongodb, siNodedotjs, siRazorpay, siReact, siShopify, siTailwindcss } from "simple-icons";

export function TechBadgeIcon({ name }: { name: string }) {
  if (name === "Shopify") {
    return (
      <svg className="h-3.5 w-3.5 shrink-0" viewBox="0 0 24 24" fill="#95BF47" aria-hidden="true">
        <path d={siShopify.path} />
      </svg>
    );
  }
  if (name === "Shiprocket") {
    return (
      <svg className="h-3.5 w-3.5 shrink-0" viewBox="0 0 24 24" fill="#8B5CF6" aria-hidden="true">
        <path d="M13.13 2.5a.75.75 0 0 0-.85-.14 11.05 11.05 0 0 0-4.7 4.7.75.75 0 0 0 .14.85l1.6 1.6-4.57 4.58a2.5 2.5 0 0 0 0 3.53l.35.36a2.5 2.5 0 0 0 3.54 0l4.57-4.58 1.6 1.6a.75.75 0 0 0 .86.14 11.05 11.05 0 0 0 4.7-4.7.75.75 0 0 0-.15-.85l-7.04-7.09zm1.06 6.36a1.25 1.25 0 1 1 1.77-1.77 1.25 1.25 0 0 1-1.77 1.77z" />
      </svg>
    );
  }
  if (name === "Razorpay") {
    return (
      <svg className="h-3.5 w-3.5 shrink-0" viewBox="0 0 24 24" fill="#0C8CE9" aria-hidden="true">
        <path d={siRazorpay.path} />
      </svg>
    );
  }
  if (name === "React.js" || name === "React") {
    return (
      <svg className="h-3.5 w-3.5 shrink-0" viewBox="0 0 24 24" fill="#61DAFB" aria-hidden="true">
        <path d={siReact.path} />
      </svg>
    );
  }
  if (name === "Node.js" || name === "Node") {
    return (
      <svg className="h-3.5 w-3.5 shrink-0" viewBox="0 0 24 24" fill="#5FA04E" aria-hidden="true">
        <path d={siNodedotjs.path} />
      </svg>
    );
  }
  if (name === "MongoDB") {
    return (
      <svg className="h-3.5 w-3.5 shrink-0" viewBox="0 0 24 24" fill="#47A248" aria-hidden="true">
        <path d={siMongodb.path} />
      </svg>
    );
  }
  if (name === "Tailwind CSS" || name === "Tailwind") {
    return (
      <svg className="h-3.5 w-3.5 shrink-0" viewBox="0 0 24 24" fill="#38BDF8" aria-hidden="true">
        <path d={siTailwindcss.path} />
      </svg>
    );
  }
  return null;
}
