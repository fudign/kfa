import { useTranslation } from 'react-i18next';
import { Calendar, ArrowRight } from 'lucide-react';

interface NewsItem {
  id: number;
  titleKey: string;
  excerptKey: string;
  date: string;
  imageUrl: string;
  category: string;
}

const newsItems: NewsItem[] = [
  {
    id: 1,
    titleKey: 'news1.title',
    excerptKey: 'news1.excerpt',
    date: '2025-10-15',
    imageUrl: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800',
    category: 'regulation',
  },
  {
    id: 2,
    titleKey: 'news2.title',
    excerptKey: 'news2.excerpt',
    date: '2025-10-10',
    imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800',
    category: 'events',
  },
  {
    id: 3,
    titleKey: 'news3.title',
    excerptKey: 'news3.excerpt',
    date: '2025-10-05',
    imageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800',
    category: 'analytics',
  },
];

export function NewsSection() {
  const { t } = useTranslation('home');

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <section className="bg-white py-24">
      <div className="container">
        {/* Header */}
        <div className="mb-12 flex items-end justify-between">
          <div>
            <h2 className="mb-4 font-display text-display-lg text-primary-900">
              {t('news.title')}
            </h2>
            <p className="max-w-2xl text-lg text-neutral-600">{t('news.subtitle')}</p>
          </div>
          <a
            href="/news"
            className="hidden items-center gap-2 font-semibold text-primary-600 transition-colors hover:text-primary-700 md:flex"
          >
            {t('news.viewAll')}
            <ArrowRight className="h-5 w-5" />
          </a>
        </div>

        {/* News Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {newsItems.map((item) => (
            <article
              key={item.id}
              className="group cursor-pointer overflow-hidden rounded-kfa border border-neutral-200 bg-white transition-all hover:border-primary-300 hover:shadow-kfa-lg"
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden bg-gradient-to-br from-primary-100 to-primary-50">
                <img
                  src={item.imageUrl}
                  alt={t(`news.items.${item.titleKey}`)}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute right-4 top-4 rounded-full bg-white px-3 py-1 text-sm font-medium text-primary-700 shadow-kfa-sm">
                  {t(`news.categories.${item.category}`)}
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="mb-3 flex items-center gap-2 text-sm text-neutral-500">
                  <Calendar className="h-4 w-4" />
                  <time dateTime={item.date}>{formatDate(item.date)}</time>
                </div>

                <h3 className="mb-3 font-display text-xl font-semibold text-primary-900 transition-colors group-hover:text-primary-700">
                  {t(`news.items.${item.titleKey}`)}
                </h3>

                <p className="mb-4 line-clamp-3 leading-relaxed text-neutral-600">
                  {t(`news.items.${item.excerptKey}`)}
                </p>

                <div className="flex items-center gap-2 font-semibold text-primary-600 transition-colors group-hover:text-primary-700">
                  {t('news.readMore')}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Mobile View All */}
        <div className="mt-8 text-center md:hidden">
          <a
            href="/news"
            className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-6 py-3 font-semibold text-white shadow-kfa-md transition-all hover:bg-primary-700"
          >
            {t('news.viewAll')}
            <ArrowRight className="h-5 w-5" />
          </a>
        </div>
      </div>
    </section>
  );
}
