"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, ShieldCheck, TrendingUp, Users, Briefcase, Monitor, Shield } from "lucide-react";
import { FadeIn } from "@/components/motion/fade-in";
import { courseName, courseSubtitle, courseStats, phases, testimonials, faqItems } from "@/lib/nea";

const problems = [
  {
    title: "Generic training doesn’t translate to jobs.",
    description: "Most bootcamps leave learners with certificates, not employer-ready portfolios and hiring momentum.",
  },
  {
    title: "Career clarity is missing from the experience.",
    description: "Without a roadmap, learners struggle to align skills with real roles and talent demand.",
  },
  {
    title: "Premium placement support is rare.",
    description: "High-achieving learners need access to hiring partners and talent teams, not just self-study content.",
  },
];

const solutions = [
  {
    title: "Structured employer-facing roadmap.",
    description: "Four phases, clear sprint goals, and proven milestones that prepare learners for real hiring environments.",
    icon: TrendingUp,
  },
  {
    title: "Live career mentorship.",
    description: "Mentor guidance with feedback loops, hiring insights, and project reviews that mirror employer expectations.",
    icon: Users,
  },
  {
    title: "Hiring partner acceleration.",
    description: "Premium exposure to HR teams, role pathways, and talent placement advisory for strong launch momentum.",
    icon: Briefcase,
  },
];

const outcomes = [
  { value: "72h", label: "Average employer response time" },
  { value: "4x", label: "Faster interview readiness" },
  { value: "100%", label: "Career pathway clarity" },
];

const difference = [
  "A premium elite career ecosystem built around talent placement.",
  "Employer-aligned projects that become portfolio assets.",
  "Mentorship from hiring partners, not anonymous instructors.",
  "Structured roadmap with progress tracking, milestones, and feedback loops.",
];

const placementBenefits = [
  "Dedicated HR introductions.",
  "Role-ready interview preparation.",
  "Priority application review.",
  "Employer-fit assessment and feedback.",
];

export function LandingHero() {
  return (
    <section className="relative overflow-hidden pb-24 pt-20 sm:pb-28">
      <div className="absolute inset-x-0 top-0 h-[540px] bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.18),transparent_30%),radial-gradient(circle_at_20%_20%,_rgba(16,185,129,0.12),transparent_28%)]" />
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr]">
          <FadeIn>
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/15 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.24em] text-cyan-200 shadow-[0_0_40px_rgba(34,211,238,0.08)]">
                <Sparkles className="h-4 w-4 text-cyan-300" />
                Premium career launch ecosystem
              </div>
              <div className="space-y-6">
                <h1 className="font-display text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
                  Become employable in <span className="text-gradient-electric">12 weeks</span> with a premium career acceleration ecosystem.
                </h1>
                <p className="max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
                  {courseSubtitle}
                </p>
              </div>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <Link href="/courses" className="inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold text-black bg-cyan-400 transition hover:bg-cyan-300">
                  Explore Courses
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/checkout" className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-7 py-3.5 text-sm font-semibold text-white transition hover:border-cyan-300/40 hover:bg-white/10">
                  Enroll Now
                </Link>
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.08} className="flex items-end justify-end">
            <div className="glass-card relative overflow-hidden rounded-[2rem] border border-cyan-400/10 p-8 shadow-[0_40px_120px_rgba(16,185,129,0.14)]">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.18),transparent_50%)]" />
              <div className="relative space-y-6">
                <div className="space-y-3">
                  <p className="text-xs uppercase tracking-[0.32em] text-cyan-300/80">Program snapshot</p>
                  <h2 className="font-display text-3xl font-semibold text-white">Nexus Media in numbers</h2>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  {courseStats.map((stat) => (
                    <div key={stat.label} className="rounded-3xl bg-slate-950/70 p-5">
                      <p className="text-3xl font-semibold text-cyan-300">{stat.value}</p>
                      <p className="mt-2 text-sm text-slate-400">{stat.label}</p>
                    </div>
                  ))}
                </div>
                <div className="rounded-3xl border border-white/10 bg-black/30 p-5 text-sm text-slate-300">
                  <p className="font-medium text-white">Why Nexus Media works</p>
                  <p className="mt-3 leading-relaxed text-slate-400">
                    The platform blends premium coaching, live employer signals, and an outcome-first roadmap to accelerate your career launch.
                  </p>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

export function ProblemSection() {
  return (
    <section className="relative overflow-hidden border-t border-white/10 py-24">
      <div className="absolute left-0 top-12 h-80 w-80 rounded-full bg-cyan-500/10 blur-3xl" />
      <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl" />
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm uppercase tracking-[0.32em] text-cyan-300/80">The challenge</p>
            <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">Most learners miss the employer signal and career launch structure.</h2>
            <p className="mt-4 text-base leading-8 text-slate-400">
              Standard programs teach tasks, but Nexus Media builds a hire-ready career identity through milestones, mentorship, and employer-ready deliverables.
            </p>
          </div>
        </FadeIn>

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {problems.map((item, index) => (
            <motion.article
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.08 * index, duration: 0.5 }}
              className="glass-card rounded-[2rem] border border-white/10 p-8"
            >
              <h3 className="text-xl font-semibold text-white">{item.title}</h3>
              <p className="mt-4 text-sm leading-7 text-slate-300">{item.description}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function SolutionSection() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:items-center">
            <div>
              <span className="inline-flex items-center rounded-full border border-cyan-400/20 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.26em] text-cyan-200">
                Career system</span>
              <h2 className="mt-6 font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                A premium, structured, and employer-aligned pathway.
              </h2>
              <p className="mt-4 max-w-xl text-base leading-8 text-slate-400">
                Nexus Media is built not as a course catalog, but as a career acceleration ecosystem with hiring momentum baked into every phase.
              </p>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              {solutions.map((item, index) => (
                <div key={item.title} className="glass-card rounded-[2rem] border border-white/10 p-7">
                  <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-300">
                    <item.icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-5 text-lg font-semibold text-white">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-300">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

export function RoadmapSection() {
  return (
    <section className="border-t border-white/10 py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="text-center">
            <span className="text-sm uppercase tracking-[0.32em] text-cyan-300/80">Program roadmap</span>
            <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Four phases to move from hire-ready foundation to premium advantage.
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-slate-400">
              Each phase is designed as a career sprint with measurable outputs, real mentor guidance, and employer-facing outcomes.
            </p>
          </div>
        </FadeIn>

        <div className="mt-16 space-y-6 lg:space-y-0">
          <div className="hidden lg:grid lg:grid-cols-4 lg:gap-6">
            {phases.map((phase) => (
              <motion.article
                key={phase.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className={`glass-card rounded-[2rem] border p-6 ${phase.premium ? "border-cyan-400/30 bg-cyan-500/5" : "border-white/10"}`}
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.26em] text-cyan-300/80">{phase.label}</p>
                    <h3 className="mt-3 text-xl font-semibold text-white">{phase.title}</h3>
                  </div>
                  {phase.premium && (
                    <span className="rounded-full bg-cyan-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-cyan-200">
                      Premium
                    </span>
                  )}
                </div>
                <p className="mt-5 text-sm leading-7 text-slate-300">{phase.description}</p>
                <div className="mt-6 flex items-center justify-between text-sm text-slate-400">
                  <span>{phase.duration}</span>
                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">₦{phase.price}</span>
                </div>
                <div className="mt-6 space-y-3">
                  {phase.outcomes.map((outcome) => (
                    <p key={outcome} className="text-sm text-slate-300">• {outcome}</p>
                  ))}
                </div>
                <Link
                  href={`/courses/${phase.slug}`}
                  className="mt-6 inline-flex items-center justify-center rounded-full bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-cyan-500/15"
                >
                  View phase
                </Link>
              </motion.article>
            ))}
          </div>

          <div className="lg:hidden space-y-4">
            {phases.map((phase) => (
              <motion.article
                key={phase.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className={`glass-card rounded-[2rem] border p-5 ${phase.premium ? "border-cyan-400/30 bg-cyan-500/5" : "border-white/10"}`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.26em] text-cyan-300/80">{phase.label}</p>
                    <h3 className="mt-2 text-lg font-semibold text-white">{phase.title}</h3>
                  </div>
                  <span className="text-sm text-slate-300">₦{phase.price}</span>
                </div>
                <p className="mt-4 text-sm leading-7 text-slate-300">{phase.description}</p>
                <div className="mt-5 grid gap-2">
                  {phase.outcomes.map((outcome) => (
                    <p key={outcome} className="text-sm text-slate-300">• {outcome}</p>
                  ))}
                </div>
                <Link
                  href={`/courses/${phase.slug}`}
                  className="mt-5 inline-flex w-full items-center justify-center rounded-full border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition hover:border-cyan-300/40 hover:bg-white/10"
                >
                  View phase
                </Link>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function OutcomesSection() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
            <div>
              <p className="text-sm uppercase tracking-[0.32em] text-cyan-300/80">Career outcomes</p>
              <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                Graduate with confidence, clarity, and placement momentum.
              </h2>
              <p className="mt-4 max-w-xl text-base leading-8 text-slate-400">
                Nexus Media graduates leave with polished career assets, expert hiring support, and a measurable progress path for next-stage roles.
              </p>
            </div>
            <div className="grid gap-5 sm:grid-cols-3">
              {outcomes.map((metric) => (
                <div key={metric.label} className="glass-card rounded-[2rem] border border-white/10 p-6">
                  <p className="text-4xl font-semibold text-cyan-300">{metric.value}</p>
                  <p className="mt-3 text-sm text-slate-300">{metric.label}</p>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

export function DifferenceSection() {
  return (
    <section className="border-t border-white/10 py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <FadeIn>
            <div className="space-y-6">
              <span className="text-sm uppercase tracking-[0.32em] text-cyan-300/80">Why Nexus Media</span>
              <h2 className="font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                Nexus Media is built for career outcomes, not just content.
              </h2>
              <p className="max-w-2xl text-base leading-8 text-slate-400">
                Every phase, tool, and mentor session is mapped to hiring signals and outcome-based progress. That’s the difference between study and launch.
              </p>
            </div>
          </FadeIn>
          <FadeIn delay={0.08}>
            <div className="grid gap-4">
              {difference.map((item, index) => (
                <div key={item} className="glass-card rounded-[2rem] border border-white/10 p-6">
                  <p className="text-sm text-slate-300">{item}</p>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

export function PlacementSection() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="rounded-[2rem] border border-white/10 bg-slate-950/60 p-8 shadow-[0_30px_90px_rgba(16,185,129,0.12)]">
            <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
              <div>
                <span className="text-sm uppercase tracking-[0.32em] text-cyan-300/80">HR advantage</span>
                <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                  Employer and talent placement support is woven into every phase.
                </h2>
                <p className="mt-4 max-w-2xl text-base leading-8 text-slate-400">
                  Nexus Media creates direct hiring momentum by aligning projects, feedback, and candidate readiness with the expectations of talent teams.
                </p>
              </div>
              <div className="grid gap-4">
                {placementBenefits.map((item) => (
                  <div key={item} className="flex items-start gap-4 rounded-[2rem] border border-white/10 bg-black/40 p-5">
                    <ShieldCheck className="mt-1 h-5 w-5 text-cyan-300" />
                    <p className="text-sm text-slate-300">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

export function TestimonialSection() {
  return (
    <section className="border-t border-white/10 py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="text-center">
            <span className="text-sm uppercase tracking-[0.32em] text-cyan-300/80">Success stories</span>
            <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Hear from learners who launched premium careers through Nexus Media.
            </h2>
          </div>
        </FadeIn>
        <div className="mt-16 grid gap-6 lg:grid-cols-3">
          {testimonials.map((item, index) => (
            <FadeIn key={item.name} delay={0.08 * index}>
              <article className="glass-card rounded-[2rem] border border-white/10 p-8">
                <p className="text-lg leading-8 text-slate-300">“{item.quote}”</p>
                <div className="mt-8 space-y-1">
                  <p className="font-semibold text-white">{item.name}</p>
                  <p className="text-sm text-slate-400">{item.role}, {item.company}</p>
                </div>
              </article>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FaqSection() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="text-center">
            <span className="text-sm uppercase tracking-[0.32em] text-cyan-300/80">FAQs</span>
            <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Questions about Nexus Media journey.
            </h2>
          </div>
        </FadeIn>
        <div className="mt-14 grid gap-5 lg:grid-cols-2">
          {faqItems.map((item, index) => (
            <FadeIn key={item.question} delay={0.08 * index}>
              <div className="glass-card rounded-[2rem] border border-white/10 p-7">
                <h3 className="text-lg font-semibold text-white">{item.question}</h3>
                <p className="mt-4 text-sm leading-7 text-slate-300">{item.answer}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FinalCtaSection() {
  return (
    <section className="relative overflow-hidden border-t border-white/10 py-24">
      <div className="absolute inset-x-0 top-0 h-56 bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.16),transparent_45%)]" />
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="glass-card relative overflow-hidden rounded-[2rem] border border-white/10 bg-black/60 p-10 shadow-[0_40px_120px_rgba(16,185,129,0.14)]">
          <div className="grid gap-8 lg:grid-cols-[1.3fr_0.7fr] lg:items-center">
            <div>
              <p className="text-sm uppercase tracking-[0.32em] text-cyan-300/80">Ready to launch</p>
              <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                Join Nexus Media and move from uncertainty to employer-ready momentum.
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-8 text-slate-300">
                Begin the most structured, high-touch career launch experience built to align your projects, professional profile, and hire-ready readiness with premium roles.
              </p>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row lg:justify-end">
              <Link href="/checkout" className="inline-flex items-center justify-center rounded-full bg-cyan-400 px-8 py-3.5 text-sm font-semibold text-black transition hover:bg-cyan-300">
                Start Enrollment
              </Link>
              <Link href="/courses" className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-8 py-3.5 text-sm font-semibold text-white transition hover:border-cyan-300/40 hover:bg-white/10">
                View Phases
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
