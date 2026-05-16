"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Fingerprint, Megaphone, Clapperboard, UsersRound } from "lucide-react";
import { FadeIn } from "@/components/motion/fade-in";

const services = [
  {
    title: "Branding & Identity",
    body: "Distinct systems, guidelines, and visual language that scale with you.",
    icon: Fingerprint,
  },
  {
    title: "Marketing & Publicity",
    body: "Campaigns and creatives engineered to earn attention and drive action.",
    icon: Megaphone,
  },
  {
    title: "Media & Content Support",
    body: "Presentations, assets, and communications that feel as sharp as your strategy.",
    icon: Clapperboard,
  },
  {
    title: "HR Services",
    body: "People-facing touchpoints and employer brand support that signal maturity.",
    icon: UsersRound,
  },
] as const;

export function ServicesPreview() {
  return (
    <section className="border-y border-border bg-foreground/[0.02] py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <FadeIn className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-display text-xs font-semibold uppercase tracking-[0.25em] text-accent">Services</p>
            <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight sm:text-4xl">What we deliver</h2>
            <p className="mt-3 max-w-xl text-muted">Focused capabilities. Senior-level craft. Built for momentum.</p>
          </div>
          <Link
            href="/services"
            className="text-sm font-semibold text-accent transition hover:text-accent-2"
          >
            Explore all services
          </Link>
        </FadeIn>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((s, i) => (
            <motion.div
              key={s.title}
              whileHover={{ y: -6 }}
              transition={{ type: "spring", stiffness: 260, damping: 22 }}
            >
              <FadeIn delay={0.05 * i} className="h-full">
                <div className="glass-panel group flex h-full flex-col rounded-2xl p-6 transition hover:border-accent/35 hover:shadow-[0_18px_50px_rgba(91,33,255,0.12)] dark:hover:shadow-[0_18px_50px_rgba(0,0,0,0.45)]">
                  <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-accent/20 to-accent-2/15 text-accent ring-1 ring-border transition group-hover:scale-105">
                    <s.icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-display text-lg font-semibold">{s.title}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{s.body}</p>
                </div>
              </FadeIn>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
