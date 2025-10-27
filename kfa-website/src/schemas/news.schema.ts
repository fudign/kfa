import { z } from 'zod';

// Схема валидации для новостей
export const newsSchema = z.object({
  title: z.string()
    .min(3, 'Заголовок должен содержать минимум 3 символа')
    .max(255, 'Заголовок не может превышать 255 символов'),

  slug: z.string()
    .min(3, 'URL-адрес должен содержать минимум 3 символа')
    .max(255, 'URL-адрес не может превышать 255 символов')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'URL-адрес может содержать только строчные буквы, цифры и дефисы'),

  content: z.string()
    .min(10, 'Содержимое должно содержать минимум 10 символов'),

  excerpt: z.string()
    .max(500, 'Краткое описание не может превышать 500 символов')
    .optional()
    .or(z.literal('')),

  image: z.string()
    .url('Неверный формат URL изображения')
    .optional()
    .or(z.literal('')),

  status: z.enum(['draft', 'published', 'archived'], {
    errorMap: () => ({ message: 'Статус должен быть: черновик, опубликовано или архив' })
  }),

  featured: z.boolean()
});

export type NewsFormData = z.infer<typeof newsSchema>;
