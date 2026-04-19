import Link from "next/link";
import { FadeIn } from "@/components/motion/fade-in";

export function CtaSection() {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-24 sm:px-6 lg:px-8">
      <FadeIn>
        <div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-accent/15 via-background to-accent-2/10 p-10 sm:p-14">
          <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-accent/30 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-28 -left-20 h-72 w-72 rounded-full bg-accent-2/20 blur-3xl" />
          <div className="relative max-w-2xl">
            <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
              Ready to build a brand people remember?
            </h2>
            <p className="mt-4 text-base text-muted sm:text-lg">
              Tell us what you are launching, repositioning, or scaling—we will map the fastest path to standout
              creative.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-full bg-foreground px-8 py-3 text-sm font-semibold text-background transition hover:opacity-90 dark:bg-white dark:text-black"
              >
                Book a consultation
              </Link>
              <Link
                href="/approach"
                className="inline-flex items-center justify-center rounded-full border border-border bg-card px-8 py-3 text-sm font-semibold transition hover:border-accent/40"
              >
                See our approach
              </Link>
            </div>
          </div>
        </div>
      </FadeIn>
    </section>
  );
}
