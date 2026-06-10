import type { SVGProps } from "react";
import Image from "next/image";
import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { FacebookIcon, InstagramIcon, LinkedInIcon } from "@/components/icons/social-icons";
import { FooterNewsletter } from "@/components/layout/footer-newsletter";
import { company, footerServices, navLinks, socialLinks } from "@/lib/site";

function XIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-white/10 bg-[#0a0a0a]">
      <div className="mx-auto grid max-w-6xl gap-12 px-4 py-14 sm:px-6 sm:grid-cols-2 lg:grid-cols-4 lg:px-8">
        <div className="space-y-5">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-10 w-10 items-center justify-center overflow-hidden">
              <Image src="/nexus%20icon.png" alt="Nexus Media icon" fill className="object-contain" sizes="40px" />
            </span>
            <span className="font-display text-base font-bold text-white">{company.shortName}</span>
          </div>
          <p className="text-sm leading-relaxed text-zinc-400">{company.tagline}</p>
          <ul className="space-y-3 text-sm text-zinc-400">
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300" />
              {company.address}
            </li>
            <li className="flex items-start gap-2">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300" />
              {company.phone}
            </li>
            <li className="flex items-start gap-2">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300" />
              <a href={`mailto:${company.email}`} className="hover:text-white">
                {company.email}
              </a>
            </li>
          </ul>
        </div>

        <div>
          <p className="font-display text-sm font-semibold text-white">Quick Links</p>
          <ul className="mt-4 space-y-2.5 text-sm text-zinc-400">
            {navLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="transition hover:text-emerald-200">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="font-display text-sm font-semibold text-white">Services</p>
          <ul className="mt-4 space-y-2.5 text-sm text-zinc-400">
            {footerServices.map((s) => (
              <li key={s}>
                <Link href="/services" className="transition hover:text-emerald-200">
                  {s}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-8">
          <div>
            <p className="font-display text-sm font-semibold text-white">Stay Connected</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {socialLinks.map((s) => (
                <a
                  key={s.href}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-zinc-900 text-zinc-300 transition hover:border-emerald-400/40 hover:text-white"
                  aria-label={s.label}
                >
                  {s.icon === "linkedin" && <LinkedInIcon className="h-4 w-4" />}
                  {s.icon === "instagram" && <InstagramIcon className="h-4 w-4" />}
                  {s.icon === "x" && <XIcon className="h-4 w-4" />}
                  {s.icon === "facebook" && <FacebookIcon className="h-4 w-4" />}
                </a>
              ))}
            </div>
          </div>
          <FooterNewsletter />
        </div>
      </div>
      <div className="border-t border-white/10 py-6 text-center text-xs text-zinc-500">
        © {new Date().getFullYear()} {company.name}. All rights reserved.
      </div>
    </footer>
  );
}
