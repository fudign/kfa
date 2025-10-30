@echo off
chcp 65001 >nul
echo ========================================
echo    ТЕСТИРОВАНИЕ NEWS API
echo ========================================
echo.

set API_URL=http://localhost:8000/api

echo [TEST 1] Проверка публичного доступа к новостям...
curl -s -o nul -w "HTTP Status: %%{http_code}\n" %API_URL%/news
echo.

echo [TEST 2] Получение списка новостей (JSON)...
curl -s -H "Accept: application/json" %API_URL%/news | jq .
echo.

echo [TEST 3] Проверка структуры API...
curl -s -H "Accept: application/json" %API_URL%/news | jq "keys"
echo.

echo ========================================
echo Для тестирования защищенных endpoints:
echo ========================================
echo.
echo 1. Получите токен через /api/login
echo 2. Используйте токен в заголовке:
echo    curl -H "Authorization: Bearer YOUR_TOKEN" %API_URL%/news/stats
echo.
pause
