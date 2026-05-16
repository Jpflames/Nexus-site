import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { FadeIn } from "@/components/motion/fade-in";
import { ServicesAlternating } from "@/components/services/services-alternating";
import { company } from "@/lib/site";

export const metadata: Metadata = {
  title: "Services",
  description: `${company.shortName} offers branding, marketing, media support, and HR services.`,
};

export default function ServicesPage() {
  return (
    <div className="nexus-page-glow">
      <section className="mx-auto max-w-4xl px-4 py-20 text-center sm:px-6 lg:px-8 lg:py-24">
        <FadeIn>
          <h1 className="font-display text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl">
            Our Services
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-zinc-400">
            Comprehensive creative, media, and HR solutions designed to elevate your brand and strengthen the people systems behind it.
          </p>
        </FadeIn>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 lg:px-8">
        <ServicesAlternating />
      </section>

      <section className="relative overflow-hidden border-t border-white/10 py-20">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(236,72,153,0.12),transparent_65%)]" />
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
    </div>
  );
}
