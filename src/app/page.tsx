import { HeroSection } from "@/components/home/hero-section";
import { WhyUs } from "@/components/home/why-us";
import { Testimonials } from "@/components/home/testimonials";
import { HomeFinalCta } from "@/components/home/home-final-cta";

/** Homepage — matches preview: hero, why us, testimonials, CTA */
export default function HomePage() {
  return (
    <>
      <HeroSection />
      <WhyUs />
      <Testimonials />
      <HomeFinalCta />
    </>
  );
}
