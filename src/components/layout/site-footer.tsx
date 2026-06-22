import Image from "next/image";
import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { FooterNewsletter } from "@/components/layout/footer-newsletter";
import { company, footerServices, navLinks } from "@/lib/site";

const footerEmail = "info@nexusmediaglobal.org";

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
              <a href={`mailto:${footerEmail}`} className="hover:text-white">
                {footerEmail}
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
          <FooterNewsletter />
        </div>
      </div>
      <div className="border-t border-white/10 py-6 text-center text-xs text-zinc-500">
        © {new Date().getFullYear()} {company.name}. All rights reserved.
      </div>
    </footer>
  );
}
