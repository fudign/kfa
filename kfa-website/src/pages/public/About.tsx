import { useTranslation } from 'react-i18next';
import { MissionSection } from '@/components/sections/about/MissionSection';
import { HistoryTimeline } from '@/components/sections/about/HistoryTimeline';
import { TeamSection } from '@/components/sections/about/TeamSection';
import { DocumentsSection } from '@/components/sections/about/DocumentsSection';

function AboutHeroSection() {
  const { t } = useTranslation('about');

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary-600 to-primary-800 px-4 py-16 md:py-24 lg:py-32">
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

      <div className="container relative">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="mb-4 font-display text-3xl text-white md:mb-6 md:text-4xl lg:text-5xl">
            {t('hero.title')}
          </h1>
          <p className="mb-6 text-base leading-relaxed text-primary-50 md:mb-8 md:text-lg lg:text-xl">
            {t('hero.subtitle')}
          </p>

          {/* Stats */}
          <div className="grid gap-4 md:gap-6 md:grid-cols-3 lg:gap-8">
            <div className="rounded-lg bg-white/10 p-4 backdrop-blur-sm md:p-6">
              <div className="mb-2 font-display text-3xl font-bold text-white md:text-4xl">10+</div>
              <div className="text-sm text-primary-100 md:text-base">{t('hero.stats.years')}</div>
            </div>
            <div className="rounded-lg bg-white/10 p-4 backdrop-blur-sm md:p-6">
              <div className="mb-2 font-display text-3xl font-bold text-white md:text-4xl">150+</div>
              <div className="text-sm text-primary-100 md:text-base">{t('hero.stats.members')}</div>
            </div>
            <div className="rounded-lg bg-white/10 p-4 backdrop-blur-sm md:p-6">
              <div className="mb-2 font-display text-3xl font-bold text-white md:text-4xl">500+</div>
              <div className="text-sm text-primary-100 md:text-base">{t('hero.stats.certified')}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function AboutPage() {
  return (
    <div className="min-h-screen">
      <AboutHeroSection />
      <MissionSection />
      <HistoryTimeline />
      <TeamSection />
      <DocumentsSection />
    </div>
  );
}
