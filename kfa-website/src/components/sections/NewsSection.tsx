import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import { Calendar, ArrowRight } from 'lucide-react';
import { newsAPI } from '@/services/api';
import type { News } from '@/types';

// Fallback hardcoded news items (if API fails or no news in database)
const fallbackNewsItems: News[] = [
  {
    id: 1,
    title: 'Добро пожаловать в КФА',
    slug: 'dobro-pozhalovat-v-kfa',
    content: 'Кыргызский Финансовый Альянс - профессиональное объединение участников рынка ценных бумаг.',
    excerpt: 'Кыргызский Финансовый Альянс - профессиональное объединение участников рынка ценных бумаг.',
    image: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800',
    status: 'published',
    featured: true,
    reading_time: 5,
    published_at: '2025-10-15',
    created_at: '2025-10-15',
    updated_at: '2025-10-15',
    author: { id: 1, name: 'КФА', email: 'info@kfa.kg' },
    is_published: true,
    is_draft: false,
    is_pending: false,
    can_edit: false,
  },
  {
    id: 2,
    title: 'Новые стандарты профессиональной деятельности',
    slug: 'novye-standarty',
    content: 'Внедрение новых стандартов для повышения качества услуг на рынке.',
    excerpt: 'Внедрение новых стандартов для повышения качества услуг на рынке.',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800',
    status: 'published',
    featured: true,
    reading_time: 5,
    published_at: '2025-10-10',
    created_at: '2025-10-10',
    updated_at: '2025-10-10',
    author: { id: 1, name: 'КФА', email: 'info@kfa.kg' },
    is_published: true,
    is_draft: false,
    is_pending: false,
    can_edit: false,
  },
  {
    id: 3,
    title: 'Аналитический отчет: Рынок ценных бумаг',
    slug: 'analiticheskij-otchet',
    content: 'Комплексный анализ рынка ценных бумаг за 2025 год.',
    excerpt: 'Комплексный анализ рынка ценных бумаг за 2025 год.',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800',
    status: 'published',
    featured: true,
    reading_time: 5,
    published_at: '2025-10-05',
    created_at: '2025-10-05',
    updated_at: '2025-10-05',
    author: { id: 1, name: 'КФА', email: 'info@kfa.kg' },
    is_published: true,
    is_draft: false,
    is_pending: false,
    can_edit: false,
  },
];

export function NewsSection() {
  const { t } = useTranslation('home');
  const [newsItems, setNewsItems] = useState<News[]>(fallbackNewsItems);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNews();
  }, []);

  const loadNews = async () => {
    try {
      setLoading(true);
      // Fetch published news, featured first, limit to 3
      const response = await newsAPI.getAll({
        status: 'published',
        featured: true,
        per_page: 3,
      });

      if (response.data && response.data.length > 0) {
        setNewsItems(response.data);
      } else {
        // If no news in database, keep fallback items
        console.log('No news found in database, using fallback items');
      }
    } catch (error) {
      console.error('Error loading news:', error);
      // On error, keep fallback items
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <section className="bg-white py-24 dark:bg-neutral-900">
      <div className="container">
        {/* Header */}
        <div className="mb-12 flex items-end justify-between">
          <div>
            <h2 className="mb-4 font-display text-display-lg text-primary-900 dark:text-primary-100">
              {t('news.title')}
            </h2>
            <p className="max-w-2xl text-lg text-neutral-600 dark:text-neutral-400">{t('news.subtitle')}</p>
          </div>
          <a
            href="/news"
            className="hidden items-center gap-2 font-semibold text-primary-600 transition-colors hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 md:flex"
          >
            {t('news.viewAll')}
            <ArrowRight className="h-5 w-5" />
          </a>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary-600 border-t-transparent"></div>
          </div>
        ) : (
          <>
            {/* News Grid */}
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {newsItems.map((item) => (
                <article
                  key={item.id}
                  className="group cursor-pointer overflow-hidden rounded-kfa border border-neutral-200 bg-white transition-all hover:border-primary-300 hover:shadow-kfa-lg dark:border-neutral-700 dark:bg-neutral-800 dark:hover:border-primary-600"
                >
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden bg-gradient-to-br from-primary-100 to-primary-50 dark:from-primary-900/30 dark:to-primary-800/30">
                    <img
                      src={item.featured_image?.url || item.image || 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800'}
                      alt={item.title}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    {item.featured && (
                      <div className="absolute right-4 top-4 rounded-full bg-white px-3 py-1 text-sm font-medium text-primary-700 shadow-kfa-sm dark:bg-neutral-800 dark:text-primary-400">
                        {t('news.featured') || 'Избранное'}
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="mb-3 flex items-center gap-2 text-sm text-neutral-500 dark:text-neutral-400">
                      <Calendar className="h-4 w-4" />
                      <time dateTime={item.published_at || item.created_at}>
                        {formatDate(item.published_at || item.created_at)}
                      </time>
                    </div>

                    <h3 className="mb-3 font-display text-xl font-semibold text-primary-900 transition-colors group-hover:text-primary-700 dark:text-primary-100 dark:group-hover:text-primary-300">
                      {item.title}
                    </h3>

                    <p className="mb-4 line-clamp-3 leading-relaxed text-neutral-600 dark:text-neutral-400">
                      {item.excerpt || item.content?.substring(0, 150) + '...'}
                    </p>

                    <a
                      href={`/news/${item.slug}`}
                      className="flex items-center gap-2 font-semibold text-primary-600 transition-colors group-hover:text-primary-700 dark:text-primary-400 dark:group-hover:text-primary-300"
                    >
                      {t('news.readMore')}
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </>
        )}

        {/* Mobile View All */}
        <div className="mt-8 text-center md:hidden">
          <a
            href="/news"
            className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-6 py-3 font-semibold text-white shadow-kfa-md transition-all hover:bg-primary-700 dark:bg-primary-700 dark:hover:bg-primary-800"
          >
            {t('news.viewAll')}
            <ArrowRight className="h-5 w-5" />
          </a>
        </div>
      </div>
    </section>
  );
}
