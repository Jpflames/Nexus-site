/** Site-wide copy, navigation, and contact for the Nexus Media platform */

export const company = {
  name: "Nexus Media",
  shortName: "Nexus Media",
  tagline: "Brand, media, HR, and career growth support for ambitious teams and professionals.",
  heroDescription:
    "Nexus Media helps brands, teams, and professionals grow through sharp creative systems, publicity, HR support, and practical career acceleration.",
  description:
    "Nexus Media is a creative and professional services company delivering branding, marketing, media support, HR services, and career acceleration programs.",
  phone: "+2349013940923",
  email: "thenexusmedia.global@gmail.com",
  address: "AMAC, Abuja, Nigeria",
  founder: {
    name: "Nathaniel Ishaya",
    role: "Founder & Creative Director",
    bio: "Nathaniel built Nexus Media to help organizations communicate clearly, hire better, and grow with polished creative and people-focused systems.",
  },
} as const;

export const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/courses", label: "Courses" },
  { href: "/contact", label: "Contact" },
] as const;

export const footerServices = [
  "Branding & Identity",
  "Marketing & Publicity",
  "Media & Content Support",
  "HR Services",
] as const;

export const serviceInterestOptions = [
  "Branding & Identity",
  "Marketing & Publicity",
  "Media & Content Support",
  "HR Services",
  "Career Acceleration",
  "Other",
] as const;

export const socialLinks = [
  { label: "Facebook", href: "https://facebook.com", icon: "facebook" as const },
  { label: "Instagram", href: "https://instagram.com", icon: "instagram" as const },
  { label: "LinkedIn", href: "https://linkedin.com", icon: "linkedin" as const },
  { label: "X", href: "https://x.com", icon: "x" as const },
] as const;

export const trustIndustries = ["Fintech", "Enterprise", "Consulting", "E-commerce", "Education"] as const;
