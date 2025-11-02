import { HeroSection } from '@/components/aceternity/hero-spotlight';
import { AboutSection } from '@/components/sections/AboutSection';
import { NewsSection } from '@/components/sections/NewsSection';
import { EventsSection } from '@/components/sections/EventsSection';
import { MembershipBenefitsSection } from '@/components/sections/MembershipBenefitsSection';
import { PartnersSection } from '@/components/sections/PartnersSection';
import { SEO } from '@/components/seo';
import {
  generateOrganizationSchema,
  generateWebSiteSchema,
} from '@/lib/seo/structuredData';

export function HomePage() {
  // Объединяем structured data для главной страницы
  const structuredData = [generateOrganizationSchema(), generateWebSiteSchema()];

  return (
    <div className="min-h-screen">
      <SEO
        title="Главная"
        description="Кыргызский Финансовый Альянс - Саморегулируемая организация профессиональных участников рынка ценных бумаг Кыргызской Республики"
        url="https://kfa.kg"
        structuredData={structuredData}
      />
      <HeroSection />
      <AboutSection />
      <NewsSection />
      <EventsSection />
      <MembershipBenefitsSection />
      <PartnersSection />
    </div>
  );
}
