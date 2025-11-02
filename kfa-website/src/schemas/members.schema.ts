import { z } from 'zod';

// Схема валидации для членов КФА
export const membersSchema = z.object({
  name: z.string()
    .min(2, 'Имя должно содержать минимум 2 символа')
    .max(255, 'Имя не может превышать 255 символов'),

  email: z.string()
    .email('Введите корректный email адрес')
    .max(255, 'Email не может превышать 255 символов'),

  company: z.string()
    .min(2, 'Название компании должно содержать минимум 2 символа')
    .max(255, 'Название компании не может превышать 255 символов')
    .optional()
    .or(z.literal('')),

  position: z.string()
    .min(2, 'Должность должна содержать минимум 2 символа')
    .max(255, 'Должность не может превышать 255 символов')
    .optional()
    .or(z.literal('')),

  phone: z.string()
    .regex(/^[\d\s\+\-\(\)]+$/, 'Телефон может содержать только цифры, пробелы и символы +, -, (, )')
    .min(10, 'Телефон должен содержать минимум 10 символов')
    .max(20, 'Телефон не может превышать 20 символов')
    .optional()
    .or(z.literal('')),

  photo: z.string()
    .url('Неверный формат URL фотографии')
    .optional()
    .or(z.literal('')),

  bio: z.string()
    .max(1000, 'Биография не может превышать 1000 символов')
    .optional()
    .or(z.literal('')),

  joined_at: z.string()
    .optional()
    .or(z.literal(''))
});

export type MembersFormData = z.infer<typeof membersSchema>;
