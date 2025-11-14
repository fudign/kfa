import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { partnersAPI, type Partner } from '../../lib/supabase-partners';

export function PartnersSection() {
  const { t } = useTranslation('home');
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPartners();
  }, []);

  async function loadPartners() {
    try {
      setLoading(true);
      setError(null);
      const data = await partnersAPI.fetchAll({
        status: 'active',
        sortBy: 'display_order',
        sortOrder: 'asc',
      });
      setPartners(data);
    } catch (err) {
      console.error('Error loading partners:', err);
      setError('Failed to load partners');
      // Fallback to static data if API fails
      setPartners([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="bg-neutral-50 py-24 dark:bg-neutral-800">
      <div className="container">
        {/* Header */}
        <div className="mb-16 text-center">
          <h2 className="mb-4 font-display text-display-lg text-primary-900 dark:text-primary-100">
            {t('partners.title')}
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-neutral-600 dark:text-neutral-400">
            {t('partners.subtitle')}
          </p>
        </div>

        {/* Partners Grid */}
        <div className="mx-auto max-w-6xl">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-600 border-t-transparent"></div>
            </div>
          ) : error ? (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-center text-red-600 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
              {error}
            </div>
          ) : partners.length === 0 ? (
            <div className="rounded-lg border border-neutral-200 bg-white p-8 text-center text-neutral-600 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-400">
              <p>{t('partners.noPartners', 'Партнеры появятся в ближайшее время')}</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-4">
              {partners.map((partner) => (
                <div
                  key={partner.id}
                  className="group flex items-center justify-center rounded-kfa border border-neutral-200 bg-white p-8 transition-all hover:border-primary-300 hover:shadow-kfa-md dark:border-neutral-700 dark:bg-neutral-900 dark:hover:border-primary-600"
                  title={partner.name}
                >
                  {partner.logo ? (
                    <img
                      src={partner.logo}
                      alt={partner.name}
                      loading="lazy"
                      decoding="async"
                      className="h-auto w-full max-w-[160px] object-contain opacity-70 transition-opacity group-hover:opacity-100"
                    />
                  ) : (
                    <div className="flex h-24 w-full items-center justify-center text-center">
                      <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                        {partner.name}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <a
            href="/membership"
            className="inline-flex items-center gap-2 font-semibold text-primary-600 transition-colors hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
          >
            {t('partners.cta')}
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
