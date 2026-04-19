"use client";

import { motion } from "framer-motion";
import { FadeIn } from "@/components/motion/fade-in";

type Category = {
  title: string;
  items: readonly string[];
};

export function ServiceCategories({ categories }: { categories: readonly Category[] }) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {categories.map((cat, i) => (
        <FadeIn key={cat.title} delay={0.05 * i}>
          <motion.div
            whileHover={{ y: -5 }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
            className="glass-panel h-full rounded-2xl p-8 transition hover:border-accent/35 hover:shadow-[0_20px_60px_rgba(91,33,255,0.12)] dark:hover:shadow-[0_20px_60px_rgba(0,0,0,0.45)]"
          >
            <h2 className="font-display text-xl font-semibold">{cat.title}</h2>
            <ul className="mt-6 space-y-3">
              {cat.items.map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-3 rounded-xl border border-border/60 bg-background/40 px-4 py-3 text-sm text-muted"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-accent to-accent-2" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        </FadeIn>
      ))}
    </div>
  );
}
