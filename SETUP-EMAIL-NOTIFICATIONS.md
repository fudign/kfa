# Настройка Email уведомлений для заявок

## 📧 Что нужно сделать

Чтобы админы получали email уведомления о новых заявках, нужно:

1. Настроить Database Webhook в Supabase
2. Интегрировать с email сервисом (например, SendGrid, Resend, или SMTP)

---

## 🚀 Вариант 1: Database Webhook + Supabase Edge Functions

### Шаг 1: Создать Edge Function

1. Откройте Supabase Dashboard → Edge Functions
2. Создайте новую функцию `notify-new-application`
3. Код функции:

```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
const ADMIN_EMAIL = Deno.env.get('ADMIN_EMAIL') || 'admin@kfa.kg'

serve(async (req) => {
  try {
    const { record } = await req.json()

    // Отправить email админу
    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'KFA Notifications <noreply@kfa.kg>',
        to: [ADMIN_EMAIL],
        subject: `Новая заявка на членство: ${record.first_name} ${record.last_name}`,
        html: `
          <h2>Новая заявка на членство</h2>
          <p><strong>ФИО:</strong> ${record.first_name} ${record.last_name}</p>
          <p><strong>Email:</strong> ${record.email}</p>
          <p><strong>Телефон:</strong> ${record.phone}</p>
          <p><strong>Организация:</strong> ${record.organization_name || 'Не указано'}</p>
          <p><strong>Должность:</strong> ${record.position}</p>
          <p><strong>Тип членства:</strong> ${record.membership_type === 'individual' ? 'Индивидуальное' : 'Корпоративное'}</p>

          <h3>Опыт работы:</h3>
          <p>${record.experience}</p>

          <h3>Мотивация:</h3>
          <p>${record.motivation}</p>

          <p><a href="https://kfa-website.vercel.app/dashboard/applications">Посмотреть все заявки</a></p>
        `,
      }),
    })

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
})
```

### Шаг 2: Настроить Database Webhook

1. Откройте Supabase Dashboard → Database → Webhooks
2. Создайте новый webhook:
   - **Name:** notify-new-application
   - **Table:** membership_applications
   - **Events:** INSERT
   - **Type:** HTTP Request
   - **Method:** POST
   - **URL:** https://YOUR_PROJECT_REF.supabase.co/functions/v1/notify-new-application
   - **HTTP Headers:**
     ```
     Authorization: Bearer YOUR_ANON_KEY
     ```

---

## 🚀 Вариант 2: Database Trigger + Supabase Edge Functions

Более надежный вариант с использованием PostgreSQL триггера:

### SQL для создания триггера:

```sql
-- Создать функцию для вызова webhook
CREATE OR REPLACE FUNCTION notify_new_application()
RETURNS TRIGGER AS $$
DECLARE
  webhook_url TEXT := 'https://YOUR_PROJECT_REF.supabase.co/functions/v1/notify-new-application';
BEGIN
  -- Вызвать Edge Function асинхронно
  PERFORM
    net.http_post(
      url := webhook_url,
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer YOUR_ANON_KEY'
      ),
      body := jsonb_build_object(
        'record', row_to_json(NEW)
      )
    );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Создать триггер
DROP TRIGGER IF EXISTS on_new_application ON membership_applications;
CREATE TRIGGER on_new_application
  AFTER INSERT ON membership_applications
  FOR EACH ROW
  EXECUTE FUNCTION notify_new_application();
```

---

## 🚀 Вариант 3: Простое решение через frontend

Самый простой вариант - отправлять email прямо из frontend при успешной отправке заявки:

### Обновить `supabase-applications.ts`:

```typescript
static async submit(data: MembershipApplicationData): Promise<{ success: boolean; application?: MembershipApplication }> {
  try {
    const { data: insertData, error } = await supabase
      .from(this.TABLE)
      .insert({
        membership_type: data.membershipType,
        first_name: data.firstName,
        last_name: data.lastName,
        organization_name: data.organizationName || null,
        position: data.position,
        email: data.email,
        phone: data.phone,
        experience: data.experience,
        motivation: data.motivation,
        status: 'pending',
      })
      .select()
      .single()

    if (error) {
      console.error('Error submitting application:', error)
      throw new Error(error.message || 'Failed to submit application')
    }

    // Отправить email уведомление админу
    try {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'KFA Notifications <noreply@kfa.kg>',
          to: ['admin@kfa.kg'],
          subject: `Новая заявка: ${data.firstName} ${data.lastName}`,
          html: `
            <h2>Новая заявка на членство</h2>
            <p><strong>ФИО:</strong> ${data.firstName} ${data.lastName}</p>
            <p><strong>Email:</strong> ${data.email}</p>
            <p><a href="https://kfa-website.vercel.app/dashboard/applications">Посмотреть заявки</a></p>
          `,
        }),
      })
    } catch (emailError) {
      // Не падаем если email не отправился
      console.error('Failed to send email notification:', emailError)
    }

    return {
      success: true,
      application: insertData as MembershipApplication
    }
  } catch (error: any) {
    console.error('Error submitting application:', error)
    throw new Error(error.message || 'Failed to submit application')
  }
}
```

---

## 📧 Email сервисы

### Resend (Рекомендуется)
- **Плюсы:** Простой API, бесплатные 3000 emails/месяц, отличная доставляемость
- **Сайт:** https://resend.com
- **API Key:** Dashboard → API Keys
- **Цена:** $0 до 3000 emails/месяц

### SendGrid
- **Плюсы:** Популярный, много функций
- **Сайт:** https://sendgrid.com
- **API Key:** Dashboard → Settings → API Keys
- **Цена:** $0 до 100 emails/день

### SMTP (Gmail/Yandex)
- **Плюсы:** Бесплатно
- **Минусы:** Ограничения на количество писем
- **Требуется:** App Password для Gmail

---

## 🔧 Переменные окружения

Добавьте в `.env`:

```env
# Email Notifications
VITE_RESEND_API_KEY=re_xxxxxxxxxxxxx
VITE_ADMIN_EMAIL=admin@kfa.kg
```

**⚠️ ВАЖНО:** Не коммитьте `.env` файл в Git!

---

## ✅ Рекомендуемое решение

Для быстрого старта рекомендую **Вариант 3** (frontend) с **Resend**:

1. Зарегистрируйтесь на https://resend.com
2. Получите API ключ
3. Добавьте код отправки email в `supabase-applications.ts`
4. Добавьте переменные в `.env`
5. Готово!

Позже можно перенести на Edge Functions для большей надежности.

---

## 🧪 Тестирование

После настройки:

1. Отправьте тестовую заявку через форму
2. Проверьте почту админа
3. Если письмо не пришло, проверьте:
   - Консоль браузера на ошибки
   - API ключ правильный
   - Email адрес админа правильный
   - Папку спам

---

## 📝 Что будет в письме

```
Тема: Новая заявка на членство: Иван Петров

ФИО: Иван Петров
Email: ivan@example.com
Телефон: +996 555 123 456
Организация: ОсОО "Компания"
Должность: Финансовый директор
Тип членства: Индивидуальное

Опыт работы:
5 лет в финансовой сфере...

Мотивация:
Хочу развивать навыки...

[Посмотреть все заявки]
```

---

Выберите вариант и я помогу с реализацией!
