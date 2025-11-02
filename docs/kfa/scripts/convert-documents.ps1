# ================================================================
# СКРИПТ КОНВЕРТАЦИИ ДОКУМЕНТОВ КФА (PowerShell)
# ================================================================
# Автоматическая конвертация Markdown → PDF, DOCX
# Создание архивов для скачивания
# ================================================================

# Остановка при ошибке
$ErrorActionPreference = "Stop"

# ================================================================
# НАСТРОЙКИ
# ================================================================

# Директории
$DOCS_DIR = Split-Path -Parent $PSScriptRoot
$OUTPUT_DIR = Join-Path $DOCS_DIR "output"
$PDF_DIR = Join-Path $OUTPUT_DIR "pdf"
$DOCX_DIR = Join-Path $OUTPUT_DIR "docx"
$ARCHIVES_DIR = Join-Path $OUTPUT_DIR "archives"

# Создание выходных директорий
$directories = @(
    (Join-Path $PDF_DIR "charter"),
    (Join-Path $PDF_DIR "regulations"),
    (Join-Path $PDF_DIR "web"),
    (Join-Path $PDF_DIR "forms"),
    (Join-Path $DOCX_DIR "charter"),
    (Join-Path $DOCX_DIR "regulations"),
    (Join-Path $DOCX_DIR "web"),
    (Join-Path $DOCX_DIR "forms"),
    $ARCHIVES_DIR
)

foreach ($dir in $directories) {
    if (-not (Test-Path $dir)) {
        New-Item -ItemType Directory -Path $dir -Force | Out-Null
    }
}

# Лог файл
$LOG_FILE = Join-Path $OUTPUT_DIR "conversion.log"
"=== Начало конвертации: $(Get-Date) ===" | Out-File -FilePath $LOG_FILE

# ================================================================
# ФУНКЦИИ ВЫВОДА
# ================================================================

function Write-Info {
    param([string]$Message)
    Write-Host "[INFO] $Message" -ForegroundColor Blue
}

function Write-Success {
    param([string]$Message)
    Write-Host "[SUCCESS] $Message" -ForegroundColor Green
}

function Write-Warning {
    param([string]$Message)
    Write-Host "[WARNING] $Message" -ForegroundColor Yellow
}

function Write-Error-Custom {
    param([string]$Message)
    Write-Host "[ERROR] $Message" -ForegroundColor Red
}

# ================================================================
# ПРОВЕРКА ЗАВИСИМОСТЕЙ
# ================================================================

Write-Info "Проверка зависимостей..."

# Проверка pandoc
try {
    $null = Get-Command pandoc -ErrorAction Stop
    Write-Success "pandoc установлен"
} catch {
    Write-Error-Custom "pandoc не установлен. Скачайте с https://pandoc.org/installing.html"
    exit 1
}

# Проверка 7-Zip (для создания архивов)
$7zipPath = "C:\Program Files\7-Zip\7z.exe"
if (-not (Test-Path $7zipPath)) {
    Write-Warning "7-Zip не найден. Архивы будут созданы с помощью Compress-Archive"
    $use7zip = $false
} else {
    Write-Success "7-Zip установлен"
    $use7zip = $true
}

# ================================================================
# ФУНКЦИИ КОНВЕРТАЦИИ
# ================================================================

function Convert-ToPDF {
    param(
        [string]$InputFile,
        [string]$OutputFile
    )

    $fileName = Split-Path -Leaf $InputFile
    Write-Info "Конвертация в PDF: $fileName"

    try {
        & pandoc $InputFile `
            -o $OutputFile `
            --pdf-engine=xelatex `
            -V geometry:margin=2cm `
            -V fontsize=12pt `
            -V documentclass=article `
            -V lang=ru `
            --toc `
            --toc-depth=3 `
            2>> $LOG_FILE

        Write-Success "PDF создан: $(Split-Path -Leaf $OutputFile)"
    } catch {
        Write-Error-Custom "Ошибка при создании PDF: $fileName"
        $_.Exception.Message | Out-File -Append -FilePath $LOG_FILE
    }
}

function Convert-ToDOCX {
    param(
        [string]$InputFile,
        [string]$OutputFile
    )

    $fileName = Split-Path -Leaf $InputFile
    Write-Info "Конвертация в DOCX: $fileName"

    try {
        & pandoc $InputFile `
            -o $OutputFile `
            -V lang=ru `
            --toc `
            --toc-depth=3 `
            2>> $LOG_FILE

        Write-Success "DOCX создан: $(Split-Path -Leaf $OutputFile)"
    } catch {
        Write-Error-Custom "Ошибка при создании DOCX: $fileName"
        $_.Exception.Message | Out-File -Append -FilePath $LOG_FILE
    }
}

# ================================================================
# КОНВЕРТАЦИЯ УЧРЕДИТЕЛЬНЫХ ДОКУМЕНТОВ
# ================================================================

Write-Info "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
Write-Info "КОНВЕРТАЦИЯ УЧРЕДИТЕЛЬНЫХ ДОКУМЕНТОВ (8 документов)"
Write-Info "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

Set-Location $DOCS_DIR

$charterDocs = @(
    "Устав-КФА-2025-10-23.md",
    "Положение-о-членстве-КФА.md",
    "Приложения-к-Положению-о-членстве-КФА.md",
    "Базовые-стандарты-профессиональной-деятельности-КФА.md",
    "Кодекс-профессиональной-этики-КФА.md",
    "Регламент-дисциплинарного-производства-КФА.md",
    "Регламент-работы-Совета-КФА.md",
    "НАВИГАТОР-ДОКУМЕНТОВ-КФА.md"
)

foreach ($doc in $charterDocs) {
    $fullPath = Join-Path $DOCS_DIR $doc
    if (Test-Path $fullPath) {
        $baseName = [System.IO.Path]::GetFileNameWithoutExtension($doc)
        Convert-ToPDF -InputFile $fullPath -OutputFile (Join-Path $PDF_DIR "charter\$baseName.pdf")
        Convert-ToDOCX -InputFile $fullPath -OutputFile (Join-Path $DOCX_DIR "charter\$baseName.docx")
    } else {
        Write-Warning "Файл не найден: $doc"
    }
}

# ================================================================
# КОНВЕРТАЦИЯ РЕГУЛИРУЮЩИХ ПОЛОЖЕНИЙ
# ================================================================

Write-Info "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
Write-Info "КОНВЕРТАЦИЯ РЕГУЛИРУЮЩИХ ПОЛОЖЕНИЙ (6 документов)"
Write-Info "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

$regulationDocs = @(
    "Положение-о-сертификации-специалистов-КФА.md",
    "Положение-о-непрерывном-профессиональном-образовании-КФА.md",
    "Положение-о-финансово-хозяйственной-деятельности-КФА.md",
    "Дополнительные-положения-КФА.md"
)

foreach ($doc in $regulationDocs) {
    $fullPath = Join-Path $DOCS_DIR $doc
    if (Test-Path $fullPath) {
        $baseName = [System.IO.Path]::GetFileNameWithoutExtension($doc)
        Convert-ToPDF -InputFile $fullPath -OutputFile (Join-Path $PDF_DIR "regulations\$baseName.pdf")
        Convert-ToDOCX -InputFile $fullPath -OutputFile (Join-Path $DOCX_DIR "regulations\$baseName.docx")
    } else {
        Write-Warning "Файл не найден: $doc"
    }
}

# ================================================================
# КОНВЕРТАЦИЯ ВЕБ-ДОКУМЕНТОВ
# ================================================================

Write-Info "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
Write-Info "КОНВЕРТАЦИЯ ВЕБ-ДОКУМЕНТОВ (2 документа)"
Write-Info "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

Set-Location (Join-Path $DOCS_DIR "web")

$webDocs = @(
    "Политика-конфиденциальности-сайта-КФА.md",
    "Пользовательское-соглашение-сайта-КФА.md"
)

foreach ($doc in $webDocs) {
    if (Test-Path $doc) {
        $baseName = [System.IO.Path]::GetFileNameWithoutExtension($doc)
        Convert-ToPDF -InputFile $doc -OutputFile (Join-Path $PDF_DIR "web\$baseName.pdf")
        Convert-ToDOCX -InputFile $doc -OutputFile (Join-Path $DOCX_DIR "web\$baseName.docx")
    } else {
        Write-Warning "Файл не найден: $doc"
    }
}

# ================================================================
# КОНВЕРТАЦИЯ ОПЕРАЦИОННЫХ ФОРМ
# ================================================================

Write-Info "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
Write-Info "КОНВЕРТАЦИЯ ОПЕРАЦИОННЫХ ФОРМ (10 форм в 4 файлах)"
Write-Info "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

Set-Location (Join-Path $DOCS_DIR "forms")

$formDocs = @(
    "Соглашение-о-конфиденциальности-NDA.md",
    "Договор-о-членстве-в-КФА.md",
    "Формы-для-образования-и-мероприятий-КФА.md",
    "Формы-для-сертификации-специалистов-КФА.md"
)

foreach ($doc in $formDocs) {
    if (Test-Path $doc) {
        $baseName = [System.IO.Path]::GetFileNameWithoutExtension($doc)
        Convert-ToPDF -InputFile $doc -OutputFile (Join-Path $PDF_DIR "forms\$baseName.pdf")
        Convert-ToDOCX -InputFile $doc -OutputFile (Join-Path $DOCX_DIR "forms\$baseName.docx")
    } else {
        Write-Warning "Файл не найден: $doc"
    }
}

# ================================================================
# СОЗДАНИЕ АРХИВОВ
# ================================================================

Write-Info "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
Write-Info "СОЗДАНИЕ АРХИВОВ ДЛЯ СКАЧИВАНИЯ"
Write-Info "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

Set-Location $OUTPUT_DIR

function Create-Archive {
    param(
        [string]$Source,
        [string]$Destination,
        [string]$Name
    )

    Write-Info "Создание архива: $Name..."

    if ($use7zip) {
        & $7zipPath a -tzip $Destination $Source -r | Out-File -Append -FilePath $LOG_FILE
    } else {
        Compress-Archive -Path $Source -DestinationPath $Destination -Force
    }

    Write-Success "Создан: $(Split-Path -Leaf $Destination)"
}

# Полные архивы
Create-Archive -Source (Join-Path $PDF_DIR "*") `
    -Destination (Join-Path $ARCHIVES_DIR "KFA-Documents-Full-PDF.zip") `
    -Name "Полный архив PDF"

Create-Archive -Source (Join-Path $DOCX_DIR "*") `
    -Destination (Join-Path $ARCHIVES_DIR "KFA-Documents-Full-DOCX.zip") `
    -Name "Полный архив DOCX"

# Учредительные документы
Create-Archive -Source (Join-Path $PDF_DIR "charter\*") `
    -Destination (Join-Path $ARCHIVES_DIR "KFA-Charter-Documents-PDF.zip") `
    -Name "Учредительные документы (PDF)"

Create-Archive -Source (Join-Path $DOCX_DIR "charter\*") `
    -Destination (Join-Path $ARCHIVES_DIR "KFA-Charter-Documents-DOCX.zip") `
    -Name "Учредительные документы (DOCX)"

# Регулирующие положения
Create-Archive -Source (Join-Path $PDF_DIR "regulations\*") `
    -Destination (Join-Path $ARCHIVES_DIR "KFA-Regulations-PDF.zip") `
    -Name "Регулирующие положения (PDF)"

Create-Archive -Source (Join-Path $DOCX_DIR "regulations\*") `
    -Destination (Join-Path $ARCHIVES_DIR "KFA-Regulations-DOCX.zip") `
    -Name "Регулирующие положения (DOCX)"

# Операционные формы
Create-Archive -Source (Join-Path $PDF_DIR "forms\*") `
    -Destination (Join-Path $ARCHIVES_DIR "KFA-Forms-PDF.zip") `
    -Name "Операционные формы (PDF)"

Create-Archive -Source (Join-Path $DOCX_DIR "forms\*") `
    -Destination (Join-Path $ARCHIVES_DIR "KFA-Forms-DOCX.zip") `
    -Name "Операционные формы (DOCX)"

# ================================================================
# СТАТИСТИКА
# ================================================================

Write-Info "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
Write-Info "СТАТИСТИКА КОНВЕРТАЦИИ"
Write-Info "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

$pdfCount = (Get-ChildItem -Path $PDF_DIR -Filter "*.pdf" -Recurse).Count
$docxCount = (Get-ChildItem -Path $DOCX_DIR -Filter "*.docx" -Recurse).Count
$archiveCount = (Get-ChildItem -Path $ARCHIVES_DIR -Filter "*.zip").Count

Write-Success "Создано PDF файлов: $pdfCount"
Write-Success "Создано DOCX файлов: $docxCount"
Write-Success "Создано архивов: $archiveCount"

# Размеры архивов
Write-Info ""
Write-Info "Размеры архивов:"
Get-ChildItem -Path $ARCHIVES_DIR -Filter "*.zip" | ForEach-Object {
    $size = "{0:N2} MB" -f ($_.Length / 1MB)
    Write-Host "  " -NoNewline
    Write-Host "✓" -ForegroundColor Green -NoNewline
    Write-Host " $($_.Name.PadRight(45)) $size"
}

# ================================================================
# ЗАВЕРШЕНИЕ
# ================================================================

Write-Info ""
Write-Info "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
Write-Success "КОНВЕРТАЦИЯ ЗАВЕРШЕНА УСПЕШНО!"
Write-Info "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

Write-Info ""
Write-Info "Результаты сохранены в:"
Write-Info "  📁 PDF: $PDF_DIR"
Write-Info "  📁 DOCX: $DOCX_DIR"
Write-Info "  📦 Архивы: $ARCHIVES_DIR"
Write-Info "  📋 Лог: $LOG_FILE"

"=== Завершение конвертации: $(Get-Date) ===" | Out-File -Append -FilePath $LOG_FILE

Write-Info ""
Write-Success "Все файлы готовы для загрузки на веб-сайт КФА!"

# Пауза для просмотра результатов
Write-Host ""
Write-Host "Нажмите любую клавишу для выхода..." -ForegroundColor Cyan
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
