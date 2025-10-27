import { useTranslation } from 'react-i18next';
import { FileText, Scale, AlertCircle, CheckCircle, XCircle, UserX } from 'lucide-react';

function TermsHeroSection() {
  const { t } = useTranslation('terms');

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary-600 to-primary-800 py-24">
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
          <div className="mb-6 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent-500">
              <Scale className="h-8 w-8 text-white" />
            </div>
          </div>

          <h1 className="mb-4 font-display text-display-lg text-white">
            {t('hero.title')}
          </h1>
          <p className="text-lg text-primary-50">
            {t('hero.subtitle')}
          </p>
          <p className="mt-4 text-sm text-primary-200">
            {t('hero.lastUpdated')}: 22.10.2025
          </p>
        </div>
      </div>
    </section>
  );
}

function TermsContentSection() {
  const { t } = useTranslation('terms');

  const sections = [
    {
      id: 'acceptance',
      icon: CheckCircle,
      titleKey: 'sections.acceptance.title',
      contentKey: 'sections.acceptance.content',
    },
    {
      id: 'services',
      icon: FileText,
      titleKey: 'sections.services.title',
      contentKey: 'sections.services.content',
    },
    {
      id: 'userResponsibilities',
      icon: AlertCircle,
      titleKey: 'sections.userResponsibilities.title',
      contentKey: 'sections.userResponsibilities.content',
    },
    {
      id: 'prohibitedUse',
      icon: XCircle,
      titleKey: 'sections.prohibitedUse.title',
      contentKey: 'sections.prohibitedUse.content',
    },
    {
      id: 'termination',
      icon: UserX,
      titleKey: 'sections.termination.title',
      contentKey: 'sections.termination.content',
    },
    {
      id: 'liability',
      icon: Scale,
      titleKey: 'sections.liability.title',
      contentKey: 'sections.liability.content',
    },
  ];

  return (
    <section className="bg-white py-16 dark:bg-neutral-900">
      <div className="container">
        <div className="mx-auto max-w-4xl space-y-12">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <div key={section.id} id={section.id}>
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h2 className="font-display text-2xl font-semibold text-primary-900 dark:text-primary-100">
                    {t(section.titleKey)}
                  </h2>
                </div>
                <div className="prose prose-neutral max-w-none dark:prose-invert">
                  <p className="leading-relaxed text-neutral-700 dark:text-neutral-300">
                    {t(section.contentKey)}
                  </p>
                </div>
              </div>
            );
          })}

          {/* Important Notice */}
          <div className="rounded-kfa border border-accent-300 bg-accent-50 p-6 dark:border-accent-700 dark:bg-accent-900/20">
            <div className="flex gap-3">
              <AlertCircle className="h-6 w-6 flex-shrink-0 text-accent-600 dark:text-accent-400" />
              <div>
                <h3 className="mb-2 font-semibold text-accent-900 dark:text-accent-100">
                  {t('notice.title')}
                </h3>
                <p className="text-sm text-accent-800 dark:text-accent-200">
                  {t('notice.content')}
                </p>
              </div>
            </div>
          </div>

          {/* Contact Section */}
          <div className="rounded-kfa border border-primary-200 bg-gradient-to-br from-primary-50 to-accent-50 p-8 dark:border-primary-800 dark:from-primary-900/20 dark:to-accent-900/20">
            <h3 className="mb-4 font-display text-xl font-semibold text-primary-900 dark:text-primary-100">
              {t('contact.title')}
            </h3>
            <p className="mb-4 text-neutral-700 dark:text-neutral-300">
              {t('contact.description')}
            </p>
            <div className="flex flex-col gap-2 text-sm text-neutral-600 dark:text-neutral-400">
              <p>Email: <a href="mailto:legal@kfa.kg" className="text-primary-600 hover:underline dark:text-primary-400">legal@kfa.kg</a></p>
              <p>Телефон: <a href="tel:+996312123456" className="text-primary-600 hover:underline dark:text-primary-400">+996 (312) 12-34-56</a></p>
              <p>Адрес: г. Бишкек, ул. Московская 189, БЦ "Авангард", 5 этаж</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function TermsPage() {
  return (
    <div className="min-h-screen">
      <TermsHeroSection />
      <TermsContentSection />
    </div>
  );
}
