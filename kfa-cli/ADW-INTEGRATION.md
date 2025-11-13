# ADW Integration - Python Workflows via KFA CLI

Интеграция AI Developer Workflows (Python) с KFA CLI для унифицированного доступа.

## Что такое ADW?

ADW (AI Developer Workflows) - исполняемые Python скрипты для программной оркестрации агентов Claude Code:

- **adw_prompt.py** - выполнение ad-hoc промптов
- **adw_slash_command.py** - выполнение slash команд из .claude/commands/
- **adw_chore_implement.py** - полный workflow (планирование + реализация)

## Установка

### 1. Установка uv (Python package manager)

**Windows:**

```bash
powershell -c "irm https://astral.sh/uv/install.ps1 | iex"
```

**Linux/Mac:**

```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
```

### 2. Настройка окружения

Создайте `.env` в корне проекта (если еще не создан):

```bash
ANTHROPIC_API_KEY=your_api_key_here
CLAUDE_CODE_PATH=claude
```

### 3. Проверка установки

```bash
kfa adw check
```

Вывод при успехе:

```
✓ ADW is available
uv version: 0.x.x
ADW scripts: adws/
```

## Команды

### kfa adw check

Проверка доступности ADW (uv, Python, скрипты).

```bash
kfa adw check
kfa adw check --format json
```

### kfa adw prompt

Выполнение ad-hoc промпта через Claude Code.

```bash
# Простой промпт
kfa adw prompt "List all TypeScript files in src/"

# С опциями
kfa adw prompt "Add logging" --model opus --agent-name logger

# Без повторной попытки при ошибке
kfa adw prompt "Quick test" --no-retry
```

**Опции:**

- `--model sonnet|opus` - модель Claude (default: sonnet)
- `--agent-name <name>` - имя агента для tracking
- `--no-retry` - отключить автоматический retry при ошибке
- `--format json` - вывод в JSON формате

**Результаты:**
Сохраняются в `agents/{adw_id}/{agent_name}/`:

- `cc_raw_output.jsonl` - streaming output от Claude Code
- `cc_raw_output.json` - все сообщения массивом
- `cc_final_object.json` - последнее сообщение (финальный результат)
- `custom_summary_output.json` - краткая сводка с метаданными

### kfa adw slash

Выполнение slash команд из `.claude/commands/`.

```bash
# Выполнить /chore
kfa adw slash /chore "Add authentication logging"

# Выполнить /implement с аргументом
kfa adw slash /implement specs/auth-plan.md

# С опциями
kfa adw slash /review --model opus --agent-name reviewer
```

**Опции:**

- `--model sonnet|opus` - модель Claude
- `--agent-name <name>` - имя агента
- `--format json` - JSON вывод

**Примеры slash команд:**

- `/chore` - создать план для задачи
- `/implement` - реализовать план из файла спецификации
- `/review` - ревью кода
- `/test` - написать тесты

### kfa adw chore

Полный workflow: планирование + реализация задачи.

```bash
# Простая задача
kfa adw chore "Add user profile photo upload"

# С опциями
kfa adw chore "Fix CORS issue in API" --model opus
```

**Опции:**

- `--model sonnet|opus` - модель Claude
- `--format json` - JSON вывод

**Что делает:**

1. Создает план задачи (planner agent)
2. Реализует план (implementer agent)
3. Сохраняет результаты обоих этапов

### kfa adw status

Показать статус последнего выполнения ADW.

```bash
kfa adw status
kfa adw status --format json
```

**Вывод:**

- ADW ID (уникальный идентификатор выполнения)
- Тип (Prompt/Slash Command)
- Статус (Success/Failed)
- Модель Claude
- Session ID
- Путь к результатам

## Примеры использования

### Пример 1: Быстрый анализ кодовой базы

```bash
kfa adw prompt "Analyze authentication flow in kfa-website/src"
```

### Пример 2: Создание новой фичи (полный цикл)

```bash
# Способ 1: Использовать chore workflow (все в одном)
kfa adw chore "Add news filtering by category"

# Способ 2: Раздельно (больше контроля)
kfa adw slash /chore "Add news filtering by category"
# Проверить план в specs/chore-{id}-news-filtering.md
kfa adw slash /implement specs/chore-{id}-news-filtering.md
```

### Пример 3: Исправление бага

```bash
# С Opus моделью для сложных задач
kfa adw chore "Fix memory leak in event listeners" --model opus
```

### Пример 4: Проверка результатов

```bash
# После выполнения команды
kfa adw status

# Просмотр результатов
cat agents/{adw_id}/*/custom_summary_output.json
```

### Пример 5: JSON workflow для автоматизации

```bash
# Выполнить и получить JSON
kfa adw prompt "List all API endpoints" --format json > result.json

# Обработать результат
node -e "const r = require('./result.json'); console.log(r.output);"
```

## Архитектура

```
KFA CLI (Node.js)
  │
  ├─ lib/python.js (PythonAdapter)
  │     │
  │     └─ spawn('uv', ['run', 'adw_script.py', ...])
  │
  └─ commands/adw/
        ├─ check.js     → Python availability
        ├─ prompt.js    → adw_prompt.py
        ├─ slash.js     → adw_slash_command.py
        ├─ chore.js     → adw_chore_implement.py
        └─ status.js    → Read latest result
```

**Преимущества интеграции:**

1. Единая точка входа (`kfa` command)
2. Консистентный интерфейс (все команды в одном стиле)
3. JSON output для всех команд (композиция)
4. Единая система кэширования (для Node.js команд)
5. Простая автоматизация

## Сравнение: KFA CLI vs Прямые ADW скрипты

### Прямой вызов ADW:

```bash
./adws/adw_prompt.py "List files" --model sonnet
```

### Через KFA CLI:

```bash
kfa adw prompt "List files" --model sonnet
```

**Плюсы KFA CLI:**

- Короче (не нужен полный путь)
- Единый интерфейс со всеми другими командами
- Консистентная обработка ошибок
- Встроенный `--format json` для всех команд
- Автоматическое определение project root

## Troubleshooting

### Ошибка: "ADW not available"

**Решение:** Установите uv:

```bash
# Windows
powershell -c "irm https://astral.sh/uv/install.ps1 | iex"

# Linux/Mac
curl -LsSf https://astral.sh/uv/install.sh | sh
```

### Ошибка: "Script not found"

**Решение:** Убедитесь, что запускаете команды из корня проекта KFA:

```bash
cd /path/to/kfa-6-alpha
kfa adw check
```

### Ошибка: "ANTHROPIC_API_KEY not found"

**Решение:** Создайте `.env` файл:

```bash
echo "ANTHROPIC_API_KEY=sk-ant-..." > .env
```

## Дополнительные ресурсы

- [ADW README](../adws/README.md) - подробная документация ADW
- [KFA CLI README](./README.md) - общая документация KFA CLI
- [Prime Prompts](./prime-prompts/) - альтернатива для простых задач
- [Agent Tools Guide](../agent-tools/QUICK-REFERENCE.md) - легковесные инструменты

## Когда использовать что?

### Используйте Prime Prompts (`kfa prime`):

- Нужен готовый промпт для копирования
- Работаете в AI ассистенте (Claude, ChatGPT)
- Быстрая подсказка без выполнения

### Используйте ADW (`kfa adw`):

- Автоматизация workflows
- Программная оркестрация агентов
- Нужны результаты в файлах (для дальнейшей обработки)
- Сложные multi-step операции

### Используйте Agent Tools (`agent-tools/`):

- Легковесные операции (backup, test)
- Не нужен Claude Code
- Простые скрипты без AI
