# KFA Agentic Layer Guide

Руководство по использованию Agentic Development Layer в проекте KFA.

## Обзор

KFA использует концепцию **Agentic Development** - подход, где AI агенты помогают разрабатывать и поддерживать проект, следуя заранее определенным шаблонам и workflows.

## Архитектура

```
kfa-6-alpha/
├── .claude/commands/        # Slash-команды для агентов
│   ├── kfa-add-feature.md
│   ├── kfa-deploy.md
│   ├── kfa-debug.md
│   ├── kfa-fix-db.md
│   └── kfa-test.md
├── adws/                    # AI Developer Workflows
│   ├── adw_modules/         # Базовые модули
│   │   └── agent.py         # Ядро выполнения Claude Code
│   ├── adw_kfa_test.py      # Workflow для тестирования
│   ├── adw_kfa_deploy.py    # Workflow для деплоя
│   ├── adw_kfa_add_feature.py # Workflow для добавления фич
│   ├── adw_prompt.py        # Выполнение ad-hoc промптов
│   ├── adw_slash_command.py # Выполнение slash команд
│   └── adw_chore_implement.py # Планирование + реализация
├── agent-tools/             # Легковесные инструменты
│   ├── db/                  # Database operations
│   ├── deploy/              # Deployment tools
│   ├── supabase/            # Supabase operations
│   ├── test/                # Testing tools
│   └── vercel/              # Vercel operations
├── specs/                   # Спецификации и планы
│   ├── chore-*.md           # Планы задач
│   └── template-chore.md    # Шаблон задачи
└── agents/                  # Выходные данные агентов
    └── {adw_id}/            # Результаты работы workflow
        └── {agent_name}/    # Результаты конкретного агента
```

## Быстрый старт

### 1. Установка

```bash
# Установить uv (если не установлен)
# Windows:
powershell -c "irm https://astral.sh/uv/install.ps1 | iex"

# Linux/Mac:
curl -LsSf https://astral.sh/uv/install.sh | sh

# Установить зависимости
npm install
```

### 2. Настройка

Создайте `.env` файл:

```bash
ANTHROPIC_API_KEY=your_api_key_here
CLAUDE_CODE_PATH=claude
```

## Использование

### Agent Tools (Легковесные инструменты)

Быстрые операции без использования AI:

```bash
# Проверка базы данных
node agent-tools/supabase/test-connection.js

# Проверка окружения
node agent-tools/deploy/verify-env.js

# Сборка frontend
node agent-tools/deploy/build-frontend.js

# Health check
node agent-tools/deploy/health-check.js --url=https://kfa-website.vercel.app
```

См. [agent-tools/QUICK-REFERENCE.md](agent-tools/QUICK-REFERENCE.md) для полного списка.

### AI Developer Workflows (ADWs)

Автоматизированные workflows с использованием AI:

#### Тестирование

```bash
# Полный набор тестов
./adws/adw_kfa_test.py

# Быстрая проверка
./adws/adw_kfa_test.py --quick

# С подробным выводом
./adws/adw_kfa_test.py --verbose
```

#### Деплой

```bash
# Полный деплой с проверками
./adws/adw_kfa_deploy.py

# Деплой без тестов
./adws/adw_kfa_deploy.py --skip-tests

# Принудительный деплой
./adws/adw_kfa_deploy.py --force
```

#### Добавление новой фичи

```bash
# Автоматическое добавление фичи
./adws/adw_kfa_add_feature.py "Add member registration form"

# С моделью Opus для сложных фич
./adws/adw_kfa_add_feature.py "Add event calendar view" --model opus
```

#### Ad-hoc промпты

```bash
# Выполнение произвольного промпта
./adws/adw_prompt.py "Fix TypeScript errors in kfa-website/src"

# С моделью Opus
./adws/adw_prompt.py "Refactor database schema" --model opus
```

#### Slash команды

```bash
# Исправление базы данных
./adws/adw_slash_command.py /kfa-fix-db "RLS policy blocking news access"

# Отладка проблемы
./adws/adw_slash_command.py /kfa-debug "Images not loading in production"

# Тестирование
./adws/adw_slash_command.py /kfa-test
```

### Slash Commands

Используйте напрямую в Claude Code CLI:

```bash
# В интерактивном режиме Claude Code
claude

# Затем используйте команды:
/kfa-fix-db
/kfa-add-feature
/kfa-deploy
/kfa-debug
/kfa-test
```

## Доступные Slash Commands

### `/kfa-fix-db`

Исправление проблем с базой данных:

- RLS policies
- Отсутствующие колонки/таблицы
- Проблемы с доступом
- Несоответствия типов

**Пример:**

```
/kfa-fix-db RLS policy blocking news access for authenticated users
```

### `/kfa-add-feature`

Добавление новой фичи:

- Database migration
- TypeScript types
- API functions
- React components
- Dashboard integration
- Tests

**Пример:**

```
/kfa-add-feature Add member registration form with email validation
```

### `/kfa-deploy`

Деплой приложения:

- Pre-deployment checks
- Build verification
- Deployment execution
- Post-deployment validation

**Пример:**

```
/kfa-deploy
```

### `/kfa-debug`

Отладка проблем:

- Frontend errors
- Backend issues
- Database problems
- Deployment failures

**Пример:**

```
/kfa-debug Images not loading in partners section
```

### `/kfa-test`

Тестирование:

- Unit tests
- E2E tests
- API tests
- Manual testing checklists

**Пример:**

```
/kfa-test
```

## Workflows

### Типичный workflow разработки

1. **Создание спецификации:**

```bash
./adws/adw_slash_command.py /chore "Add photo gallery to events"
# Создает specs/chore-abc12345-photo-gallery.md
```

2. **Реализация фичи:**

```bash
./adws/adw_kfa_add_feature.py "Add photo gallery to events"
# Автоматически создает все необходимые компоненты
```

3. **Тестирование:**

```bash
./adws/adw_kfa_test.py
# Проверяет все аспекты приложения
```

4. **Деплой:**

```bash
./adws/adw_kfa_deploy.py
# Деплоит с проверками
```

### Workflow исправления бага

1. **Диагностика:**

```bash
./adws/adw_slash_command.py /kfa-debug "Partners section shows empty logos"
```

2. **Исправление:**

```bash
# Агент предложит исправления
# Или используйте /kfa-fix-db если проблема в БД
```

3. **Тестирование:**

```bash
./adws/adw_kfa_test.py --quick
```

4. **Деплой:**

```bash
./adws/adw_kfa_deploy.py
```

## Best Practices

### 1. Используйте правильный инструмент

- **Agent Tools** - для быстрых операций без AI
- **ADWs** - для комплексных workflows с AI
- **Slash Commands** - для интерактивной работы

### 2. Модель выбора

- **Sonnet** (default) - для большинства задач
- **Opus** - для сложных архитектурных решений

### 3. Тестирование

Всегда тестируйте перед деплоем:

```bash
./adws/adw_kfa_test.py
```

### 4. Версионирование

Коммитьте specs для истории:

```bash
git add specs/chore-abc12345-my-feature.md
git commit -m "Add spec for my-feature"
```

### 5. Документация

Обновляйте документацию при добавлении фич.

## Observability

Все workflows сохраняют результаты:

```
agents/
└── {adw_id}/                    # Уникальный ID workflow
    └── {agent_name}/            # Имя агента
        ├── cc_raw_output.jsonl  # Полный JSONL вывод
        ├── cc_raw_output.json   # Парсенный JSON массив
        ├── cc_final_object.json # Финальный результат
        └── prompts/             # Сохраненные промпты
            └── {command}.txt
```

## Troubleshooting

### Claude Code не установлен

```bash
# Установите Claude Code CLI
# Следуйте инструкциям на https://docs.claude.com/
```

### Ошибки uv

```bash
# Переустановите uv
curl -LsSf https://astral.sh/uv/install.sh | sh
```

### Permissions errors

```bash
# Сделайте workflows исполняемыми
chmod +x adws/*.py
```

### Workflow таймаут

Увеличьте таймаут в `adws/adw_modules/agent.py`:

```python
timeout=600  # 10 минут
```

## Расширение

### Создание нового Workflow

1. Создайте файл `adws/adw_my_workflow.py`:

```python
#!/usr/bin/env -S uv run --quiet --script
# /// script
# dependencies = [
#   "pydantic",
#   "python-dotenv",
#   "rich"
# ]
# ///
"""My custom workflow"""

import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent / "adw_modules"))

from agent import execute_template, generate_short_id

def main():
    # Ваша логика
    pass

if __name__ == "__main__":
    main()
```

2. Сделайте исполняемым:

```bash
chmod +x adws/adw_my_workflow.py
```

### Создание новой Slash Command

1. Создайте `.claude/commands/my-command.md`:

```markdown
# My Custom Command

Description of what this command does.

## Context

...

## Your Task

...
```

2. Используйте:

```bash
./adws/adw_slash_command.py /my-command "arguments"
```

## Дополнительные ресурсы

- [Agent Tools Guide](AGENT-TOOLS-GUIDE.md) - Детальное руководство по agent-tools
- [Agent Tools Quick Reference](agent-tools/QUICK-REFERENCE.md) - Быстрая справка
- [ADWs README](adws/README.md) - Документация по workflows
- [Specs README](specs/README.md) - Формат спецификаций
- [TAC-8 Examples](tac-8/) - Примеры из TAC-8

## Контакты

Для вопросов и предложений создавайте Issues или обращайтесь к команде разработки KFA.
