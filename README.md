# Mahesh - Full Stack Developer Portfolio

Next.js (App Router) + TypeScript + Tailwind CSS v4 + Framer Motion + Lenis.

## Run

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start
```

## Make it yours

All content lives in **`src/data/site.ts`**: name, headline, bio, stats, tech stack, socials,
nav links, timeline, projects, process steps, skills, philosophy quote and "more about me" stats. No component edits needed.

> The timeline and the "more about me" numbers are placeholders. Replace them with real data before publishing.
> Project `links` currently point to `#`. Add your live URLs.

### Project media

Each project takes an optional `media` slot:

```ts
media: { type: "image", src: "/p1.png", alt: "...", width: 1899, height: 866 }
media: { type: "video", src: "/demo.mp4", poster: "/demo.jpg", alt: "..." }
// omit `media` to render the built-in browser-mockup placeholder
```

Videos autoplay muted and only decode while on screen. Remote images need their host
added to `images.remotePatterns` in `next.config.ts`.

### Contact form

`POST /api/contact` validates input (shared rules in `src/lib/contact.ts`), has a honeypot and a
basic per-IP rate limit. To deliver messages by email, copy `.env.example` to `.env.local` and set
`RESEND_API_KEY` + `CONTACT_TO_EMAIL`. Without them, submissions are logged on the server.

## Structure

```
src/
  app/                 layout, page, globals.css (theme tokens), api/contact, sitemap
  components/
    layout/            Header, MenuDrawer, Footer
    sections/          Hero, About, Experience, Works, ProjectCard, ProcessOrbit, SkillsPhilosophy, MoreAboutMe, Contact
    ui/                Cursor, CursorSplash, Magnetic, Reveal/SplitLines, ScrollText, Marquee,
                       Media, LiveProductMenu, AvailabilityBadge, SectionHeading, Icons, LocalTime
    providers/         SmoothScroll (Lenis + anchor routing)
  data/site.ts         all content
  hooks/               useMediaQuery
  lib/                 utils, contact validation
  types/               shared types
```

## Interaction notes

- Custom cursor + glow splash only mount on fine pointers; touch devices keep native behaviour.

- The cursor splash is a WebGL2 fluid simulation (dye + velocity on the GPU). It runs only while the pointer moves (plus a gentle idle drift in the hero) and skips itself without WebGL2.
- `prefers-reduced-motion` disables smooth scrolling, the splash and CSS animations.
- `short:` Tailwind variant (max-height 760px) tightens layouts on short laptop screens.