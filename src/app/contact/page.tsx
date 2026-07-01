import type { Metadata } from "next";
import type { SVGProps } from "react";
import { Mail, MapPin, Phone } from "lucide-react";
import { FacebookIcon, InstagramIcon, LinkedInIcon } from "@/components/icons/social-icons";
import { FadeIn } from "@/components/motion/fade-in";
import { ContactForm } from "@/components/contact/contact-form";
import { company, socialLinks } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: `Contact ${company.shortName} — consultations and new business.`,
};

function XIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export default function ContactPage() {
  return (
    <div className="nexus-page-glow">
      <section className="mx-auto max-w-4xl px-4 py-20 text-center sm:px-6 lg:px-8 lg:py-24">
        <FadeIn>
          <h1 className="font-display text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl">
            Let&apos;s <span className="text-gradient-emerald">Connect</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-zinc-400">
            Ready to amplify your brand? Get in touch and let&apos;s create something extraordinary together.
          </p>
        </FadeIn>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-24 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.05fr] lg:items-start">
          <FadeIn delay={0.05} className="space-y-8">
            <div>
              <h2 className="font-display text-xl font-bold text-white">Get in Touch</h2>
              <ul className="mt-6 space-y-5">

                <li className="flex items-start gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-cyan-400 text-white shadow-lg">
                    <Phone className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Phone</p>
                    <p className="mt-1 text-sm text-zinc-300">{company.phone}</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-cyan-400 text-white shadow-lg">
                    <Mail className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Email</p>
                    <a href={`mailto:${company.email}`} className="mt-1 block text-sm text-zinc-300 hover:text-emerald-400">
                      {company.email}
                    </a>
                  </div>
                </li>
              </ul>
            </div>


          </FadeIn>

          <ContactForm />
        </div>
      </section>
    </div>
  );
}
