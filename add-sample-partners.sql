-- Добавление примеров партнеров КФА
-- После выполнения этого скрипта, загрузите логотипы через dashboard

-- 1. Национальный банк КР (Platinum партнер)
INSERT INTO partners (
  name,
  description,
  category,
  status,
  is_featured,
  display_order,
  website,
  slug
) VALUES (
  'Национальный Банк Кыргызской Республики',
  'Центральный банк Кыргызской Республики',
  'platinum',
  'active',
  true,
  1,
  'https://www.nbkr.kg',
  'natsionalnyy-bank-kyrgyzskoy-respubliki'
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  display_order = EXCLUDED.display_order;

-- 2. Министерство финансов КР (Gold партнер)
INSERT INTO partners (
  name,
  description,
  category,
  status,
  is_featured,
  display_order,
  website,
  slug
) VALUES (
  'Министерство финансов КР',
  'Министерство финансов Кыргызской Республики',
  'gold',
  'active',
  true,
  2,
  'https://www.minfin.kg',
  'ministerstvo-finansov-kr'
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  display_order = EXCLUDED.display_order;

-- 3. Бишкекская фондовая биржа (Gold партнер)
INSERT INTO partners (
  name,
  description,
  category,
  status,
  is_featured,
  display_order,
  website,
  slug
) VALUES (
  'Кыргызская фондовая биржа',
  'Основная площадка торговли ценными бумагами в Кыргызстане',
  'gold',
  'active',
  true,
  3,
  'https://www.kse.kg',
  'kyrgyzskaya-fondovaya-birzha'
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  display_order = EXCLUDED.display_order;

-- 4. USAID (Silver партнер)
INSERT INTO partners (
  name,
  description,
  category,
  status,
  is_featured,
  display_order,
  website,
  slug
) VALUES (
  'USAID Kyrgyzstan',
  'Агентство США по международному развитию',
  'silver',
  'active',
  false,
  4,
  'https://www.usaid.gov/kyrgyz-republic',
  'usaid-kyrgyzstan'
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  display_order = EXCLUDED.display_order;

-- 5. GIZ (Silver партнер)
INSERT INTO partners (
  name,
  description,
  category,
  status,
  is_featured,
  display_order,
  website,
  slug
) VALUES (
  'GIZ Кыргызстан',
  'Германское общество по международному сотрудничеству',
  'silver',
  'active',
  false,
  5,
  'https://www.giz.de',
  'giz-kyrgyzstan'
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  display_order = EXCLUDED.display_order;

-- Проверка добавленных партнеров
SELECT
  id,
  name,
  category,
  status,
  is_featured,
  display_order,
  slug,
  CASE WHEN logo IS NULL THEN '❌ Нет логотипа' ELSE '✅ Есть логотип' END as logo_status
FROM partners
ORDER BY display_order;
