import { z } from 'zod';

// Схема валидации для мероприятий
export const eventsSchema = z.object({
  title: z.string()
    .min(3, 'Название должно содержать минимум 3 символа')
    .max(255, 'Название не может превышать 255 символов'),

  slug: z.string()
    .min(3, 'URL-адрес должен содержать минимум 3 символа')
    .max(255, 'URL-адрес не может превышать 255 символов')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'URL-адрес может содержать только строчные буквы, цифры и дефисы'),

  description: z.string()
    .min(10, 'Описание должно содержать минимум 10 символов'),

  location: z.string()
    .min(3, 'Место проведения должно содержать минимум 3 символа')
    .max(255, 'Место проведения не может превышать 255 символов'),

  starts_at: z.string()
    .min(1, 'Укажите дату и время начала'),

  ends_at: z.string()
    .min(1, 'Укажите дату и время окончания'),

  capacity: z.number()
    .int('Вместимость должна быть целым числом')
    .positive('Вместимость должна быть положительным числом')
    .optional()
    .nullable(),

  image: z.string()
    .url('Неверный формат URL изображения')
    .optional()
    .or(z.literal(''))
}).refine((data) => {
  // Проверка, что дата окончания позже даты начала
  if (data.starts_at && data.ends_at) {
    return new Date(data.ends_at) > new Date(data.starts_at);
  }
  return true;
}, {
  message: 'Дата окончания должна быть позже даты начала',
  path: ['ends_at']
});

export type EventsFormData = z.infer<typeof eventsSchema>;
