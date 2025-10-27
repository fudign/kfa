import { useTranslation } from 'react-i18next';
import { MembershipTypesSection } from '@/components/sections/membership/MembershipTypesSection';
import { JoinProcessSection } from '@/components/sections/membership/JoinProcessSection';
import { RequirementsSection } from '@/components/sections/membership/RequirementsSection';
import { MembershipBenefitsSection } from '@/components/sections/MembershipBenefitsSection';

function MembershipHeroSection() {
  const { t } = useTranslation('membership');

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 py-32">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      {/* Animated Gradient Orbs */}
      <div className="absolute -left-20 -top-20 h-96 w-96 rounded-full bg-accent-500/20 blur-3xl"></div>
      <div className="absolute -bottom-20 -right-20 h-96 w-96 rounded-full bg-primary-400/20 blur-3xl"></div>

      <div className="container relative">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="mb-6 font-display text-display-xl text-white">
            {t('hero.title')}
          </h1>
          <p className="mb-8 text-xl leading-relaxed text-primary-50">
            {t('hero.subtitle')}
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href="/membership/join"
              className="inline-flex items-center gap-2 rounded-lg bg-white px-8 py-4 font-semibold text-primary-700 shadow-kfa-lg transition-all hover:bg-primary-50 hover:shadow-kfa-xl"
            >
              {t('hero.cta.join')}
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
            <a
              href="#benefits"
              className="inline-flex items-center gap-2 rounded-lg border-2 border-white px-8 py-4 font-semibold text-white transition-all hover:bg-white/10"
            >
              {t('hero.cta.learnMore')}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export function MembershipPage() {
  return (
    <div className="min-h-screen">
      <MembershipHeroSection />
      <div id="fees">
        <MembershipTypesSection />
      </div>
      <div id="benefits">
        <MembershipBenefitsSection />
      </div>
      <RequirementsSection />
      <JoinProcessSection />
    </div>
  );
}
