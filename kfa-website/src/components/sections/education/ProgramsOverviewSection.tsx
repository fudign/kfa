import { GraduationCap, BookOpen, Award, Users, Clock, TrendingUp } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

interface Program {
  id: number;
  icon: typeof GraduationCap;
  titleKey: string;
  descriptionKey: string;
  duration: string;
  level: string;
  participants: number;
}

const programs: Program[] = [
  {
    id: 1,
    icon: GraduationCap,
    titleKey: 'program1',
    descriptionKey: 'description1',
    duration: '3 месяца',
    level: 'Базовый',
    participants: 150,
  },
  {
    id: 2,
    icon: BookOpen,
    titleKey: 'program2',
    descriptionKey: 'description2',
    duration: '6 месяцев',
    level: 'Продвинутый',
    participants: 80,
  },
  {
    id: 3,
    icon: Award,
    titleKey: 'program3',
    descriptionKey: 'description3',
    duration: '2 месяца',
    level: 'Специализация',
    participants: 45,
  },
  {
    id: 4,
    icon: Users,
    titleKey: 'program4',
    descriptionKey: 'description4',
    duration: '1 месяц',
    level: 'Руководители',
    participants: 35,
  },
];

const levelColors: Record<string, string> = {
  'Базовый': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  'Продвинутый': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  'Специализация': 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  'Руководители': 'bg-accent-100 text-accent-700 dark:bg-accent-900/30 dark:text-accent-400',
};

export function ProgramsOverviewSection() {
  const { t } = useTranslation('education');

  return (
    <section className="bg-gradient-to-b from-primary-50 to-white py-24 dark:from-neutral-800 dark:to-neutral-900">
      <div className="container">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-6 font-display text-display-md text-primary-900 dark:text-primary-100">
            {t('programs.title')}
          </h2>
          <p className="text-lg leading-relaxed text-neutral-600 dark:text-neutral-400">
            {t('programs.subtitle')}
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-2">
          {programs.map((program) => {
            const Icon = program.icon;
            return (
              <Link
                key={program.id}
                to="/education/programs"
                className="group relative overflow-hidden rounded-kfa border border-neutral-200 bg-white p-8 transition-all hover:border-primary-300 hover:shadow-kfa-lg dark:border-neutral-700 dark:bg-neutral-900"
              >
                <div className="mb-6 inline-flex rounded-full bg-gradient-to-br from-primary-100 to-primary-50 p-4 dark:from-primary-900/30 dark:to-primary-800/30">
                  <Icon className="h-8 w-8 text-primary-600 dark:text-primary-400" />
                </div>

                <div className="mb-4 flex items-center gap-3">
                  <h3 className="font-display text-xl font-semibold text-primary-900 dark:text-primary-100">
                    {t(`programs.${program.titleKey}.title`)}
                  </h3>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${levelColors[program.level]}`}>
                    {program.level}
                  </span>
                </div>

                <p className="mb-6 leading-relaxed text-neutral-600 dark:text-neutral-400">
                  {t(`programs.${program.descriptionKey}`)}
                </p>

                <div className="flex items-center gap-6 text-sm text-neutral-500 dark:text-neutral-500">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>{program.duration}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span>{program.participants} участников</span>
                  </div>
                </div>

                <div className="mt-6 flex items-center gap-2 font-semibold text-primary-600 transition-colors group-hover:text-primary-700 dark:text-primary-400">
                  Подробнее
                  <TrendingUp className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <Link
            to="/education/programs"
            className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-primary-600 to-primary-700 px-8 py-4 font-semibold text-white shadow-kfa-md transition-all hover:shadow-kfa-lg"
          >
            Все программы обучения
          </Link>
        </div>
      </div>
    </section>
  );
}
