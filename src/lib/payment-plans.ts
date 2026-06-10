import { phases } from "@/lib/nea";

export type PaymentPlan = {
  title: string;
  price: number;
  description: string;
  bullets: string[];
  badge: string;
  highlight: boolean;
  phaseSlugs: string[];
  paymentType: "single_phase" | "full_access";
};

export const paymentPlans: PaymentPlan[] = [
  {
    title: "Phase 1",
    price: 11000,
    description: "Employability foundation access for focused career positioning.",
    bullets: ["Employability Foundation", "Career identity toolkit", "Mentor review cycle"],
    badge: "Starter",
    highlight: false,
    phaseSlugs: ["employability-foundation"],
    paymentType: "single_phase",
  },
  {
    title: "Phase 2",
    price: 12000,
    description: "Real-world project experience with employer-style feedback.",
    bullets: ["Real-World Experience", "Live project delivery", "Case study build"],
    badge: "Project",
    highlight: false,
    phaseSlugs: ["real-world-experience"],
    paymentType: "single_phase",
  },
  {
    title: "Phase 3",
    price: 12000,
    description: "Job readiness training for interviews, applications, and offers.",
    bullets: ["Job Readiness", "Interview mastery", "Application system"],
    badge: "Career",
    highlight: false,
    phaseSlugs: ["job-readiness"],
    paymentType: "single_phase",
  },
  {
    title: "Phase 4",
    price: 65000,
    description: "Premium skill track access for advanced role specialization.",
    bullets: ["Premium Skill Track", "Advanced portfolio asset", "Priority placement support"],
    badge: "Premium",
    highlight: false,
    phaseSlugs: ["premium-skill-track"],
    paymentType: "single_phase",
  },
  {
    title: "Full Accelerator",
    price: 90000,
    description: "Complete Nexus Media journey with an optimized discount and fullest career impact.",
    bullets: ["All 4 phases", "Career placement preparation", "Access to employer network"],
    badge: "Best Value",
    highlight: true,
    phaseSlugs: phases.map((phase) => phase.slug),
    paymentType: "full_access",
  },
];

export function getPaymentPlan(title: string) {
  return paymentPlans.find((plan) => plan.title === title);
}
