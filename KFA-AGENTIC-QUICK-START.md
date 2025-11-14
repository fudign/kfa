# KFA Agentic Layer - Быстрый старт

Краткое руководство по использованию Agentic Development Layer в KFA.

## Установка

```bash
# 1. Установить uv (для workflows)
curl -LsSf https://astral.sh/uv/install.sh | sh

# 2. Настроить .env
echo "ANTHROPIC_API_KEY=your_key" > .env
echo "CLAUDE_CODE_PATH=claude" >> .env

# 3. Готово!
```

## Основные команды

### Тестирование

```bash
# Быстрая проверка
./adws/adw_kfa_test.py --quick

# Полные тесты
./adws/adw_kfa_test.py
```

### Деплой

```bash
# С проверками
./adws/adw_kfa_deploy.py

# Без тестов
./adws/adw_kfa_deploy.py --skip-tests
```

### Добавление фичи

```bash
./adws/adw_kfa_add_feature.py "Describe your feature"
```

### Проверка инфраструктуры

```bash
# База данных
node agent-tools/supabase/test-connection.js

# Frontend build
node agent-tools/deploy/build-frontend.js

# Deployment
node agent-tools/deploy/health-check.js --url=https://kfa-website.vercel.app
```

## Slash Commands (в Claude Code)

```
/kfa-fix-db     - Исправить проблемы БД
/kfa-add-feature - Добавить новую фичу
/kfa-deploy     - Деплой приложения
/kfa-debug      - Отладка проблем
/kfa-test       - Запустить тесты
```

## Типичные сценарии

### Добавить новую фичу

```bash
# 1. Создать фичу
./adws/adw_kfa_add_feature.py "Add event registration form"

# 2. Тестировать
./adws/adw_kfa_test.py

# 3. Деплоить
./adws/adw_kfa_deploy.py
```

### Исправить баг в БД

```bash
# 1. Диагностика
./adws/adw_slash_command.py /kfa-debug "News not showing"

# 2. Исправление
./adws/adw_slash_command.py /kfa-fix-db "RLS blocking news access"

# 3. Тестирование
./adws/adw_kfa_test.py --quick
```

### Деплой

```bash
# 1. Проверить локально
npm run dev

# 2. Запустить тесты
./adws/adw_kfa_test.py

# 3. Деплоить
./adws/adw_kfa_deploy.py
```

## Структура

```
.claude/commands/    - Slash команды для агентов
adws/               - AI workflows (Python скрипты)
agent-tools/        - Легковесные инструменты (Node.js)
specs/              - Спецификации задач
agents/             - Выходные данные workflows
```

## Полная документация

См. [KFA-AGENTIC-LAYER-GUIDE.md](KFA-AGENTIC-LAYER-GUIDE.md)
