import { useTranslation } from 'react-i18next';

interface Partner {
  id: number;
  name: string;
  logoUrl: string;
  category: 'financial' | 'government' | 'international' | 'technology';
}

const partners: Partner[] = [
  {
    id: 1,
    name: 'Национальный Банк КР',
    logoUrl: 'https://placehold.co/200x100/1A3A6B/FFFFFF/png?text=NBKR',
    category: 'government',
  },
  {
    id: 2,
    name: 'Минфин КР',
    logoUrl: 'https://placehold.co/200x100/1A3A6B/FFFFFF/png?text=MinFin',
    category: 'government',
  },
  {
    id: 3,
    name: 'Комерцбанк',
    logoUrl: 'https://placehold.co/200x100/1A3A6B/FFFFFF/png?text=Bank+1',
    category: 'financial',
  },
  {
    id: 4,
    name: 'ФинТех Групп',
    logoUrl: 'https://placehold.co/200x100/1A3A6B/FFFFFF/png?text=FinTech',
    category: 'technology',
  },
  {
    id: 5,
    name: 'World Bank',
    logoUrl: 'https://placehold.co/200x100/1A3A6B/FFFFFF/png?text=World+Bank',
    category: 'international',
  },
  {
    id: 6,
    name: 'ЕБРР',
    logoUrl: 'https://placehold.co/200x100/1A3A6B/FFFFFF/png?text=EBRD',
    category: 'international',
  },
  {
    id: 7,
    name: 'Банк Азия',
    logoUrl: 'https://placehold.co/200x100/1A3A6B/FFFFFF/png?text=Bank+2',
    category: 'financial',
  },
  {
    id: 8,
    name: 'ТехКомпани',
    logoUrl: 'https://placehold.co/200x100/1A3A6B/FFFFFF/png?text=Tech+Co',
    category: 'technology',
  },
];

export function PartnersSection() {
  const { t } = useTranslation('home');

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
          <div className="grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-4">
            {partners.map((partner) => (
              <div
                key={partner.id}
                className="group flex items-center justify-center rounded-kfa border border-neutral-200 bg-white p-8 transition-all hover:border-primary-300 hover:shadow-kfa-md dark:border-neutral-700 dark:bg-neutral-900 dark:hover:border-primary-600"
              >
                <img
                  src={partner.logoUrl}
                  alt={partner.name}
                  loading="lazy"
                  decoding="async"
                  className="h-auto w-full max-w-[160px] object-contain opacity-70 transition-opacity group-hover:opacity-100"
                />
              </div>
            ))}
          </div>
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
