-- ═══════════════════════════════════════════════════════════════════════════
-- ДОБАВЛЕНИЕ НЕДОСТАЮЩИХ НАСТРОЕК
-- ═══════════════════════════════════════════════════════════════════════════

-- Добавить недостающую настройку YouTube
INSERT INTO public.settings (key, value, type, category, label, description) VALUES
('social_youtube', 'https://youtube.com/@kfa', 'url', 'social', 'YouTube', 'Ссылка на канал в YouTube')
ON CONFLICT (key) DO UPDATE SET
  value = EXCLUDED.value,
  label = EXCLUDED.label,
  description = EXCLUDED.description,
  updated_at = NOW();

-- Проверка
SELECT id, key, value, category, label
FROM public.settings
WHERE key = 'social_youtube';

-- ═══════════════════════════════════════════════════════════════════════════
-- ГОТОВО!
-- ✅ Добавлена настройка social_youtube
-- ═══════════════════════════════════════════════════════════════════════════
