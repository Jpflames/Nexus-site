/** Site-wide copy, navigation, and contact — aligned with brand preview */

export const company = {
  name: "The Nexus Media Limited",
  shortName: "The Nexus Media",
  tagline: "Building Connections. Amplifying Brands. Creating Impact.",
  heroDescription:
    "We're a forward-thinking media and marketing company dedicated to helping brands create meaningful connections with their audiences.",
  description:
    "A forward-thinking media and marketing company that helps brands connect meaningfully with their audience through strategic, visual, and results-driven communication.",
  phone: "+234 (0) 123 456 7890",
  email: "hello@nexusmedia.ng",
  address: "Karu, Nasarawa, Nigeria",
  founder: {
    name: "Nathaniel Ishaya",
    role: "Founder & Creative Director",
    bio: "With a passion for storytelling and brand building, Nathaniel founded The Nexus Media to help brands create meaningful connections with their audiences.",
  },
} as const;

export const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/approach", label: "Our Approach" },
  { href: "/contact", label: "Contact" },
] as const;

export const footerServices = [
  "Branding & Identity",
  "Marketing & Publicity",
  "Media & Content Support",
  "Digital Strategy",
] as const;

export const serviceInterestOptions = [
  "Branding & Identity",
  "Marketing & Publicity",
  "Media & Content Support",
  "Digital Strategy",
  "Other",
] as const;

export const socialLinks = [
  { label: "Facebook", href: "https://facebook.com", icon: "facebook" as const },
  { label: "Instagram", href: "https://instagram.com", icon: "instagram" as const },
  { label: "LinkedIn", href: "https://linkedin.com", icon: "linkedin" as const },
  { label: "X", href: "https://x.com", icon: "x" as const },
] as const;

export const trustIndustries = ["Tech", "Finance", "Healthcare", "Retail", "Education"] as const;
