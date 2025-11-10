# Story 1.5: Run Migrations and Verify Schema - Summary

**Status:** Ready to Execute
**Date:** 2025-11-02
**Epic:** 1 - Database Schema Completion

---

## Created Migrations

### 1. Members Table Enhancement

**File:** `2025_11_02_000001_add_constraints_and_indexes_to_members_table.php`

**Changes:**

- ✅ Email: unique constraint + required
- ✅ Company: required
- ✅ Position: required
- ✅ Joined_at: required
- ✅ Indexes: email (via unique), company, joined_at

### 2. News Table Enhancement

**File:** `2025_11_02_000002_add_indexes_to_news_table.php`

**Changes:**

- ✅ Index on author_id
- ✅ Index on published_at DESC
- ✅ Foreign key CASCADE delete (changed from SET NULL)

### 3. Events Table Enhancement

**File:** `2025_11_02_000003_add_constraints_and_indexes_to_events_table.php`

**Changes:**

- ✅ Location: required
- ✅ Ends_at: required
- ✅ CHECK constraint: ends_at > starts_at
- ✅ Indexes: starts_at, ends_at
- ✅ Partial index on upcoming events

### 4. Programs Table Enhancement

**File:** `2025_11_02_000004_add_constraints_and_indexes_to_programs_table.php`

**Changes:**

- ✅ Duration: required
- ✅ Level: enum (beginner, intermediate, advanced)
- ✅ Syllabus: JSONB (PostgreSQL)
- ✅ Indexes: level, price

---

## How to Execute (When Docker is Available)

### Step 1: Start Docker Containers

```bash
cd kfa-backend
docker compose up -d
```

### Step 2: Run Migrations

```bash
docker compose exec kfa-api php artisan migrate
```

### Step 3: Check Migration Status

```bash
docker compose exec kfa-api php artisan migrate:status
```

Expected output should show all migrations executed, including the 4 new ones.

### Step 4: Verify Database Schema

**Check Members Table:**

```bash
docker compose exec kfa-pgsql psql -U sail -d kfa -c "\d members"
```

Verify:

- email is NOT NULL and has UNIQUE constraint
- company, position, joined_at are NOT NULL
- Indexes exist on email, company, joined_at

**Check News Table:**

```bash
docker compose exec kfa-pgsql psql -U sail -d kfa -c "\d news"
```

Verify:

- author_id has CASCADE delete
- Indexes exist on author_id, published_at

**Check Events Table:**

```bash
docker compose exec kfa-pgsql psql -U sail -d kfa -c "\d events"
```

Verify:

- location, ends_at are NOT NULL
- CHECK constraint exists: chk_events_dates
- Indexes exist on starts_at, ends_at
- Partial index exists: idx_events_upcoming

**Check Programs Table:**

```bash
docker compose exec kfa-pgsql psql -U sail -d kfa -c "\d programs"
```

Verify:

- duration is NOT NULL
- level is enum type
- syllabus is JSONB type
- Indexes exist on level, price

---

## Test Data Seeding (Optional)

Create a seeder to test the schema:

**File:** `database/seeders/TestDataSeeder.php`

```php
<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Member;
use App\Models\News;
use App\Models\Event;
use App\Models\Program;

class TestDataSeeder extends Seeder
{
    public function run(): void
    {
        // Create test user
        $user = User::create([
            'name' => 'Admin User',
            'email' => 'admin@kfa.kg',
            'password' => bcrypt('password123'),
        ]);

        // Create test member
        Member::create([
            'name' => 'Test Member',
            'email' => 'member@test.com',
            'company' => 'Test Company',
            'position' => 'Test Position',
            'joined_at' => now(),
        ]);

        // Create test news
        News::create([
            'title' => 'Test News',
            'slug' => 'test-news',
            'content' => 'Test content',
            'author_id' => $user->id,
            'published_at' => now(),
        ]);

        // Create test event
        Event::create([
            'title' => 'Test Event',
            'slug' => 'test-event',
            'description' => 'Test description',
            'location' => 'Test Location',
            'starts_at' => now()->addDay(),
            'ends_at' => now()->addDays(2),
        ]);

        // Create test program
        Program::create([
            'title' => 'Test Program',
            'slug' => 'test-program',
            'description' => 'Test description',
            'duration' => '3 months',
            'level' => 'beginner',
        ]);
    }
}
```

**Run seeder:**

```bash
docker compose exec kfa-api php artisan db:seed --class=TestDataSeeder
```

---

## Acceptance Criteria Checklist

- [ ] All 4 migrations execute without errors
- [ ] Database tables inspected and verified
- [ ] Indexes verified using `\d table_name`
- [ ] Foreign key relationships verified
- [ ] Test rollback executes cleanly
- [ ] Re-run migrations successfully
- [ ] Seeders can insert test data into all tables

---

## Troubleshooting

**If migrations fail:**

1. Check PostgreSQL is running: `docker compose ps`
2. Check database logs: `docker compose logs kfa-pgsql`
3. Verify connection: `docker compose exec kfa-api php artisan db:show`
4. Check migration files for syntax errors

**If constraint violations occur:**

- Ensure existing data meets new constraints before running migrations
- May need to add data cleanup step in migration up() method

**If rollback fails:**

- Check down() methods match up() operations
- Ensure foreign keys are dropped before columns
- Check index names match

---

## Status: ✅ READY

All migration files created and ready for execution. When Docker environment is available, follow the steps above to complete Story 1.5.

**Next Story:** 2.1 - Implement register endpoint
