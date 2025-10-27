// import { useState } from 'react';
import { CheckCircle, AlertCircle, BarChart3, FileText, Download, Share2 } from 'lucide-react';
import { Link } from 'react-router-dom';

function ScorecardHeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary-600 to-primary-800 py-24">
      {/* Background Pattern */}
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
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex rounded-full bg-white/10 p-4 backdrop-blur-sm">
            <BarChart3 className="h-12 w-12 text-white" />
          </div>

          <h1 className="mb-6 font-display text-display-xl text-white">
            Governance Scorecard
          </h1>
          <p className="text-xl leading-relaxed text-primary-50">
            Оцените уровень корпоративного управления в вашей компании
          </p>
          <p className="mt-4 text-lg text-primary-100">
            Онлайн-инструмент для самооценки практик корпоративного управления
          </p>

          <div className="mt-12 flex flex-wrap justify-center gap-4">
            <button className="btn-secondary">Начать оценку</button>
            <button className="btn-outline border-white text-white hover:bg-white hover:text-primary-600">
              Посмотреть пример
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function ScorecardOverviewSection() {
  const categories = [
    {
      name: 'Права акционеров',
      questions: 12,
      icon: <CheckCircle className="h-8 w-8" />,
      color: 'primary',
    },
    {
      name: 'Совет директоров',
      questions: 18,
      icon: <CheckCircle className="h-8 w-8" />,
      color: 'success',
    },
    {
      name: 'Прозрачность',
      questions: 10,
      icon: <CheckCircle className="h-8 w-8" />,
      color: 'info',
    },
    {
      name: 'Управление рисками',
      questions: 15,
      icon: <CheckCircle className="h-8 w-8" />,
      color: 'warning',
    },
    {
      name: 'ESG практики',
      questions: 14,
      icon: <CheckCircle className="h-8 w-8" />,
      color: 'purple',
    },
    {
      name: 'Комитеты',
      questions: 8,
      icon: <CheckCircle className="h-8 w-8" />,
      color: 'secondary',
    },
  ];

  return (
    <section className="py-16 md:py-24">
      <div className="container">
        <div className="mb-12 text-center">
          <h2 className="mb-4 font-display text-3xl md:text-4xl">Области оценки</h2>
          <p className="mx-auto max-w-2xl text-lg text-text-muted">
            Комплексная оценка по 6 ключевым направлениям корпоративного управления
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((category, index) => (
            <div
              key={index}
              className="rounded-kfa border border-border bg-surface p-6 transition-all hover:shadow-lg"
            >
              <div className={`mb-4 inline-flex rounded-lg bg-${category.color}-50 p-3 text-${category.color}-600`}>
                {category.icon}
              </div>
              <h3 className="mb-2 text-xl font-semibold">{category.name}</h3>
              <p className="text-text-muted">{category.questions} вопросов</p>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-lg text-text-muted">
            Всего <span className="font-semibold text-primary-600">77 вопросов</span> • Время прохождения{' '}
            <span className="font-semibold text-primary-600">30-45 минут</span>
          </p>
        </div>
      </div>
    </section>
  );
}

function ScorecardBenefitsSection() {
  const benefits = [
    {
      icon: <BarChart3 className="h-8 w-8" />,
      title: 'Объективная оценка',
      description: 'Получите независимую оценку текущего состояния корпоративного управления',
    },
    {
      icon: <AlertCircle className="h-8 w-8" />,
      title: 'Выявление пробелов',
      description: 'Определите слабые места и приоритетные области для улучшения',
    },
    {
      icon: <FileText className="h-8 w-8" />,
      title: 'Подробный отчет',
      description: 'Получите детализированный отчет с рекомендациями и планом действий',
    },
    {
      icon: <Share2 className="h-8 w-8" />,
      title: 'Бенчмаркинг',
      description: 'Сравните свои результаты со средними показателями по индустрии',
    },
  ];

  return (
    <section className="bg-surface py-16 md:py-24">
      <div className="container">
        <div className="mb-12 text-center">
          <h2 className="mb-4 font-display text-3xl md:text-4xl">Преимущества инструмента</h2>
          <p className="mx-auto max-w-2xl text-lg text-text-muted">
            Профессиональная самооценка для улучшения практик управления
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="rounded-kfa border border-border bg-background p-8"
            >
              <div className="mb-4 inline-flex rounded-lg bg-primary-50 p-3 text-primary-600">
                {benefit.icon}
              </div>
              <h3 className="mb-3 text-xl font-semibold">{benefit.title}</h3>
              <p className="text-text-muted">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ScorecardProcessSection() {
  const steps = [
    {
      number: '1',
      title: 'Регистрация',
      description: 'Создайте аккаунт или войдите в систему',
    },
    {
      number: '2',
      title: 'Заполнение',
      description: 'Ответьте на вопросы по всем категориям',
    },
    {
      number: '3',
      title: 'Анализ',
      description: 'Система автоматически рассчитает ваш балл',
    },
    {
      number: '4',
      title: 'Отчет',
      description: 'Получите детальный отчет с рекомендациями',
    },
  ];

  return (
    <section className="py-16 md:py-24">
      <div className="container">
        <div className="mb-12 text-center">
          <h2 className="mb-4 font-display text-3xl md:text-4xl">Как это работает</h2>
          <p className="mx-auto max-w-2xl text-lg text-text-muted">
            Простой процесс для получения полной картины вашей системы управления
          </p>
        </div>

        <div className="mx-auto max-w-4xl">
          <div className="grid gap-6 md:grid-cols-4">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <div className="rounded-kfa border border-border bg-surface p-6 text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary-600 font-display text-2xl text-white">
                    {step.number}
                  </div>
                  <h3 className="mb-2 text-lg font-semibold">{step.title}</h3>
                  <p className="text-sm text-text-muted">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className="absolute right-0 top-8 hidden h-0.5 w-full translate-x-1/2 bg-border md:block" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ScorecardExampleSection() {
  return (
    <section className="bg-surface py-16 md:py-24">
      <div className="container">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-kfa border border-border bg-background p-8 md:p-12">
            <h2 className="mb-6 font-display text-3xl md:text-4xl">Пример отчета</h2>

            {/* Sample Scores */}
            <div className="mb-8 space-y-4">
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <span className="font-semibold">Права акционеров</span>
                  <span className="text-success-600">85%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-gray-200">
                  <div className="h-full bg-success-500" style={{ width: '85%' }} />
                </div>
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <span className="font-semibold">Совет директоров</span>
                  <span className="text-success-600">78%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-gray-200">
                  <div className="h-full bg-success-500" style={{ width: '78%' }} />
                </div>
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <span className="font-semibold">Прозрачность</span>
                  <span className="text-warning-600">65%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-gray-200">
                  <div className="h-full bg-warning-500" style={{ width: '65%' }} />
                </div>
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <span className="font-semibold">Управление рисками</span>
                  <span className="text-error-600">52%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-gray-200">
                  <div className="h-full bg-error-500" style={{ width: '52%' }} />
                </div>
              </div>
            </div>

            {/* Overall Score */}
            <div className="mb-8 rounded-kfa bg-primary-50 p-6 text-center">
              <div className="mb-2 text-sm font-semibold uppercase text-primary-600">Общий балл</div>
              <div className="mb-2 font-display text-5xl font-bold text-primary-600">72%</div>
              <div className="text-text-muted">Хороший уровень корпоративного управления</div>
            </div>

            <div className="flex flex-wrap gap-4">
              <button className="btn-primary flex items-center gap-2">
                <Download className="h-5 w-5" />
                Скачать пример PDF
              </button>
              <Link to="/governance/code" className="btn-outline">
                Изучить Кодекс
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ScorecardCTASection() {
  return (
    <section className="py-16 md:py-24">
      <div className="container">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-kfa bg-gradient-to-br from-primary-600 to-primary-800 p-8 text-center text-white md:p-12">
            <h2 className="mb-4 font-display text-3xl md:text-4xl">Готовы начать оценку?</h2>
            <p className="mb-8 text-lg text-primary-50">
              Присоединяйтесь к компаниям, которые улучшают свое корпоративное управление
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/auth/register" className="btn-secondary">
                Создать аккаунт
              </Link>
              <Link to="/auth/login" className="btn-outline border-white text-white hover:bg-white hover:text-primary-600">
                Войти
              </Link>
            </div>

            <p className="mt-6 text-sm text-primary-100">
              Уже являетесь членом КФА? Получите доступ к расширенной версии с бенчмаркингом
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export function GovernanceScorecardPage() {
  return (
    <div className="min-h-screen">
      <ScorecardHeroSection />
      <ScorecardOverviewSection />
      <ScorecardBenefitsSection />
      <ScorecardProcessSection />
      <ScorecardExampleSection />
      <ScorecardCTASection />
    </div>
  );
}
