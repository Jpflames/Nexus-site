"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Check, Sparkles } from "lucide-react";
import { FadeIn } from "@/components/motion/fade-in";
import { phases, pricingPlans } from "@/lib/nea";

export function CourseCatalogHero() {
  return (
    <section className="relative overflow-hidden pb-24 pt-20">
      <div className="absolute inset-x-0 top-0 h-[520px] bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.16),transparent_28%),radial-gradient(circle_at_80%_10%,_rgba(16,185,129,0.12),transparent_30%)]" />
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <FadeIn>
            <div className="space-y-6">
              <span className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.24em] text-cyan-200">
                <Sparkles className="h-4 w-4 text-cyan-300" />
                Become Employable in 12 Weeks
              </span>
              <h1 className="font-display text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
                Become a hire-ready candidate with a cinematic career launch experience.
              </h1>
              <p className="max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
                Nexus Media is a premium career accelerator with employer-aligned phases, mentor-led delivery, and a strong pathway into the talent market.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <Link href="/checkout" className="inline-flex items-center justify-center gap-2 rounded-full bg-cyan-400 px-7 py-3.5 text-sm font-semibold text-black transition hover:bg-cyan-300">
                  Secure Your Spot
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/courses/employability-foundation" className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-7 py-3.5 text-sm font-semibold text-white transition hover:border-cyan-300/40 hover:bg-white/10">
                  Explore Phase 1
                </Link>
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.08}>
            <div className="glass-card rounded-[2rem] border border-white/10 p-8 shadow-[0_40px_120px_rgba(16,185,129,0.12)]">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-500/15 text-cyan-300">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm uppercase tracking-[0.28em] text-cyan-300/80">Program highlights</p>
                    <p className="text-base text-slate-300">A modern course experience designed for premium career acceleration.</p>
                  </div>
                </div>
                <div className="grid gap-3">
                  <div className="rounded-3xl border border-white/10 bg-black/40 p-5">
                    <p className="text-2xl font-semibold text-white">90%+</p>
                    <p className="mt-2 text-sm text-slate-400">Completion rate across live cohorts</p>
                  </div>
                  <div className="rounded-3xl border border-white/10 bg-black/40 p-5">
                    <p className="text-2xl font-semibold text-white">200+</p>
                    <p className="mt-2 text-sm text-slate-400">Premium mentor sessions delivered</p>
                  </div>
                  <div className="rounded-3xl border border-white/10 bg-black/40 p-5">
                    <p className="text-2xl font-semibold text-white">Top hiring teams</p>
                    <p className="mt-2 text-sm text-slate-400">Employer exposure from premium talent partners</p>
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

export function PhaseRoadmap() {
  return (
    <section className="border-t border-white/10 py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="text-center">
            <span className="text-sm uppercase tracking-[0.32em] text-cyan-300/80">Interactive roadmap</span>
            <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              An elite roadmap that feels structured, cinematic, and career-led.
            </h2>
          </div>
        </FadeIn>
        <div className="mt-16 grid gap-6 lg:grid-cols-4">
          {phases.map((phase) => (
            <motion.article
              key={phase.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ y: -6 }}
              transition={{ duration: 0.35 }}
              className={`glass-card rounded-[2rem] border p-6 ${phase.premium ? "border-cyan-400/30 bg-cyan-500/5" : "border-white/10 bg-black/70"}`}
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-cyan-300/80">{phase.label}</p>
                  <h3 className="mt-3 text-xl font-semibold text-white">{phase.title}</h3>
                </div>
                <span className="rounded-full bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-slate-200">
                  {phase.duration}
                </span>
              </div>
              <p className="mt-5 text-sm leading-7 text-slate-300">{phase.description}</p>
              <div className="mt-6 space-y-2 text-sm text-slate-300">
                {phase.outcomes.map((item) => (
                  <div key={item} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-cyan-300" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
              <div className="mt-6 flex items-center justify-between text-sm text-slate-400">
                <span className="rounded-full bg-white/5 px-3 py-1">{phase.unlockState}</span>
                <span className="font-semibold text-white">₦{phase.price}</span>
              </div>
              <Link
                href={`/courses/${phase.slug}`}
                className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-white/10 px-4 py-3 text-sm font-semibold text-white transition hover:bg-cyan-500/15"
              >
                Explore phase
              </Link>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function PricingSection() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="text-center">
            <span className="text-sm uppercase tracking-[0.32em] text-cyan-300/80">Pricing</span>
            <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Premium pricing with clear value, savings, and payment flexibility.
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-slate-400">
              Choose the path that matches your ambition — from focused phase enrollment to the full accelerator bundle.
            </p>
          </div>
        </FadeIn>
        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {pricingPlans.map((plan, index) => (
            <FadeIn key={plan.title} delay={0.08 * index}>
              <article className={`glass-card rounded-[2rem] border p-8 ${plan.highlight ? "border-cyan-400/30 bg-cyan-500/5" : "border-white/10"}`}>
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm uppercase tracking-[0.28em] text-cyan-300/80">{plan.title}</p>
                    <p className="mt-2 text-3xl font-semibold text-white">₦{plan.price}</p>
                  </div>
                  {plan.badge && (
                    <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-slate-200">{plan.badge}</span>
                  )}
                </div>
                <p className="mt-6 text-sm leading-7 text-slate-300">{plan.description}</p>
                <ul className="mt-6 space-y-3 text-sm text-slate-300">
                  {plan.bullets.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <Check className="mt-1 h-4 w-4 text-cyan-300" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-8 space-y-3 text-sm text-slate-400">
                  <p>Installment option available.</p>
                  <p>Secure checkout with Flutterwave and Paystack.</p>
                </div>
                <Link
                  href="/checkout"
                  className="mt-8 inline-flex w-full items-center justify-center rounded-full bg-white/10 px-4 py-3 text-sm font-semibold text-white transition hover:bg-cyan-500/15"
                >
                  Choose plan
                </Link>
              </article>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
