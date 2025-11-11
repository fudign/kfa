-- ============================================================================
-- Supabase Setup SQL Script
-- ============================================================================
-- Запустите этот скрипт в Supabase Dashboard → SQL Editor
-- После запуска Laravel миграций
--
-- ВАЖНО: О типах данных в RLS policies
-- - auth.uid() возвращает UUID
-- - storage.objects.owner хранится как TEXT, нужно приводить: owner::uuid
-- - В таблицах user_id обычно UUID или bigint (зависит от вашей миграции)
-- - Если возникает ошибка типов, используйте явное приведение: ::uuid или ::bigint
-- ============================================================================

-- 1. ENABLE ROW LEVEL SECURITY (RLS) для всех таблиц
-- ============================================================================
-- Примечание: Выполните после того, как Laravel создаст таблицы

-- Пример для таблиц (раскомментируйте после создания таблиц):
-- ALTER TABLE users ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE members ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE news ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE events ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE programs ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE media ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE partners ENABLE ROW LEVEL SECURITY;


-- 2. СОЗДАТЬ STORAGE BUCKETS
-- ============================================================================
-- Примечание: Это можно сделать через UI или SQL

-- Создать bucket для медиа (публичный доступ)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'media',
  'media',
  true,
  10485760, -- 10MB
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf', 'video/mp4']
)
ON CONFLICT (id) DO NOTHING;

-- Создать bucket для документов (приватный)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'documents',
  'documents',
  false,
  10485760, -- 10MB
  ARRAY['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
)
ON CONFLICT (id) DO NOTHING;

-- Создать bucket для аватаров
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'avatars',
  'avatars',
  true,
  2097152, -- 2MB
  ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;


-- 3. НАСТРОИТЬ STORAGE RLS POLICIES
-- ============================================================================

-- Политика для публичного чтения медиа
CREATE POLICY "Public read access for media"
ON storage.objects FOR SELECT
USING (bucket_id = 'media');

-- Политика для загрузки медиа (только авторизованные)
CREATE POLICY "Authenticated users can upload media"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'media'
  AND auth.role() = 'authenticated'
);

-- Политика для обновления медиа (только владельцы)
CREATE POLICY "Users can update own media files"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'media'
  AND auth.uid() = owner::uuid
);

-- Политика для удаления медиа (только владельцы)
CREATE POLICY "Users can delete own media files"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'media'
  AND auth.uid() = owner::uuid
);

-- Политики для avatars
CREATE POLICY "Public read access for avatars"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');

CREATE POLICY "Authenticated users can upload avatars"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'avatars'
  AND auth.role() = 'authenticated'
);

-- Политики для documents (приватные)
CREATE POLICY "Authenticated users can read own documents"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'documents'
  AND auth.uid() = owner::uuid
);

CREATE POLICY "Authenticated users can upload documents"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'documents'
  AND auth.role() = 'authenticated'
);


-- 4. СОЗДАТЬ ИНДЕКСЫ ДЛЯ ПРОИЗВОДИТЕЛЬНОСТИ
-- ============================================================================
-- Примечание: Создайте эти индексы после того, как Laravel создаст таблицы

-- Индексы для полнотекстового поиска (русский язык)
-- CREATE INDEX idx_news_title_search ON news USING gin(to_tsvector('russian', title));
-- CREATE INDEX idx_news_content_search ON news USING gin(to_tsvector('russian', content));

-- Индексы для фильтрации
-- CREATE INDEX idx_news_status ON news(status);
-- CREATE INDEX idx_news_created_at ON news(created_at DESC);
-- CREATE INDEX idx_members_status ON members(status);
-- CREATE INDEX idx_events_start_date ON events(start_date);

-- Составные индексы
-- CREATE INDEX idx_news_status_created ON news(status, created_at DESC);
-- CREATE INDEX idx_members_type_status ON members(member_type, status);


-- 5. ПРИМЕР RLS POLICIES ДЛЯ ТАБЛИЦ
-- ============================================================================
-- Раскомментируйте и настройте после создания таблиц

-- Политики для users
-- CREATE POLICY "Users can view own profile"
-- ON users FOR SELECT
-- USING (auth.uid() = id);

-- CREATE POLICY "Admins can view all users"
-- ON users FOR SELECT
-- USING (
--   EXISTS (
--     SELECT 1 FROM users
--     WHERE users.id = auth.uid()
--     AND users.role = 'admin'
--   )
-- );

-- Политики для news (публичное чтение)
-- CREATE POLICY "Anyone can view published news"
-- ON news FOR SELECT
-- USING (status = 'published');

-- CREATE POLICY "Authenticated users can create news"
-- ON news FOR INSERT
-- WITH CHECK (auth.role() = 'authenticated');

-- CREATE POLICY "Users can update own news"
-- ON news FOR UPDATE
-- USING (auth.uid() = user_id);

-- CREATE POLICY "Users can delete own news"
-- ON news FOR DELETE
-- USING (auth.uid() = user_id);


-- 6. СОЗДАТЬ ФУНКЦИИ ДЛЯ TRIGGERS (опционально)
-- ============================================================================

-- Функция для автоматического обновления updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Примеры триггеров (создайте после таблиц):
-- CREATE TRIGGER update_news_updated_at
--   BEFORE UPDATE ON news
--   FOR EACH ROW
--   EXECUTE FUNCTION update_updated_at_column();

-- CREATE TRIGGER update_members_updated_at
--   BEFORE UPDATE ON members
--   FOR EACH ROW
--   EXECUTE FUNCTION update_updated_at_column();


-- 7. СОЗДАТЬ VIEWS ДЛЯ УДОБСТВА (опционально)
-- ============================================================================

-- View для публичных новостей с автором
-- CREATE OR REPLACE VIEW public_news AS
-- SELECT
--   n.*,
--   u.name as author_name,
--   u.email as author_email
-- FROM news n
-- LEFT JOIN users u ON n.user_id = u.id
-- WHERE n.status = 'published'
-- ORDER BY n.created_at DESC;

-- Grant SELECT на view для анонимных пользователей
-- GRANT SELECT ON public_news TO anon;


-- 8. НАСТРОИТЬ РАСШИРЕНИЯ POSTGRESQL
-- ============================================================================

-- Включить расширения для полнотекстового поиска
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE EXTENSION IF NOT EXISTS unaccent;

-- Включить расширение для UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";


-- ============================================================================
-- ЗАВЕРШЕНО!
-- ============================================================================
-- После выполнения этого скрипта:
-- 1. Проверьте, что Storage buckets созданы: Storage → Buckets
-- 2. Проверьте RLS policies: Storage → Policies
-- 3. Запустите Laravel миграции: php artisan migrate
-- 4. Раскомментируйте и выполните RLS policies для таблиц
-- 5. Создайте индексы для производительности
-- ============================================================================
