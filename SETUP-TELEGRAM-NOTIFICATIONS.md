# Настройка Telegram уведомлений для заявок

## 🚀 Быстрая настройка (5 минут)

Telegram уведомления - это самый простой и бесплатный способ получать уведомления о новых заявках.

---

## 📱 Шаг 1: Создать Telegram бота

1. Откройте Telegram и найдите [@BotFather](https://t.me/botfather)
2. Отправьте команду `/newbot`
3. Введите имя бота: `KFA Applications Bot`
4. Введите username: `kfa_applications_bot` (или другое уникальное имя)
5. **Скопируйте API токен** (выглядит как `123456789:ABCdefGHIjklMNOpqrsTUVwxyz`)

---

## 📱 Шаг 2: Получить Chat ID

### Вариант А: Через бота [@userinfobot](https://t.me/userinfobot)

1. Откройте https://t.me/userinfobot
2. Нажмите "Start"
3. Бот покажет ваш Chat ID (например: `123456789`)

### Вариант Б: Через свой бот

1. Отправьте любое сообщение своему боту (созданному в Шаге 1)
2. Откройте в браузере:
   ```
   https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates
   ```
3. Найдите `"chat":{"id":123456789}` в ответе
4. Скопируйте это число

---

## 🔧 Шаг 3: Добавить переменные окружения

Добавьте в файл `kfa-website/.env`:

```env
# Telegram Notifications
VITE_TELEGRAM_BOT_TOKEN=123456789:ABCdefGHIjklMNOpqrsTUVwxyz
VITE_TELEGRAM_CHAT_ID=123456789
```

**⚠️ ВАЖНО:** Не коммитьте `.env` файл в Git!

---

## 💻 Шаг 4: Обновить код

### Обновить `kfa-website/src/lib/supabase-applications.ts`:

Добавьте функцию отправки уведомления:

```typescript
/**
 * Отправить уведомление в Telegram
 */
private static async sendTelegramNotification(application: MembershipApplication): Promise<void> {
  try {
    const botToken = import.meta.env.VITE_TELEGRAM_BOT_TOKEN;
    const chatId = import.meta.env.VITE_TELEGRAM_CHAT_ID;

    if (!botToken || !chatId) {
      console.warn('Telegram credentials not configured');
      return;
    }

    const message = `
🔔 *Новая заявка на членство КФА*

👤 *ФИО:* ${application.first_name} ${application.last_name}
📧 *Email:* ${application.email}
📱 *Телефон:* ${application.phone}
${application.organization_name ? `🏢 *Организация:* ${application.organization_name}\n` : ''}
💼 *Должность:* ${application.position}
📋 *Тип:* ${application.membership_type === 'individual' ? 'Индивидуальное' : 'Корпоративное'}

*Опыт:*
${application.experience.substring(0, 200)}${application.experience.length > 200 ? '...' : ''}

*Мотивация:*
${application.motivation.substring(0, 200)}${application.motivation.length > 200 ? '...' : ''}

👉 [Посмотреть все заявки](https://kfa-website.vercel.app/dashboard/applications)
    `.trim();

    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;

    await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'Markdown',
        disable_web_page_preview: true,
      }),
    });

    console.log('Telegram notification sent successfully');
  } catch (error) {
    console.error('Failed to send Telegram notification:', error);
    // Не бросаем ошибку - это не критично
  }
}
```

Обновите метод `submit()`:

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

    // Отправить уведомление в Telegram (асинхронно, не блокирует)
    this.sendTelegramNotification(insertData as MembershipApplication).catch(console.error);

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

## 🧪 Шаг 5: Тестирование

1. Перезапустите dev сервер:
   ```bash
   cd kfa-website
   npm run dev
   ```

2. Откройте http://localhost:5173/membership/join

3. Заполните и отправьте тестовую заявку

4. Проверьте Telegram - должно прийти сообщение! 📱

---

## 📱 Пример сообщения в Telegram

```
🔔 Новая заявка на членство КФА

👤 ФИО: Иван Петров
📧 Email: ivan@example.com
📱 Телефон: +996 555 123 456
🏢 Организация: ОсОО "ТехКомпани"
💼 Должность: Финансовый директор
📋 Тип: Индивидуальное

Опыт:
Более 10 лет опыта в финансовой сфере. Работал в крупных компаниях...

Мотивация:
Хочу развивать профессиональные компетенции, обмениваться опытом...

👉 Посмотреть все заявки
```

---

## ✅ Преимущества Telegram уведомлений

- ✅ **Бесплатно** - никаких лимитов
- ✅ **Мгновенно** - уведомление приходит за секунду
- ✅ **Надежно** - Telegram API очень стабилен
- ✅ **Просто** - настройка за 5 минут
- ✅ **Мобильно** - уведомления на телефоне
- ✅ **Группы** - можно отправлять в группу для всей команды

---

## 👥 Отправка в группу Telegram

Если хотите, чтобы уведомления получала вся команда:

1. Создайте группу в Telegram
2. Добавьте бота в группу
3. Сделайте бота администратором
4. Получите Chat ID группы (будет отрицательным: `-123456789`)
5. Используйте этот Chat ID в `.env`

---

## 🔒 Безопасность

**⚠️ НЕ ПУБЛИКУЙТЕ:**
- Bot Token
- Chat ID

**✅ БЕЗОПАСНО:**
- Токен и Chat ID только в `.env` файле
- `.env` в `.gitignore`
- Используйте Environment Variables в Vercel для продакшена

---

## 🚀 Деплой на Vercel

После настройки локально, добавьте переменные в Vercel:

1. Откройте Vercel Dashboard → Your Project → Settings → Environment Variables
2. Добавьте:
   - `VITE_TELEGRAM_BOT_TOKEN` = ваш токен
   - `VITE_TELEGRAM_CHAT_ID` = ваш chat id
3. Redeploy проект

Теперь уведомления будут работать и на продакшене! 🎉

---

## 🆘 Проблемы и решения

### Уведомление не приходит

**Проверьте:**
1. Bot Token правильный (скопировали из BotFather)
2. Chat ID правильный (проверьте через userinfobot)
3. Отправили хотя бы одно сообщение боту (нажали Start)
4. Переменные в `.env` правильно названы
5. Dev сервер перезапущен после изменения `.env`

### "Bot was blocked by the user"

**Решение:** Найдите бота в Telegram и нажмите "Restart" или "/start"

### "Chat not found"

**Решение:**
1. Убедитесь что Chat ID правильный
2. Для групп Chat ID должен быть отрицательным (начинаться с `-`)
3. Бот должен быть добавлен в группу и быть администратором

---

## 📊 Статистика

После настройки вы будете получать уведомления:
- ⚡ Мгновенно при новой заявке
- 📱 На телефон (push-уведомление)
- 💻 На компьютер (если открыт Telegram Desktop)
- 🌐 В web-версии Telegram

---

**Готово!** Теперь вы будете получать уведомления о каждой новой заявке! 🎉
