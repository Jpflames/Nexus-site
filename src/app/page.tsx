import { HeroSection } from "@/components/home/hero-section";
import { IntroSection } from "@/components/home/intro-section";
import { ServicesPreview } from "@/components/home/services-preview";
import { WhyUs } from "@/components/home/why-us";
import { PortfolioSection } from "@/components/home/portfolio-section";
import { Testimonials } from "@/components/home/testimonials";
import { HomeFinalCta } from "@/components/home/home-final-cta";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <IntroSection />
      <ServicesPreview />
      <WhyUs />
      <PortfolioSection />
      <Testimonials />
      <HomeFinalCta />
    </>
  );
}
