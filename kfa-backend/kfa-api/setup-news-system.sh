#!/bin/bash

echo "========================================"
echo "   УСТАНОВКА СИСТЕМЫ УПРАВЛЕНИЯ НОВОСТЯМИ"
echo "========================================"
echo ""

echo "[1/3] Запуск миграций..."
php artisan migrate
if [ $? -ne 0 ]; then
    echo "❌ ОШИБКА: Миграции не выполнены!"
    exit 1
fi
echo "✅ Миграции успешно выполнены!"
echo ""

echo "[2/3] Назначение прав доступа администратору..."
php artisan tinker <<EOF
\$admin = \Spatie\Permission\Models\Role::where('name', 'admin')->first();
if (\$admin) {
    \$admin->givePermissionTo([
        'content.view',
        'content.create',
        'content.update',
        'content.delete',
        'media.view',
        'media.upload',
        'media.delete'
    ]);
    echo "✅ Права успешно назначены!\n";
} else {
    echo "❌ ОШИБКА: Роль admin не найдена!\n";
}
exit
EOF
echo ""

echo "[3/3] Проверка настроек..."
php artisan route:list --path=news
echo ""

echo "========================================"
echo "   УСТАНОВКА ЗАВЕРШЕНА УСПЕШНО!"
echo "========================================"
echo ""
echo "Система управления новостями готова к использованию!"
echo ""
echo "Доступные endpoints:"
echo "  - GET    /api/news              (публичный)"
echo "  - POST   /api/news              (требует auth)"
echo "  - GET    /api/news/stats        (требует auth)"
echo "  - POST   /api/news/{id}/publish (требует admin)"
echo ""
echo "Запустите frontend: npm run dev"
echo "Откройте: http://localhost:5173/dashboard/news"
echo ""
