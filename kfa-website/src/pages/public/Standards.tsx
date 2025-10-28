import { Scale, Shield, Award } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { StandardsListSection } from '@/components/sections/standards/StandardsListSection';
import { EthicsCodeSection } from '@/components/sections/standards/EthicsCodeSection';
import { QualityControlSection } from '@/components/sections/standards/QualityControlSection';
import { DisputeResolutionSection } from '@/components/sections/standards/DisputeResolutionSection';
import { SEO } from '@/components/seo';

function StandardsHeroSection() {
  const { t } = useTranslation('standards');

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
            <Scale className="h-12 w-12 text-white" />
          </div>

          <h1 className="mb-6 font-display text-display-xl text-white">
            {t('hero.title')}
          </h1>
          <p className="text-xl leading-relaxed text-primary-50">
            {t('hero.subtitle')}
          </p>

          {/* Quick Stats */}
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            <div className="rounded-kfa border border-white/20 bg-white/10 p-6 backdrop-blur-sm">
              <div className="mb-2 flex justify-center">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <div className="mb-1 font-display text-3xl font-bold text-white">60+</div>
              <div className="text-sm text-primary-100">{t('hero.stat1')}</div>
            </div>

            <div className="rounded-kfa border border-white/20 bg-white/10 p-6 backdrop-blur-sm">
              <div className="mb-2 flex justify-center">
                <Award className="h-8 w-8 text-white" />
              </div>
              <div className="mb-1 font-display text-3xl font-bold text-white">12</div>
              <div className="text-sm text-primary-100">{t('hero.stat2')}</div>
            </div>

            <div className="rounded-kfa border border-white/20 bg-white/10 p-6 backdrop-blur-sm">
              <div className="mb-2 flex justify-center">
                <Scale className="h-8 w-8 text-white" />
              </div>
              <div className="mb-1 font-display text-3xl font-bold text-white">100%</div>
              <div className="text-sm text-primary-100">{t('hero.stat3')}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function StandardsPage() {
  return (
    <div className="min-h-screen">
      <SEO
        title="Стандарты и этика"
        description="Профессиональные стандарты, кодекс этики, контроль качества и урегулирование споров в Кыргызском Финансовом Альянсе. Саморегулирование рынка ценных бумаг"
        url="https://kfa.kg/standards"
        keywords="стандарты КФА, кодекс этики, контроль качества, саморегулирование, профессиональная деятельность"
        image="https://kfa.kg/images/standards-og.png"
      />
      <StandardsHeroSection />
      <StandardsListSection />
      <EthicsCodeSection />
      <QualityControlSection />
      <DisputeResolutionSection />
    </div>
  );
}
