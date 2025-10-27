import { useTranslation } from 'react-i18next';
import { DocumentsSection } from '@/components/sections/about/DocumentsSection';
import { FileText, Shield, Award, BookOpen } from 'lucide-react';

function DocumentsHeroSection() {
  const { t } = useTranslation('documents');

  const features = [
    {
      icon: FileText,
      titleKey: 'features.charter.title',
      descriptionKey: 'features.charter.description',
    },
    {
      icon: Shield,
      titleKey: 'features.regulations.title',
      descriptionKey: 'features.regulations.description',
    },
    {
      icon: Award,
      titleKey: 'features.standards.title',
      descriptionKey: 'features.standards.description',
    },
    {
      icon: BookOpen,
      titleKey: 'features.reports.title',
      descriptionKey: 'features.reports.description',
    },
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary-600 to-primary-800 py-32">
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
          <h1 className="mb-6 font-display text-display-xl text-white">
            {t('hero.title')}
          </h1>
          <p className="mb-12 text-xl leading-relaxed text-primary-50">
            {t('hero.subtitle')}
          </p>

          {/* Features Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="rounded-lg bg-white/10 p-6 backdrop-blur-sm transition-all hover:bg-white/20"
                >
                  <Icon className="mx-auto mb-3 h-8 w-8 text-accent-300" />
                  <div className="mb-2 font-semibold text-white">
                    {t(feature.titleKey)}
                  </div>
                  <div className="text-sm text-primary-100">
                    {t(feature.descriptionKey)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

export function DocumentsPage() {
  return (
    <div className="min-h-screen">
      <DocumentsHeroSection />
      <DocumentsSection />
    </div>
  );
}
