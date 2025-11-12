<?php
/**
 * Create test news in SQLite database
 * Run: php create-test-news.php
 */

require __DIR__ . '/kfa-backend/kfa-api/vendor/autoload.php';

$app = require_once __DIR__ . '/kfa-backend/kfa-api/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use Illuminate\Support\Facades\DB;

// Test news data
$testNews = [
    [
        'title' => 'Добро пожаловать в КФА',
        'slug' => 'dobro-pozhalovat-v-kfa',
        'content' => 'Кыргызский Финансовый Альянс рад приветствовать вас! Мы являемся саморегулируемой организацией профессиональных участников рынка ценных бумаг Кыргызской Республики. Наша миссия - развитие и поддержка финансового рынка страны.',
        'excerpt' => 'Кыргызский Финансовый Альянс - профессиональное объединение участников рынка ценных бумаг.',
        'image' => 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800',
        'status' => 'published',
        'featured' => true,
        'category' => 'regulation',
        'published_at' => now(),
        'created_at' => now(),
        'updated_at' => now(),
    ],
    [
        'title' => 'Новые стандарты профессиональной деятельности',
        'slug' => 'novye-standarty-professionalnoj-deyatelnosti',
        'content' => 'КФА объявляет о внедрении новых стандартов профессиональной деятельности для участников рынка ценных бумаг. Эти стандарты направлены на повышение качества услуг и защиту интересов инвесторов.',
        'excerpt' => 'Внедрение новых стандартов для повышения качества услуг на рынке.',
        'image' => 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800',
        'status' => 'published',
        'featured' => true,
        'category' => 'events',
        'published_at' => now()->subDays(5),
        'created_at' => now()->subDays(5),
        'updated_at' => now()->subDays(5),
    ],
    [
        'title' => 'Аналитический отчет: Рынок ценных бумаг Кыргызстана в 2025',
        'slug' => 'analiticheskij-otchet-rynok-cennyh-bumag-2025',
        'content' => 'Представляем вашему вниманию комплексный анализ состояния и перспектив развития рынка ценных бумаг Кыргызской Республики. Отчёт включает статистику, тренды и прогнозы на ближайшие годы.',
        'excerpt' => 'Комплексный анализ рынка ценных бумаг за 2025 год.',
        'image' => 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800',
        'status' => 'published',
        'featured' => false,
        'category' => 'analytics',
        'published_at' => now()->subDays(10),
        'created_at' => now()->subDays(10),
        'updated_at' => now()->subDays(10),
    ],
    [
        'title' => 'Обучающий семинар для членов КФА',
        'slug' => 'obuchayushchij-seminar-dlya-chlenov-kfa',
        'content' => 'Приглашаем всех членов КФА на обучающий семинар по новым регуляторным требованиям. Семинар пройдет 20 декабря 2025 года в офисе КФА.',
        'excerpt' => 'Семинар по новым регуляторным требованиям для членов КФА.',
        'image' => 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800',
        'status' => 'published',
        'featured' => false,
        'category' => 'events',
        'published_at' => now()->subDays(3),
        'created_at' => now()->subDays(3),
        'updated_at' => now()->subDays(3),
    ],
    [
        'title' => 'Итоги работы КФА за первое полугодие 2025',
        'slug' => 'itogi-raboty-kfa-za-pervoe-polugodie-2025',
        'content' => 'Подведены итоги работы Кыргызского Финансового Альянса за первое полугодие 2025 года. Основные достижения, статистика членства и планы на второе полугодие.',
        'excerpt' => 'Итоги работы КФА: достижения и планы на будущее.',
        'image' => 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
        'status' => 'published',
        'featured' => true,
        'category' => 'analytics',
        'published_at' => now()->subDays(15),
        'created_at' => now()->subDays(15),
        'updated_at' => now()->subDays(15),
    ],
];

echo "\n╔═══════════════════════════════════════════════════╗\n";
echo "║      Creating Test News in Database              ║\n";
echo "╚═══════════════════════════════════════════════════╝\n\n";

try {
    // Check if news already exist
    $existingCount = DB::table('news')->count();
    echo "📊 Current news count: $existingCount\n\n";

    if ($existingCount > 0) {
        echo "⚠️  Database already has news. Skipping...\n";
        echo "💡 To recreate, delete database/database.sqlite and run migrations again.\n\n";
    } else {
        echo "📝 Inserting test news...\n\n";

        foreach ($testNews as $news) {
            DB::table('news')->insert($news);
            echo "   ✅ Created: {$news['title']}\n";
        }

        echo "\n✅ Successfully created " . count($testNews) . " test news!\n\n";
    }

    // Verify
    $finalCount = DB::table('news')->count();
    echo "📊 Final news count: $finalCount\n";

    // Show some news
    $recentNews = DB::table('news')
        ->select('title', 'status', 'featured', 'published_at')
        ->orderBy('published_at', 'desc')
        ->limit(5)
        ->get();

    if ($recentNews->count() > 0) {
        echo "\n📰 Recent news:\n";
        foreach ($recentNews as $news) {
            $featured = $news->featured ? '⭐' : '  ';
            echo "   $featured {$news->title} ({$news->status})\n";
        }
    }

    echo "\n╔═══════════════════════════════════════════════════╗\n";
    echo "║                  SUCCESS ✅                       ║\n";
    echo "╚═══════════════════════════════════════════════════╝\n\n";

    echo "🔗 Check your site:\n";
    echo "   - Homepage: http://localhost:3001\n";
    echo "   - Dashboard: http://localhost:3001/dashboard\n";
    echo "   - News Manager: http://localhost:3001/dashboard/news\n\n";

} catch (Exception $e) {
    echo "\n❌ Error: " . $e->getMessage() . "\n\n";
    exit(1);
}
