# Chore: {Title Here}

**ID:** chore-{8-char-id}-{kebab-case-name}
**Created:** {YYYY-MM-DD}
**Status:** planned

## Context

Опишите текущее состояние проекта и почему нужна эта задача.

Например:
- Текущая система аутентификации работает, но нет логирования
- Пользователи сообщают о проблемах с входом
- Нужна возможность отслеживать ошибки

## Objective

Конкретная, измеримая цель задачи.

Например:
- Добавить логирование во все authentication endpoints
- Логи должны включать: timestamp, user ID, action, status
- Логи сохраняются в БД и доступны через admin panel

## Implementation Plan

1. [ ] Подготовка
   - [ ] Изучить текущий код аутентификации
   - [ ] Определить какие события логировать
   - [ ] Выбрать структуру логов

2. [ ] Backend
   - [ ] Создать migration для таблицы auth_logs
   - [ ] Добавить AuthLogger service
   - [ ] Интегрировать в AuthController

3. [ ] Frontend (если нужно)
   - [ ] Создать admin панель для просмотра логов
   - [ ] Добавить фильтрацию и поиск

4. [ ] Testing
   - [ ] Unit tests для AuthLogger
   - [ ] Integration tests для API endpoints
   - [ ] E2E tests для auth flow

5. [ ] Documentation
   - [ ] Обновить API docs
   - [ ] Добавить примеры использования

## Files to Modify

### Backend
- `kfa-backend/database/migrations/YYYY_MM_DD_create_auth_logs_table.php` (new)
- `kfa-backend/app/Services/AuthLogger.php` (new)
- `kfa-backend/app/Http/Controllers/AuthController.php` (modify)

### Frontend (если нужно)
- `kfa-website/src/pages/admin/AuthLogs.tsx` (new)
- `kfa-website/src/services/api.ts` (modify)

### Tests
- `kfa-backend/tests/Unit/AuthLoggerTest.php` (new)
- `kfa-website/tests/e2e/auth-logging.spec.ts` (new)

## Technical Details

### Database Schema

```sql
CREATE TABLE auth_logs (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NULL,
    action VARCHAR(50) NOT NULL,
    status VARCHAR(20) NOT NULL,
    ip_address VARCHAR(45) NOT NULL,
    user_agent TEXT,
    metadata JSON NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### API Endpoints (если нужно новые)

```
GET /api/admin/auth-logs
  - Query params: ?user_id, ?action, ?from_date, ?to_date
  - Response: paginated list of logs

GET /api/admin/auth-logs/{id}
  - Response: single log entry
```

## Tests

### Unit Tests
- [ ] AuthLogger::log() creates record in database
- [ ] AuthLogger::log() handles missing user_id
- [ ] AuthLogger::log() validates action types

### Integration Tests
- [ ] POST /api/login creates auth log on success
- [ ] POST /api/login creates auth log on failure
- [ ] POST /api/logout creates auth log

### E2E Tests
- [ ] Admin can view auth logs in panel
- [ ] Admin can filter logs by user
- [ ] Admin can filter logs by date range

## Dependencies

**Requires:**
- User authentication system (completed)
- Admin panel (completed)

**Blocks:**
- Security audit feature (planned)

## Success Criteria

- [ ] All authentication actions are logged
- [ ] Logs are viewable in admin panel
- [ ] All tests passing
- [ ] Documentation updated
- [ ] No performance degradation (response time < +10ms)

## Notes

- Consider log retention policy (e.g., keep for 90 days)
- May need to add log rotation/archival later
- Check GDPR compliance for storing user data

## Resources

- [Laravel Logging Docs](https://laravel.com/docs/logging)
- [Database Design Best Practices](...)
- Similar implementation in user-activity-tracker
