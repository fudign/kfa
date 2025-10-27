import { FileText, ArrowRight, Calendar, User } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

interface Publication {
  id: number;
  titleKey: string;
  descriptionKey: string;
  author: string;
  date: string;
  category: 'market-analysis' | 'regulatory' | 'methodology' | 'annual-report';
  pages: number;
  slug: string;
}

const publications: Publication[] = [
  {
    id: 1,
    titleKey: 'pub1',
    descriptionKey: 'description1',
    author: 'Аналитический отдел КФА',
    date: '2025-10-22',
    category: 'market-analysis',
    pages: 85,
    slug: 'market-analysis-q3-2025',
  },
  {
    id: 2,
    titleKey: 'pub2',
    descriptionKey: 'description2',
    author: 'Аналитический отдел КФА',
    date: '2025-10-22',
    category: 'regulatory',
    pages: 92,
    slug: 'regulatory-changes-2026',
  },
  {
    id: 3,
    titleKey: 'pub3',
    descriptionKey: 'description3',
    author: 'Департамент управления рисками КФА',
    date: '2025-10-22',
    category: 'methodology',
    pages: 128,
    slug: 'risk-assessment-methodology',
  },
  {
    id: 5,
    titleKey: 'pub5',
    descriptionKey: 'description5',
    author: 'Центр устойчивого развития КФА',
    date: '2025-10-22',
    category: 'market-analysis',
    pages: 115,
    slug: 'esg-trends-kyrgyzstan',
  },
  {
    id: 6,
    titleKey: 'pub6',
    descriptionKey: 'description6',
    author: 'Комитет по корпоративному управлению КФА',
    date: '2025-10-22',
    category: 'methodology',
    pages: 145,
    slug: 'corporate-governance-best-practices',
  },
];

const categoryColors = {
  'market-analysis': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  regulatory: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  methodology: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  'annual-report': 'bg-accent-100 text-accent-700 dark:bg-accent-900/30 dark:text-accent-400',
};

const categoryLabels = {
  'market-analysis': 'Анализ рынка',
  regulatory: 'Регулирование',
  methodology: 'Методология',
  'annual-report': 'Годовой отчет',
};

export function PublicationsSection() {
  const { t } = useTranslation('research');
  const navigate = useNavigate();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <section className="bg-gradient-to-b from-primary-50 to-white py-24 dark:from-neutral-800 dark:to-neutral-900">
      <div className="container">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-6 font-display text-display-md text-primary-900 dark:text-primary-100">
            {t('publications.title')}
          </h2>
          <p className="text-lg leading-relaxed text-neutral-600 dark:text-neutral-400">
            {t('publications.subtitle')}
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-2">
          {publications.map((pub) => (
            <div
              key={pub.id}
              className="group overflow-hidden rounded-kfa border border-neutral-200 bg-white transition-all hover:border-primary-300 hover:shadow-kfa-lg dark:border-neutral-700 dark:bg-neutral-900"
            >
              <div className="p-8">
                <div className="mb-4 flex items-start justify-between">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${categoryColors[pub.category]}`}
                  >
                    {categoryLabels[pub.category]}
                  </span>
                  <div className="rounded-full bg-primary-100 p-3 dark:bg-primary-900/30">
                    <FileText className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                  </div>
                </div>

                <h3 className="mb-3 font-display text-xl font-semibold text-primary-900 dark:text-primary-100">
                  {t(`publications.${pub.titleKey}.title`)}
                </h3>

                <p className="mb-6 leading-relaxed text-neutral-600 dark:text-neutral-400">
                  {t(`publications.${pub.descriptionKey}`)}
                </p>

                <div className="mb-6 space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>{pub.author}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(pub.date)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    <span>{pub.pages} страниц</span>
                  </div>
                </div>

                <button
                  onClick={() => navigate(`/research/${pub.slug}`)}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary-600 py-3 font-semibold text-white transition-colors hover:bg-primary-700"
                >
                  Читать полностью
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
