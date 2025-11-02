import { FileText, Shield, TrendingUp, Users, Award, BookOpen } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface Standard {
  id: number;
  icon: typeof FileText;
  categoryKey: string;
  descriptionKey: string;
  documentCount: number;
}

const standards: Standard[] = [
  {
    id: 1,
    icon: Shield,
    categoryKey: 'category1',
    descriptionKey: 'description1',
    documentCount: 8,
  },
  {
    id: 2,
    icon: TrendingUp,
    categoryKey: 'category2',
    descriptionKey: 'description2',
    documentCount: 12,
  },
  {
    id: 3,
    icon: Users,
    categoryKey: 'category3',
    descriptionKey: 'description3',
    documentCount: 6,
  },
  {
    id: 4,
    icon: Award,
    categoryKey: 'category4',
    descriptionKey: 'description4',
    documentCount: 10,
  },
  {
    id: 5,
    icon: BookOpen,
    categoryKey: 'category5',
    descriptionKey: 'description5',
    documentCount: 15,
  },
  {
    id: 6,
    icon: FileText,
    categoryKey: 'category6',
    descriptionKey: 'description6',
    documentCount: 9,
  },
];

export function StandardsListSection() {
  const { t } = useTranslation('standards');

  return (
    <section className="bg-gradient-to-b from-primary-50 to-white py-24 dark:from-neutral-800 dark:to-neutral-900">
      <div className="container">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-6 font-display text-display-md text-primary-900 dark:text-primary-100">
            {t('standardsList.title')}
          </h2>
          <p className="text-lg leading-relaxed text-neutral-600 dark:text-neutral-400">
            {t('standardsList.subtitle')}
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {standards.map((standard) => {
            const Icon = standard.icon;
            return (
              <div
                key={standard.id}
                className="group relative overflow-hidden rounded-kfa border border-neutral-200 bg-white p-8 transition-all hover:border-primary-300 hover:shadow-kfa-lg dark:border-neutral-700 dark:bg-neutral-900"
              >
                <div className="mb-6 inline-flex rounded-full bg-gradient-to-br from-primary-100 to-primary-50 p-4 dark:from-primary-900/30 dark:to-primary-800/30">
                  <Icon className="h-8 w-8 text-primary-600 dark:text-primary-400" />
                </div>

                <h3 className="mb-3 font-display text-xl font-semibold text-primary-900 dark:text-primary-100">
                  {t(`standardsList.${standard.categoryKey}.title`)}
                </h3>

                <p className="mb-4 leading-relaxed text-neutral-600 dark:text-neutral-400">
                  {t(`standardsList.${standard.descriptionKey}`)}
                </p>

                <div className="flex items-center gap-2 text-sm text-neutral-500 dark:text-neutral-500">
                  <FileText className="h-4 w-4" />
                  <span>{standard.documentCount} документов</span>
                </div>

                <button className="mt-6 w-full rounded-lg bg-primary-600 py-2.5 font-semibold text-white transition-colors hover:bg-primary-700">
                  Скачать пакет
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
