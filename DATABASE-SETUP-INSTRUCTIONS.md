# Инструкция по настройке базы данных Supabase

## Проблема

Прямое PostgreSQL подключение через PHP PDO не работает из-за проблем с DNS/IPv6 резолвингом хоста `db.eofneihisbhucxcydvac.supabase.co`.

## Решение

Выполните SQL скрипт через веб-интерфейс Supabase.

## Шаги

### 1. Откройте Supabase SQL Editor

Перейдите по ссылке:

```
https://supabase.com/dashboard/project/eofneihisbhucxcydvac/sql/new
```

Или:

1. Откройте https://supabase.com/dashboard
2. Выберите проект `eofneihisbhucxcydvac`
3. В левом меню выберите **SQL Editor**
4. Нажмите **New Query**

### 2. Скопируйте SQL скрипт

Откройте файл `database-setup.sql` в корне проекта и скопируйте весь его содержимое.

Или выполните команду:

```bash
cat database-setup.sql
```

### 3. Вставьте и выполните

1. Вставьте скопированный SQL в редактор
2. Нажмите кнопку **Run** (или Ctrl+Enter)
3. Дождитесь сообщения об успешном выполнении

### 4. Проверьте результат

После выполнения SQL скрипта должны быть созданы следующие таблицы:

- ✅ `membership_applications` - заявки на членство
- ✅ `users` - пользователи
- ✅ `sessions` - сессии
- ✅ `personal_access_tokens` - токены API (Laravel Sanctum)
- ✅ `cache` и `cache_locks` - кеш Laravel
- ✅ `jobs` и `failed_jobs` - очередь Laravel

### 5. Проверьте таблицы

В Supabase Dashboard перейдите в **Table Editor** и убедитесь, что таблица `membership_applications` создана с правильной структурой:

#### Структура таблицы membership_applications

| Колонка           | Тип          | Nullable | Default   |
| ----------------- | ------------ | -------- | --------- |
| id                | bigserial    | NO       | AUTO      |
| user_id           | bigint       | YES      | NULL      |
| membership_type   | varchar(255) | NO       | -         |
| status            | varchar(255) | NO       | 'pending' |
| first_name        | varchar(255) | NO       | -         |
| last_name         | varchar(255) | NO       | -         |
| organization_name | varchar(255) | YES      | NULL      |
| position          | varchar(255) | NO       | -         |
| email             | varchar(255) | NO       | -         |
| phone             | varchar(50)  | NO       | -         |
| experience        | text         | NO       | -         |
| motivation        | text         | NO       | -         |
| created_at        | timestamp    | NO       | NOW()     |
| updated_at        | timestamp    | NO       | NOW()     |

#### Constraints:

- `PRIMARY KEY`: id
- `UNIQUE`: email
- `CHECK`: membership_type IN ('individual', 'corporate')
- `CHECK`: status IN ('pending', 'approved', 'rejected')

#### Indexes:

- `idx_membership_applications_email` - для быстрого поиска по email
- `idx_membership_applications_status` - для фильтрации по статусу
- `idx_membership_applications_created_at` - для сортировки по дате

## Альтернативный метод (если веб-интерфейс недоступен)

Если у вас есть локальный `psql` клиент:

```bash
psql "postgresql://postgres:egD.SYGb.F5Hm3r@db.eofneihisbhucxcydvac.supabase.co:5432/postgres?sslmode=require" < database-setup.sql
```

Но скорее всего это тоже не сработает из-за проблем с DNS.

## Проверка работы API

После настройки базы данных проверьте, что Laravel может подключиться:

```bash
cd kfa-backend/kfa-api
php artisan tinker
```

В tinker выполните:

```php
DB::table('membership_applications')->count()
```

Должно вернуть 0 (пустая таблица).

## Запуск Laravel сервера

После настройки базы данных запустите Laravel:

```bash
cd kfa-backend/kfa-api
php artisan serve --host=0.0.0.0 --port=8000
```

Или на Windows:

```bash
cd kfa-backend/kfa-api
php artisan serve
```

API будет доступен на http://localhost:8000

## Проверка работы формы

1. Откройте frontend: http://localhost:3002/join
2. Заполните форму членства
3. Нажмите "Подать заявку"
4. Должно появиться сообщение об успехе

## Troubleshooting

### Ошибка "could not translate host name"

Это значит, что PHP не может резолвить DNS хост Supabase. Решения:

1. ✅ Используйте веб-интерфейс Supabase для создания таблиц (рекомендуется)
2. Настройте /etc/hosts (Linux/Mac) или C:\Windows\System32\drivers\etc\hosts (Windows)
3. Используйте VPN или другое сетевое подключение

### Laravel не может подключиться к базе

Проверьте настройки в `kfa-backend/kfa-api/.env`:

- DB_HOST должен быть `db.eofneihisbhucxcydvac.supabase.co`
- DB_PORT должен быть `5432`
- DB_DATABASE должен быть `postgres`
- DB_USERNAME должен быть `postgres`
- DB_PASSWORD должен быть правильным

### CORS ошибки

Убедитесь, что в `kfa-backend/kfa-api/config/cors.php` настроено:

```php
'allowed_origins' => ['http://localhost:3002'],
```

## Статус

- ✅ Frontend готов (http://localhost:3002/join)
- ✅ Backend API готов
- ⏳ База данных - требуется выполнить SQL скрипт
- ⏳ Laravel сервер - запустить после настройки БД

## Следующие шаги

1. Выполните `database-setup.sql` в Supabase SQL Editor
2. Запустите Laravel: `cd kfa-backend/kfa-api && php artisan serve`
3. Протестируйте форму на http://localhost:3002/join
4. Проверьте данные в Supabase Table Editor

---

Если возникнут проблемы, проверьте логи Laravel:

```bash
tail -f kfa-backend/kfa-api/storage/logs/laravel.log
```
