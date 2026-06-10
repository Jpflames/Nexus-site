export type Phase = {
  id: number;
  slug: string;
  title: string;
  label: string;
  description: string;
  duration: string;
  price: number;
  premium?: boolean;
  outcomes: string[];
  tools: string[];
  unlockState: "Open" | "Locked" | "Premium";
};

export type Mentor = {
  name: string;
  role: string;
  speciality: string;
  avatar: string;
};

export type Testimonial = {
  quote: string;
  name: string;
  role: string;
  company: string;
};

export type FaqItem = {
  question: string;
  answer: string;
};

export type PricingPlan = {
  title: string;
  price: number;
  description: string;
  bullets: string[];
  badge: string;
  highlight: boolean;
  phaseSlugs: string[];
  paymentType: "single_phase" | "full_access";
};

export const courseName = "Nexus Media";
export const courseSubtitle = "A premium career acceleration ecosystem designed to deliver hire-ready skills, mentor guidance, and hiring momentum over 12 weeks.";
export const courseStats = [
  { value: "94%", label: "Job-Ready Confidence" },
  { value: "7/10", label: "Recruiter Interview Rate" },
  { value: "12 Weeks", label: "Structured Launch Program" },
];

export const phases: Phase[] = [
  {
    id: 1,
    slug: "employability-foundation",
    title: "Employability Foundation",
    label: "Phase 1",
    description: "Build the mindset, portfolio, and career identity that makes employers notice you.",
    duration: "3 weeks",
    price: 11000,
    outcomes: [
      "Personal brand positioning",
      "CV & LinkedIn excellence",
      "Foundational career toolkit",
    ],
    tools: ["Figma", "Notion", "LinkedIn", "Google Workspace"],
    unlockState: "Open",
  },
  {
    id: 2,
    slug: "real-world-experience",
    title: "Real-World Experience",
    label: "Phase 2",
    description: "Execute employer-style projects with real feedback and career-ready outcomes.",
    duration: "3 weeks",
    price: 12000,
    outcomes: [
      "Live project delivery",
      "Stakeholder communication",
      "Professional case study build",
    ],
    tools: ["Slack", "Miro", "Airtable", "Figma"],
    unlockState: "Open",
  },
  {
    id: 3,
    slug: "job-readiness",
    title: "Job Readiness",
    label: "Phase 3",
    description: "Sharpen interview performance, application systems, and job search rhythm.",
    duration: "3 weeks",
    price: 12000,
    outcomes: [
      "Interview mastery",
      "Application personalization",
      "Offer negotiation readiness",
    ],
    tools: ["Typeform", "LinkedIn Recruiter", "Zoom", "Figma"],
    unlockState: "Open",
  },
  {
    id: 4,
    slug: "premium-skill-track",
    title: "Premium Skill Track",
    label: "Phase 4",
    description: "A high-impact premium skill stack focused on elite roles and rapid salary growth.",
    duration: "3 weeks",
    price: 65000,
    premium: true,
    outcomes: [
      "Advanced career specialization",
      "Industry portfolio asset",
      "Priority placement support",
    ],
    tools: ["Python", "SQL", "Notion", "Figma"],
    unlockState: "Premium",
  },
];

export const pricingPlans = [
  {
    title: "Phase 1 – 3",
    price: 35000,
    description: "Core employability phases with proven career acceleration outcomes.",
    bullets: ["12-week structured curriculum", "Industry-minded deliverables", "Mentor review cycles"],
    badge: "Most Popular",
    highlight: false,
  },
  {
    title: "Phase 4 Premium",
    price: 65000,
    description: "Elite specialization with priority hiring and premium mentorship.",
    bullets: ["Advanced role-track training", "Premium career support", "Priority application support"],
    badge: "Premium",
    highlight: true,
  },
  {
    title: "Full Accelerator",
    price: 90000,
    description: "Complete Nexus Media journey with an optimized discount and fullest career impact.",
    bullets: ["All 4 phases", "Career placement preparation", "Access to employer network"],
    badge: "Best Value",
    highlight: true,
  },
];

export const mentorProfiles: Mentor[] = [
  {
    name: "Aisha Bello",
    role: "Career Strategy Coach",
    speciality: "Talent positioning & interview mastery",
    avatar: "https://i.pravatar.cc/120?img=32",
  },
  {
    name: "David Okoye",
    role: "Hiring Partner",
    speciality: "Employer screening & placement insight",
    avatar: "https://i.pravatar.cc/120?img=12",
  },
  {
    name: "Mina Yusuf",
    role: "Product Growth Lead",
    speciality: "Portfolio delivery & market fit",
    avatar: "https://i.pravatar.cc/120?img=45",
  },
];

export const testimonials: Testimonial[] = [
  {
    quote: "Nexus Media helped me replace confusion with clarity — I landed three interviews and signed an offer in 8 weeks.",
    name: "Chioma Ade",
    role: "UX Designer",
    company: "TechWave",
  },
  {
    quote: "The roadmap, mentor feedback, and hiring prep felt premium. It was the difference between applying and getting hired.",
    name: "Emeka Nwosu",
    role: "Data Analyst",
    company: "FinServe",
  },
  {
    quote: "Phase 4 was transformational. I gained advanced skills, strong confidence, and a gateway into a high-growth role.",
    name: "Tara James",
    role: "Product Ops Specialist",
    company: "Pulse Labs",
  },
];

export const faqItems: FaqItem[] = [
  {
    question: "Who should enroll in Nexus Media?",
    answer:
      "Nexus Media is designed for early talent, career changers, and recent graduates who want a structured, high-touch pathway into employer-ready roles.",
  },
  {
    question: "How is Nexus Media different from typical online courses?",
    answer:
      "Nexus Media blends live mentorship, hiring-facing projects, placement-focused career systems, and a premium roadmap built around employer expectations.",
  },
  {
    question: "Can I pay per phase or enroll in the full bundle?",
    answer:
      "Yes. You can enroll in Phase 1–3 individually at the base rate or choose Phase 4 premium or the full bundle for the best value.",
  },
  {
    question: "What are the payment options?",
    answer:
      "We support Flutterwave and Paystack for secure checkout, plus installment payment guidance for established learners.",
  },
];

export function getPhaseBySlug(slug: string) {
  return phases.find((phase) => phase.slug === slug);
}

export const coursePaths = phases.map((phase) => ({
  slug: phase.slug,
  title: phase.title,
}));
