import { Award, BookOpen, CheckCircle, Clock, Users, TrendingUp } from 'lucide-react';
// import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

function CertificationHeroSection() {
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
            <Award className="h-12 w-12 text-white" />
          </div>

          <h1 className="mb-6 font-display text-display-xl text-white">
            Программа сертификации директоров
          </h1>
          <p className="text-xl leading-relaxed text-primary-50">
            Профессиональная подготовка и сертификация членов советов директоров по международным стандартам
          </p>

          {/* Quick Stats */}
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            <div className="rounded-kfa border border-white/20 bg-white/10 p-6 backdrop-blur-sm">
              <div className="mb-2 flex justify-center">
                <Users className="h-8 w-8 text-white" />
              </div>
              <div className="mb-1 font-display text-3xl font-bold text-white">200+</div>
              <div className="text-sm text-primary-100">Сертифицированных директоров</div>
            </div>

            <div className="rounded-kfa border border-white/20 bg-white/10 p-6 backdrop-blur-sm">
              <div className="mb-2 flex justify-center">
                <BookOpen className="h-8 w-8 text-white" />
              </div>
              <div className="mb-1 font-display text-3xl font-bold text-white">5</div>
              <div className="text-sm text-primary-100">Уровней сертификации</div>
            </div>

            <div className="rounded-kfa border border-white/20 bg-white/10 p-6 backdrop-blur-sm">
              <div className="mb-2 flex justify-center">
                <TrendingUp className="h-8 w-8 text-white" />
              </div>
              <div className="mb-1 font-display text-3xl font-bold text-white">95%</div>
              <div className="text-sm text-primary-100">Успешных выпускников</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CertificationLevelsSection() {
  const levels = [
    {
      level: 'Foundation',
      title: 'Базовый уровень',
      duration: '40 часов',
      icon: <BookOpen className="h-8 w-8" />,
      description: 'Основы корпоративного управления и роли директоров',
      topics: [
        'Принципы корпоративного управления',
        'Права и обязанности директоров',
        'Структура совета директоров',
        'Этика и конфликты интересов',
      ],
    },
    {
      level: 'Professional',
      title: 'Профессиональный уровень',
      duration: '80 часов',
      icon: <Award className="h-8 w-8" />,
      description: 'Углубленная подготовка для активных директоров',
      topics: [
        'Стратегическое планирование',
        'Финансовый анализ и отчетность',
        'Управление рисками',
        'ESG и устойчивое развитие',
      ],
    },
    {
      level: 'Advanced',
      title: 'Продвинутый уровень',
      duration: '120 часов',
      icon: <TrendingUp className="h-8 w-8" />,
      description: 'Для опытных директоров и председателей советов',
      topics: [
        'Эффективность совета директоров',
        'Управление изменениями',
        'Кризисное управление',
        'Международные стандарты',
      ],
    },
  ];

  return (
    <section className="py-16 md:py-24">
      <div className="container">
        <div className="mb-12 text-center">
          <h2 className="mb-4 font-display text-3xl md:text-4xl">Уровни сертификации</h2>
          <p className="mx-auto max-w-2xl text-lg text-text-muted">
            Выберите программу, соответствующую вашему опыту и целям развития
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {levels.map((level, index) => (
            <div
              key={index}
              className="rounded-kfa border border-border bg-surface p-8 transition-all hover:shadow-lg"
            >
              <div className="mb-4 inline-flex rounded-lg bg-primary-50 p-3 text-primary-600">
                {level.icon}
              </div>
              <div className="mb-2 text-sm font-semibold uppercase tracking-wide text-primary-600">
                {level.level}
              </div>
              <h3 className="mb-2 text-2xl font-bold">{level.title}</h3>
              <div className="mb-4 flex items-center gap-2 text-sm text-text-muted">
                <Clock className="h-4 w-4" />
                <span>{level.duration}</span>
              </div>
              <p className="mb-6 text-text-muted">{level.description}</p>

              <div className="mb-6 space-y-2">
                {level.topics.map((topic, topicIndex) => (
                  <div key={topicIndex} className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 flex-shrink-0 text-success-500" />
                    <span className="text-sm">{topic}</span>
                  </div>
                ))}
              </div>

              <button className="btn-outline w-full">Подробнее</button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CertificationProcessSection() {
  const steps = [
    {
      number: '1',
      title: 'Регистрация',
      description: 'Заполните заявку и предоставьте необходимые документы',
    },
    {
      number: '2',
      title: 'Обучение',
      description: 'Пройдите курс обучения с экспертами-практиками',
    },
    {
      number: '3',
      title: 'Экзамен',
      description: 'Сдайте квалификационный экзамен и защитите проект',
    },
    {
      number: '4',
      title: 'Сертификат',
      description: 'Получите сертификат и вступите в сообщество директоров',
    },
  ];

  return (
    <section className="bg-surface py-16 md:py-24">
      <div className="container">
        <div className="mb-12 text-center">
          <h2 className="mb-4 font-display text-3xl md:text-4xl">Процесс сертификации</h2>
          <p className="mx-auto max-w-2xl text-lg text-text-muted">
            Простой и прозрачный путь к профессиональной сертификации
          </p>
        </div>

        <div className="mx-auto max-w-4xl">
          <div className="grid gap-6 md:grid-cols-4">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <div className="rounded-kfa border border-border bg-background p-6 text-center">
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

function CertificationBenefitsSection() {
  const benefits = [
    'Признанная квалификация на рынке',
    'Доступ к эксклюзивным мероприятиям',
    'Членство в профессиональном сообществе',
    'Постоянное повышение квалификации',
    'Приоритет при поиске позиций директоров',
    'Скидки на образовательные программы',
  ];

  return (
    <section className="py-16 md:py-24">
      <div className="container">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-kfa bg-gradient-to-br from-primary-600 to-primary-800 p-8 text-white md:p-12">
            <h2 className="mb-4 font-display text-3xl md:text-4xl">Преимущества сертификации</h2>
            <p className="mb-8 text-lg text-primary-50">
              Инвестиция в ваше профессиональное развитие и карьеру
            </p>

            <div className="mb-8 grid gap-4 md:grid-cols-2">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 flex-shrink-0 text-success-300" />
                  <span className="text-lg">{benefit}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-4">
              <Link to="/membership/join" className="btn-secondary">
                Подать заявку
              </Link>
              <Link to="/governance/community" className="btn-outline border-white text-white hover:bg-white hover:text-primary-600">
                Сообщество директоров
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function DirectorsCertificationPage() {
  return (
    <div className="min-h-screen">
      <CertificationHeroSection />
      <CertificationLevelsSection />
      <CertificationProcessSection />
      <CertificationBenefitsSection />
    </div>
  );
}
