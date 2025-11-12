<?php

namespace Database\Seeders;

use App\Models\Document;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class KFADocumentsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $documents = [
            // 1. УЧРЕДИТЕЛЬНЫЕ ДОКУМЕНТЫ
            [
                'title' => 'Устав КФА',
                'slug' => 'charter',
                'description' => 'Устав Кыргызского Финансового Альянса - основополагающий документ, определяющий правовой статус, цели, задачи и структуру организации.',
                'category' => 'charter',
                'file_url' => '/documents/charter/Устав-КФА-2025-10-23.pdf',
                'file_type' => 'application/pdf',
                'file_size' => 450000,
                'is_public' => true,
                'order' => 1,
            ],
            [
                'title' => 'Положение о членстве в КФА',
                'slug' => 'membership-regulations',
                'description' => 'Положение о членстве в КФА, определяющее категории членства, права и обязанности членов, процедуры вступления и выхода.',
                'category' => 'charter',
                'file_url' => '/documents/charter/Положение-о-членстве-КФА.pdf',
                'file_type' => 'application/pdf',
                'file_size' => 350000,
                'is_public' => true,
                'order' => 2,
            ],
            [
                'title' => 'Приложения к Положению о членстве',
                'slug' => 'membership-appendices',
                'description' => 'Приложения к Положению о членстве: формы заявлений, анкеты, перечни документов.',
                'category' => 'charter',
                'file_url' => '/documents/charter/Приложения-к-Положению-о-членстве-КФА.pdf',
                'file_type' => 'application/pdf',
                'file_size' => 250000,
                'is_public' => true,
                'order' => 3,
            ],
            [
                'title' => 'Базовые стандарты профессиональной деятельности',
                'slug' => 'professional-standards',
                'description' => 'Базовые стандарты профессиональной деятельности членов КФА на финансовом рынке Кыргызской Республики.',
                'category' => 'charter',
                'file_url' => '/documents/charter/Базовые-стандарты-профессиональной-деятельности-КФА.pdf',
                'file_type' => 'application/pdf',
                'file_size' => 400000,
                'is_public' => true,
                'order' => 4,
            ],
            [
                'title' => 'Кодекс профессиональной этики',
                'slug' => 'ethics-code',
                'description' => 'Кодекс профессиональной этики членов Кыргызского Финансового Альянса.',
                'category' => 'charter',
                'file_url' => '/documents/charter/Кодекс-профессиональной-этики-КФА.pdf',
                'file_type' => 'application/pdf',
                'file_size' => 300000,
                'is_public' => true,
                'order' => 5,
            ],
            [
                'title' => 'Регламент дисциплинарного производства',
                'slug' => 'disciplinary-regulations',
                'description' => 'Регламент дисциплинарного производства в отношении членов КФА.',
                'category' => 'charter',
                'file_url' => '/documents/charter/Регламент-дисциплинарного-производства-КФА.pdf',
                'file_type' => 'application/pdf',
                'file_size' => 280000,
                'is_public' => true,
                'order' => 6,
            ],
            [
                'title' => 'Регламент работы Совета КФА',
                'slug' => 'council-regulations',
                'description' => 'Регламент работы Совета Кыргызского Финансового Альянса.',
                'category' => 'charter',
                'file_url' => '/documents/charter/Регламент-работы-Совета-КФА.pdf',
                'file_type' => 'application/pdf',
                'file_size' => 220000,
                'is_public' => true,
                'order' => 7,
            ],
            [
                'title' => 'Навигатор документов КФА',
                'slug' => 'documents-navigator',
                'description' => 'Путеводитель по учредительным документам КФА с описаниями и рекомендациями.',
                'category' => 'charter',
                'file_url' => '/documents/charter/НАВИГАТОР-ДОКУМЕНТОВ-КФА.pdf',
                'file_type' => 'application/pdf',
                'file_size' => 300000,
                'is_public' => true,
                'order' => 8,
            ],

            // 2. РЕГУЛИРУЮЩИЕ ПОЛОЖЕНИЯ
            [
                'title' => 'Положение о сертификации специалистов',
                'slug' => 'certification-regulations',
                'description' => 'Положение о сертификации специалистов финансового рынка, включая 9 программ сертификации.',
                'category' => 'regulations',
                'file_url' => '/documents/regulations/Положение-о-сертификации-специалистов-КФА.pdf',
                'file_type' => 'application/pdf',
                'file_size' => 320000,
                'is_public' => true,
                'order' => 10,
            ],
            [
                'title' => 'Положение о непрерывном профессиональном образовании',
                'slug' => 'continuing-education',
                'description' => 'Положение о системе непрерывного профессионального образования (НПО) для членов КФА.',
                'category' => 'regulations',
                'file_url' => '/documents/regulations/Положение-о-непрерывном-профессиональном-образовании-КФА.pdf',
                'file_type' => 'application/pdf',
                'file_size' => 280000,
                'is_public' => true,
                'order' => 11,
            ],
            [
                'title' => 'Положение о финансово-хозяйственной деятельности',
                'slug' => 'financial-regulations',
                'description' => 'Положение о финансово-хозяйственной деятельности КФА, включая структуру взносов и бюджет.',
                'category' => 'regulations',
                'file_url' => '/documents/regulations/Положение-о-финансово-хозяйственной-деятельности-КФА.pdf',
                'file_type' => 'application/pdf',
                'file_size' => 260000,
                'is_public' => true,
                'order' => 12,
            ],
            [
                'title' => 'Дополнительные положения КФА',
                'slug' => 'additional-regulations',
                'description' => 'Дополнительные положения: о защите персональных данных, о партнерстве, о публикациях.',
                'category' => 'regulations',
                'file_url' => '/documents/regulations/Дополнительные-положения-КФА.pdf',
                'file_type' => 'application/pdf',
                'file_size' => 240000,
                'is_public' => true,
                'order' => 13,
            ],

            // 3. ВЕБ-ДОКУМЕНТЫ
            [
                'title' => 'Политика конфиденциальности',
                'slug' => 'privacy-policy',
                'description' => 'Политика конфиденциальности сайта КФА, регулирующая обработку персональных данных.',
                'category' => 'legal',
                'file_url' => '/documents/web/Политика-конфиденциальности-сайта-КФА.pdf',
                'file_type' => 'application/pdf',
                'file_size' => 220000,
                'is_public' => true,
                'order' => 20,
            ],
            [
                'title' => 'Пользовательское соглашение',
                'slug' => 'terms-of-service',
                'description' => 'Пользовательское соглашение сайта КФА - правила использования веб-сайта.',
                'category' => 'legal',
                'file_url' => '/documents/web/Пользовательское-соглашение-сайта-КФА.pdf',
                'file_type' => 'application/pdf',
                'file_size' => 200000,
                'is_public' => true,
                'order' => 21,
            ],

            // 4. ОПЕРАЦИОННЫЕ ФОРМЫ - ЧЛЕНСТВО
            [
                'title' => 'Договор о членстве в КФА',
                'slug' => 'membership-agreement',
                'description' => 'Типовой договор о членстве в Кыргызском Финансовом Альянсе.',
                'category' => 'forms',
                'file_url' => '/documents/forms/Договор-о-членстве-в-КФА.pdf',
                'file_type' => 'application/pdf',
                'file_size' => 180000,
                'is_public' => true,
                'order' => 30,
            ],
            [
                'title' => 'Соглашение о конфиденциальности (NDA)',
                'slug' => 'nda',
                'description' => 'Соглашение о неразглашении конфиденциальной информации для членов КФА.',
                'category' => 'forms',
                'file_url' => '/documents/forms/Соглашение-о-конфиденциальности-NDA.pdf',
                'file_type' => 'application/pdf',
                'file_size' => 150000,
                'is_public' => true,
                'order' => 31,
            ],

            // 5. ОПЕРАЦИОННЫЕ ФОРМЫ - ОБРАЗОВАНИЕ И МЕРОПРИЯТИЯ
            [
                'title' => 'Формы для образования и мероприятий',
                'slug' => 'education-forms',
                'description' => 'Формы регистрации на курсы, семинары и мероприятия КФА.',
                'category' => 'forms',
                'file_url' => '/documents/forms/Формы-для-образования-и-мероприятий-КФА.pdf',
                'file_type' => 'application/pdf',
                'file_size' => 200000,
                'is_public' => true,
                'order' => 32,
            ],

            // 6. ОПЕРАЦИОННЫЕ ФОРМЫ - СЕРТИФИКАЦИЯ
            [
                'title' => 'Формы для сертификации специалистов',
                'slug' => 'certification-forms',
                'description' => 'Заявки на сертификацию, экзаменационные листы, сертификаты специалистов КФА.',
                'category' => 'forms',
                'file_url' => '/documents/forms/Формы-для-сертификации-специалистов-КФА.pdf',
                'file_type' => 'application/pdf',
                'file_size' => 220000,
                'is_public' => true,
                'order' => 33,
            ],

            // 7. ВНУТРЕННИЕ ДОКУМЕНТЫ (для членов)
            [
                'title' => 'Каталог документов КФА',
                'slug' => 'documents-catalog',
                'description' => 'Полный каталог документов КФА для скачивания с описаниями.',
                'category' => 'internal',
                'file_url' => '/documents/internal/КАТАЛОГ-ДОКУМЕНТОВ-КФА-ДЛЯ-СКАЧИВАНИЯ.pdf',
                'file_type' => 'application/pdf',
                'file_size' => 250000,
                'is_public' => false,
                'order' => 40,
            ],
            [
                'title' => 'Инструкция по публикации документов',
                'slug' => 'publication-guide',
                'description' => 'Руководство для администраторов по публикации документов на сайте КФА.',
                'category' => 'internal',
                'file_url' => '/documents/internal/ИНСТРУКЦИЯ-ПО-ПУБЛИКАЦИИ-ДОКУМЕНТОВ-КФА.pdf',
                'file_type' => 'application/pdf',
                'file_size' => 200000,
                'is_public' => false,
                'order' => 41,
            ],
            [
                'title' => 'Руководство по развертыванию сайта',
                'slug' => 'deployment-guide',
                'description' => 'Техническое руководство по развертыванию и администрированию сайта КФА.',
                'category' => 'internal',
                'file_url' => '/documents/internal/РУКОВОДСТВО-ПО-РАЗВЕРТЫВАНИЮ-САЙТА-КФА.pdf',
                'file_type' => 'application/pdf',
                'file_size' => 280000,
                'is_public' => false,
                'order' => 42,
            ],
            [
                'title' => 'Навигатор форм и документов',
                'slug' => 'forms-navigator',
                'description' => 'Путеводитель по операционным формам и процедурам использования документов КФА.',
                'category' => 'internal',
                'file_url' => '/documents/internal/НАВИГАТОР-ФОРМ-И-ДОКУМЕНТОВ-КФА.pdf',
                'file_type' => 'application/pdf',
                'file_size' => 230000,
                'is_public' => false,
                'order' => 43,
            ],
        ];

        foreach ($documents as $doc) {
            Document::updateOrCreate(
                ['slug' => $doc['slug']],
                array_merge($doc, [
                    'uploaded_by' => 1, // Admin user
                ])
            );
        }

        $this->command->info('✅ Loaded ' . count($documents) . ' KFA documents');
    }
}
