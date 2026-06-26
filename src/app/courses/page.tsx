import type { Metadata } from "next";
import { CourseCatalogHero, PhaseRoadmap, PricingSection } from "@/components/course/course-catalog";
import { company } from "@/lib/site";

export const metadata: Metadata = {
  title: "Courses | Nexus Media",
  description: `Explore the Nexus Media premium course catalog and accelerate your career with structured phases, mentorship, and placement support.`,
  openGraph: {
    title: "Nexus Media Courses",
    description: `Explore the Nexus Media premium course catalog and accelerate your career with structured phases, mentorship, and placement support.`,
  },
};

export default function CoursesPage() {
  return (
    <main className="nexus-page-glow">
      <CourseCatalogHero />
      <PricingSection />
      <PhaseRoadmap />
    </main>
  );
}
