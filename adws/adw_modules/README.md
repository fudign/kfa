# ADW Modules

Базовые модули для AI Developer Workflows.

## Модули

### agent.py

Ядро для программного выполнения Claude Code CLI.

**Основные компоненты:**

1. **AgentPromptRequest** - Конфигурация промпта:

   ```python
   request = AgentPromptRequest(
       prompt="List all files",
       adw_id="abc12345",
       agent_name="explorer",
       model="sonnet",
       output_file="./agents/abc12345/explorer/cc_raw_output.jsonl"
   )
   ```

2. **AgentPromptResponse** - Ответ от агента:

   ```python
   response = prompt_claude_code(request)
   if response.success:
       print(response.output)
       print(f"Session: {response.session_id}")
   ```

3. **execute_template()** - Выполнение slash команд:
   ```python
   request = AgentTemplateRequest(
       agent_name="planner",
       slash_command="/chore",
       args=["Add feature"],
       adw_id="abc12345"
   )
   response = execute_template(request)
   ```

## Использование

```python
import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "adw_modules"))

from agent import (
    AgentPromptRequest,
    prompt_claude_code,
    generate_short_id
)

# Генерация уникального ID
adw_id = generate_short_id()

# Создание запроса
request = AgentPromptRequest(
    prompt="Your prompt here",
    adw_id=adw_id,
    agent_name="ops",
    model="sonnet",
    output_file=f"./agents/{adw_id}/ops/cc_raw_output.jsonl"
)

# Выполнение
response = prompt_claude_code(request)
```

## Особенности для KFA

- Адаптирован для Windows и Linux
- Поддержка .mcp.json конфигурации
- Автоматическое сохранение всех outputs
- Retry логика для надежности
- Безопасная фильтрация environment variables

## Outputs

Каждое выполнение создает:

- `cc_raw_output.jsonl` - Raw JSONL stream
- `cc_raw_output.json` - Parsed JSON array
- `cc_final_object.json` - Последнее сообщение (результат)
- `custom_summary_output.json` - Высокоуровневое резюме

## Дополнительно

См. примеры в `tac-8/tac8_app1__agent_layer_primitives/adws/` для advanced использования.
