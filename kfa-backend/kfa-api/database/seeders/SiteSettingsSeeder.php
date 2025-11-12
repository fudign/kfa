<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\SiteSetting;

class SiteSettingsSeeder extends Seeder
{
    /**
     * Seed site settings
     */
    public function run(): void
    {
        $settings = [
            // General Settings
            [
                'key' => 'site_name',
                'value' => 'КФА',
                'type' => 'text',
                'category' => 'general',
                'label' => 'Название сайта',
                'description' => 'Отображается в заголовке и метатегах',
            ],
            [
                'key' => 'site_description',
                'value' => 'Казахстанская Федерация Аудиторов - профессиональное объединение аудиторов',
                'type' => 'textarea',
                'category' => 'general',
                'label' => 'Описание сайта',
                'description' => 'Краткое описание для метатегов и SEO',
            ],
            [
                'key' => 'site_keywords',
                'value' => 'аудит, аудиторы, Казахстан, КФА, сертификация, обучение',
                'type' => 'text',
                'category' => 'general',
                'label' => 'Ключевые слова',
                'description' => 'Ключевые слова для SEO (через запятую)',
            ],
            [
                'key' => 'site_logo',
                'value' => '/images/logo.png',
                'type' => 'text',
                'category' => 'general',
                'label' => 'Логотип сайта',
                'description' => 'URL или путь к логотипу',
            ],
            [
                'key' => 'site_favicon',
                'value' => '/favicon.ico',
                'type' => 'text',
                'category' => 'general',
                'label' => 'Favicon',
                'description' => 'URL или путь к favicon',
            ],
            [
                'key' => 'items_per_page',
                'value' => '20',
                'type' => 'number',
                'category' => 'general',
                'label' => 'Элементов на страницу',
                'description' => 'Количество элементов в списках',
            ],
            [
                'key' => 'maintenance_mode',
                'value' => 'false',
                'type' => 'boolean',
                'category' => 'general',
                'label' => 'Режим обслуживания',
                'description' => 'Включить режим технического обслуживания',
            ],

            // Contact Settings
            [
                'key' => 'contact_email',
                'value' => 'info@kfa.kg',
                'type' => 'text',
                'category' => 'contact',
                'label' => 'Email для связи',
                'description' => 'Основной email для связи',
            ],
            [
                'key' => 'contact_phone',
                'value' => '+996 XXX XXX XXX',
                'type' => 'text',
                'category' => 'contact',
                'label' => 'Телефон',
                'description' => 'Контактный телефон',
            ],
            [
                'key' => 'contact_address',
                'value' => 'г. Бишкек, Кыргызстан',
                'type' => 'textarea',
                'category' => 'contact',
                'label' => 'Адрес',
                'description' => 'Физический адрес организации',
            ],
            [
                'key' => 'contact_working_hours',
                'value' => 'Пн-Пт: 9:00-18:00',
                'type' => 'text',
                'category' => 'contact',
                'label' => 'Часы работы',
                'description' => 'График работы',
            ],

            // Social Media Settings
            [
                'key' => 'social_facebook',
                'value' => 'https://facebook.com/kfa',
                'type' => 'text',
                'category' => 'social',
                'label' => 'Facebook',
                'description' => 'URL страницы Facebook',
            ],
            [
                'key' => 'social_instagram',
                'value' => 'https://instagram.com/kfa',
                'type' => 'text',
                'category' => 'social',
                'label' => 'Instagram',
                'description' => 'URL профиля Instagram',
            ],
            [
                'key' => 'social_twitter',
                'value' => 'https://twitter.com/kfa',
                'type' => 'text',
                'category' => 'social',
                'label' => 'Twitter',
                'description' => 'URL профиля Twitter',
            ],
            [
                'key' => 'social_linkedin',
                'value' => 'https://linkedin.com/company/kfa',
                'type' => 'text',
                'category' => 'social',
                'label' => 'LinkedIn',
                'description' => 'URL страницы LinkedIn',
            ],
            [
                'key' => 'social_youtube',
                'value' => 'https://youtube.com/@kfa',
                'type' => 'text',
                'category' => 'social',
                'label' => 'YouTube',
                'description' => 'URL канала YouTube',
            ],
            [
                'key' => 'social_telegram',
                'value' => 'https://t.me/kfa',
                'type' => 'text',
                'category' => 'social',
                'label' => 'Telegram',
                'description' => 'URL канала Telegram',
            ],

            // SEO Settings
            [
                'key' => 'seo_title',
                'value' => 'КФА - Казахстанская Федерация Аудиторов',
                'type' => 'text',
                'category' => 'seo',
                'label' => 'SEO Заголовок',
                'description' => 'Заголовок для поисковых систем',
            ],
            [
                'key' => 'seo_description',
                'value' => 'Профессиональное объединение аудиторов Казахстана. Сертификация, обучение, стандарты.',
                'type' => 'textarea',
                'category' => 'seo',
                'label' => 'SEO Описание',
                'description' => 'Описание для поисковых систем',
            ],
            [
                'key' => 'seo_og_image',
                'value' => '/images/og-image.jpg',
                'type' => 'text',
                'category' => 'seo',
                'label' => 'Open Graph изображение',
                'description' => 'Изображение для социальных сетей',
            ],
            [
                'key' => 'seo_robots',
                'value' => 'index, follow',
                'type' => 'text',
                'category' => 'seo',
                'label' => 'Robots meta tag',
                'description' => 'Правила индексации для поисковых роботов',
            ],

            // Analytics Settings
            [
                'key' => 'analytics_enabled',
                'value' => 'false',
                'type' => 'boolean',
                'category' => 'analytics',
                'label' => 'Включить аналитику',
                'description' => 'Включить сбор аналитики',
            ],
            [
                'key' => 'analytics_google_id',
                'value' => '',
                'type' => 'text',
                'category' => 'analytics',
                'label' => 'Google Analytics ID',
                'description' => 'ID счетчика Google Analytics (G-XXXXXXXXXX)',
            ],
            [
                'key' => 'analytics_yandex_id',
                'value' => '',
                'type' => 'text',
                'category' => 'analytics',
                'label' => 'Yandex Metrika ID',
                'description' => 'ID счетчика Яндекс Метрики',
            ],

            // Theme Settings
            [
                'key' => 'theme_primary_color',
                'value' => '#0066cc',
                'type' => 'text',
                'category' => 'theme',
                'label' => 'Основной цвет',
                'description' => 'Цвет в формате HEX',
            ],
            [
                'key' => 'theme_secondary_color',
                'value' => '#6c757d',
                'type' => 'text',
                'category' => 'theme',
                'label' => 'Вторичный цвет',
                'description' => 'Цвет в формате HEX',
            ],
            [
                'key' => 'theme_dark_mode',
                'value' => 'true',
                'type' => 'boolean',
                'category' => 'theme',
                'label' => 'Темная тема',
                'description' => 'Включить поддержку темной темы',
            ],
        ];

        foreach ($settings as $setting) {
            SiteSetting::updateOrCreate(
                ['key' => $setting['key']],
                $setting
            );
        }

        $this->command->info('✅ Site settings created successfully!');
        $this->command->info('📊 Total settings: ' . count($settings));
        $this->command->info('📂 Categories: general, contact, social, seo, analytics, theme');
    }
}
