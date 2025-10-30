# ========================================
#   УСТАНОВКА СИСТЕМЫ УПРАВЛЕНИЯ НОВОСТЯМИ
# ========================================

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  УСТАНОВКА СИСТЕМЫ УПРАВЛЕНИЯ НОВОСТЯМИ" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Проверка наличия PHP
Write-Host "[Проверка] Поиск PHP..." -ForegroundColor Yellow
$phpPath = Get-Command php -ErrorAction SilentlyContinue

if (-not $phpPath) {
    Write-Host "❌ ОШИБКА: PHP не найден!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Установите PHP:" -ForegroundColor Yellow
    Write-Host "  - Скачайте: https://windows.php.net/download/" -ForegroundColor White
    Write-Host "  - Или используйте: choco install php" -ForegroundColor White
    Write-Host ""
    Read-Host "Нажмите Enter для выхода"
    exit 1
}

Write-Host "✅ PHP найден: $($phpPath.Source)" -ForegroundColor Green
Write-Host ""

# Шаг 1: Миграции
Write-Host "[1/3] Запуск миграций..." -ForegroundColor Yellow
php artisan migrate

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ ОШИБКА: Миграции не выполнены!" -ForegroundColor Red
    Read-Host "Нажмите Enter для выхода"
    exit 1
}

Write-Host "✅ Миграции успешно выполнены!" -ForegroundColor Green
Write-Host ""

# Шаг 2: Права доступа
Write-Host "[2/3] Назначение прав доступа администратору..." -ForegroundColor Yellow

$tinkerScript = @"
`$admin = \Spatie\Permission\Models\Role::where('name', 'admin')->first();
if (`$admin) {
    `$admin->givePermissionTo([
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
"@

$tinkerScript | php artisan tinker
Write-Host ""

# Шаг 3: Проверка настроек
Write-Host "[3/3] Проверка настроек..." -ForegroundColor Yellow
php artisan route:list --path=news | Select-Object -First 20
Write-Host ""

Write-Host "========================================" -ForegroundColor Green
Write-Host "  УСТАНОВКА ЗАВЕРШЕНА УСПЕШНО!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

Write-Host "Система управления новостями готова к использованию!" -ForegroundColor White
Write-Host ""

Write-Host "Доступные endpoints:" -ForegroundColor Yellow
Write-Host "  - GET    /api/news              (публичный)" -ForegroundColor White
Write-Host "  - POST   /api/news              (требует auth)" -ForegroundColor White
Write-Host "  - GET    /api/news/stats        (требует auth)" -ForegroundColor White
Write-Host "  - POST   /api/news/{id}/publish (требует admin)" -ForegroundColor White
Write-Host ""

Write-Host "Следующие шаги:" -ForegroundColor Yellow
Write-Host "  1. Запустите Backend:  php artisan serve" -ForegroundColor White
Write-Host "  2. Запустите Frontend: cd ../../kfa-website && npm run dev" -ForegroundColor White
Write-Host "  3. Откройте: http://localhost:5173/dashboard/news" -ForegroundColor White
Write-Host ""

Read-Host "Нажмите Enter для завершения"
