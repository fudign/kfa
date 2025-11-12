import { useState, useEffect } from 'react';
import { Calendar, Search, ArrowRight } from 'lucide-react';
import { SEO } from '@/components/seo';
import { newsAPI } from '@/services/api/news';
import type { News } from '@/types/news';

function NewsHeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary-600 to-primary-800 px-4 py-12 md:py-16 lg:py-24">
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
          <h1 className="mb-4 font-display text-3xl text-white md:mb-6 md:text-4xl lg:text-5xl">
            Новости
          </h1>
          <p className="text-base leading-relaxed text-primary-50 md:text-lg lg:text-xl">
            Актуальные события, важные изменения и аналитика финансового рынка Кыргызстана
          </p>
        </div>
      </div>
    </section>
  );
}

export function NewsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNews();
  }, []);

  const loadNews = async () => {
    try {
      setLoading(true);
      const response = await newsAPI.getAll({ status: 'published', per_page: 100 });
      setNews(response.data);
    } catch (error) {
      console.error('Error loading news:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredNews = news.filter((article) => {
    const matchesSearch =
      searchQuery === '' ||
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (article.excerpt && article.excerpt.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesSearch;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen">
      <SEO
        title="Новости"
        description="Актуальные новости, события и аналитика фондового рынка Кыргызстана. Регулирование, международное сотрудничество, образовательные программы КФА"
        url="https://kfa.kg/news"
        keywords="новости КФА, фондовый рынок, ценные бумаги, регулирование, аналитика, финансы Кыргызстан"
        image="https://kfa.kg/images/news-og.png"
      />
      <NewsHeroSection />

      <section className="bg-white px-4 py-8 dark:bg-neutral-900 md:py-12">
        <div className="container">
          {/* Search */}
          <div className="mb-6 md:mb-8">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Поиск новостей..."
                className="w-full rounded-lg border border-neutral-300 bg-white py-2 pl-10 pr-4 text-neutral-900 placeholder-neutral-400 transition-colors focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-100 dark:placeholder-neutral-500"
              />
            </div>
          </div>

          {/* News Grid */}
          {loading ? (
            <div className="rounded-kfa border-2 border-dashed border-neutral-300 bg-neutral-50 p-8 text-center dark:border-neutral-700 dark:bg-neutral-800 md:p-12">
              <p className="text-base text-neutral-600 dark:text-neutral-400 md:text-lg">
                Загрузка новостей...
              </p>
            </div>
          ) : filteredNews.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-3 lg:gap-8">
              {filteredNews.map((article) => {
                const imageUrl = article.featured_image?.url || article.image;
                const publishDate = article.published_at || article.created_at;

                return (
                  <article
                    key={article.id}
                    className="group cursor-pointer overflow-hidden rounded-kfa border border-neutral-200 bg-white transition-all hover:border-primary-300 hover:shadow-kfa-lg dark:border-neutral-700 dark:bg-neutral-900"
                  >
                    {/* Image */}
                    {imageUrl && (
                      <div className="relative h-40 overflow-hidden bg-gradient-to-br from-primary-100 to-primary-50 dark:from-neutral-800 dark:to-neutral-900 md:h-48">
                        <img
                          src={imageUrl}
                          alt={article.title}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        {article.featured && (
                          <div className="absolute right-3 top-3 rounded-full bg-yellow-500 px-2 py-1 text-xs font-medium text-white shadow-kfa-sm md:right-4 md:top-4 md:px-3 md:text-sm">
                            Избранное
                          </div>
                        )}
                      </div>
                    )}

                    {/* Content */}
                    <div className="p-4 md:p-6">
                      <div className="mb-2 flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400 md:mb-3 md:text-sm">
                        <Calendar className="h-3 w-3 md:h-4 md:w-4" />
                        <time dateTime={publishDate}>{formatDate(publishDate)}</time>
                      </div>

                      <h3 className="mb-2 font-display text-lg font-semibold text-primary-900 transition-colors group-hover:text-primary-700 dark:text-primary-100 dark:group-hover:text-primary-400 md:mb-3 md:text-xl">
                        {article.title}
                      </h3>

                      {article.excerpt && (
                        <p className="mb-3 line-clamp-3 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400 md:mb-4 md:text-base">
                          {article.excerpt}
                        </p>
                      )}

                      {article.author && (
                        <p className="mb-3 text-xs text-neutral-500 dark:text-neutral-500 md:mb-4 md:text-sm">
                          Автор: {article.author.name}
                        </p>
                      )}

                      <div className="flex items-center gap-2 text-sm font-semibold text-primary-600 transition-colors group-hover:text-primary-700 dark:text-primary-400 dark:group-hover:text-primary-300 md:text-base">
                        Читать полностью
                        <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1 md:h-4 md:w-4" />
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="rounded-kfa border-2 border-dashed border-neutral-300 bg-neutral-50 p-8 text-center dark:border-neutral-700 dark:bg-neutral-800 md:p-12">
              <p className="text-base text-neutral-600 dark:text-neutral-400 md:text-lg">
                Новостей не найдено
              </p>
              <p className="mt-2 text-xs text-neutral-500 dark:text-neutral-500 md:text-sm">
                Попробуйте изменить критерии поиска
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
