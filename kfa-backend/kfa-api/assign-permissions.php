<?php

// Загружаем Laravel bootstrap
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

echo "🔐 Назначение прав доступа...\n\n";

// Создаем необходимые права, если их нет
$permissions = [
    'content.view' => ['display' => 'Просмотр контента', 'category' => 'content'],
    'content.create' => ['display' => 'Создание контента', 'category' => 'content'],
    'content.update' => ['display' => 'Редактирование контента', 'category' => 'content'],
    'content.delete' => ['display' => 'Удаление контента', 'category' => 'content'],
    'media.view' => ['display' => 'Просмотр медиа', 'category' => 'media'],
    'media.upload' => ['display' => 'Загрузка медиа', 'category' => 'media'],
    'media.delete' => ['display' => 'Удаление медиа', 'category' => 'media']
];

foreach ($permissions as $permissionName => $data) {
    $permission = Permission::firstOrCreate(
        ['name' => $permissionName],
        [
            'display_name' => $data['display'],
            'category' => $data['category'],
            'description' => $data['display']
        ]
    );
    echo "✓ Право '{$permissionName}' ({$data['display']}) готово\n";
}

// Находим или создаем роль admin
$admin = Role::firstOrCreate(
    ['name' => 'admin'],
    ['display_name' => 'Администратор', 'description' => 'Полный доступ к системе']
);
echo "\n✓ Роль 'admin' готова\n";

// Назначаем все права роли admin
$admin->syncPermissions(array_keys($permissions));

echo "\n✅ Все права успешно назначены роли 'admin'!\n";
echo "\nСписок назначенных прав:\n";
foreach ($permissions as $permName => $data) {
    echo "  - {$permName} ({$data['display']})\n";
}

echo "\n🎉 Настройка завершена!\n";
