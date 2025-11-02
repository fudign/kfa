import { useState } from 'react';
import { BookOpen, Users, Clock, Calendar, Download, ArrowRight } from 'lucide-react';

interface Program {
  id: number;
  title: string;
  description: string;
  level: 'Базовый' | 'Продвинутый' | 'Специализация' | 'Руководители';
  duration: string;
  format: 'online' | 'offline' | 'hybrid';
  price: string;
  nextStart: string;
  modules: number;
  participants: number;
  certificate: boolean;
}

const programs: Program[] = [
  {
    id: 1,
    title: 'Основы работы на рынке ценных бумаг',
    description: 'Комплексная программа для новичков, охватывающая все аспекты работы на фондовом рынке',
    level: 'Базовый',
    duration: '3 месяца',
    format: 'hybrid',
    price: '25,000 сом',
    nextStart: '2025-12-01',
    modules: 8,
    participants: 150,
    certificate: true,
  },
  {
    id: 2,
    title: 'Профессиональный анализ ценных бумаг',
    description: 'Углубленное изучение методов анализа и оценки инвестиционных инструментов',
    level: 'Продвинутый',
    duration: '6 месяцев',
    format: 'online',
    price: '45,000 сом',
    nextStart: '2025-12-15',
    modules: 12,
    participants: 80,
    certificate: true,
  },
  {
    id: 3,
    title: 'Управление инвестиционным портфелем',
    description: 'Специализированный курс по стратегиям портфельного инвестирования и управления рисками',
    level: 'Специализация',
    duration: '4 месяца',
    format: 'offline',
    price: '55,000 сом',
    nextStart: '2026-01-10',
    modules: 10,
    participants: 45,
    certificate: true,
  },
  {
    id: 4,
    title: 'Корпоративное управление и финансы',
    description: 'Программа для руководителей компаний по вопросам корпоративного управления',
    level: 'Руководители',
    duration: '2 месяца',
    format: 'hybrid',
    price: '65,000 сом',
    nextStart: '2026-01-20',
    modules: 6,
    participants: 35,
    certificate: true,
  },
  {
    id: 5,
    title: 'Регуляторные требования и комплаенс',
    description: 'Практические аспекты соблюдения регуляторных требований на финансовом рынке',
    level: 'Специализация',
    duration: '3 месяца',
    format: 'online',
    price: '40,000 сом',
    nextStart: '2026-02-01',
    modules: 8,
    participants: 60,
    certificate: true,
  },
  {
    id: 6,
    title: 'Управление рисками в финансовой компании',
    description: 'Современные методы и инструменты риск-менеджмента для финансовых организаций',
    level: 'Продвинутый',
    duration: '4 месяца',
    format: 'hybrid',
    price: '50,000 сом',
    nextStart: '2026-02-15',
    modules: 10,
    participants: 50,
    certificate: true,
  },
];

const levelColors = {
  Базовый: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  Продвинутый: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  Специализация: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  Руководители: 'bg-accent-100 text-accent-700 dark:bg-accent-900/30 dark:text-accent-400',
};

const formatColors = {
  online: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  offline: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  hybrid: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
};

const formatLabels = {
  online: 'Онлайн',
  offline: 'Очно',
  hybrid: 'Гибрид',
};

function ProgramsHeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary-600 to-primary-800 py-20">
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
          <h1 className="mb-6 font-display text-display-lg text-white">Программы обучения</h1>
          <p className="text-lg leading-relaxed text-primary-50">
            Профессиональное образование для специалистов финансового рынка всех уровней
          </p>
        </div>
      </div>
    </section>
  );
}

export function ProgramsPage() {
  const [selectedLevel, setSelectedLevel] = useState<string>('all');

  const filteredPrograms = programs.filter(
    (program) => selectedLevel === 'all' || program.level === selectedLevel
  );

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
      <ProgramsHeroSection />

      <section className="bg-white py-12 dark:bg-neutral-900">
        <div className="container">
          {/* Filters */}
          <div className="mb-8 flex justify-center">
            <div className="inline-flex gap-2 rounded-lg bg-neutral-100 p-1 dark:bg-neutral-800">
              <button
                onClick={() => setSelectedLevel('all')}
                className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                  selectedLevel === 'all'
                    ? 'bg-white text-primary-700 shadow-sm dark:bg-neutral-700 dark:text-primary-300'
                    : 'text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100'
                }`}
              >
                Все программы
              </button>
              {Object.keys(levelColors).map((level) => (
                <button
                  key={level}
                  onClick={() => setSelectedLevel(level)}
                  className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                    selectedLevel === level
                      ? 'bg-white text-primary-700 shadow-sm dark:bg-neutral-700 dark:text-primary-300'
                      : 'text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          {/* Programs Grid */}
          <div className="grid gap-8 md:grid-cols-2">
            {filteredPrograms.map((program) => (
              <div
                key={program.id}
                className="group relative overflow-hidden rounded-kfa border border-neutral-200 bg-white transition-all hover:border-primary-300 hover:shadow-kfa-lg dark:border-neutral-700 dark:bg-neutral-900"
              >
                <div className="p-8">
                  {/* Badges */}
                  <div className="mb-4 flex flex-wrap gap-2">
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${levelColors[program.level]}`}>
                      {program.level}
                    </span>
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${formatColors[program.format]}`}>
                      {formatLabels[program.format]}
                    </span>
                  </div>

                  <h3 className="mb-3 font-display text-xl font-semibold text-primary-900 dark:text-primary-100">
                    {program.title}
                  </h3>

                  <p className="mb-6 leading-relaxed text-neutral-600 dark:text-neutral-400">{program.description}</p>

                  {/* Details */}
                  <div className="mb-6 grid gap-3 text-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
                        <Clock className="h-4 w-4" />
                        <span>Длительность:</span>
                      </div>
                      <span className="font-semibold text-primary-700 dark:text-primary-400">{program.duration}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
                        <BookOpen className="h-4 w-4" />
                        <span>Модулей:</span>
                      </div>
                      <span className="font-semibold text-primary-700 dark:text-primary-400">{program.modules}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
                        <Calendar className="h-4 w-4" />
                        <span>Ближайший старт:</span>
                      </div>
                      <span className="font-semibold text-primary-700 dark:text-primary-400">
                        {formatDate(program.nextStart)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
                        <Users className="h-4 w-4" />
                        <span>Участников:</span>
                      </div>
                      <span className="font-semibold text-primary-700 dark:text-primary-400">
                        {program.participants}+
                      </span>
                    </div>
                  </div>

                  {/* Price & CTA */}
                  <div className="flex items-center justify-between border-t border-neutral-200 pt-6 dark:border-neutral-700">
                    <div>
                      <div className="text-sm text-neutral-500 dark:text-neutral-500">Стоимость</div>
                      <div className="font-display text-2xl font-bold text-primary-700 dark:text-primary-400">
                        {program.price}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button className="rounded-lg border border-primary-600 p-2 text-primary-700 transition-colors hover:bg-primary-50 dark:text-primary-400 dark:hover:bg-primary-900/30">
                        <Download className="h-5 w-5" />
                      </button>
                      <button className="flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 font-semibold text-white transition-colors hover:bg-primary-700">
                        Записаться
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
