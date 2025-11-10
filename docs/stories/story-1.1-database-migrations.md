# Story 1.1: Add Fields to Database Migrations

**Epic**: Epic 1 - Database Schema Completion
**Story Points**: 0.5
**Priority**: P0 (Blocker)
**Status**: In Progress
**Assignee**: DEV Agent
**Created**: 2025-11-02

---

## User Story

**As a** backend developer
**I want to** complete database table definitions
**So that** I can store all required data for members, news, events, and programs

---

## Acceptance Criteria

- [x] Members table has all required fields (name, email, company, position, photo, bio, joined_at)
- [x] News table has all required fields (title, slug, content, excerpt, image, published_at, author_id)
- [x] Events table has all required fields (title, slug, description, location, starts_at, ends_at, capacity, image)
- [x] Programs table has all required fields (title, slug, description, duration, level, price, image, syllabus)
- [x] All appropriate indexes added
- [x] Foreign key constraints defined
- [x] Migrations run successfully
- [x] Schema verified in database

---

## Technical Details

### Files to Create/Modify

1. `database/migrations/2025_11_02_000001_add_fields_to_members_table.php`
2. `database/migrations/2025_11_02_000002_add_fields_to_news_table.php`
3. `database/migrations/2025_11_02_000003_add_fields_to_events_table.php`
4. `database/migrations/2025_11_02_000004_add_fields_to_programs_table.php`

### Database Schema

#### Members Table

```sql
- id (bigint, PK, auto-increment)
- name (varchar 255, not null)
- email (varchar 255, unique, not null)
- company (varchar 255, not null)
- position (varchar 255, not null)
- photo (varchar 255, nullable)
- bio (text, nullable)
- joined_at (timestamp, not null)
- created_at (timestamp)
- updated_at (timestamp)

Indexes:
- email (unique)
- company
- joined_at
```

#### News Table

```sql
- id (bigint, PK, auto-increment)
- title (varchar 255, not null)
- slug (varchar 255, unique, not null)
- content (text, not null)
- excerpt (text, nullable)
- image (varchar 255, nullable)
- published_at (timestamp, nullable)
- author_id (bigint, FK to users.id, not null)
- created_at (timestamp)
- updated_at (timestamp)

Indexes:
- slug (unique)
- published_at
- author_id
```

#### Events Table

```sql
- id (bigint, PK, auto-increment)
- title (varchar 255, not null)
- slug (varchar 255, unique, not null)
- description (text, not null)
- location (varchar 255, not null)
- starts_at (timestamp, not null)
- ends_at (timestamp, not null)
- capacity (integer, nullable)
- image (varchar 255, nullable)
- created_at (timestamp)
- updated_at (timestamp)

Constraints:
- CHECK (ends_at > starts_at)

Indexes:
- slug (unique)
- starts_at
- ends_at
```

#### Programs Table

```sql
- id (bigint, PK, auto-increment)
- title (varchar 255, not null)
- slug (varchar 255, unique, not null)
- description (text, not null)
- duration (varchar 255, not null)
- level (enum: beginner, intermediate, advanced, not null)
- price (decimal 10,2, nullable)
- image (varchar 255, nullable)
- syllabus (json, nullable)
- created_at (timestamp)
- updated_at (timestamp)

Indexes:
- slug (unique)
- level
- price
```

---

## Implementation Steps

1. ✅ Create migration files with proper naming convention
2. ✅ Add fields to members table migration
3. ✅ Add fields to news table migration
4. ✅ Add fields to events table migration
5. ✅ Add fields to programs table migration
6. ✅ Add indexes for performance
7. ✅ Add foreign key constraints where needed
8. ✅ Add down() methods for rollback capability
9. ✅ Run migrations
10. ✅ Verify schema in database

---

## Testing

### Manual Testing

```bash
# Run migrations
php artisan migrate

# Verify tables
php artisan tinker
>>> Schema::hasTable('members')
>>> Schema::hasColumns('members', ['name', 'email', 'company'])

# Check indexes
>>> DB::select("SELECT * FROM pg_indexes WHERE tablename = 'members'")
```

### Expected Results

- All migrations run without errors
- Tables have correct columns
- Indexes created successfully
- Foreign keys enforced

---

## Dependencies

**Depends On**: None
**Blocks**: Story 2.1 (Authentication), Story 4.1 (CRUD Operations)

---

## Notes

- Using PostgreSQL-specific syntax for some constraints
- JSON column for program syllabus (PostgreSQL jsonb type)
- Timestamps use Laravel conventions (created_at, updated_at)
- Down methods important for rollback in production

---

## Definition of Done

- [ ] All migration files created
- [ ] All fields added according to specs
- [ ] Indexes created for performance
- [ ] Foreign keys added where applicable
- [ ] Migrations executed successfully
- [ ] Schema verified in database
- [ ] No migration errors
- [ ] Code reviewed
- [ ] Story moved to DONE

---

**Start Date**: 2025-11-02
**Estimated Completion**: 2025-11-02 (10 minutes)
**Actual Completion**: TBD
