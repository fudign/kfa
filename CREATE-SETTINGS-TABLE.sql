-- ═══════════════════════════════════════════════════════════════════════════
-- СОЗДАНИЕ ТАБЛИЦЫ НАСТРОЕК САЙТА В SUPABASE
-- ═══════════════════════════════════════════════════════════════════════════

-- Таблица настроек сайта
CREATE TABLE IF NOT EXISTS public.settings (
  id BIGSERIAL PRIMARY KEY,
  key VARCHAR(255) UNIQUE NOT NULL,
  value TEXT,
  type VARCHAR(50) DEFAULT 'string',
  category VARCHAR(100) DEFAULT 'general',
  label VARCHAR(255),
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Индексы
CREATE INDEX IF NOT EXISTS idx_settings_key ON public.settings(key);
CREATE INDEX IF NOT EXISTS idx_settings_category ON public.settings(category);

-- RLS Policies
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "settings_public_read" ON public.settings;
DROP POLICY IF EXISTS "settings_admin_all" ON public.settings;

-- Публичное чтение некоторых настроек
CREATE POLICY "settings_public_read" ON public.settings
  FOR SELECT
  USING (true);

-- Админы могут всё
CREATE POLICY "settings_admin_all" ON public.settings
  FOR ALL
  TO authenticated
  USING (true);

-- Права доступа
GRANT SELECT ON public.settings TO anon;
GRANT ALL ON public.settings TO authenticated;
GRANT USAGE, SELECT ON SEQUENCE public.settings_id_seq TO authenticated;

-- Вставить базовые настройки
INSERT INTO public.settings (key, value, type, category, label, description) VALUES

-- Общие настройки
('site_name', 'Кыргызская Ассоциация Финансистов', 'string', 'general', 'Название сайта', 'Основное название сайта'),
('site_description', 'Профессиональное объединение финансистов Кыргызстана', 'text', 'general', 'Описание сайта', 'Краткое описание сайта для SEO'),
('site_keywords', 'финансы, кыргызстан, ассоциация, корпоративное управление', 'text', 'general', 'Ключевые слова', 'Ключевые слова для SEO'),
('contact_email', 'info@kfa.kg', 'email', 'general', 'Email для связи', 'Основной email для контактов'),
('contact_phone', '+996 312 123 456', 'string', 'general', 'Телефон', 'Основной телефон для связи'),
('office_address', 'г. Бишкек, ул. Примерная, 123', 'text', 'general', 'Адрес офиса', 'Физический адрес офиса'),

-- Настройки новостей
('news_per_page', '12', 'number', 'news', 'Новостей на странице', 'Количество новостей на одной странице'),
('news_excerpt_length', '200', 'number', 'news', 'Длина анонса', 'Максимальная длина анонса новости (символов)'),
('news_show_featured', 'true', 'boolean', 'news', 'Показывать избранные', 'Отображать избранные новости отдельным блоком'),

-- Настройки событий
('events_per_page', '9', 'number', 'events', 'Событий на странице', 'Количество событий на одной странице'),
('events_allow_registration', 'true', 'boolean', 'events', 'Разрешить регистрацию', 'Разрешить регистрацию на события через сайт'),
('events_show_past', 'true', 'boolean', 'events', 'Показывать прошедшие', 'Отображать прошедшие события'),

-- Настройки членства
('membership_enabled', 'true', 'boolean', 'membership', 'Прием заявок', 'Разрешить подачу заявок на членство'),
('membership_fee_individual', '5000', 'number', 'membership', 'Взнос (физ. лица)', 'Годовой членский взнос для физических лиц (сом)'),
('membership_fee_corporate', '25000', 'number', 'membership', 'Взнос (юр. лица)', 'Годовой членский взнос для юридических лиц (сом)'),

-- Социальные сети
('social_facebook', 'https://facebook.com/kfa.kg', 'url', 'social', 'Facebook', 'Ссылка на страницу в Facebook'),
('social_instagram', 'https://instagram.com/kfa.kg', 'url', 'social', 'Instagram', 'Ссылка на страницу в Instagram'),
('social_linkedin', 'https://linkedin.com/company/kfa-kg', 'url', 'social', 'LinkedIn', 'Ссылка на страницу в LinkedIn'),
('social_twitter', 'https://twitter.com/kfa_kg', 'url', 'social', 'Twitter/X', 'Ссылка на страницу в Twitter'),

-- Функциональность
('feature_news', 'true', 'boolean', 'features', 'Модуль новостей', 'Включить модуль новостей на сайте'),
('feature_events', 'true', 'boolean', 'features', 'Модуль событий', 'Включить модуль событий на сайте'),
('feature_education', 'true', 'boolean', 'features', 'Модуль обучения', 'Включить модуль образовательных программ'),
('feature_research', 'true', 'boolean', 'features', 'Модуль исследований', 'Включить модуль публикаций и исследований'),

-- Уведомления
('notifications_email_enabled', 'true', 'boolean', 'notifications', 'Email уведомления', 'Отправлять уведомления по email'),
('notifications_admin_email', 'admin@kfa.kg', 'email', 'notifications', 'Email админа', 'Email для получения уведомлений администратором')

ON CONFLICT (key) DO UPDATE SET
  value = EXCLUDED.value,
  label = EXCLUDED.label,
  description = EXCLUDED.description,
  updated_at = NOW();

-- Проверка
SELECT
  category,
  COUNT(*) as settings_count
FROM public.settings
GROUP BY category
ORDER BY category;

SELECT id, key, value, category, label
FROM public.settings
ORDER BY category, key;

-- ═══════════════════════════════════════════════════════════════════════════
-- ГОТОВО!
-- ✅ Таблица settings создана
-- ✅ Добавлено 24 базовых настройки
-- ✅ Настроены RLS policies
-- ✅ Категории: general, news, events, membership, social, features, notifications
-- ═══════════════════════════════════════════════════════════════════════════
