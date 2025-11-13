-- Создание таблицы media и настройка Storage для КФА
-- Запустите этот SQL в Supabase SQL Editor

-- =============================================
-- ЧАСТЬ 1: Создание таблицы media
-- =============================================

-- Удаляем таблицу если она существует (для чистого старта)
DROP TABLE IF EXISTS public.media CASCADE;

-- Создаем таблицу media
CREATE TABLE public.media (
    id BIGSERIAL PRIMARY KEY,
    filename VARCHAR(255) NOT NULL,
    path TEXT NOT NULL UNIQUE,
    url TEXT NOT NULL,
    mime_type VARCHAR(100),
    size BIGINT,
    type VARCHAR(50) CHECK (type IN ('image', 'video', 'document', 'other')),
    alt_text TEXT,
    title VARCHAR(255),
    description TEXT,
    uploaded_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Создаем индексы
CREATE INDEX idx_media_type ON public.media(type);
CREATE INDEX idx_media_uploaded_by ON public.media(uploaded_by);
CREATE INDEX idx_media_created_at ON public.media(created_at);
CREATE INDEX idx_media_path ON public.media(path);

-- Функция для автоматического обновления updated_at
CREATE OR REPLACE FUNCTION public.update_media_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Триггер для автоматического обновления updated_at
CREATE TRIGGER update_media_updated_at
    BEFORE UPDATE ON public.media
    FOR EACH ROW
    EXECUTE FUNCTION public.update_media_updated_at();

-- Включаем Row Level Security (RLS)
ALTER TABLE public.media ENABLE ROW LEVEL SECURITY;

-- Политика: все могут читать медиафайлы
CREATE POLICY "Anyone can view media"
    ON public.media
    FOR SELECT
    USING (true);

-- Политика: аутентифицированные пользователи могут загружать медиафайлы
CREATE POLICY "Authenticated users can upload media"
    ON public.media
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- Политика: пользователи могут обновлять свои медиафайлы
CREATE POLICY "Users can update own media"
    ON public.media
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = uploaded_by)
    WITH CHECK (auth.uid() = uploaded_by);

-- Политика: пользователи могут удалять свои медиафайлы
CREATE POLICY "Users can delete own media"
    ON public.media
    FOR DELETE
    TO authenticated
    USING (auth.uid() = uploaded_by);

-- Комментарии
COMMENT ON TABLE public.media IS 'Таблица медиафайлов (изображения, видео, документы)';
COMMENT ON COLUMN public.media.id IS 'Уникальный идентификатор медиафайла';
COMMENT ON COLUMN public.media.filename IS 'Исходное имя файла';
COMMENT ON COLUMN public.media.path IS 'Путь к файлу в Storage';
COMMENT ON COLUMN public.media.url IS 'Публичный URL файла';
COMMENT ON COLUMN public.media.mime_type IS 'MIME тип файла';
COMMENT ON COLUMN public.media.size IS 'Размер файла в байтах';
COMMENT ON COLUMN public.media.type IS 'Тип медиа: image, video, document, other';
COMMENT ON COLUMN public.media.alt_text IS 'Альтернативный текст для изображений';
COMMENT ON COLUMN public.media.uploaded_by IS 'ID пользователя, загрузившего файл';

SELECT 'Таблица media успешно создана!' AS result;

-- =============================================
-- ЧАСТЬ 2: Инструкции для настройки Storage Bucket
-- =============================================

-- ВАЖНО! Следующую часть нельзя выполнить через SQL.
-- Bucket создается через Dashboard или через API.

-- Откройте Supabase Dashboard -> Storage и создайте bucket вручную:
-- 1. Перейдите в раздел Storage
-- 2. Нажмите "New bucket"
-- 3. Введите имя: "media"
-- 4. Установите "Public bucket" = true (для публичного доступа)
-- 5. Нажмите "Create bucket"

-- После создания bucket, настройте политики:
-- 1. Откройте bucket "media"
-- 2. Перейдите в раздел "Policies"
-- 3. Добавьте следующие политики:

-- Политика 1: Все могут читать (SELECT)
-- Target roles: public
-- Policy definition: (bucket_id = 'media')

-- Политика 2: Аутентифицированные пользователи могут загружать (INSERT)
-- Target roles: authenticated
-- Policy definition: (bucket_id = 'media')

-- Политика 3: Пользователи могут обновлять свои файлы (UPDATE)
-- Target roles: authenticated
-- Policy definition: (bucket_id = 'media' AND auth.uid() = owner)

-- Политика 4: Пользователи могут удалять свои файлы (DELETE)
-- Target roles: authenticated
-- Policy definition: (bucket_id = 'media' AND auth.uid() = owner)
