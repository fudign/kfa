import { useState } from 'react';
import { Calendar, Search, ArrowRight } from 'lucide-react';

interface NewsArticle {
  id: number;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  imageUrl: string;
  author?: string;
}

const newsArticles: NewsArticle[] = [
  {
    id: 1,
    title: 'Новые требования к профессиональным участникам рынка',
    excerpt: 'НБКР утвердил обновленные стандарты для брокеров и дилеров. Изменения вступят в силу с 1 января 2026 года.',
    date: '2025-10-15',
    category: 'regulation',
    imageUrl: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800',
    author: 'Анна Смирнова',
  },
  {
    id: 2,
    title: 'Итоги ежегодной конференции КФА 2025',
    excerpt: 'Более 200 участников обсудили перспективы развития фондового рынка и цифровизацию финансовых услуг.',
    date: '2025-10-10',
    category: 'events',
    imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800',
    author: 'Марат Токтоматов',
  },
  {
    id: 3,
    title: 'Квартальный отчет: рост объемов торгов',
    excerpt: 'По итогам III квартала 2025 года объем торгов увеличился на 23% по сравнению с аналогичным периодом прошлого года.',
    date: '2025-10-05',
    category: 'analytics',
    imageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800',
    author: 'Азамат Мурзабеков',
  },
  {
    id: 4,
    title: 'Новая программа сертификации специалистов',
    excerpt: 'КФА запускает обновленную программу подготовки и аттестации специалистов рынка ценных бумаг',
    date: '2025-09-28',
    category: 'education',
    imageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800',
    author: 'Анна Смирнова',
  },
  {
    id: 5,
    title: 'Соглашение о сотрудничестве с ЕБРР',
    excerpt: 'Подписан меморандум о взаимопонимании с Европейским банком реконструкции и развития',
    date: '2025-09-20',
    category: 'international',
    imageUrl: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800',
    author: 'Алексей Петров',
  },
  {
    id: 6,
    title: 'Обновление профессиональных стандартов',
    excerpt: 'Совет КФА утвердил новую редакцию стандартов профессиональной деятельности',
    date: '2025-09-15',
    category: 'regulation',
    imageUrl: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800',
  },
];

const categories = [
  { id: 'all', name: 'Все новости' },
  { id: 'regulation', name: 'Регулирование' },
  { id: 'events', name: 'События' },
  { id: 'analytics', name: 'Аналитика' },
  { id: 'education', name: 'Образование' },
  { id: 'international', name: 'Международное' },
];

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
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredNews = newsArticles.filter((article) => {
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
    const matchesSearch =
      searchQuery === '' ||
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
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
      <NewsHeroSection />

      <section className="bg-white px-4 py-8 dark:bg-neutral-900 md:py-12">
        <div className="container">
          {/* Filters */}
          <div className="mb-6 flex flex-col gap-4 md:mb-8 md:flex-row md:items-center md:justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Поиск новостей..."
                className="w-full rounded-lg border border-neutral-300 bg-white py-2 pl-10 pr-4 text-neutral-900 placeholder-neutral-400 transition-colors focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-100 dark:placeholder-neutral-500"
              />
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-primary-600 text-white'
                      : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          {/* News Grid */}
          {filteredNews.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-3 lg:gap-8">
              {filteredNews.map((article) => (
                <article
                  key={article.id}
                  className="group cursor-pointer overflow-hidden rounded-kfa border border-neutral-200 bg-white transition-all hover:border-primary-300 hover:shadow-kfa-lg dark:border-neutral-700 dark:bg-neutral-900"
                >
                  {/* Image */}
                  <div className="relative h-40 overflow-hidden bg-gradient-to-br from-primary-100 to-primary-50 dark:from-neutral-800 dark:to-neutral-900 md:h-48">
                    <img
                      src={article.imageUrl}
                      alt={article.title}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute right-3 top-3 rounded-full bg-white px-2 py-1 text-xs font-medium text-primary-700 shadow-kfa-sm dark:bg-neutral-800 dark:text-primary-400 md:right-4 md:top-4 md:px-3 md:text-sm">
                      {categories.find((c) => c.id === article.category)?.name}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4 md:p-6">
                    <div className="mb-2 flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400 md:mb-3 md:text-sm">
                      <Calendar className="h-3 w-3 md:h-4 md:w-4" />
                      <time dateTime={article.date}>{formatDate(article.date)}</time>
                    </div>

                    <h3 className="mb-2 font-display text-lg font-semibold text-primary-900 transition-colors group-hover:text-primary-700 dark:text-primary-100 dark:group-hover:text-primary-400 md:mb-3 md:text-xl">
                      {article.title}
                    </h3>

                    <p className="mb-3 line-clamp-3 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400 md:mb-4 md:text-base">
                      {article.excerpt}
                    </p>

                    {article.author && (
                      <p className="mb-3 text-xs text-neutral-500 dark:text-neutral-500 md:mb-4 md:text-sm">
                        Автор: {article.author}
                      </p>
                    )}

                    <div className="flex items-center gap-2 text-sm font-semibold text-primary-600 transition-colors group-hover:text-primary-700 dark:text-primary-400 dark:group-hover:text-primary-300 md:text-base">
                      Читать полностью
                      <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1 md:h-4 md:w-4" />
                    </div>
                  </div>
                </article>
              ))}
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
