# AI Developer Workflows (ADWs) для KFA

Директория `adws/` содержит AI Developer Workflows - исполняемые Python скрипты для программной оркестрации агентов Claude Code.

## Структура

```
adws/
├── adw_modules/              # Базовые модули
│   ├── agent.py             # Ядро выполнения Claude Code
│   └── README.md            # Документация модулей
├── adw_prompt.py            # Прямое выполнение промптов
├── adw_slash_command.py     # Выполнение slash команд
└── adw_chore_implement.py   # Workflow: планирование + реализация
```

## Быстрый старт

### 1. Установка зависимостей

Скрипты используют `uv` для управления зависимостями:

```bash
# Установить uv (если еще не установлен)
# Windows:
powershell -c "irm https://astral.sh/uv/install.ps1 | iex"

# Linux/Mac:
curl -LsSf https://astral.sh/uv/install.sh | sh
```

### 2. Настройка окружения

Создайте `.env` файл в корне проекта:

```bash
ANTHROPIC_API_KEY=your_api_key_here
CLAUDE_CODE_PATH=claude
```

### 3. Использование

#### Выполнение ad-hoc промпта:

```bash
./adws/adw_prompt.py "List all TypeScript files in kfa-website/src"
```

#### Выполнение slash команды:

```bash
./adws/adw_slash_command.py /chore "Add logging to authentication"
```

#### Полный workflow (планирование + реализация):

```bash
./adws/adw_chore_implement.py "Add user profile photo upload"
```

## Outputs

Все выполнения сохраняют outputs в `agents/{adw_id}/`:

```
agents/
└── abc12345/                # Уникальный ID выполнения
    ├── planner/             # Outputs агента планирования
    │   ├── cc_raw_output.jsonl
    │   ├── cc_final_object.json
    │   └── custom_summary_output.json
    └── workflow_summary.json
```

## Интеграция с существующими инструментами

ADW скрипты работают вместе с:

- `.claude/commands/` - Slash команды (chore, implement, и т.д.)
- `agent-tools/` - Легковесные инструменты для операций
- `specs/` - Спецификации и планы задач

## Примеры для KFA

### Добавление новой фичи:

```bash
# 1. Создать план
./adws/adw_slash_command.py /chore "Add news filtering by category"

# 2. Реализовать план
./adws/adw_slash_command.py /implement specs/chore-xyz-news-filtering.md
```

### Исправление бага:

```bash
# Один workflow для планирования и реализации
./adws/adw_chore_implement.py "Fix CORS issue in authentication endpoint"
```

## Дополнительная информация

- [Руководство по Agent Tools](../agent-tools/README.md)
- [Quick Reference](../agent-tools/QUICK-REFERENCE.md)
- [План агентной разработки](../KFA-AGENTIC-DEVELOPMENT-PLAN.md)
