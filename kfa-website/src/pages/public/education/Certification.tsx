import { Award, CheckCircle, FileCheck, Clock, Download, AlertCircle, TrendingUp, Users } from 'lucide-react';

interface CertificationLevel {
  id: number;
  title: string;
  description: string;
  requirements: string[];
  examTopics: string[];
  duration: string;
  validFor: string;
  examFormat: string;
  passingScore: number;
  price: string;
}

const certifications: CertificationLevel[] = [
  {
    id: 1,
    title: 'Базовый сертификат специалиста',
    description:
      'Начальный уровень квалификации для специалистов, начинающих карьеру на финансовом рынке',
    requirements: [
      'Высшее образование (экономическое или юридическое)',
      'Опыт работы на финансовом рынке не менее 1 года',
      'Прохождение базовой образовательной программы (80 часов)',
      'Отсутствие дисциплинарных взысканий от регулятора',
    ],
    examTopics: [
      'Основы рынка ценных бумаг',
      'Регуляторные требования НБКР',
      'Профессиональная этика',
      'Базовые финансовые инструменты',
      'Права и обязанности инвесторов',
    ],
    duration: '3 месяца подготовки',
    validFor: '3 года',
    examFormat: 'Письменный тест (100 вопросов)',
    passingScore: 70,
    price: '5,000 сом',
  },
  {
    id: 2,
    title: 'Профессиональный сертификат',
    description: 'Продвинутый уровень для опытных специалистов с углубленными знаниями',
    requirements: [
      'Наличие базового сертификата КФА',
      'Опыт работы на финансовом рынке не менее 3 лет',
      'Прохождение профессиональной образовательной программы (120 часов)',
      'Рекомендации от двух членов КФА',
    ],
    examTopics: [
      'Углубленный анализ ценных бумаг',
      'Управление портфелем',
      'Оценка инвестиционных рисков',
      'Корпоративные финансы',
      'Международные стандарты отчетности',
    ],
    duration: '6 месяцев подготовки',
    validFor: '3 года',
    examFormat: 'Письменный тест + практический кейс',
    passingScore: 75,
    price: '8,000 сом',
  },
  {
    id: 3,
    title: 'Экспертный сертификат',
    description: 'Высший уровень квалификации для лидеров и экспертов отрасли',
    requirements: [
      'Наличие профессионального сертификата КФА',
      'Опыт работы на финансовом рынке не менее 5 лет',
      'Прохождение экспертной образовательной программы (160 часов)',
      'Публикации или исследования в сфере финансовых рынков',
      'Рекомендации от Совета КФА',
    ],
    examTopics: [
      'Стратегическое управление активами',
      'Сложные финансовые инструменты',
      'Системные риски финансового рынка',
      'Регуляторная политика и надзор',
      'Корпоративное управление',
    ],
    duration: '9 месяцев подготовки',
    validFor: '5 лет',
    examFormat: 'Комплексный экзамен + защита проекта',
    passingScore: 80,
    price: '12,000 сом',
  },
];

function CertificationHeroSection() {
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
          <div className="mb-6 inline-flex rounded-full bg-white/10 p-4 backdrop-blur-sm">
            <Award className="h-12 w-12 text-white" />
          </div>

          <h1 className="mb-6 font-display text-display-lg text-white">Профессиональная сертификация</h1>
          <p className="text-lg leading-relaxed text-primary-50">
            Признанная система аттестации специалистов финансового рынка Кыргызской Республики
          </p>
        </div>
      </div>
    </section>
  );
}

function CertificationProcessSection() {
  const steps = [
    {
      id: 1,
      icon: FileCheck,
      title: 'Подача заявки',
      description: 'Заполнение анкеты и предоставление необходимых документов',
      duration: '1-2 дня',
    },
    {
      id: 2,
      icon: Users,
      title: 'Проверка квалификации',
      description: 'Верификация образования, опыта работы и соответствия требованиям',
      duration: '5-7 дней',
    },
    {
      id: 3,
      icon: Clock,
      title: 'Подготовка',
      description: 'Прохождение образовательной программы и самостоятельная подготовка',
      duration: '3-9 месяцев',
    },
    {
      id: 4,
      icon: FileCheck,
      title: 'Сдача экзамена',
      description: 'Прохождение аттестационного экзамена в формате теста и/или кейса',
      duration: '1 день',
    },
    {
      id: 5,
      icon: Award,
      title: 'Получение сертификата',
      description: 'Выдача сертификата при успешной сдаче экзамена',
      duration: '7-10 дней',
    },
  ];

  return (
    <section className="bg-white py-24 dark:bg-neutral-900">
      <div className="container">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-6 font-display text-display-md text-primary-900 dark:text-primary-100">
            Процесс сертификации
          </h2>
          <p className="text-lg leading-relaxed text-neutral-600 dark:text-neutral-400">
            Пошаговый путь к получению профессионального сертификата КФА
          </p>
        </div>

        <div className="relative mt-16">
          {/* Timeline Line */}
          <div className="absolute left-8 top-0 hidden h-full w-0.5 bg-gradient-to-b from-primary-200 via-primary-400 to-primary-600 md:block"></div>

          <div className="space-y-8">
            {steps.map((step) => {
              const Icon = step.icon;
              return (
                <div key={step.id} className="relative flex gap-6">
                  {/* Timeline Node */}
                  <div className="relative z-10 flex-shrink-0">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary-600 to-primary-700 shadow-kfa-md">
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                  </div>

                  {/* Content Card */}
                  <div className="flex-1 rounded-kfa border border-neutral-200 bg-white p-6 shadow-kfa-sm dark:border-neutral-700 dark:bg-neutral-900">
                    <div className="mb-3 flex items-center justify-between">
                      <h4 className="font-display text-xl font-semibold text-primary-900 dark:text-primary-100">
                        {step.title}
                      </h4>
                      <div className="flex items-center gap-2 text-sm text-neutral-500 dark:text-neutral-500">
                        <Clock className="h-4 w-4" />
                        <span>{step.duration}</span>
                      </div>
                    </div>
                    <p className="leading-relaxed text-neutral-600 dark:text-neutral-400">{step.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

export function CertificationPage() {
  return (
    <div className="min-h-screen">
      <CertificationHeroSection />

      <section className="bg-gradient-to-b from-primary-50 to-white py-24 dark:from-neutral-800 dark:to-neutral-900">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-6 font-display text-display-md text-primary-900 dark:text-primary-100">
              Уровни сертификации
            </h2>
            <p className="text-lg leading-relaxed text-neutral-600 dark:text-neutral-400">
              Трехуровневая система, соответствующая международным стандартам
            </p>
          </div>

          <div className="mt-16 space-y-8">
            {certifications.map((cert, index) => (
              <div
                key={cert.id}
                className="overflow-hidden rounded-kfa border border-neutral-200 bg-white shadow-kfa-sm dark:border-neutral-700 dark:bg-neutral-900"
              >
                <div className="bg-gradient-to-r from-primary-600 to-primary-700 p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/20 text-2xl font-bold text-white backdrop-blur-sm">
                        {index + 1}
                      </div>
                      <div>
                        <h3 className="font-display text-2xl font-bold text-white">{cert.title}</h3>
                        <p className="text-primary-100">{cert.description}</p>
                      </div>
                    </div>
                    <div className="rounded-full bg-white p-4">
                      <Award className="h-8 w-8 text-primary-600" />
                    </div>
                  </div>
                </div>

                <div className="grid gap-8 p-8 md:grid-cols-2">
                  {/* Requirements */}
                  <div>
                    <div className="mb-4 flex items-center gap-2 font-semibold text-primary-700 dark:text-primary-400">
                      <FileCheck className="h-5 w-5" />
                      <span>Требования для допуска</span>
                    </div>
                    <ul className="space-y-2">
                      {cert.requirements.map((req, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                          <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-600 dark:text-green-400" />
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Exam Topics */}
                  <div>
                    <div className="mb-4 flex items-center gap-2 font-semibold text-primary-700 dark:text-primary-400">
                      <TrendingUp className="h-5 w-5" />
                      <span>Темы экзамена</span>
                    </div>
                    <ul className="space-y-2">
                      {cert.examTopics.map((topic, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                          <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-600 dark:text-blue-400" />
                          <span>{topic}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Exam Details */}
                <div className="border-t border-neutral-200 bg-neutral-50 p-6 dark:border-neutral-700 dark:bg-neutral-800">
                  <div className="grid gap-4 md:grid-cols-4">
                    <div>
                      <div className="text-sm text-neutral-500 dark:text-neutral-500">Подготовка</div>
                      <div className="font-semibold text-primary-700 dark:text-primary-400">{cert.duration}</div>
                    </div>
                    <div>
                      <div className="text-sm text-neutral-500 dark:text-neutral-500">Срок действия</div>
                      <div className="font-semibold text-primary-700 dark:text-primary-400">{cert.validFor}</div>
                    </div>
                    <div>
                      <div className="text-sm text-neutral-500 dark:text-neutral-500">Проходной балл</div>
                      <div className="font-semibold text-primary-700 dark:text-primary-400">{cert.passingScore}%</div>
                    </div>
                    <div>
                      <div className="text-sm text-neutral-500 dark:text-neutral-500">Стоимость</div>
                      <div className="font-display text-xl font-bold text-primary-700 dark:text-primary-400">
                        {cert.price}
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex flex-wrap gap-3">
                    <button className="flex items-center gap-2 rounded-lg bg-primary-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-primary-700">
                      Подать заявку
                    </button>
                    <button className="flex items-center gap-2 rounded-lg border border-primary-600 px-6 py-3 font-semibold text-primary-700 transition-colors hover:bg-primary-50 dark:text-primary-400 dark:hover:bg-primary-900/30">
                      <Download className="h-4 w-4" />
                      Программа экзамена
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CertificationProcessSection />

      {/* Important Notes */}
      <section className="bg-white py-16 dark:bg-neutral-900">
        <div className="container">
          <div className="rounded-kfa border-2 border-accent-200 bg-accent-50 p-8 dark:border-accent-800 dark:bg-accent-900/20">
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <AlertCircle className="h-8 w-8 text-accent-600 dark:text-accent-400" />
              </div>
              <div>
                <h3 className="mb-4 font-display text-xl font-semibold text-accent-900 dark:text-accent-100">
                  Важная информация
                </h3>
                <ul className="space-y-2 text-neutral-700 dark:text-neutral-300">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-accent-600 dark:text-accent-400" />
                    <span>Сертификаты КФА признаются Национальным банком Кыргызской Республики</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-accent-600 dark:text-accent-400" />
                    <span>Для продления сертификата необходимо набрать минимум 40 часов CPD за период действия</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-accent-600 dark:text-accent-400" />
                    <span>При повторной сдаче экзамена взимается 50% от стоимости сертификации</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-accent-600 dark:text-accent-400" />
                    <span>Обладатели сертификатов имеют приоритет при трудоустройстве в компании-члены КФА</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
