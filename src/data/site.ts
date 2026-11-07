import type {
  NavLink,
  ProcessStep,
  Project,
  SocialLink,
  TimelineEntry,
} from "@/types";

/**
 * Single source of truth for all portfolio content.
 * Edit this file to rebrand the site — no component changes required.
 */
export const profile = {
  name: "Arshad",
  role: "Full Stack Developer",
  tagline: "Data Analyst",
  headline: ["Building", "Digital", "Solutions."],
  intro:
    "Developing full-stack applications and transforming data into actionable insights.",
  about:
    "I build full-stack web applications and turn raw data into actionable insights. From responsive interfaces and reliable APIs to data cleaning, SQL analysis, and interactive dashboards, I focus on practical solutions that solve real-world problems.",
  location: "Patna, Bihar, India",
  timezone: "Asia/Kolkata",
  email: "arshuarshad1551@gmail.com",
  phones: ["+91 88738 67316", "+91 91423 12801"],
  work: "Open to Remote / On-site",
  available: true,
  url: "https://mahesh.dev",
  stats: [
    { value: 25, suffix: "+", label: "Development Projects" },
    { value: 5, suffix: "+", label: "Data Analysis" },
    { value: 15, suffix: "+", label: "Tech Stack" },
  ],
  /** Development first, then data analysis. A name with no logo in `TechIcon` shows as text. */
  stack: [
    "HTML",
    "CSS",
    "JavaScript",
    "TypeScript",
    "React",
    "Next.js",
    "Tailwind CSS",
    "Node.js",
    "Express",
    "Java",
    "C",
    "Dart",
    "Flutter",
    "PostgreSQL",
    "MongoDB",
    "Prisma",
    "Redis",
    "Firebase",
    "Docker",
    "AWS",
    "Azure",
    "Vercel",
    "Git",
    "GitHub",
    "Postman",
    "Figma",
    "Python",
    "NumPy",
    "Pandas",
    "SQL",
    "Excel",
    "Power BI",
    "Tableau",
    "Statistics",
  ],
} as const;

/** Full-screen brand card shown right after the loader. */
export const brand = {
  name: "ARSHXCODER",
  accentIndex: 4,
  subtitle: "FULL STACK DEVELOPER",
  portrait: "/images/portrait-hd.webp",
} as const;

/** Light introduction panel shown above the hero. */
export const introduction = {
  fullName: "Md Arshad Raza",
  role: "Full Stack Developer",
  /** Typed one after another after "I Am", starting with the main role. */
  roles: [
    "Full Stack Developer",
    "Data Analyst",
    "Frontend Engineer",
    "Backend Engineer",
    "Web Developer",
    "UI/UX Developer",
    "Java Developer",
    "Python Developer",
    "Programmer",
  ],
  // Non-breaking space keeps "&" from wrapping onto its own line on phones.
  heading: ["I Build Scalable Web Applications &", "Deliver Real-World"],
  highlight: "Digital Solutions.",
  features: ["Web Development", "Backend Development", "Problem Solving"],
  // AI-upscaled 4x (Real-ESRGAN) from hero-portrait.png; original kept in /assets-backup.
  photo: "/images/hero-portrait-hd.webp",
  // Drop the PDF into /public/resume/ with this exact name.
  resume: "/resume/Md-Arshad-Raza-Resume.pdf",
} as const;

export const navLinks: NavLink[] = [
  { label: "About", href: "#about" },
  { label: "Work", href: "#work" },
  { label: "Philosophy", href: "#philosophy" },
  { label: "Contact", href: "#contact" },
];

export const socials: SocialLink[] = [
  { key: "github", label: "GitHub", href: "https://github.com/ARSHAD-12356" },
  { key: "linkedin", label: "LinkedIn", href: "https://www.linkedin.com/in/md-arshad-raza-b5097722a/" },
  { key: "instagram", label: "Instagram", href: "https://www.instagram.com/firarsh1551?vrfl=Nmh1eDFyczN2cXUz" },
  { key: "fiverr", label: "Fiverr", href: "https://www.fiverr.com/" },
  { key: "email", label: "Email", href: "mailto:" + profile.email },
];

/** Public profiles shown as icon links in the introduction panel and footer. */
export const profileLinks = [
  { key: "github", label: "GitHub", href: "https://github.com/ARSHAD-12356" },
  { key: "linkedin", label: "LinkedIn", href: "https://www.linkedin.com/in/md-arshad-raza-b5097722a/" },
  { key: "instagram", label: "Instagram", href: "https://www.instagram.com/firarsh1551?vrfl=Nmh1eDFyczN2cXUz" },
  { key: "x", label: "X (Twitter)", href: "https://x.com/ArshuArshad12" },
  { key: "whatsapp", label: "WhatsApp", href: "https://wa.me/918873867316" },
] as const;

export type ProfileLinkKey = (typeof profileLinks)[number]["key"];

export const footer = {
  description: "Full Stack Developer crafting scalable, user-centric web applications and digital solutions.",
  email: "arshad.raza.dev@gmail.com",
} as const;

export const timeline: TimelineEntry[] = [
  {
    kind: "education",
    period: "Aug 2023 – 2027",
    role: "B.Tech – Information Technology",
    org: "Rungta College of Engineering and Technology",
    summary:
      "Pursuing a Bachelor of Technology in Information Technology, building a foundation in software development, programming, databases, and computer science.",
    highlights: [
      "Relevant learning areas: programming, data structures, databases, and web development.",
      "Developing practical skills through academic projects and independent learning.",
    ],
  },
  {
    kind: "education",
    period: "Mar 2021 – Feb 2023",
    role: "I.Sc",
    org: "College of Commerce, Arts & Science",
    summary:
      "Completed Intermediate of Science, building a foundation in analytical thinking and science subjects.",
    highlights: [
      "Developed foundational problem-solving and analytical skills.",
      "Built an academic foundation for further studies in Information Technology.",
    ],
  },
  {
    kind: "work",
    period: "Mar 2024 – Present",
    role: "Full Stack Engineer",
    org: "Freelance & Contract",
    location: "Remote",
    summary:
      "Building SaaS dashboards, internal tools and automation pipelines for startups and small businesses worldwide.",
    highlights: [
      "Shipped 10+ production apps on Next.js, Node and PostgreSQL",
      "Cut manual invoicing time by ~70% for a client through automation",
    ],
  },
  {
    kind: "work",
    period: "Sep 2026 – Present",
    role: "Web Developer",
    org: "Elivya Travel Solution Pvt Ltd",
    location: "Hybrid",
    summary:
      "Developing and maintaining responsive web experiences with a focus on clean interfaces, usability, and reliable functionality.",
    highlights: [
      "Building responsive website sections and reusable UI components.",
      "Improving website layout, usability, and cross-device compatibility.",
    ],
  },
  {
    kind: "work",
    period: "Sep 2026 – Present",
    role: "Operation Assistant",
    org: "Transcend Journey",
    location: "Remote",
    summary:
      "Supporting day-to-day operations, coordinating tasks, and helping maintain organized workflows across remote teams.",
    highlights: [
      "Assisting with operational coordination and routine administrative tasks.",
      "Maintaining accurate records and supporting timely follow-ups.",
    ],
  },
  {
    kind: "work",
    period: "Sep 2026 – Present",
    role: "Web Developer",
    org: "Promonex Media Pvt Ltd",
    location: "Hybrid",
    summary:
      "Developing and improving business websites with a focus on responsive design, user experience, and website performance.",
    highlights: [
      "Building and refining website sections using modern frontend technologies.",
      "Improving responsive layouts, visual consistency, and page performance.",
    ],
  },
  {
    kind: "work",
    period: "Nov 2026 – Present",
    role: "Odin Writer",
    org: "Mercor · Freelance (Contract)",
    location: "Remote · San Francisco, US",
    summary:
      "Contract-based remote role with Mercor, contributing technical writing and code-focused work across modern web technologies.",
    highlights: [
      "Working on technical content and tasks involving React.js and Next.js.",
      "Delivering accurate, well-structured work to project guidelines on a remote contract basis.",
    ],
  },
];

export const projects: Project[] = [
  {
    id: "nextfurn",
    video: "/videos/nextfurn.mp4",
    title: "NextFurn",
    category: "E-COMMERCE · FURNITURE",
    year: "2026",
    description:
      "A complete furniture solutions website for offices, schools, hospitals, hotels and more. Built with a modern UI, product catalog, category navigation, and responsive design.",
    problem: "Clients across offices, schools, and healthcare needed a seamless way to explore and order commercial furniture.",
    solution:
      "A complete furniture solutions website with a modern UI, product catalog, category navigation, and responsive design.",
    stack: ["Next.js", "Node.js", "MongoDB", "Tailwind CSS", "Swiper.js"],
    features: ["Modern UI", "Product catalog", "Category navigation", "Responsive design"],
    media: { type: "image", src: "/images/nextfurn-banner.webp", alt: "NextFurn website banner screenshot", width: 1905, height: 902 },
    accent: "#4f8cff",
    links: [
      { label: "Live product", href: "https://nextfurnoverseas.com/", hint: "Production" },
      { label: "Source code", href: "#", hint: "GitHub" },
    ],
  },
  {
    id: "rickytasha",
    video: "/videos/rickytasha.mp4",
    title: "RickyTasha",
    category: "E-COMMERCE · FASHION",
    year: "2026",
    description:
      "A complete online store for sarees, suits and ethnic wear. Built with a modern UI, category-wise collections, product listing, festive offers and a smooth shopping experience.",
    problem: "Ethnic wear shoppers needed an elegant, fast online shopping platform with collection discovery and seamless checkout.",
    solution:
      "A complete online store for sarees, suits and ethnic wear. Built with a modern UI, category-wise collections, product listing, festive offers and a smooth shopping experience.",
    stack: ["Shopify", "Shiprocket", "Razorpay", "Liquid"],
    features: ["Category-wise collections", "Product listing", "Festive offers", "Smooth shopping experience"],
    media: { type: "image", src: "/images/rickytasha-banner.png", alt: "RickyTasha online store banner screenshot", width: 1901, height: 907 },
    accent: "#3ddc97",
    links: [
      { label: "Live product", href: "https://www.rickytasha.in/", hint: "Production" },
      { label: "Visit store", href: "https://www.rickytasha.in/", hint: "Store" },
    ],
  },
  {
    id: "promonex-media",
    video: "/videos/promonex-media.mp4",
    title: "Promonex Media",
    category: "DIGITAL MARKETING · AGENCY",
    year: "2026",
    description:
      "A full-service digital marketing agency website showcasing services, industry expertise, and business growth solutions. Built with a modern UI and responsive design.",
    problem:
      "A growing digital agency needed an authoritative online presence to present services, case studies, and generate qualified business leads.",
    solution:
      "A full-service digital marketing agency website showcasing services, industry expertise, and business growth solutions. Built with a modern UI and responsive design.",
    stack: ["Next.js", "Tailwind CSS", "Framer Motion", "EmailJS"],
    features: ["Services showcase", "Industry expertise", "Business growth solutions", "Responsive design"],
    media: { type: "image", src: "/images/promonex-banner.png", alt: "Promonex Media agency homepage banner screenshot", width: 1905, height: 907 },
    accent: "#ff5a5f",
    links: [
      { label: "Live product", href: "https://www.promonexmedia.com/", hint: "Production" },
      { label: "Visit agency", href: "https://www.promonexmedia.com/", hint: "Website" },
    ],
  },
  {
    id: "bigrahpurm-developers",
    video: "/videos/bigrahpurm-developers.mp4",
    title: "Bigrahpurm Developers",
    category: "REAL ESTATE · PROPERTY",
    year: "2026",
    description:
      "A real estate website for premium residential projects in Patna. Showcases modern living spaces, amenities, project details, and inquiry functionality with a clean and responsive UI.",
    problem:
      "Homebuyers in Patna needed a trustworthy, modern platform to explore floor plans, amenities, and project timelines with direct inquiry.",
    solution:
      "A real estate website for premium residential projects in Patna. Showcases modern living spaces, amenities, project details, and inquiry functionality with a clean and responsive UI.",
    stack: ["React.js", "Node.js", "MongoDB", "Tailwind CSS"],
    features: ["Modern living spaces", "Amenities", "Project details", "Inquiry functionality"],
    media: { type: "image", src: "/images/bigrahpurm-banner.png", alt: "Bigrahpurm Developers website banner screenshot", width: 1906, height: 906 },
    accent: "#3ddc97",
    links: [
      { label: "Live product", href: "https://www.bigrahpurmdevelopers.com/", hint: "Production" },
      { label: "Visit project", href: "https://www.bigrahpurmdevelopers.com/", hint: "Website" },
    ],
  },
];

export const process: ProcessStep[] = [
  {
    title: "Analyze",
    summary:
      "I start with the problem, not the stack — mapping users, constraints and the metric that defines success.",
    deliverables: ["Discovery call", "Requirements doc", "Technical scope"],
  },
  {
    title: "Design",
    summary: "Architecture and interface designed together, so data flows and user flows never fight each other.",
    deliverables: ["System architecture", "Wireframes", "Data model"],
  },
  {
    title: "Build",
    summary: "Short, visible iterations with typed, tested code and a staging link you can click every week.",
    deliverables: ["Weekly demos", "CI/CD pipeline", "Code reviews"],
  },
  {
    title: "Deliver",
    summary:
      "Launch is the midpoint. I monitor, document and hand over a system your team can own with confidence.",
    deliverables: ["Production deploy", "Documentation", "Post-launch support"],
  },
];

export const philosophy = {
  /** Rendered one line per entry on larger screens; joined with spaces on phones. */
  quoteLines: ["The function of good", "software is to make the", "complex appear to be", "simple."],
  author: "Grady Booch",
  skills: [
    { label: "Languages", items: ["TypeScript", "JavaScript", "Python", "Dart", "SQL", "HTML", "CSS"] },
    { label: "Developer Tools", items: ["Git", "GitHub", "Docker", "Postman", "Figma", "npm", "Vercel", "Bash"] },
    {
      label: "Technologies",
      items: ["React", "Next.js", "Node.js", "Express", "PostgreSQL", "MongoDB", "Firebase", "Flutter"],
    },
  ],
};
/** "More about me" counters. `value` animates from 0; `suffix` is appended as-is. */
export const highlights = [
  {
    label: "Projects Completed",
    value: 10,
    suffix: "+",
    description: "Completed multiple projects from concept to final implementation.",
  },
  {
    label: "Years Experience",
    value: 2,
    suffix: "+",
    description: "Building software with architectural intent and predictable system behavior.",
  },
  {
    label: "Engineering Hours",
    value: 500,
    suffix: "+",
    description: "Engineering judgment refined through real-world constraints.",
  },
  {
    label: "Systems First",
    value: 1,
    suffix: "st",
    description: "Architecture precedes interface. Structure defines outcome.",
  },
];

/**
 * Destination configuration for the "VIEW ALL PROJECTS" CTA button.
 * If you create a dedicated projects archive page (e.g. "/projects") or wish to point
 * to an external repository showcase, update the href here.
 */
export const allProjectsConfig = {
  href: "/projects",
  label: "VIEW ALL PROJECTS",
} as const;