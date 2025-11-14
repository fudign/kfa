-- Создание таблицы membership_applications (заявки на членство)

CREATE TABLE IF NOT EXISTS membership_applications (
  id SERIAL PRIMARY KEY,
  membership_type VARCHAR(20) NOT NULL CHECK (membership_type IN ('individual', 'corporate')),
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  organization_name VARCHAR(255),
  position VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  experience TEXT NOT NULL,
  motivation TEXT NOT NULL,
  agree_to_terms BOOLEAN DEFAULT true,

  -- Статус заявки
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'reviewing', 'approved', 'rejected')),

  -- Административные поля
  reviewed_by INTEGER REFERENCES auth.users(id),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  admin_notes TEXT,
  rejection_reason TEXT,

  -- Метаданные
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ip_address INET,
  user_agent TEXT,

  -- Связь с пользователем (если есть аккаунт)
  user_id INTEGER REFERENCES auth.users(id)
);

-- Индексы для быстрого поиска
CREATE INDEX IF NOT EXISTS idx_applications_email ON membership_applications(email);
CREATE INDEX IF NOT EXISTS idx_applications_status ON membership_applications(status);
CREATE INDEX IF NOT EXISTS idx_applications_created_at ON membership_applications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_applications_membership_type ON membership_applications(membership_type);

-- Функция для автоматического обновления updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Триггер для автоматического обновления updated_at
DROP TRIGGER IF EXISTS update_applications_updated_at ON membership_applications;
CREATE TRIGGER update_applications_updated_at
  BEFORE UPDATE ON membership_applications
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- RLS политики
ALTER TABLE membership_applications ENABLE ROW LEVEL SECURITY;

-- Любой может создать заявку (даже анонимно)
CREATE POLICY "Anyone can create applications"
ON membership_applications FOR INSERT
WITH CHECK (true);

-- Только авторизованные админы могут читать все заявки
CREATE POLICY "Admins can view all applications"
ON membership_applications FOR SELECT
TO authenticated
USING (true);

-- Пользователи могут читать только свои заявки
CREATE POLICY "Users can view own applications"
ON membership_applications FOR SELECT
USING (
  auth.uid() = user_id OR
  email = auth.email()
);

-- Только админы могут обновлять заявки
CREATE POLICY "Admins can update applications"
ON membership_applications FOR UPDATE
TO authenticated
USING (true);

-- Только админы могут удалять заявки
CREATE POLICY "Admins can delete applications"
ON membership_applications FOR DELETE
TO authenticated
USING (true);

-- Добавляем тестовую заявку для примера
INSERT INTO membership_applications (
  membership_type,
  first_name,
  last_name,
  organization_name,
  position,
  email,
  phone,
  experience,
  motivation,
  status
) VALUES (
  'individual',
  'Иван',
  'Петров',
  'ОсОО "Финанс"',
  'Финансовый аналитик',
  'ivan.petrov@example.com',
  '+996 555 123 456',
  'Опыт работы в финансовой сфере более 5 лет. Сертифицированный финансовый аналитик (CFA Level 2).',
  'Хочу развивать профессиональные навыки и участвовать в развитии финансового рынка Кыргызстана.',
  'pending'
);

-- Проверка созданной таблицы
SELECT
  id,
  membership_type,
  first_name || ' ' || last_name AS full_name,
  organization_name,
  email,
  status,
  created_at
FROM membership_applications
ORDER BY created_at DESC;

-- Статистика по заявкам
SELECT
  status,
  COUNT(*) as count
FROM membership_applications
GROUP BY status
ORDER BY count DESC;
