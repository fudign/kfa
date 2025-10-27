import { HeroSection } from '@/components/aceternity/hero-spotlight';
import { AboutSection } from '@/components/sections/AboutSection';
import { NewsSection } from '@/components/sections/NewsSection';
import { EventsSection } from '@/components/sections/EventsSection';
import { MembershipBenefitsSection } from '@/components/sections/MembershipBenefitsSection';
import { PartnersSection } from '@/components/sections/PartnersSection';

export function HomePage() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <AboutSection />
      <NewsSection />
      <EventsSection />
      <MembershipBenefitsSection />
      <PartnersSection />
    </div>
  );
}
