import { FadeIn } from "@/components/motion/fade-in";
import { company } from "@/lib/site";

export function IntroSection() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
      <FadeIn>
        <p className="font-display text-xs font-semibold uppercase tracking-[0.25em] text-accent">Who we are</p>
        <h2 className="mt-4 max-w-3xl font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          Strategic branding, media, publicity, and HR support for organizations that want to move with clarity.
        </h2>
        <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">{company.description}</p>
      </FadeIn>
    </section>
  );
}
