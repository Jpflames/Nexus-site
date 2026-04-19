"use client";

import { motion } from "framer-motion";
import { Lightbulb, PenLine, Rocket, Search, SlidersHorizontal } from "lucide-react";

const ICONS = {
  search: Search,
  lightbulb: Lightbulb,
  pen: PenLine,
  sliders: SlidersHorizontal,
  rocket: Rocket,
} as const;

export type ApproachIconKey = keyof typeof ICONS;

export type ApproachStepDef = {
  title: string;
  body: string;
  icon: ApproachIconKey;
};

/** Center-line alternating timeline */
export function ApproachTimeline({ steps }: { steps: readonly ApproachStepDef[] }) {
  return (
    <div className="relative">
      <div className="pointer-events-none absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 bg-gradient-to-b from-[#ec4899] via-[#a855f7] to-[#ec4899]/25 md:block" />

      <ol>
        {steps.map((step, i) => {
          const Icon = ICONS[step.icon];
          const isLeft = i % 2 === 0;
          return (
            <li key={step.title} className="relative grid gap-8 py-10 md:grid-cols-2 md:items-center md:gap-0 md:py-12">
              <div className={isLeft ? "" : "md:order-2"}>
                {isLeft && (
                  <motion.div
                    initial={{ opacity: 0, y: 14 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-12%" }}
                    transition={{ duration: 0.45, delay: i * 0.04 }}
                    className="ml-auto w-full max-w-md rounded-2xl border border-white/10 bg-[#121212]/95 p-6 text-left shadow-[0_0_36px_rgba(236,72,153,0.08)] backdrop-blur-md md:mr-10"
                  >
                    <StepCardBody Icon={Icon} index={i} step={step} />
                  </motion.div>
                )}
              </div>

              <div className={isLeft ? "md:order-2" : ""}>
                {!isLeft && (
                  <motion.div
                    initial={{ opacity: 0, y: 14 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-12%" }}
                    transition={{ duration: 0.45, delay: i * 0.04 }}
                    className="w-full max-w-md rounded-2xl border border-white/10 bg-[#121212]/95 p-6 text-left shadow-[0_0_36px_rgba(236,72,153,0.08)] backdrop-blur-md md:ml-10"
                  >
                    <StepCardBody Icon={Icon} index={i} step={step} />
                  </motion.div>
                )}
              </div>

              <div
                className="pointer-events-none absolute left-1/2 top-1/2 z-10 hidden h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-[#ec4899] to-[#a855f7] ring-4 ring-black md:block"
                aria-hidden
              />
            </li>
          );
        })}
      </ol>
    </div>
  );
}

function StepCardBody({
  Icon,
  index,
  step,
}: {
  Icon: (typeof ICONS)[ApproachIconKey];
  index: number;
  step: ApproachStepDef;
}) {
  return (
    <>
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#ec4899]/25 to-[#a855f7]/25 text-[#f472b6] ring-1 ring-[#ec4899]/25">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-[#f472b6]">
            Step {String(index + 1).padStart(2, "0")}
          </p>
          <h2 className="font-display text-xl font-bold text-white">{step.title}</h2>
        </div>
      </div>
      <p className="text-sm leading-relaxed text-zinc-400">{step.body}</p>
    </>
  );
}
