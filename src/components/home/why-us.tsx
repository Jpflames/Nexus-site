"use client";

import { motion } from "framer-motion";
import { Award, Target, Users, Zap } from "lucide-react";
import { FadeIn } from "@/components/motion/fade-in";

const features = [
  {
    title: "Strategic Approach",
    body: "Data-backed decisions and clear positioning so every creative move supports your goals.",
    icon: Target,
  },
  {
    title: "Creative Excellence",
    body: "Premium craft across identity, campaigns, and content, built to stand out in crowded markets.",
    icon: Zap,
  },
  {
    title: "Client-Centric",
    body: "Transparent timelines, proactive communication, and workflows designed around your team.",
    icon: Users,
  },
  {
    title: "Proven Results",
    body: "Work engineered for recall, trust, and conversion, measured against outcomes that matter.",
    icon: Award,
  },
] as const;

const stats = [
  { value: "100%", label: "Client Satisfaction" },
  { value: "3x", label: "Average ROI Increase" },
  { value: "50+", label: "Brands Transformed" },
] as const;

/** Why choose us section for services */
export function WhyUs() {
  return (
    <section className="nexus-dot-grid border-t border-white/10 py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <FadeIn className="text-center">
          <h2 className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-[2.5rem]">
            Why Choose Us
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-zinc-400 sm:text-lg">
            We combine strategy, creativity, and results to deliver exceptional value
          </p>
        </FadeIn>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.06 * i, duration: 0.45 }}
            >
              <div className="flex h-full flex-col rounded-2xl border border-white/10 bg-[#121212] p-6 transition hover:border-[#ec4899]/35 hover:shadow-[0_0_40px_rgba(236,72,153,0.12)]">
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-[#ec4899]/50 bg-[#ec4899]/10 text-[#f472b6]">
                  <f.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 font-display text-lg font-bold text-white">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-400">{f.body}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <FadeIn className="mt-16">
          <div className="rounded-2xl border border-[#ec4899]/20 bg-gradient-to-r from-[#ec4899]/10 via-black to-[#a855f7]/10 px-6 py-10 sm:px-10">
            <div className="flex flex-col gap-8 sm:flex-row sm:items-stretch sm:justify-around sm:gap-0">
              {stats.map((s, i) => (
                <div
                  key={s.label}
                  className={`text-center sm:flex-1 ${i > 0 ? "sm:border-l sm:border-white/10 sm:pl-10" : ""}`}
                >
                  <p className="font-display text-4xl font-extrabold text-gradient-pink sm:text-5xl">{s.value}</p>
                  <p className="mt-2 text-sm text-zinc-300">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
