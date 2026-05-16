"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { FadeIn } from "@/components/motion/fade-in";

const projects = [
  {
    title: "Lumen Health",
    category: "Brand System / Launch",
    tone: "from-emerald-500/25 to-cyan-500/10",
  },
  {
    title: "Northline Bank",
    category: "Campaign / Social",
    tone: "from-blue-500/25 to-indigo-500/10",
  },
  {
    title: "Karo NGO",
    category: "Story / Fundraising Kit",
    tone: "from-violet-500/25 to-fuchsia-500/10",
  },
] as const;

export function PortfolioSection() {
  return (
    <section id="work" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-20 sm:px-6 lg:px-8">
      <FadeIn className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-display text-xs font-semibold uppercase tracking-[0.25em] text-accent">Selected work</p>
          <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight sm:text-4xl">Recent impact</h2>
          <p className="mt-3 max-w-xl text-muted">A snapshot of engagements, with names anonymized where needed.</p>
        </div>
        <Link href="/contact" className="text-sm font-semibold text-accent transition hover:text-accent-2">
          Start a project
        </Link>
      </FadeIn>

      <div className="mt-12 grid gap-6 lg:grid-cols-3">
        {projects.map((p, i) => (
          <FadeIn key={p.title} delay={0.06 * i}>
            <motion.article
              whileHover={{ y: -4 }}
              transition={{ type: "spring", stiffness: 280, damping: 22 }}
              className="group relative overflow-hidden rounded-2xl border border-border bg-card"
            >
              <div className={`h-40 bg-gradient-to-br ${p.tone} relative`}>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.35),transparent_45%)] opacity-60 dark:opacity-25" />
              </div>
              <div className="flex items-start justify-between gap-4 p-6">
                <div>
                  <h3 className="font-display text-lg font-semibold">{p.title}</h3>
                  <p className="mt-1 text-sm text-muted">{p.category}</p>
                </div>
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border text-muted transition group-hover:border-accent/40 group-hover:text-accent">
                  <ArrowUpRight className="h-4 w-4" />
                </span>
              </div>
            </motion.article>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}
