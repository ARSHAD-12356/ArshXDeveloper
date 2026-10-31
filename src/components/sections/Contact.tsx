"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState, type FormEvent } from "react";
import { profile, socials } from "@/data/site";
import { validateContact, type ContactErrors, type ContactPayload } from "@/lib/contact";
import { cn, EASE_OUT_EXPO } from "@/lib/utils";

type Status = "idle" | "submitting" | "success" | "error";

const empty: ContactPayload = {
  name: "",
  email: "",
  projectType: "",
  budget: "",
  message: "",
  company: "",
};

const PROJECT_TYPES = [
  "Full Stack Development",
  "Website Development",
  "E-commerce / Shopify",
  "Data Analytics / Dashboard",
  "Automation",
  "Other",
];

const BUDGET_OPTIONS = [
  "Under ₹10,000",
  "₹10,000–₹25,000",
  "₹25,000–₹50,000",
  "₹50,000+",
  "Not decided yet",
];

export function Contact() {
  const [values, setValues] = useState<ContactPayload>(empty);
  const [errors, setErrors] = useState<ContactErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [serverError, setServerError] = useState("");

  const update =
    (field: keyof ContactPayload) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const next = { ...values, [field]: e.target.value };
      setValues(next);
      if (touched[field]) setErrors(validateContact(next));
    };

  const blur = (field: string) => () => {
    setTouched((t) => ({ ...t, [field]: true }));
    setErrors(validateContact(values));
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const found = validateContact(values);
    setErrors(found);
    setTouched({ name: true, email: true, message: true });
    if (Object.keys(found).length) return;

    setStatus("submitting");
    setServerError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
        errors?: ContactErrors;
      };
      if (!res.ok || !data.ok) {
        if (data.errors) setErrors(data.errors);
        throw new Error(data.error || "Something went wrong.");
      }
      setStatus("success");
      setValues(empty);
      setTouched({});
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Something went wrong.");
      setStatus("error");
    }
  };

  const contactCards = [
    {
      label: "EMAIL",
      value: profile.email || "hello@mahesh.dev",
      href: `mailto:${profile.email || "hello@mahesh.dev"}`,
      icon: (
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect width="20" height="16" x="2" y="4" rx="2" />
          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
        </svg>
      ),
    },
    {
      label: "PHONE",
      value: profile.phone || "+91 9204644875",
      href: `tel:${(profile.phone || "+919204644875").replace(/\s+/g, "")}`,
      icon: (
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
        </svg>
      ),
    },
    {
      label: "LOCATION",
      value: profile.location || "Patna, Bihar, India",
      href: `https://maps.google.com/?q=${encodeURIComponent(profile.location || "Patna, Bihar, India")}`,
      icon: (
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
          <circle cx="12" cy="10" r="3" />
        </svg>
      ),
    },
    {
      label: "WORK",
      value: profile.work || "Open to Remote / On-site",
      href: "#contact",
      icon: (
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect width="20" height="14" x="2" y="7" rx="2" />
          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
        </svg>
      ),
    },
  ];

  return (
    <section
      id="contact"
      data-header-theme="light"
      data-header-label="06 / Contact"
      aria-labelledby="contact-title"
      className="theme-light relative bg-[#fbfdfc] text-ink min-h-[100svh] flex flex-col justify-center py-20 sm:py-24 lg:py-28 xl:py-32 overflow-hidden selection:bg-emerald-500 selection:text-white"
    >
      {/* Background Decorative Ambient Curve and Lighting matching reference */}
      <AmbientCurve />

      <div className="container-x relative z-10 w-full max-w-[1560px] mx-auto">
        {/* Top Header Indicator Row */}
        <div className="flex items-center justify-between gap-4 pb-5 sm:pb-6 border-b border-black/[0.06]">
          <div className="flex items-center gap-2 text-xs font-mono font-semibold">
            <span className="text-[#00bb7f] font-bold text-xs sm:text-sm">06</span>
            <span className="h-px w-6 sm:w-8 bg-black/25" aria-hidden="true" />
            <span className="tracking-[0.22em] text-black/60 uppercase text-[11px] sm:text-xs">
              CONTACT
            </span>
          </div>

          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/35 bg-emerald-50/80 px-4 py-1.5 shadow-[0_4px_14px_-6px_rgba(16,185,129,0.35)] backdrop-blur">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#10b981] opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#10b981] shadow-[0_0_8px_#10b981]" />
            </span>
            <span className="font-mono text-[10.5px] sm:text-[11px] font-bold uppercase tracking-[0.14em] text-emerald-950">
              AVAILABLE FOR PROJECTS
            </span>
          </div>
        </div>

        {/* Two-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 xl:gap-20 items-center mt-12 sm:mt-16 lg:mt-20">
          {/* Left Column: Heading, Intro, 4 Info Cards, Socials */}
          <div className="lg:col-span-6 flex flex-col justify-between">
            {/* Small Outlined Badge */}
            <div className="inline-flex self-start items-center gap-1.5 rounded-full border border-emerald-500/35 bg-emerald-50/60 px-4 py-1.5 text-[11px] font-mono font-bold tracking-[0.18em] text-emerald-600 mb-7">
              <span>↗</span>
              <span>LET&apos;S CONNECT</span>
              <span>↗</span>
            </div>

            {/* Main Heading */}
            <h2
              id="contact-title"
              className="font-display font-extrabold text-[clamp(2.6rem,4.1vw,4.6rem)] leading-[0.94] tracking-tight text-[#0a0d0c] mb-7"
            >
              LET&apos;S BUILD
              <br />
              SOMETHING
              <br />
              <span className="bg-gradient-to-r from-[#00d294] via-[#00c785] to-[#00c5d6] bg-clip-text text-transparent">
                GREAT
              </span>{" "}
              TOGETHER<span className="text-[#00bb7f]">.</span>
            </h2>

            {/* Introduction Paragraph */}
            <p className="text-[15px] sm:text-base md:text-[17px] text-black/60 leading-[1.75] mb-10 sm:mb-12 max-w-xl">
              I&apos;m a Full Stack Developer &amp; Data Analyst, open to freelance projects, full-time opportunities, or just a friendly tech chat. Feel free to reach out!
            </p>

            {/* 4 Contact Information Cards (2x2 Grid) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10 sm:mb-12">
              {contactCards.map((card) => (
                <a
                  key={card.label}
                  href={card.href}
                  target={card.href.startsWith("http") ? "_blank" : undefined}
                  rel={card.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="group flex items-center justify-between p-4 sm:p-5 rounded-[22px] border border-black/[0.07] bg-white/90 backdrop-blur shadow-[0_1px_2px_rgba(0,0,0,0.03),0_8px_24px_-12px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 hover:border-emerald-500/40 hover:shadow-[0_14px_34px_-14px_rgba(16,185,129,0.35)] transition-all duration-300"
                >
                  <div className="flex items-center gap-4 min-w-0 pr-2">
                    <span className="flex h-11 w-11 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#eafaf1] to-[#d5f5e6] text-[#059669] ring-1 ring-emerald-500/10 transition-transform duration-300 group-hover:scale-105">
                      {card.icon}
                    </span>
                    <div className="flex flex-col min-w-0">
                      <span className="font-mono text-[10.5px] font-semibold uppercase tracking-[0.18em] text-black/45 leading-none mb-2">
                        {card.label}
                      </span>
                      <span className="text-sm sm:text-[15px] font-bold text-[#0a0d0c] leading-snug break-words">
                        {card.value}
                      </span>
                    </div>
                  </div>
                  <span className="text-black/30 group-hover:text-emerald-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all text-sm shrink-0">
                    ↗
                  </span>
                </a>
              ))}
            </div>

            {/* Social Links Row */}
            <div>
              <p className="text-[10.5px] font-mono font-bold uppercase tracking-[0.2em] text-black/45 mb-4">
                SOCIALS
              </p>
              <div className="flex items-center gap-3 flex-wrap">
                {/* GitHub */}
                <a
                  href="https://github.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub Profile"
                  className="flex h-12 w-12 sm:h-[52px] sm:w-[52px] items-center justify-center rounded-2xl border border-black/[0.07] bg-white shadow-[0_6px_18px_-10px_rgba(0,0,0,0.15)] hover:-translate-y-1 hover:border-emerald-500/40 hover:shadow-[0_12px_26px_-12px_rgba(16,185,129,0.4)] transition-all duration-300 text-[#0a0d0c]"
                >
                  <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
                  </svg>
                </a>

                {/* LinkedIn */}
                <a
                  href="https://www.linkedin.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn Profile"
                  className="flex h-12 w-12 sm:h-[52px] sm:w-[52px] items-center justify-center rounded-2xl border border-black/[0.07] bg-white shadow-[0_6px_18px_-10px_rgba(0,0,0,0.15)] hover:-translate-y-1 hover:border-emerald-500/40 hover:shadow-[0_12px_26px_-12px_rgba(16,185,129,0.4)] transition-all duration-300 text-[#0077b5]"
                >
                  <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.07v8.37h2.78Z" />
                  </svg>
                </a>

                {/* Instagram */}
                <a
                  href="https://www.instagram.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram Profile"
                  className="flex h-12 w-12 sm:h-[52px] sm:w-[52px] items-center justify-center rounded-2xl border border-black/[0.07] bg-white shadow-[0_6px_18px_-10px_rgba(0,0,0,0.15)] hover:-translate-y-1 hover:border-emerald-500/40 hover:shadow-[0_12px_26px_-12px_rgba(16,185,129,0.4)] transition-all duration-300"
                >
                  <span className="flex h-5 w-5 items-center justify-center rounded-[5px] bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] text-white">
                    <svg className="h-3 w-3 stroke-current fill-none stroke-[2.2]" viewBox="0 0 24 24">
                      <rect width="18" height="18" x="3" y="3" rx="5" />
                      <circle cx="12" cy="12" r="3.5" />
                      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
                    </svg>
                  </span>
                </a>

                {/* Fiverr */}
                <a
                  href="https://www.fiverr.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Fiverr Profile"
                  className="flex h-12 w-12 sm:h-[52px] sm:w-[52px] items-center justify-center rounded-2xl border border-black/[0.07] bg-white shadow-[0_6px_18px_-10px_rgba(0,0,0,0.15)] hover:-translate-y-1 hover:border-emerald-500/40 hover:shadow-[0_12px_26px_-12px_rgba(16,185,129,0.4)] transition-all duration-300"
                >
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#00b22d] text-white font-bold text-[10px] leading-none">
                    fi
                  </span>
                </a>

                {/* Email */}
                <a
                  href={`mailto:${profile.email || "hello@mahesh.dev"}`}
                  aria-label="Email Me"
                  className="flex h-12 w-12 sm:h-[52px] sm:w-[52px] items-center justify-center rounded-2xl border border-black/[0.07] bg-white shadow-[0_6px_18px_-10px_rgba(0,0,0,0.15)] hover:-translate-y-1 hover:border-emerald-500/40 hover:shadow-[0_12px_26px_-12px_rgba(16,185,129,0.4)] transition-all duration-300"
                >
                  <span className="flex h-5 w-5 items-center justify-center rounded-[4px] bg-[#ea4335] text-white">
                    <svg className="h-3 w-3 fill-current" viewBox="0 0 24 24">
                      <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                    </svg>
                  </span>
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Large Rounded Form Panel */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-[32px] sm:rounded-[40px] border border-black/[0.06] bg-white/95 backdrop-blur-xl p-6 sm:p-10 md:p-12 xl:p-14 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_30px_80px_-30px_rgba(0,0,0,0.18),0_0_90px_-20px_rgba(16,185,129,0.18)] overflow-hidden before:pointer-events-none before:absolute before:inset-x-12 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-emerald-400/70 before:to-transparent">
              {/* Decorative Faceted Origami Paper Plane Illustration matching reference */}
              <PaperPlane className="absolute top-2 right-4 sm:right-10 w-28 h-28 sm:w-36 sm:h-36 pointer-events-none select-none" />

              {/* Panel Top Indicator */}
              <div className="flex items-center gap-2.5 mb-5">
                <span className="h-2 w-2 rounded-full bg-[#10b981] shadow-[0_0_6px_#10b981]" />
                <span className="font-mono text-[11px] font-bold tracking-[0.24em] text-black/55 uppercase">
                  SEND A MESSAGE
                </span>
              </div>

              {/* Form Title & Subtitle */}
              <h3 className="font-display text-[1.85rem] sm:text-4xl md:text-[2.75rem] leading-[1.05] font-bold text-[#0a0d0c] tracking-tight mb-3 max-w-[80%]">
                Have a Project in Mind?
              </h3>
              <p className="text-sm sm:text-base text-black/55 mb-9 sm:mb-11">
                Fill out the form and I&apos;ll get back to you within 24 hours.
              </p>

              <AnimatePresence mode="wait" initial={false}>
                {status === "success" ? (
                  <motion.div
                    key="success"
                    role="status"
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.4, ease: EASE_OUT_EXPO }}
                    className="flex flex-col items-center justify-center py-10 text-center"
                  >
                    <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#10b981] text-white shadow-[0_0_25px_rgba(16,185,129,0.4)] mb-4">
                      <svg className="h-7 w-7 stroke-current fill-none stroke-[2.4]" viewBox="0 0 24 24">
                        <path d="M20 6 9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                    <h4 className="font-display text-xl font-bold text-[#0a0d0c] mb-1">
                      Message Sent Successfully!
                    </h4>
                    <p className="text-xs sm:text-sm text-black/60 max-w-sm mb-6">
                      Thank you for reaching out. I&apos;ll review your project details and get back to you within 24 hours.
                    </p>
                    <button
                      type="button"
                      onClick={() => setStatus("idle")}
                      className="rounded-full border border-black/15 bg-white px-5 py-2 text-xs font-mono font-semibold hover:border-black/40 hover:bg-black/[0.03] transition-colors"
                    >
                      Send Another Message
                    </button>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    noValidate
                    onSubmit={onSubmit}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-4 sm:space-y-5"
                  >
                    {/* Honeypot field for anti-spam */}
                    <input
                      type="text"
                      name="company"
                      value={values.company}
                      onChange={update("company")}
                      tabIndex={-1}
                      autoComplete="off"
                      className="sr-only"
                      aria-hidden="true"
                    />

                    {/* Row 1: Your Name & Your Email */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                      {/* Name Field */}
                      <div>
                        <div
                          className={cn(
                            "flex items-center gap-3 px-4 sm:px-5 py-3.5 sm:py-4 rounded-2xl border bg-[#f8faf9] focus-within:bg-white focus-within:ring-2 focus-within:ring-emerald-500/20 transition-all",
                            errors.name && touched.name
                              ? "border-red-500 bg-red-50/[0.15]"
                              : "border-black/[0.08] focus-within:border-emerald-500"
                          )}
                        >
                          <svg className="h-4 w-4 text-black/40 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                            <circle cx="12" cy="7" r="4" />
                          </svg>
                          <input
                            type="text"
                            required
                            placeholder="Your name *"
                            value={values.name}
                            onChange={update("name")}
                            onBlur={blur("name")}
                            className="w-full bg-transparent text-sm sm:text-[15px] text-[#0a0d0c] placeholder:text-black/40 focus:outline-none"
                          />
                        </div>
                        {errors.name && touched.name && (
                          <p className="mt-1 text-[11px] text-red-500">{errors.name}</p>
                        )}
                      </div>

                      {/* Email Field */}
                      <div>
                        <div
                          className={cn(
                            "flex items-center gap-3 px-4 sm:px-5 py-3.5 sm:py-4 rounded-2xl border bg-[#f8faf9] focus-within:bg-white focus-within:ring-2 focus-within:ring-emerald-500/20 transition-all",
                            errors.email && touched.email
                              ? "border-red-500 bg-red-50/[0.15]"
                              : "border-black/[0.08] focus-within:border-emerald-500"
                          )}
                        >
                          <svg className="h-4 w-4 text-black/40 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect width="20" height="16" x="2" y="4" rx="2" />
                            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                          </svg>
                          <input
                            type="email"
                            required
                            placeholder="Your email *"
                            value={values.email}
                            onChange={update("email")}
                            onBlur={blur("email")}
                            className="w-full bg-transparent text-sm sm:text-[15px] text-[#0a0d0c] placeholder:text-black/40 focus:outline-none"
                          />
                        </div>
                        {errors.email && touched.email && (
                          <p className="mt-1 text-[11px] text-red-500">{errors.email}</p>
                        )}
                      </div>
                    </div>

                    {/* Row 2: Project Type (Dropdown) & Budget (Dropdown) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                      {/* Project Type Dropdown */}
                      <div className="relative flex items-center px-4 sm:px-5 py-3.5 sm:py-4 rounded-2xl border border-black/[0.08] bg-[#f8faf9] focus-within:border-emerald-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-emerald-500/20 transition-all">
                        <svg className="h-4 w-4 text-black/40 shrink-0 mr-3 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect width="20" height="14" x="2" y="7" rx="2" />
                          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                        </svg>
                        <select
                          value={values.projectType}
                          onChange={update("projectType")}
                          className="w-full appearance-none bg-transparent text-sm sm:text-[15px] text-[#0a0d0c] focus:outline-none cursor-pointer pr-5"
                        >
                          <option value="" className="text-black/40">
                            Project Type *
                          </option>
                          {PROJECT_TYPES.map((type) => (
                            <option key={type} value={type} className="text-[#0a0d0c]">
                              {type}
                            </option>
                          ))}
                        </select>
                        <svg className="h-3.5 w-3.5 text-black/40 shrink-0 absolute right-5 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>

                      {/* Budget Dropdown */}
                      <div className="relative flex items-center px-4 sm:px-5 py-3.5 sm:py-4 rounded-2xl border border-black/[0.08] bg-[#f8faf9] focus-within:border-emerald-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-emerald-500/20 transition-all">
                        <svg className="h-4 w-4 text-black/40 shrink-0 mr-3 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10" />
                          <path d="M12 6v12M17 10h-7a2.5 2.5 0 0 0 0 5h7" />
                        </svg>
                        <select
                          value={values.budget}
                          onChange={update("budget")}
                          className="w-full appearance-none bg-transparent text-sm sm:text-[15px] text-[#0a0d0c] focus:outline-none cursor-pointer pr-5"
                        >
                          <option value="" className="text-black/40">
                            Budget (Optional)
                          </option>
                          {BUDGET_OPTIONS.map((opt) => (
                            <option key={opt} value={opt} className="text-[#0a0d0c]">
                              {opt}
                            </option>
                          ))}
                        </select>
                        <svg className="h-3.5 w-3.5 text-black/40 shrink-0 absolute right-5 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                    </div>

                    {/* Row 3: Message Field with character counter */}
                    <div>
                      <div
                        className={cn(
                          "relative rounded-2xl border bg-[#f8faf9] px-4 sm:px-5 py-4 focus-within:bg-white focus-within:ring-2 focus-within:ring-emerald-500/20 transition-all",
                          errors.message && touched.message
                            ? "border-red-500 bg-red-50/[0.15]"
                            : "border-black/[0.08] focus-within:border-emerald-500"
                        )}
                      >
                        <div className="flex items-start gap-3">
                          <svg className="h-4 w-4 text-black/40 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
                          </svg>
                          <textarea
                            required
                            rows={5}
                            maxLength={500}
                            placeholder="Tell me about your project *"
                            value={values.message}
                            onChange={update("message")}
                            onBlur={blur("message")}
                            className="w-full resize-none bg-transparent text-sm sm:text-[15px] text-[#0a0d0c] placeholder:text-black/40 focus:outline-none min-h-[130px] sm:min-h-[150px] leading-relaxed"
                          />
                        </div>
                        <div className="flex justify-end pt-1">
                          <span className="font-mono text-[10.5px] text-black/40 font-medium">
                            {values.message.length}/500
                          </span>
                        </div>
                      </div>
                      {errors.message && touched.message && (
                        <p className="mt-1 text-[11px] text-red-500">{errors.message}</p>
                      )}
                    </div>

                    {serverError && (
                      <p className="text-xs text-red-500 font-medium">{serverError}</p>
                    )}

                    {/* Submit Area: Button + Privacy Note */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 pt-4 sm:pt-6">
                      <button
                        type="submit"
                        disabled={status === "submitting"}
                        className="group inline-flex items-center justify-center gap-2 rounded-full bg-[#050b08] px-8 sm:px-10 py-4 sm:py-[18px] text-[13px] sm:text-sm font-mono font-bold tracking-[0.16em] hover:-translate-y-0.5 text-white border border-emerald-400/40 shadow-[0_0_18px_rgba(16,185,129,0.22)] hover:border-emerald-400 hover:shadow-[0_0_28px_rgba(16,185,129,0.4)] disabled:opacity-60 transition-all cursor-pointer"
                      >
                        <span>{status === "submitting" ? "SENDING..." : "SEND MESSAGE"}</span>
                        <span className="transition-transform duration-200 group-hover:translate-x-1.5">
                          →
                        </span>
                      </button>

                      <div className="flex items-center gap-2 text-black/50">
                        <svg className="h-4 w-4 shrink-0 text-emerald-600/70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                        </svg>
                        <span className="text-xs sm:text-[13px] leading-snug max-w-[240px]">
                          Your information is safe with me. I never share your data.
                        </span>
                      </div>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * 3D Origami Paper Plane Illustration with faceted mint and cyan surfaces matching reference
 */
function PaperPlane({ className }: { className?: string }) {
  return (
    <div className={className} aria-hidden="true">
      {/* Soft mint/cyan ambient glow beneath the plane */}
      <div className="absolute inset-0 rounded-full bg-emerald-400/25 blur-2xl" />
      <svg
        viewBox="0 0 160 140"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="relative h-full w-full drop-shadow-[0_10px_20px_rgba(16,185,129,0.2)]"
      >
        {/* Main upper wing facet */}
        <polygon points="148,12 12,76 92,96" fill="#86efac" fillOpacity="0.85" />
        {/* Right side lower facet */}
        <polygon points="148,12 92,96 122,126" fill="#5eead4" fillOpacity="0.9" />
        {/* Fold crease highlight */}
        <polygon points="148,12 92,96 86,94" fill="#34d399" fillOpacity="0.65" />
        {/* Underbelly fold */}
        <polygon points="92,96 122,126 106,104" fill="#2dd4bf" fillOpacity="0.95" />
        {/* Top wing secondary facet */}
        <polygon points="148,12 12,76 72,62" fill="#a7f3d0" fillOpacity="0.75" />
      </svg>
    </div>
  );
}

/**
 * Subtle Background Curve Line & Glowing Mint Node matching reference
 */
function AmbientCurve() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
      {/* Mint glow on upper right */}
      <div className="absolute right-[5%] top-[12%] h-[480px] w-[480px] rounded-full bg-emerald-400/[0.08] blur-[130px]" />
      {/* Cyan glow on lower left */}
      <div className="absolute left-[8%] bottom-[8%] h-[380px] w-[380px] rounded-full bg-teal-400/[0.05] blur-[110px]" />

      {/* Decorative smooth vector curve */}
      <svg className="absolute inset-0 h-full w-full opacity-60" preserveAspectRatio="none" viewBox="0 0 1440 900" fill="none">
        <path
          d="M 580 -40 C 690 140, 710 260, 620 380 C 530 500, 410 460, 390 600 C 370 720, 480 840, 560 920"
          stroke="#10b981"
          strokeOpacity="0.18"
          strokeWidth="1.2"
        />
        <path
          d="M 720 -60 C 760 160, 660 300, 620 380"
          stroke="#00d294"
          strokeOpacity="0.25"
          strokeWidth="1.2"
        />
      </svg>

      {/* Glowing mint circular beacon node placed along the curve */}
      <div className="absolute left-[40.2%] top-[41%] hidden lg:flex items-center justify-center">
        <span className="h-6 w-6 rounded-full border border-emerald-400/35 bg-emerald-400/10" />
        <span className="absolute h-2.5 w-2.5 rounded-full bg-[#10b981] shadow-[0_0_10px_#10b981]" />
      </div>
    </div>
  );
}