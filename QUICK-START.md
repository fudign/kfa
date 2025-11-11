# 🚀 Quick Start - Supabase Integration

## ✅ Что уже готово:

- ✅ Backend настроен для Supabase PostgreSQL
- ✅ Frontend Supabase клиент создан (`src/lib/supabase.ts`)
- ✅ Storage драйвер установлен
- ✅ SQL скрипты готовы (`supabase-setup.sql`)
- ✅ Конфигурация для production готова

---

## 🎯 3 шага до запуска

### Шаг 1: Настроить Supabase (5 минут)

1. Откройте https://app.supabase.com
2. Проект: `eofneihisbhucxcydvac`
3. SQL Editor → New Query
4. Скопируйте содержимое **`supabase-setup-simple.sql`** и выполните
   (Используйте упрощенную версию для быстрого старта без ошибок!)
5. Settings → API → Скопируйте **service_role key**

### Шаг 2: Обновить Railway переменные (2 минуты)

Добавьте в Railway:

```env
SUPABASE_SERVICE_ROLE_KEY=<вставьте service_role key>
```

Остальные переменные уже настроены в `.env`.

### Шаг 3: Деплой и миграция (3 минуты)

```bash
# 1. Git push
git add .
git commit -m "Add Supabase integration"
git push

# 2. После деплоя - запустить миграции через Railway CLI
railway run php artisan migrate --force
```

**Готово!** 🎉

---

## 📱 Использование

### Backend (Laravel) - Upload файла

```php
use Illuminate\Support\Facades\Storage;

// Загрузить в Supabase
$path = Storage::disk('supabase')->put('media/news', $file);

// Получить URL
$url = Storage::disk('supabase')->url($path);
```

### Frontend (React) - Upload файла

```typescript
import { uploadFile } from '@/lib/supabase';

// Загрузить файл
const result = await uploadFile(file, `news/${Date.now()}_${file.name}`);

if (result.success) {
  console.log('URL:', result.data.url);
}
```

---

## ⚠️ Локальная разработка

**PostgreSQL не работает локально** (требуется IPv6).

**Варианты:**

1. Использовать SQLite локально (просто измените `DB_CONNECTION=sqlite` в `.env`)
2. Тестировать Storage напрямую на Supabase (работает)
3. Разрабатывать на staging

---

## 📚 Документация

- Полная инструкция: `SUPABASE-MIGRATION-PLAN.md`
- Деплой на production: `DEPLOY-INSTRUCTIONS.md`
- SQL скрипты:
  - `supabase-setup-simple.sql` - упрощенная версия (рекомендуется)
  - `supabase-setup.sql` - полная версия с строгими policies
- Исправление ошибок: `SQL-FIX-NOTICE.md`

---

## 🔗 Полезные ссылки

- [Supabase Dashboard](https://app.supabase.com/project/eofneihisbhucxcydvac)
- [Railway Dashboard](https://railway.app)
- [Vercel Dashboard](https://vercel.com)

**Connection String:**

```
postgresql://postgres:egD.SYGb.F5Hm3r@db.eofneihisbhucxcydvac.supabase.co:5432/postgres
```

Всё готово к запуску! 🚀
