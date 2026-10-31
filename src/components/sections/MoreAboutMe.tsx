import { highlights } from "@/data/site";
import { CountUp } from "@/components/ui/CountUp";
import { Reveal } from "@/components/ui/Reveal";

/** Black stats panel that slides up over the pinned Skills & Philosophy section. */
export function MoreAboutMe() {
  return (
    <section
      id="more-about-me"
      data-header-theme="dark"
      aria-labelledby="more-about-me-title"
      className="relative z-30 -mt-[100svh] bg-black py-[clamp(5rem,14svh,9rem)] text-white shadow-[0_-40px_80px_-20px_rgba(0,0,0,0.5)]"
    >
      <div className="container-x md:px-[9%]">
        <Reveal>
          <h2 id="more-about-me-title" className="text-[11px] font-bold uppercase tracking-[0.25em]">
            More about me
          </h2>
        </Reveal>

        <dl className="mt-[clamp(3.5rem,10svh,6rem)] grid gap-x-16 gap-y-[clamp(4rem,12svh,8rem)] md:grid-cols-2">
          {highlights.map((item, i) => (
            <Reveal key={item.label} delay={(i % 2) * 0.1}>
              <dt className="text-[11px] font-bold uppercase tracking-[0.25em]">{item.label}</dt>
              <dd>
                <CountUp
                  value={item.value}
                  suffix={item.suffix}
                  className="mt-5 block font-display text-[clamp(4.5rem,min(10vw,17svh),9rem)] font-extrabold leading-none tracking-tight tabular-nums"
                />
                <p className="mt-6 max-w-sm text-[0.95rem] leading-relaxed text-white/60">{item.description}</p>
              </dd>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  );
}