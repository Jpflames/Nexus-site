import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { FadeIn } from "@/components/motion/fade-in";

/** Pre-footer CTA band */
export function HomeFinalCta() {
  return (
    <section className="relative overflow-hidden border-t border-white/10 py-20">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.14),transparent_65%)]" />
      <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
        <FadeIn>
          <h2 className="font-display text-3xl font-bold text-white sm:text-4xl">Ready to Transform Your Brand?</h2>
          <p className="mt-4 text-lg text-zinc-400">Let&apos;s discuss how we can help you achieve your goals.</p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-emerald-400 via-cyan-400 to-lime-400 px-10 py-4 text-sm font-semibold text-black shadow-[0_16px_40px_rgba(16,185,129,0.22)] transition hover:brightness-110"
            >
              Schedule a Consultation
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/courses"
              className="inline-flex items-center justify-center rounded-full border border-emerald-400/30 bg-emerald-400/10 px-10 py-4 text-sm font-semibold text-white transition hover:border-emerald-300/60 hover:bg-emerald-400/15"
            >
              Explore Courses
            </Link>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
