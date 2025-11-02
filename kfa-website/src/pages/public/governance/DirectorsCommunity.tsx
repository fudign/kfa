import { Users, Calendar, MessageSquare, Award, BookOpen, Coffee, Video, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

function CommunityHeroSection() {
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
            <Users className="h-12 w-12 text-white" />
          </div>

          <h1 className="mb-6 font-display text-display-xl text-white">
            Сообщество директоров КР
          </h1>
          <p className="text-xl leading-relaxed text-primary-50">
            Профессиональная сеть для обмена опытом, знаниями и лучшими практиками корпоративного управления
          </p>

          {/* Stats */}
          <div className="mt-12 grid gap-6 md:grid-cols-4">
            <div className="rounded-kfa border border-white/20 bg-white/10 p-6 backdrop-blur-sm">
              <div className="mb-2 flex justify-center">
                <Users className="h-8 w-8 text-white" />
              </div>
              <div className="mb-1 font-display text-3xl font-bold text-white">250+</div>
              <div className="text-sm text-primary-100">Активных членов</div>
            </div>

            <div className="rounded-kfa border border-white/20 bg-white/10 p-6 backdrop-blur-sm">
              <div className="mb-2 flex justify-center">
                <Calendar className="h-8 w-8 text-white" />
              </div>
              <div className="mb-1 font-display text-3xl font-bold text-white">24</div>
              <div className="text-sm text-primary-100">Мероприятия в год</div>
            </div>

            <div className="rounded-kfa border border-white/20 bg-white/10 p-6 backdrop-blur-sm">
              <div className="mb-2 flex justify-center">
                <MessageSquare className="h-8 w-8 text-white" />
              </div>
              <div className="mb-1 font-display text-3xl font-bold text-white">15+</div>
              <div className="text-sm text-primary-100">Тематических групп</div>
            </div>

            <div className="rounded-kfa border border-white/20 bg-white/10 p-6 backdrop-blur-sm">
              <div className="mb-2 flex justify-center">
                <Award className="h-8 w-8 text-white" />
              </div>
              <div className="mb-1 font-display text-3xl font-bold text-white">100+</div>
              <div className="text-sm text-primary-100">Советов директоров</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CommunityBenefitsSection() {
  const benefits = [
    {
      icon: <Users className="h-8 w-8" />,
      title: 'Профессиональная сеть',
      description: 'Общайтесь с опытными директорами и расширяйте свою сеть контактов',
    },
    {
      icon: <BookOpen className="h-8 w-8" />,
      title: 'Обмен знаниями',
      description: 'Делитесь опытом и учитесь на примерах лучших практик управления',
    },
    {
      icon: <Calendar className="h-8 w-8" />,
      title: 'Эксклюзивные мероприятия',
      description: 'Участвуйте в закрытых встречах, форумах и образовательных сессиях',
    },
    {
      icon: <TrendingUp className="h-8 w-8" />,
      title: 'Карьерное развитие',
      description: 'Получайте доступ к возможностям в советах директоров компаний',
    },
  ];

  return (
    <section className="py-16 md:py-24">
      <div className="container">
        <div className="mb-12 text-center">
          <h2 className="mb-4 font-display text-3xl md:text-4xl">Преимущества членства</h2>
          <p className="mx-auto max-w-2xl text-lg text-text-muted">
            Станьте частью активного профессионального сообщества
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="rounded-kfa border border-border bg-surface p-8 transition-all hover:shadow-lg"
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

function CommunityActivitiesSection() {
  const activities = [
    {
      icon: <Coffee className="h-8 w-8" />,
      title: 'Ежемесячные встречи',
      description: 'Неформальные встречи для обсуждения актуальных вопросов и обмена опытом',
      frequency: 'Каждый месяц',
    },
    {
      icon: <Video className="h-8 w-8" />,
      title: 'Вебинары и мастер-классы',
      description: 'Онлайн-сессии с экспертами по различным аспектам корпоративного управления',
      frequency: '2-3 раза в месяц',
    },
    {
      icon: <MessageSquare className="h-8 w-8" />,
      title: 'Тематические группы',
      description: 'Онлайн-сообщества по отраслям и специализациям для глубокого обмена',
      frequency: 'Постоянно',
    },
    {
      icon: <Calendar className="h-8 w-8" />,
      title: 'Ежегодный форум',
      description: 'Крупнейшее событие года с международными спикерами и нетворкингом',
      frequency: 'Раз в год',
    },
  ];

  return (
    <section className="bg-surface py-16 md:py-24">
      <div className="container">
        <div className="mb-12 text-center">
          <h2 className="mb-4 font-display text-3xl md:text-4xl">Активности сообщества</h2>
          <p className="mx-auto max-w-2xl text-lg text-text-muted">
            Разнообразные форматы для вашего профессионального роста
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {activities.map((activity, index) => (
            <div
              key={index}
              className="rounded-kfa border border-border bg-background p-8"
            >
              <div className="mb-4 inline-flex rounded-lg bg-primary-50 p-3 text-primary-600">
                {activity.icon}
              </div>
              <h3 className="mb-2 text-xl font-semibold">{activity.title}</h3>
              <p className="mb-4 text-text-muted">{activity.description}</p>
              <div className="inline-flex items-center gap-2 rounded-full bg-primary-50 px-3 py-1 text-sm text-primary-700">
                <Calendar className="h-4 w-4" />
                {activity.frequency}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function UpcomingEventsSection() {
  const events = [
    {
      date: '15 ноября 2024',
      time: '18:00',
      title: 'Встреча директоров: ESG практики',
      type: 'Офлайн',
      location: 'Бишкек',
      attendees: 35,
    },
    {
      date: '22 ноября 2024',
      time: '16:00',
      title: 'Вебинар: Цифровая трансформация в советах',
      type: 'Онлайн',
      location: 'Zoom',
      attendees: 120,
    },
    {
      date: '5 декабря 2024',
      time: '10:00',
      title: 'Мастер-класс: Эффективность совета директоров',
      type: 'Офлайн',
      location: 'Бишкек',
      attendees: 25,
    },
  ];

  return (
    <section className="py-16 md:py-24">
      <div className="container">
        <div className="mb-12 text-center">
          <h2 className="mb-4 font-display text-3xl md:text-4xl">Ближайшие мероприятия</h2>
          <p className="mx-auto max-w-2xl text-lg text-text-muted">
            Присоединяйтесь к предстоящим событиям сообщества
          </p>
        </div>

        <div className="mx-auto max-w-4xl space-y-6">
          {events.map((event, index) => (
            <div
              key={index}
              className="rounded-kfa border border-border bg-surface p-6 transition-all hover:shadow-lg"
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex-grow">
                  <div className="mb-2 flex flex-wrap items-center gap-3">
                    <span className="inline-flex items-center gap-2 rounded-full bg-primary-50 px-3 py-1 text-sm text-primary-700">
                      <Calendar className="h-4 w-4" />
                      {event.date} • {event.time}
                    </span>
                    <span className={`rounded-full px-3 py-1 text-sm ${
                      event.type === 'Онлайн'
                        ? 'bg-success-50 text-success-700'
                        : 'bg-info-50 text-info-700'
                    }`}>
                      {event.type}
                    </span>
                  </div>
                  <h3 className="mb-2 text-xl font-semibold">{event.title}</h3>
                  <div className="flex items-center gap-4 text-sm text-text-muted">
                    <span>{event.location}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {event.attendees} участников
                    </span>
                  </div>
                </div>
                <button className="btn-primary whitespace-nowrap">
                  Регистрация
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link to="/events" className="btn-outline">
            Все мероприятия
          </Link>
        </div>
      </div>
    </section>
  );
}

function ThematicGroupsSection() {
  const groups = [
    { name: 'Финансовые директора', members: 45, icon: '💰' },
    { name: 'ESG и устойчивое развитие', members: 38, icon: '🌱' },
    { name: 'Цифровая трансформация', members: 52, icon: '💻' },
    { name: 'Управление рисками', members: 41, icon: '🛡️' },
    { name: 'Женщины-директора', members: 35, icon: '👩‍💼' },
    { name: 'Стартапы и инновации', members: 28, icon: '🚀' },
  ];

  return (
    <section className="bg-surface py-16 md:py-24">
      <div className="container">
        <div className="mb-12 text-center">
          <h2 className="mb-4 font-display text-3xl md:text-4xl">Тематические группы</h2>
          <p className="mx-auto max-w-2xl text-lg text-text-muted">
            Присоединяйтесь к группам по интересам для углубленного обсуждения
          </p>
        </div>

        <div className="mx-auto max-w-4xl grid gap-4 md:grid-cols-2">
          {groups.map((group, index) => (
            <div
              key={index}
              className="flex items-center justify-between rounded-kfa border border-border bg-background p-6 transition-all hover:shadow-md"
            >
              <div className="flex items-center gap-4">
                <div className="text-4xl">{group.icon}</div>
                <div>
                  <h3 className="font-semibold">{group.name}</h3>
                  <p className="text-sm text-text-muted">{group.members} участников</p>
                </div>
              </div>
              <button className="btn-outline">
                Вступить
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CommunityCTASection() {
  return (
    <section className="py-16 md:py-24">
      <div className="container">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-kfa bg-gradient-to-br from-primary-600 to-primary-800 p-8 text-center text-white md:p-12">
            <h2 className="mb-4 font-display text-3xl md:text-4xl">
              Присоединяйтесь к сообществу
            </h2>
            <p className="mb-8 text-lg text-primary-50">
              Станьте частью ведущего профессионального сообщества директоров Кыргызстана
            </p>

            <div className="mb-8 grid gap-6 md:grid-cols-3">
              <div className="rounded-lg bg-white/10 p-6 backdrop-blur-sm">
                <Award className="mx-auto mb-3 h-10 w-10" />
                <div className="font-semibold">Профессиональный рост</div>
              </div>
              <div className="rounded-lg bg-white/10 p-6 backdrop-blur-sm">
                <Users className="mx-auto mb-3 h-10 w-10" />
                <div className="font-semibold">Ценные связи</div>
              </div>
              <div className="rounded-lg bg-white/10 p-6 backdrop-blur-sm">
                <BookOpen className="mx-auto mb-3 h-10 w-10" />
                <div className="font-semibold">Непрерывное обучение</div>
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/membership/join" className="btn-secondary">
                Подать заявку
              </Link>
              <Link to="/governance/directors-database" className="btn-outline border-white text-white hover:bg-white hover:text-primary-600">
                База директоров
              </Link>
            </div>

            <p className="mt-6 text-sm text-primary-100">
              Для вступления требуется членство в КФА и рекомендация действующего члена
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export function DirectorsCommunityPage() {
  return (
    <div className="min-h-screen">
      <CommunityHeroSection />
      <CommunityBenefitsSection />
      <CommunityActivitiesSection />
      <UpcomingEventsSection />
      <ThematicGroupsSection />
      <CommunityCTASection />
    </div>
  );
}
