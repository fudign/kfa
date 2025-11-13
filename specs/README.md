# Specifications (Specs)

Директория для структурированных спецификаций и планов задач для агентов.

## Структура

```
specs/
├── chore-{id}-{name}.md      # Планы задач
├── feature-{name}.md         # Спецификации фич
└── deep_specs/               # Комплексные архитектурные спеки
```

## Формат Spec файла

### Chore (Задача)

```markdown
# Chore: {Title}

**ID:** chore-abc12345-add-logging
**Created:** 2025-11-11
**Status:** planned | in-progress | completed

## Context

Описание текущего состояния и почему нужна эта задача.

## Objective

Конкретная цель, что должно быть достигнуто.

## Implementation Plan

1. [ ] Шаг 1: Описание
2. [ ] Шаг 2: Описание
3. [ ] Шаг 3: Описание

## Files to Modify

- `kfa-website/src/components/Auth.tsx`
- `kfa-backend/app/Http/Controllers/AuthController.php`

## Tests

- [ ] Unit tests для компонента Auth
- [ ] E2E test для auth flow
- [ ] Integration test для API endpoint

## Dependencies

- Requires: user authentication system
- Blocks: user profile feature

## Notes

Дополнительные заметки, ссылки, etc.
```

### Feature (Фича)

```markdown
# Feature: {Name}

**Version:** 1.0
**Priority:** High | Medium | Low

## Description

Подробное описание фичи.

## User Stories

- As a {user}, I want {goal}, so that {benefit}
- ...

## Technical Requirements

- Frontend: React component with form validation
- Backend: Laravel API endpoint
- Database: New table for storing data

## Architecture

- Diagrams
- Data flow
- Component hierarchy

## Implementation Steps

1. Database migration
2. Backend API
3. Frontend UI
4. Tests
5. Documentation

## Testing Strategy

- Unit tests
- Integration tests
- E2E tests
- Manual testing checklist

## Rollout Plan

- Phase 1: Internal testing
- Phase 2: Beta users
- Phase 3: Full release
```

## Naming Convention

### Chores

`chore-{8-char-id}-{kebab-case-name}.md`

Примеры:

- `chore-a1b2c3d4-add-logging.md`
- `chore-x9y8z7w6-fix-cors-issue.md`
- `chore-m5n4k3j2-update-dependencies.md`

### Features

`feature-{kebab-case-name}.md`

Примеры:

- `feature-user-profile.md`
- `feature-news-filtering.md`
- `feature-photo-upload.md`

## Workflow

### 1. Создание Spec через ADW

```bash
# Автоматическое создание через /chore команду
./adws/adw_slash_command.py /chore "Add user profile photo upload"

# Создает: specs/chore-abc12345-user-photo-upload.md
```

### 2. Ручное создание

```bash
# Создать файл вручную
cp specs/template-chore.md specs/chore-abc12345-my-task.md

# Отредактировать
code specs/chore-abc12345-my-task.md
```

### 3. Реализация Spec

```bash
# Автоматическая реализация через /implement
./adws/adw_slash_command.py /implement specs/chore-abc12345-my-task.md
```

### 4. Полный Workflow

```bash
# Планирование + Реализация одной командой
./adws/adw_chore_implement.py "Add feature X"

# Создает spec и сразу реализует
```

## Интеграция с Git

Specs можно коммитить в git для истории:

```bash
# Коммит spec после создания
git add specs/chore-abc12345-my-task.md
git commit -m "Add spec for my-task"

# Коммит после реализации
git add .
git commit -m "Implement my-task (chore-abc12345)"
```

## Примеры для KFA

См. примеры в `tac-8/tac8_app1__agent_layer_primitives/specs/` для reference.

## Best Practices

1. **Детальность:** Чем подробнее spec, тем лучше агент выполнит
2. **Контекст:** Всегда указывайте текущее состояние
3. **Тесты:** Планируйте тесты заранее
4. **Зависимости:** Явно указывайте связи с другими задачами
5. **Обновления:** Обновляйте статус по мере выполнения
