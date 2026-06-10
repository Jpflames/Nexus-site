"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { company } from "@/lib/site";

const stats = [
  { value: "50", label: "Projects Delivered" },
  { value: "10", label: "Happy Clients" },
  { value: "2", label: "Years Experience" },
  { value: "24/7", label: "Support Available" },
] as const;

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=2400&q=80";

/** Full-viewport hero for Nexus Media services */
export function HeroSection() {
  return (
    <section className="relative min-h-[92vh] overflow-hidden">
      <Image
        src={HERO_IMAGE}
        alt=""
        fill
        priority
        className="object-cover brightness-[0.35]"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-black" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.14),transparent_55%)]" />

      <div className="relative z-10 mx-auto flex min-h-[92vh] max-w-4xl flex-col px-4 pb-14 pt-24 text-center sm:px-6 sm:pb-16 lg:px-8 lg:pb-20">
        {/* Main hero copy stays vertically centered; stats sit in flow below with a clear gap */}
        <div className="flex flex-1 flex-col items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/40 px-4 py-1.5 text-xs font-medium text-zinc-300 backdrop-blur-md"
          >
            <Sparkles className="h-3.5 w-3.5 text-emerald-300" />
            Creative, Media &amp; HR Services
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.06, ease: [0.22, 1, 0.36, 1] }}
            className="mt-8 font-display text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl md:text-6xl lg:text-[3.5rem]"
          >
            <span className="block">Creative services for</span>
            <span className="block bg-gradient-to-r from-emerald-300 via-cyan-300 to-lime-300 bg-clip-text text-transparent">
              brands, teams,
            </span>
            <span className="block bg-gradient-to-r from-emerald-200 via-cyan-200 to-lime-200 bg-clip-text text-transparent">
              and people.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6 max-w-2xl text-base leading-relaxed text-zinc-400 sm:text-lg"
          >
            {company.heroDescription}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="mt-10 flex w-full max-w-md flex-col items-stretch gap-3 sm:max-w-none sm:flex-row sm:justify-center"
          >
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-emerald-400 via-cyan-400 to-lime-400 px-8 py-3.5 text-sm font-semibold text-black shadow-[0_18px_45px_rgba(16,185,129,0.22)] transition hover:brightness-110"
            >
              Get Started
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/courses"
              className="inline-flex items-center justify-center rounded-full border border-emerald-400/30 bg-emerald-400/10 px-8 py-3.5 text-sm font-semibold text-white transition hover:border-emerald-300/60 hover:bg-emerald-400/15"
            >
              Explore Courses
            </Link>
            <Link
              href="/services"
              className="inline-flex items-center justify-center rounded-full border border-white/25 bg-transparent px-8 py-3.5 text-sm font-semibold text-white transition hover:border-white/50 hover:bg-white/5"
            >
              View Services
            </Link>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.26, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto mt-14 w-full max-w-5xl sm:mt-16 md:mt-20"
        >
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {stats.map((s) => (
              <div
                key={s.label}
                className="rounded-xl border border-white/10 bg-black/50 px-4 py-4 text-center backdrop-blur-md"
              >
                <p className="font-display text-2xl font-extrabold bg-gradient-to-r from-emerald-300 via-cyan-300 to-lime-300 bg-clip-text text-transparent sm:text-3xl">{s.value}</p>
                <p className="mt-1 text-xs text-zinc-400 sm:text-sm">{s.label}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
