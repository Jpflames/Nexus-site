import Image from "next/image";
import { Quote, Star } from "lucide-react";
import { FadeIn } from "@/components/motion/fade-in";
import { trustIndustries } from "@/lib/site";

const items = [
  {
    quote:
      "Nexus transformed our entire brand presence. The attention to detail and strategic thinking exceeded our expectations.",
    name: "Sarah Johnson",
    role: "CEO, TechStart Inc.",
    avatar: "https://i.pravatar.cc/120?img=5",
  },
  {
    quote:
      "Working with Nexus Media was a game-changer. They understood our vision and brought it to life beautifully.",
    name: "Michael Chen",
    role: "Marketing Director, GrowthCo",
    avatar: "https://i.pravatar.cc/120?img=11",
  },
  {
    quote:
      "Professional, creative, and results-driven. I highly recommend their services to any brand looking to stand out.",
    name: "Amara Okafor",
    role: "Founder, Bloom Retail",
    avatar: "https://i.pravatar.cc/120?img=9",
  },
] as const;

/** Client testimonials — quote badge, stars, avatars, trust strip */
export function Testimonials() {
  return (
    <section className="border-t border-white/10 bg-black py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <FadeIn className="text-center">
          <h2 className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-[2.5rem]">
            What Our Clients Say
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-zinc-400 sm:text-lg">
            Don&apos;t just take our word for it. Hear from brands we&apos;ve helped transform.
          </p>
        </FadeIn>

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {items.map((t, i) => (
            <FadeIn key={t.name} delay={0.06 * i}>
              <article className="flex h-full flex-col rounded-2xl border border-white/10 bg-[#121212] p-6 transition hover:border-[#ec4899]/25">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#ec4899] to-[#a855f7] text-white shadow-[0_8px_24px_rgba(236,72,153,0.35)]">
                  <Quote className="h-4 w-4" />
                </div>
                <div className="mt-4 flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, si) => (
                    <Star key={`${t.name}-star-${si}`} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="mt-4 flex-1 text-sm italic leading-relaxed text-zinc-200 sm:text-base">&ldquo;{t.quote}&rdquo;</p>
                <div className="mt-6 flex items-center gap-3 border-t border-white/10 pt-5">
                  <Image
                    src={t.avatar}
                    alt=""
                    width={44}
                    height={44}
                    className="h-11 w-11 rounded-full object-cover ring-2 ring-white/10"
                  />
                  <div>
                    <p className="font-display text-sm font-bold text-white">{t.name}</p>
                    <p className="text-xs text-zinc-500">{t.role}</p>
                  </div>
                </div>
              </article>
            </FadeIn>
          ))}
        </div>

        <FadeIn className="mt-16 text-center">
          <p className="text-sm text-zinc-500">Trusted by startups, SMEs, and corporate brands</p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm font-medium text-zinc-500">
            {trustIndustries.map((ind) => (
              <span key={ind}>{ind}</span>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
