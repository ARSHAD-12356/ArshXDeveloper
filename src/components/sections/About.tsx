import { profile } from "@/data/site";
import { CountUp } from "@/components/ui/CountUp";
import { Marquee } from "@/components/ui/Marquee";
import { Reveal } from "@/components/ui/Reveal";
import { ScrollText } from "@/components/ui/ScrollText";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TechIcon } from "@/components/ui/TechIcon";

export function About() {
  return (
    <section
      id="about"
      data-header-theme="light"
      aria-labelledby="about-title"
      className="theme-light relative overflow-hidden rounded-t-[2rem] bg-white py-28 text-fg shadow-[0_-40px_80px_-20px_rgba(0,0,0,0.6)] md:rounded-t-[3rem] md:py-40"
    >
      <div className="container-x">
        <SectionHeading id="about-title" index="01" eyebrow="About" title={["Building", "with purpose"]} />

        <div className="grid gap-16 md:grid-cols-12">
          <ScrollText text={profile.about} className="font-display text-lead font-medium md:col-span-9" />

          <dl className="grid grid-cols-3 gap-6 md:col-span-12 md:mt-10 md:gap-10">
            {profile.stats.map((s, i) => (
              <Reveal key={s.label} delay={i * 0.1} className="flex h-full flex-col border-t border-line pt-6">
                <dt className="text-label text-dim">{s.label}</dt>
                {/* mt-auto lines the numbers up when one label wraps to two lines and another doesn't */}
                <dd className="mt-auto pt-3 font-display text-[clamp(2.5rem,6vw,5.5rem)] font-semibold leading-none tracking-tight">
                  <CountUp value={s.value} suffix={s.suffix} hold={10} className="tabular-nums" />
                </dd>
              </Reveal>
            ))}
          </dl>
        </div>
      </div>

      <div className="mt-24 border-y border-line py-8 md:mt-32">
        <Marquee duration={profile.stack.length * 3.2}>
          {profile.stack.map((tech) => (
            <span key={tech} className="flex items-center px-6 md:px-10">
              <TechIcon name={tech} className="h-10 text-3xl md:h-14 md:text-5xl" />
              <span aria-hidden className="ml-12 inline-block h-2 w-2 rounded-full bg-accent md:ml-20" />
            </span>
          ))}
        </Marquee>
      </div>
    </section>
  );
}