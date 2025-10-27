# Laravel Installation Script for Windows (PowerShell)
# A?>;L7C5B Docker 4;O CAB0=>2:8 Laravel

Write-Host "=== $ Backend - Laravel Installation ===" -ForegroundColor Green
Write-Host ""

# >;CG8BL B5:CICN 48@5:B>@8N
$currentDir = Get-Location

Write-Host ""5:CI0O 48@5:B>@8O: $currentDir" -ForegroundColor Cyan
Write-Host ""

# @>25@:0 Docker
Write-Host "@>25@:0 Docker..." -ForegroundColor Yellow
try {
    docker --version
    Write-Host "Docker =0945=!" -ForegroundColor Green
} catch {
    Write-Host "H81:0: Docker =5 =0945=. #AB0=>28B5 Docker Desktop 8 ?>?@>1C9B5 A=>20." -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "#AB0=>2:0 Laravel G5@57 Docker..." -ForegroundColor Yellow
Write-Host "-B> <>65B 70=OBL =5A:>;L:> <8=CB ?@8 ?5@2>< 70?CA:5 (A:0G820=85 >1@07>2)" -ForegroundColor Cyan
Write-Host ""

# #40;8BL 2@5<5==CN 48@5:B>@8N 5A;8 5ABL
if (Test-Path "tmp") {
    Remove-Item -Path "tmp" -Recurse -Force
}

# !>740BL Laravel ?@>5:B 2> 2@5<5==>9 48@5:B>@88
docker run --rm `
    -v "${currentDir}:/app" `
    -w /app `
    laravelsail/php84-composer:latest `
    composer create-project --prefer-dist laravel/laravel tmp "11.*"

if ($LASTEXITCODE -ne 0) {
    Write-Host "H81:0 ?@8 A>740=88 Laravel ?@>5:B0" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "5@5<5I5=85 D09;>2..." -ForegroundColor Yellow

# 5@5<5AB8BL D09;K 87 tmp 2 B5:CICN 48@5:B>@8N
Get-ChildItem -Path "tmp" -Force | ForEach-Object {
    if ($_.Name -notin @('docker-compose.yml', '.env')) {
        Move-Item -Path $_.FullName -Destination $currentDir -Force
    }
}

# #40;8BL 2@5<5==CN 48@5:B>@8N
Remove-Item -Path "tmp" -Recurse -Force

Write-Host "$09;K ?5@5<5I5=K!" -ForegroundColor Green
Write-Host ""

# #AB0=>28BL Sanctum
Write-Host "#AB0=>2:0 Laravel Sanctum..." -ForegroundColor Yellow
docker run --rm `
    -v "${currentDir}:/app" `
    -w /app `
    laravelsail/php84-composer:latest `
    composer require laravel/sanctum

Write-Host ""
Write-Host "5=5@0F8O APP_KEY..." -ForegroundColor Yellow

# 5=5@8@>20BL APP_KEY
$envContent = Get-Content -Path ".env" -Raw
$newKey = docker run --rm `
    -v "${currentDir}:/app" `
    -w /app `
    laravelsail/php84-composer:latest `
    php artisan key:generate --show

# 0<5=8BL APP_KEY= =0 APP_KEY==>2K9_:;NG
$envContent = $envContent -replace 'APP_KEY=', "APP_KEY=$newKey"
Set-Content -Path ".env" -Value $envContent

Write-Host "APP_KEY A>740=!" -ForegroundColor Green
Write-Host ""
Write-Host "=== #AB0=>2:0 7025@H5=0! ===" -ForegroundColor Green
Write-Host ""
Write-Host "!;54CNI85 H038:" -ForegroundColor Cyan
Write-Host "1. 0?CAB8B5: docker-compose up -d" -ForegroundColor White
Write-Host "2. K?>;=8B5 <83@0F88: docker-compose exec laravel php artisan migrate" -ForegroundColor White
Write-Host "3. API 1C45B 4>ABC?5= ?> 04@5AC: http://localhost" -ForegroundColor White
Write-Host ""
