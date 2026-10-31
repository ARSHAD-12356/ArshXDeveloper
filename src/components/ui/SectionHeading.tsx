import { Reveal, SplitLines } from "./Reveal";

interface SectionHeadingProps {
  index: string;
  eyebrow: string;
  title: readonly string[];
  description?: string;
  id?: string;
}

export function SectionHeading({ index, eyebrow, title, description, id }: SectionHeadingProps) {
  return (
    <header className="mb-16 grid gap-8 md:mb-24 md:grid-cols-12 md:items-end">
      <div className="md:col-span-8">
        <Reveal className="mb-6 flex items-center gap-3 text-label text-muted">
          <span className="font-mono text-accent">{index}</span>
          <span className="h-px w-10 bg-line-strong" />
          <span>{eyebrow}</span>
        </Reveal>
        <SplitLines id={id} lines={title} className="font-display text-display font-semibold uppercase" />
      </div>
      {description && (
        <Reveal delay={0.15} className="max-w-md text-base leading-relaxed text-muted md:col-span-4 md:justify-self-end">
          <p>{description}</p>
        </Reveal>
      )}
    </header>
  );
}
