import type { Metadata } from "next";
import Image from "next/image";
import { BarChart3, Heart, ShieldCheck, UsersRound } from "lucide-react";
import { FadeIn } from "@/components/motion/fade-in";
import { company } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description: `About ${company.shortName} — vision, mission, values, and leadership.`,
};

const values = [
  {
    title: "Passion",
    body: "We pour energy into every brief—because brands deserve creative partners who care as much as they do.",
    icon: Heart,
  },
  {
    title: "Integrity",
    body: "Honest timelines, transparent communication, and work we are proud to stand behind—every time.",
    icon: ShieldCheck,
  },
  {
    title: "Excellence",
    body: "A relentless standard for craft, clarity, and consistency across every touchpoint we touch.",
    icon: BarChart3,
  },
  {
    title: "Partnership",
    body: "We collaborate like an extension of your team—aligned on outcomes, not just deliverables.",
    icon: UsersRound,
  },
] as const;

export default function AboutPage() {
  return (
    <div className="nexus-page-glow">
      <section className="mx-auto max-w-4xl px-4 py-20 text-center sm:px-6 lg:px-8 lg:py-24">
        <FadeIn>
          <h1 className="font-display text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl">
            About <span className="text-gradient-pink">Nexus Media</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-zinc-400">{company.heroDescription}</p>
        </FadeIn>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="grid gap-6 md:grid-cols-2">
          <FadeIn>
            <div className="h-full rounded-2xl border border-[#a855f7]/25 bg-[#121212]/80 p-8 shadow-[0_0_50px_rgba(168,85,247,0.12)] backdrop-blur-sm">
              <h2 className="font-display text-xl font-bold text-white">Our Vision</h2>
              <p className="mt-4 leading-relaxed text-zinc-400">
                To be the leading media and marketing partner for ambitious brands across Nigeria and beyond.
              </p>
            </div>
          </FadeIn>
          <FadeIn delay={0.06}>
            <div className="h-full rounded-2xl border border-[#3b82f6]/25 bg-[#121212]/80 p-8 shadow-[0_0_50px_rgba(59,130,246,0.1)] backdrop-blur-sm">
              <h2 className="font-display text-xl font-bold text-white">Our Mission</h2>
              <p className="mt-4 leading-relaxed text-zinc-400">
                Empowering brands to connect authentically with their audiences through innovative, strategic, and
                results-driven communication.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      <section className="border-t border-white/10 bg-black/40 py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center">
            <h2 className="font-display text-3xl font-bold text-white sm:text-4xl">Our Core Values</h2>
          </FadeIn>
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v, i) => (
              <FadeIn key={v.title} delay={0.05 * i}>
                <div className="flex h-full flex-col rounded-2xl border border-white/10 bg-[#121212] p-6 text-center transition hover:border-[#ec4899]/30">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-[#ec4899]/40 text-[#f472b6]">
                    <v.icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-5 font-display text-lg font-bold text-white">{v.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-400">{v.body}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-24 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="overflow-hidden rounded-3xl border border-[#ec4899]/20 bg-[#0c0c0c] shadow-[0_0_60px_rgba(236,72,153,0.12)]">
            <div className="grid lg:grid-cols-[minmax(0,340px)_1fr]">
              <div className="relative aspect-square min-h-[280px] bg-zinc-800 lg:aspect-auto">
                <Image
                  src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=800&q=80"
                  alt={company.founder.name}
                  fill
                  className="object-cover object-top"
                  sizes="(max-width:1024px) 100vw, 340px"
                />
              </div>
              <div className="flex flex-col justify-center p-8 sm:p-12 lg:p-14">
                <h2 className="font-display text-2xl font-bold text-white sm:text-3xl">{company.founder.name}</h2>
                <p className="mt-2 text-sm font-semibold text-gradient-pink">{company.founder.role}</p>
                <p className="mt-6 leading-relaxed text-zinc-400">{company.founder.bio}</p>
              </div>
            </div>
          </div>
        </FadeIn>
      </section>
    </div>
  );
}
