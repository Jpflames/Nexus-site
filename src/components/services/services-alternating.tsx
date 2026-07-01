"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Check, Clapperboard, Megaphone, Palette, UsersRound } from "lucide-react";
import { FadeIn } from "@/components/motion/fade-in";

type Block = {
  title: string;
  description: string;
  items: readonly string[];
  image: string;
  icon: "palette" | "megaphone" | "clapper" | "users";
};

const blocks: Block[] = [
  {
    title: "Branding & Identity",
    description:
      "We craft distinctive brand experiences that resonate with your audience and differentiate you in the market.",
    items: ["Logo Design", "Brand Guidelines", "Corporate Identity", "Visual Identity Systems"],
    image:
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80",
    icon: "palette",
  },
  {
    title: "Marketing & Publicity",
    description:
      "Strategic campaigns and compelling creatives that amplify your message and drive meaningful engagement.",
    items: ["Social Media Design", "Campaign Creatives", "Digital Marketing", "Content Strategy"],
    image:
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80",
    icon: "megaphone",
  },
  {
    title: "Media & Content Support",
    description:
      "Professional content creation and media assets that elevate your brand communication across all channels.",
    items: ["Presentation Design", "Visual Assets", "Communication Materials", "Content Production"],
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
    icon: "clapper",
  },
  {
    title: "HR Services",
    description:
      "People-focused support for hiring, onboarding, employer branding, and professional communication.",
    items: ["Recruitment Support", "Employer Branding", "Onboarding Materials", "HR Communications"],
    image:
      "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=80",
    icon: "users",
  },
];

function ServiceIcon({ type }: { type: Block["icon"] }) {
  const cls = "h-5 w-5 text-white";
  if (type === "palette") return <Palette className={cls} />;
  if (type === "megaphone") return <Megaphone className={cls} />;
  if (type === "users") return <UsersRound className={cls} />;
  return <Clapperboard className={cls} />;
}

/** Alternating image / copy rows — matches services preview */
export function ServicesAlternating() {
  return (
    <div className="space-y-24 lg:space-y-28">
      {blocks.map((b, i) => {
        const imageLeft = i % 2 === 0;
        return (
          <FadeIn key={b.title}>
            <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
              <motion.div
                initial={{ opacity: 0, x: imageLeft ? -16 : 16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className={`relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/10 ${imageLeft ? "" : "lg:order-2"}`}
              >
                <Image src={b.image} alt="" fill className="object-cover" sizes="(max-width:1024px) 100vw, 50vw" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-4 left-4 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 via-cyan-400 to-lime-400 shadow-lg ring-4 ring-black/50">
                  <ServiceIcon type={b.icon} />
                </div>
              </motion.div>

              <div className={imageLeft ? "" : "lg:order-1"}>
                <h2 className="font-display text-2xl font-bold text-white sm:text-3xl">{b.title}</h2>
                <p className="mt-4 text-base leading-relaxed text-zinc-400">{b.description}</p>
                <ul className="mt-8 space-y-3">
                  {b.items.map((item) => (
                    <li key={item} className="flex items-center gap-3 text-sm text-zinc-300 sm:text-base">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-400/10 text-emerald-200">
                        <Check className="h-3.5 w-3.5" strokeWidth={3} />
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/signup"
                  className="mt-10 inline-flex items-center gap-2 rounded-full px-7 py-3 text-sm font-semibold text-white btn-gradient"
                >
                  Get Started
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </FadeIn>
        );
      })}
    </div>
  );
}
