import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { FadeIn } from "@/components/motion/fade-in";

/** Pre-footer CTA band */
export function HomeFinalCta() {
  return (
    <section className="relative overflow-hidden border-t border-white/10 py-20">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(236,72,153,0.15),transparent_65%)]" />
      <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
        <FadeIn>
          <h2 className="font-display text-3xl font-bold text-white sm:text-4xl">Ready to Transform Your Brand?</h2>
          <p className="mt-4 text-lg text-zinc-400">Let&apos;s discuss how we can help you achieve your goals.</p>
          <Link
            href="/contact"
            className="mt-10 inline-flex items-center justify-center gap-2 rounded-full px-10 py-4 text-sm font-semibold text-white btn-gradient"
          >
            Schedule a Consultation
            <ArrowRight className="h-4 w-4" />
          </Link>
        </FadeIn>
      </div>
    </section>
  );
}
