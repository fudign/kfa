import { FileSearch, BarChart3, BookOpen } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { PublicationsSection } from '@/components/sections/research/PublicationsSection';
import { MarketDataSection } from '@/components/sections/research/MarketDataSection';
import { ResearchAreasSection } from '@/components/sections/research/ResearchAreasSection';

function ResearchHeroSection() {
  const { t } = useTranslation('research');

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary-600 to-primary-800 py-24">
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
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-flex rounded-full bg-white/10 p-4 backdrop-blur-sm">
            <FileSearch className="h-12 w-12 text-white" />
          </div>

          <h1 className="mb-6 font-display text-display-xl text-white">{t('hero.title')}</h1>
          <p className="text-xl leading-relaxed text-primary-50">{t('hero.subtitle')}</p>

          {/* Quick Stats */}
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            <div className="rounded-kfa border border-white/20 bg-white/10 p-6 backdrop-blur-sm">
              <div className="mb-2 flex justify-center">
                <BookOpen className="h-8 w-8 text-white" />
              </div>
              <div className="mb-1 font-display text-3xl font-bold text-white">60+</div>
              <div className="text-sm text-primary-100">{t('hero.stat1')}</div>
            </div>

            <div className="rounded-kfa border border-white/20 bg-white/10 p-6 backdrop-blur-sm">
              <div className="mb-2 flex justify-center">
                <BarChart3 className="h-8 w-8 text-white" />
              </div>
              <div className="mb-1 font-display text-3xl font-bold text-white">6</div>
              <div className="text-sm text-primary-100">{t('hero.stat2')}</div>
            </div>

            <div className="rounded-kfa border border-white/20 bg-white/10 p-6 backdrop-blur-sm">
              <div className="mb-2 flex justify-center">
                <FileSearch className="h-8 w-8 text-white" />
              </div>
              <div className="mb-1 font-display text-3xl font-bold text-white">15+</div>
              <div className="text-sm text-primary-100">{t('hero.stat3')}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function ResearchPage() {
  return (
    <div className="min-h-screen">
      <ResearchHeroSection />
      <MarketDataSection />
      <PublicationsSection />
      <ResearchAreasSection />
    </div>
  );
}
