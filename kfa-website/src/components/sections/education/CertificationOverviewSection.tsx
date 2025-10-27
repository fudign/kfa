import { Award, CheckCircle, FileCheck } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

interface CertificationLevel {
  id: number;
  titleKey: string;
  descriptionKey: string;
  requirements: string[];
  duration: string;
  validFor: string;
}

const certifications: CertificationLevel[] = [
  {
    id: 1,
    titleKey: 'cert1',
    descriptionKey: 'description1',
    requirements: ['Высшее образование', 'Опыт 1+ год', 'Обучение 80 часов'],
    duration: '3 месяца',
    validFor: '3 года',
  },
  {
    id: 2,
    titleKey: 'cert2',
    descriptionKey: 'description2',
    requirements: ['Базовый сертификат', 'Опыт 3+ года', 'Обучение 120 часов'],
    duration: '6 месяцев',
    validFor: '3 года',
  },
  {
    id: 3,
    titleKey: 'cert3',
    descriptionKey: 'description3',
    requirements: ['Профессиональный сертификат', 'Опыт 5+ лет', 'Обучение 160 часов'],
    duration: '9 месяцев',
    validFor: '5 лет',
  },
];

export function CertificationOverviewSection() {
  const { t } = useTranslation('education');

  return (
    <section className="bg-white py-24 dark:bg-neutral-900">
      <div className="container">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-6 font-display text-display-md text-primary-900 dark:text-primary-100">
            {t('certification.title')}
          </h2>
          <p className="text-lg leading-relaxed text-neutral-600 dark:text-neutral-400">
            {t('certification.subtitle')}
          </p>
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-3">
          {certifications.map((cert, index) => (
            <div
              key={cert.id}
              className="group relative overflow-hidden rounded-kfa border border-neutral-200 bg-gradient-to-b from-white to-neutral-50 p-8 transition-all hover:border-primary-300 hover:shadow-kfa-lg dark:border-neutral-700 dark:from-neutral-900 dark:to-neutral-800"
            >
              {/* Level Badge */}
              <div className="mb-6 flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary-600 to-primary-700 text-lg font-bold text-white">
                  {index + 1}
                </div>
                <div className="rounded-full bg-accent-100 p-3 dark:bg-accent-900/30">
                  <Award className="h-6 w-6 text-accent-600 dark:text-accent-400" />
                </div>
              </div>

              <h3 className="mb-3 font-display text-xl font-semibold text-primary-900 dark:text-primary-100">
                {t(`certification.${cert.titleKey}.title`)}
              </h3>

              <p className="mb-6 leading-relaxed text-neutral-600 dark:text-neutral-400">
                {t(`certification.${cert.descriptionKey}`)}
              </p>

              {/* Requirements */}
              <div className="mb-6 space-y-2">
                <div className="flex items-center gap-2 text-sm font-semibold text-primary-700 dark:text-primary-400">
                  <FileCheck className="h-4 w-4" />
                  <span>Требования:</span>
                </div>
                <ul className="space-y-1">
                  {cert.requirements.map((req, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                      <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-600 dark:text-green-400" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Duration & Validity */}
              <div className="space-y-2 border-t border-neutral-200 pt-6 dark:border-neutral-700">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-neutral-500 dark:text-neutral-500">Подготовка:</span>
                  <span className="font-semibold text-primary-700 dark:text-primary-400">{cert.duration}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-neutral-500 dark:text-neutral-500">Срок действия:</span>
                  <span className="font-semibold text-primary-700 dark:text-primary-400">{cert.validFor}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            to="/education/certification"
            className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-primary-600 to-primary-700 px-8 py-4 font-semibold text-white shadow-kfa-md transition-all hover:shadow-kfa-lg"
          >
            Подробнее о сертификации
          </Link>
        </div>
      </div>
    </section>
  );
}
