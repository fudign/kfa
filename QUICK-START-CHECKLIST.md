# ✅ КФА - Quick Start Checklist

**Быстрый старт проекта за 10 минут**

---

## 🔥 Критические Шаги (Обязательно!)

### □ 1. Выполнить SQL в Supabase

```
Файл: EXECUTE-THIS-IN-SUPABASE.sql
URL: https://supabase.com/dashboard/project/YOUR_PROJECT/sql

Действие: Скопировать весь SQL → Вставить → Execute
Время: 1 минута
```

### □ 2. Проверить Backend .env

```bash
cd kfa-backend/kfa-api
cat .env | grep DB_
```

Должно быть:

- ✅ DB_CONNECTION=pgsql
- ✅ DB_HOST=(ваш Supabase host)
- ✅ DB_DATABASE=postgres
- ✅ DB_USERNAME=postgres
- ✅ DB_PASSWORD=(ваш пароль)

### □ 3. Запустить Backend

```bash
cd kfa-backend/kfa-api
php artisan serve
```

Проверка: http://127.0.0.1:8000/api/news

### □ 4. Запустить Frontend

```bash
cd kfa-website
npm run dev
```

Проверка: http://localhost:3000

---

## 🎯 Проверка Работоспособности

### □ 5. Тест API

```bash
# News API
curl http://127.0.0.1:8000/api/news

# Должен вернуть JSON с новостями
```

### □ 6. Тест Login

1. Открыть: http://localhost:3000/auth/login
2. Попробовать войти (или зарегистрироваться)
3. Должно перенаправить на dashboard

---

## 🧪 Опционально: Запустить Тесты

### □ 7. E2E Тесты

```bash
cd kfa-website
npm test tests/e2e/business-processes.spec.ts
```

**Ожидаемые результаты:**

- ✅ Membership Application Process - все тесты проходят
- ✅ Payment Processing - все тесты проходят
- ✅ Event Registration - все тесты проходят

---

## 📊 Что Готово

### Backend API (100%):

- ✅ Membership Applications (9 endpoints)
- ✅ Payments (8 endpoints)
- ✅ Certifications (14 endpoints)
- ✅ Events (12+ endpoints)
- ✅ News, Media, Partners, Documents

### Frontend (95%):

- ✅ Authentication
- ✅ Dashboard
- ✅ CMS (News, Events, Media)
- ✅ Membership Forms
- ✅ Profile Management

### Tests (75%):

- ✅ Business Processes Tests - обновлены
- ✅ CMS Tests - работают
- ✅ Auth Tests - работают

---

## 🚨 Если Что-то Не Работает

### Backend не запускается:

```bash
cd kfa-backend/kfa-api
composer install
php artisan config:clear
php artisan serve
```

### Frontend не запускается:

```bash
cd kfa-website
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Database connection error:

1. Проверить .env файл
2. Проверить что Supabase проект активен
3. Проверить что SQL был выполнен

---

## 📝 Следующие Шаги

После успешного запуска:

1. Создать тестовые аккаунты (admin, member, user)
2. Протестировать основные функции
3. Запустить полный набор E2E тестов
4. Прочитать SESSION-COMPLETION-REPORT.md для деталей

---

## ✅ Готово!

Если все чекбоксы отмечены - проект готов к работе! 🎉

**Время выполнения:** ~10 минут
**Следующий файл:** NEXT-STEPS.md (детальная инструкция)

_Обновлено: 2025-11-13_
