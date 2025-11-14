-- Создание таблицы events (события/мероприятия КФА)

CREATE TABLE IF NOT EXISTS events (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  content TEXT,
  image VARCHAR(500),
  event_type VARCHAR(50) DEFAULT 'conference', -- conference, webinar, workshop, meeting
  status VARCHAR(20) DEFAULT 'upcoming', -- upcoming, ongoing, completed, cancelled
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE,
  location VARCHAR(255),
  venue VARCHAR(255),
  online BOOLEAN DEFAULT false,
  meeting_link VARCHAR(500),
  max_participants INTEGER,
  current_participants INTEGER DEFAULT 0,
  registration_required BOOLEAN DEFAULT true,
  registration_deadline TIMESTAMP WITH TIME ZONE,
  price DECIMAL(10, 2) DEFAULT 0,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by INTEGER REFERENCES auth.users(id),
  tags TEXT[]
);

-- Индексы для быстрого поиска
CREATE INDEX IF NOT EXISTS idx_events_slug ON events(slug);
CREATE INDEX IF NOT EXISTS idx_events_status ON events(status);
CREATE INDEX IF NOT EXISTS idx_events_start_date ON events(start_date);
CREATE INDEX IF NOT EXISTS idx_events_featured ON events(featured);

-- RLS политики
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Все могут читать опубликованные события
CREATE POLICY "Public can view events"
ON events FOR SELECT
USING (true);

-- Только авторизованные могут создавать
CREATE POLICY "Authenticated can create events"
ON events FOR INSERT
TO authenticated
WITH CHECK (true);

-- Только создатель может редактировать
CREATE POLICY "Users can update own events"
ON events FOR UPDATE
TO authenticated
USING (auth.uid() = created_by);

-- Только создатель может удалять
CREATE POLICY "Users can delete own events"
ON events FOR DELETE
TO authenticated
USING (auth.uid() = created_by);

-- Добавляем примеры событий
INSERT INTO events (
  title,
  slug,
  description,
  content,
  event_type,
  status,
  start_date,
  end_date,
  location,
  venue,
  online,
  max_participants,
  registration_required,
  price,
  featured
) VALUES
-- Событие 1: Конференция
(
  'Международная конференция по финансовому анализу 2025',
  'mezhdunarodnaya-konferenciya-finansovyy-analiz-2025',
  'Ведущие эксперты обсудят тренды финансового анализа и корпоративного управления',
  '<h2>О конференции</h2><p>Крупнейшее мероприятие года для финансовых аналитиков Центральной Азии.</p><h3>Программа:</h3><ul><li>Пленарное заседание</li><li>Секционные доклады</li><li>Мастер-классы</li><li>Нетворкинг</li></ul>',
  'conference',
  'upcoming',
  '2025-11-25 09:00:00+06',
  '2025-11-25 18:00:00+06',
  'Бишкек, Кыргызстан',
  'Отель Hyatt Regency',
  false,
  200,
  true,
  0,
  true
),
-- Событие 2: Вебинар
(
  'Вебинар: ESG-стандарты в практике',
  'vebinar-esg-standarty-v-praktike',
  'Практические кейсы внедрения ESG-стандартов в кыргызских компаниях',
  '<h2>О вебинаре</h2><p>Узнайте как внедрить ESG-стандарты в вашей компании.</p><h3>Спикеры:</h3><ul><li>Эксперты по ESG</li><li>Представители успешных компаний</li></ul>',
  'webinar',
  'upcoming',
  '2025-11-20 14:00:00+06',
  '2025-11-20 16:00:00+06',
  'Онлайн',
  'Zoom',
  true,
  100,
  true,
  0,
  true
),
-- Событие 3: Мастер-класс
(
  'Мастер-класс: Финансовое моделирование в Excel',
  'master-klass-finansovoe-modelirovanie-excel',
  'Практический мастер-класс по построению финансовых моделей',
  '<h2>О мастер-классе</h2><p>Научитесь строить профессиональные финансовые модели в Excel.</p><h3>Что изучим:</h3><ul><li>Основы моделирования</li><li>DCF модели</li><li>Сценарный анализ</li><li>Визуализация данных</li></ul>',
  'workshop',
  'upcoming',
  '2025-12-05 10:00:00+06',
  '2025-12-05 16:00:00+06',
  'Бишкек, Кыргызстан',
  'Бизнес-центр "Максимум"',
  false,
  30,
  true,
  1500,
  false
);

-- Проверка добавленных событий
SELECT
  id,
  title,
  event_type,
  status,
  start_date,
  location,
  CASE WHEN online THEN 'Онлайн' ELSE 'Офлайн' END as format,
  CASE WHEN featured THEN '✅ Избранное' ELSE '' END as is_featured
FROM events
ORDER BY start_date;
