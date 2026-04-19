import type { Metadata } from "next";
import { BarChart3, Target, UsersRound } from "lucide-react";
import { FadeIn } from "@/components/motion/fade-in";
import { ApproachTimeline, type ApproachStepDef } from "@/components/approach/approach-timeline";
import { company } from "@/lib/site";

export const metadata: Metadata = {
  title: "Our Approach",
  description: `How ${company.shortName} delivers strategy, creative, and impact.`,
};

const steps: ApproachStepDef[] = [
  {
    title: "Understand",
    body: "We dive deep into your brand, audience, and goals to build a solid foundation for everything that follows.",
    icon: "search",
  },
  {
    title: "Strategize",
    body: "We develop a comprehensive strategy that aligns your business objectives with creative execution.",
    icon: "lightbulb",
  },
  {
    title: "Create",
    body: "Our team brings ideas to life through compelling design, storytelling, and multimedia content.",
    icon: "pen",
  },
  {
    title: "Refine",
    body: "We iterate and polish based on feedback—ensuring every detail meets our standard of excellence.",
    icon: "sliders",
  },
  {
    title: "Deliver Impact",
    body: "We launch your brand into the market with confidence—driving measurable results and lasting connections.",
    icon: "rocket",
  },
];

const pillars = [
  {
    title: "Data-Driven",
    body: "Insights guide creative decisions so your message lands with the right people.",
    icon: BarChart3,
  },
  {
    title: "Collaboration",
    body: "Transparent workflows and tight feedback loops keep teams aligned from kickoff to launch.",
    icon: UsersRound,
  },
  {
    title: "Results-Focused",
    body: "We measure what matters—clarity, recall, and outcomes that support your growth.",
    icon: Target,
  },
] as const;

export default function ApproachPage() {
  return (
    <div className="nexus-page-glow">
      <section className="mx-auto max-w-4xl px-4 py-20 text-center sm:px-6 lg:px-8 lg:py-24">
        <FadeIn>
          <h1 className="font-display text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl">
            Our <span className="text-gradient-pink">Approach</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-zinc-400">
            A proven methodology that transforms brands through strategic thinking and creative excellence.
          </p>
        </FadeIn>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-12 sm:px-6 lg:px-8">
        <ApproachTimeline steps={steps} />
      </section>

      <section className="border-t border-white/10 bg-black/50 py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center">
            <h2 className="font-display text-3xl font-bold text-white sm:text-4xl">Why This Approach Works</h2>
          </FadeIn>
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {pillars.map((p, i) => (
              <FadeIn key={p.title} delay={0.06 * i}>
                <div className="h-full rounded-2xl border border-white/10 bg-[#121212] p-8 text-center transition hover:border-[#ec4899]/25">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#ec4899]/20 to-[#a855f7]/20 text-[#f472b6]">
                    <p.icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-6 font-display text-lg font-bold text-white">{p.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-zinc-400">{p.body}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
