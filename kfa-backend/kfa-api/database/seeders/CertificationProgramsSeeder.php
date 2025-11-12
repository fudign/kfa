<?php

namespace Database\Seeders;

use App\Models\CertificationProgram;
use Illuminate\Database\Seeder;

class CertificationProgramsSeeder extends Seeder
{
    public function run(): void
    {
        $programs = [
            [
                'name' => 'Брокер на рынке ценных бумаг',
                'code' => 'KFA-BM',
                'type' => 'basic',
                'description' => 'Базовая сертификация для брокеров, работающих на рынке ценных бумаг КР.',
                'requirements' => 'Высшее образование, опыт от 1 года',
                'curriculum' => json_encode(['Основы РЦБ', 'Законодательство', 'Биржевая торговля', 'Этика']),
                'duration_hours' => 80,
                'exam_fee' => 7000.00,
                'certification_fee' => 3000.00,
                'validity_months' => 36,
                'cpe_hours_required' => 40,
                'is_active' => true,
                'order' => 1,
            ],
            [
                'name' => 'Финансовый аналитик',
                'code' => 'KFA-FA',
                'type' => 'basic',
                'description' => 'Базовая сертификация для финансовых аналитиков.',
                'requirements' => 'Высшее образование, опыт аналитической работы от 1 года',
                'curriculum' => json_encode(['Финансовая отчетность', 'Оценка ценных бумаг', 'Анализ', 'Прогнозирование']),
                'duration_hours' => 100,
                'exam_fee' => 7000.00,
                'certification_fee' => 3000.00,
                'validity_months' => 36,
                'cpe_hours_required' => 45,
                'is_active' => true,
                'order' => 2,
            ],
            [
                'name' => 'Менеджер по управлению активами',
                'code' => 'KFA-AM',
                'type' => 'basic',
                'description' => 'Базовая сертификация для менеджеров по управлению активами.',
                'requirements' => 'Высшее образование, опыт от 2 лет',
                'curriculum' => json_encode(['Управление портфелями', 'Стратегии', 'Риск-менеджмент']),
                'duration_hours' => 120,
                'exam_fee' => 9000.00,
                'certification_fee' => 4000.00,
                'validity_months' => 36,
                'cpe_hours_required' => 50,
                'is_active' => true,
                'order' => 3,
            ],
            // СПЕЦИАЛИЗИРОВАННЫЕ ПРОГРАММЫ (6)
            [
                'name' => 'Специалист по корпоративному управлению',
                'code' => 'KFA-CG',
                'type' => 'specialized',
                'description' => 'Специализация в области корпоративного управления.',
                'requirements' => 'Базовая сертификация КФА, опыт от 2 лет',
                'curriculum' => json_encode(['Корпоративное управление', 'Права акционеров', 'ESG']),
                'duration_hours' => 60,
                'exam_fee' => 8000.00,
                'certification_fee' => 4000.00,
                'validity_months' => 36,
                'cpe_hours_required' => 30,
                'is_active' => true,
                'order' => 10,
            ],
            [
                'name' => 'Специалист по управлению рисками',
                'code' => 'KFA-RM',
                'type' => 'specialized',
                'description' => 'Специализация в риск-менеджменте на финансовом рынке.',
                'requirements' => 'Базовая сертификация КФА, опыт от 1 года',
                'curriculum' => json_encode(['Виды рисков', 'Методы оценки', 'VaR', 'Стресс-тестирование']),
                'duration_hours' => 80,
                'exam_fee' => 8000.00,
                'certification_fee' => 4000.00,
                'validity_months' => 36,
                'cpe_hours_required' => 40,
                'is_active' => true,
                'order' => 11,
            ],
            [
                'name' => 'Специалист по комплаенсу',
                'code' => 'KFA-CM',
                'type' => 'specialized',
                'description' => 'Специализация в области compliance и регулирования.',
                'requirements' => 'Базовая сертификация КФА или юридическое образование',
                'curriculum' => json_encode(['Регулирование', 'AML/CFT', 'Этические стандарты', 'KYC']),
                'duration_hours' => 70,
                'exam_fee' => 7500.00,
                'certification_fee' => 3500.00,
                'validity_months' => 36,
                'cpe_hours_required' => 35,
                'is_active' => true,
                'order' => 12,
            ],
            [
                'name' => 'Специалист по ESG и устойчивому развитию',
                'code' => 'KFA-ESG',
                'type' => 'specialized',
                'description' => 'Специализация в области ESG и устойчивых финансов.',
                'requirements' => 'Базовая сертификация КФА',
                'curriculum' => json_encode(['ESG факторы', 'Зеленые облигации', 'PRI', 'Климатические риски']),
                'duration_hours' => 60,
                'exam_fee' => 7500.00,
                'certification_fee' => 3500.00,
                'validity_months' => 36,
                'cpe_hours_required' => 30,
                'is_active' => true,
                'order' => 13,
            ],
            [
                'name' => 'Специалист по финтеху и цифровым активам',
                'code' => 'KFA-FINTECH',
                'type' => 'specialized',
                'description' => 'Специализация в финтехе, блокчейн и криптовалютах.',
                'requirements' => 'Базовая сертификация КФА, знание IT',
                'curriculum' => json_encode(['Blockchain', 'Криптовалюты', 'DeFi', 'Смарт-контракты']),
                'duration_hours' => 70,
                'exam_fee' => 8500.00,
                'certification_fee' => 4000.00,
                'validity_months' => 24,
                'cpe_hours_required' => 40,
                'is_active' => true,
                'order' => 14,
            ],
            [
                'name' => 'Специалист по инвестиционному консультированию',
                'code' => 'KFA-IC',
                'type' => 'specialized',
                'description' => 'Специализация в инвестиционном консультировании.',
                'requirements' => 'Базовая сертификация КФА, опыт с клиентами от 1 года',
                'curriculum' => json_encode(['Консультирование', 'Профилирование клиентов', 'Инвестпланы']),
                'duration_hours' => 80,
                'exam_fee' => 8000.00,
                'certification_fee' => 4000.00,
                'validity_months' => 36,
                'cpe_hours_required' => 40,
                'is_active' => true,
                'order' => 15,
            ],
        ];

        foreach ($programs as $program) {
            CertificationProgram::updateOrCreate(['code' => $program['code']], $program);
        }

        $this->command->info('✅ Loaded 9 certification programs');
    }
}
