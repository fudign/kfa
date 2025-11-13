# Быстрый старт с ADW для проекта KFA

Пошаговая инструкция для начала работы с AI Developer Workflows.

## Что было сделано

✅ Создана базовая структура:

- `adws/` - Директория для AI Developer Workflows
- `specs/` - Директория для спецификаций и планов
- `agents/` - Директория для outputs агентов
- Документация в каждой директории

✅ Изучены примеры из tac-8:

- Agent Layer Primitives (базовые ADW)
- Multi-agent workflows
- Observability система

## Следующие шаги

### Шаг 1: Скопировать agent.py модуль (5 минут)

Скопируйте готовый модуль из tac-8:

```bash
# Скопировать agent.py
cp tac-8/tac8_app1__agent_layer_primitives/adws/adw_modules/agent.py adws/adw_modules/

# Скопировать базовые ADW скрипты
cp tac-8/tac8_app1__agent_layer_primitives/adws/adw_prompt.py adws/
cp tac-8/tac8_app1__agent_layer_primitives/adws/adw_slash_command.py adws/
cp tac-8/tac8_app1__agent_layer_primitives/adws/adw_chore_implement.py adws/
```

### Шаг 2: Установить uv (если еще нет) (2 минуты)

```bash
# Windows (PowerShell):
powershell -c "irm https://astral.sh/uv/install.ps1 | iex"

# После установки проверить:
uv --version
```

### Шаг 3: Настроить переменные окружения (1 минута)

Убедитесь что в `.env` есть:

```bash
ANTHROPIC_API_KEY=your_api_key_here
CLAUDE_CODE_PATH=claude
```

### Шаг 4: Сделать скрипты исполняемыми (только Linux/Mac)

```bash
chmod +x adws/*.py
```

На Windows можно просто запускать через `python` или `uv run`.

### Шаг 5: Тестовый запуск (2 минуты)

```bash
# Простой тест - список файлов
python adws/adw_prompt.py "List all markdown files in docs/"
```

Если все работает, вы увидите:

- Output в консоли
- Созданные файлы в `agents/{adw_id}/ops/`

## Использование

### Вариант 1: Прямое выполнение промпта

Для простых ad-hoc задач:

```bash
# Windows:
python adws/adw_prompt.py "Ваш промпт здесь"

# Linux/Mac:
./adws/adw_prompt.py "Ваш промпт здесь"
```

**Примеры:**

```bash
# Анализ кода
python adws/adw_prompt.py "Analyze authentication flow in kfa-website"

# Поиск ошибок
python adws/adw_prompt.py "Find potential security issues in API endpoints"

# Генерация кода
python adws/adw_prompt.py "Create a TypeScript interface for User model"
```

### Вариант 2: Slash команды

Для использования существующих templates:

```bash
# Создать план через /chore
python adws/adw_slash_command.py /chore "Add email notifications"

# Реализовать план через /implement
python adws/adw_slash_command.py /implement specs/chore-abc12345-email-notifications.md
```

### Вариант 3: Полный workflow

Для автоматического планирования + реализации:

```bash
# Одна команда делает все
python adws/adw_chore_implement.py "Add user profile photo upload feature"

# Что происходит:
# 1. Создается план (через /chore)
# 2. План сохраняется в specs/
# 3. Автоматически запускается реализация (через /implement)
# 4. Все outputs сохраняются в agents/{adw_id}/
```

## Примеры для проекта KFA

### Пример 1: Добавить новую фичу

```bash
# Задача: Добавить фильтрацию новостей по категориям
python adws/adw_chore_implement.py "Add news filtering by category in news page"

# Результат:
# - Создан specs/chore-xyz-news-filtering.md
# - Реализован код в kfa-website/src/
# - Все outputs в agents/xyz/
```

### Пример 2: Исправить баг

```bash
# Задача: Исправить CORS ошибку
python adws/adw_chore_implement.py "Fix CORS error in authentication API endpoint"

# Результат:
# - План создан и реализован
# - Изменения в kfa-backend/
```

### Пример 3: Обновить документацию

```bash
# Задача: Обновить README
python adws/adw_prompt.py "Update README.md with latest deployment instructions"
```

## Структура Outputs

После выполнения найдете outputs в `agents/{adw_id}/`:

```
agents/
└── abc12345/                    # Уникальный ID выполнения
    ├── planner/                 # Outputs планирования
    │   ├── cc_raw_output.jsonl  # Raw stream
    │   ├── cc_final_object.json # Результат
    │   └── custom_summary_output.json
    ├── builder/                 # Outputs реализации
    │   └── ...
    └── workflow_summary.json    # Общее резюме
```

**Для отладки:**

- Смотрите `cc_final_object.json` - финальный результат
- Смотрите `custom_summary_output.json` - краткое резюме
- Смотрите `cc_raw_output.jsonl` - полный лог (для debugging)

## Интеграция с Agent Tools

ADW отлично работает с существующими agent-tools:

```bash
# 1. Проверить состояние перед изменениями
node agent-tools/db/status.js > status-before.json
node agent-tools/test/run-e2e.js > tests-before.json

# 2. Выполнить изменения через ADW
python adws/adw_chore_implement.py "Add new feature"

# 3. Проверить состояние после
node agent-tools/db/status.js > status-after.json
node agent-tools/test/run-e2e.js > tests-after.json

# 4. Сравнить
diff status-before.json status-after.json
```

## Работа со Specs

### Создание Spec вручную

```bash
# 1. Скопировать template
cp specs/template-chore.md specs/chore-abc12345-my-task.md

# 2. Отредактировать
code specs/chore-abc12345-my-task.md

# 3. Реализовать
python adws/adw_slash_command.py /implement specs/chore-abc12345-my-task.md
```

### Создание Spec через агента

```bash
# Агент создаст spec автоматически
python adws/adw_slash_command.py /chore "Add photo upload functionality"

# Spec будет сохранен в specs/ с уникальным ID
```

## Troubleshooting

### Ошибка: "Claude Code CLI is not installed"

Установите Claude Code:

```bash
npm install -g @anthropic-ai/claude-code
```

### Ошибка: "uv: command not found"

Установите uv (см. Шаг 2 выше)

### Ошибка: Permission denied (Linux/Mac)

```bash
chmod +x adws/*.py
```

### Ошибка: ANTHROPIC_API_KEY not found

Добавьте в `.env`:

```bash
ANTHROPIC_API_KEY=your_key_here
```

## Best Practices

### 1. Используйте правильный инструмент

- **adw_prompt.py** - для быстрых ad-hoc задач
- **adw_slash_command.py** - для использования templates
- **adw_chore_implement.py** - для комплексных фич

### 2. Сохраняйте outputs

Outputs в `agents/` содержат ценную информацию:

- Для debugging
- Для понимания что сделал агент
- Для повтора успешных паттернов

### 3. Используйте Specs

Specs помогают:

- Структурировать мысли
- Дать агенту четкий план
- Документировать изменения

### 4. Комбинируйте с Agent Tools

```bash
# Pre-flight checks
node agent-tools/db/status.js
node agent-tools/test/run-e2e.js

# Make changes
python adws/adw_chore_implement.py "..."

# Post-flight verification
node agent-tools/test/run-e2e.js
```

## Дополнительные ресурсы

- [Полный план развития](KFA-AGENTIC-DEVELOPMENT-PLAN.md)
- [Agent Tools Quick Reference](agent-tools/QUICK-REFERENCE.md)
- [ADW README](adws/README.md)
- [Specs README](specs/README.md)
- [TAC-8 Examples](tac-8/)

## Следующие шаги

1. **Попробуйте простой пример:**

   ```bash
   python adws/adw_prompt.py "List all React components in kfa-website"
   ```

2. **Создайте первый spec:**

   ```bash
   python adws/adw_slash_command.py /chore "Your first task"
   ```

3. **Запустите полный workflow:**

   ```bash
   python adws/adw_chore_implement.py "Add a small feature"
   ```

4. **Изучите outputs** в `agents/{adw_id}/`

5. **Масштабируйте** - добавляйте больше workflows по мере необходимости

---

## Помощь

Если возникли вопросы или проблемы:

1. Проверьте outputs в `agents/{adw_id}/`
2. Посмотрите примеры в `tac-8/`
3. Проверьте документацию в `adws/README.md`

Успехов в агентной разработке! 🚀
