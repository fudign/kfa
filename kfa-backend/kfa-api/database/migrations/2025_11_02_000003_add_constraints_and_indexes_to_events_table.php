<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * Story 1.3: Add fields to events table migration
     * - Make location and ends_at required
     * - Add CHECK constraint: ends_at > starts_at
     * - Add indexes on slug, starts_at, ends_at
     * - Add partial index on upcoming events
     */
    public function up(): void
    {
        Schema::table('events', function (Blueprint $table) {
            // Make location and ends_at required
            $table->string('location')->nullable(false)->change();
            $table->timestamp('ends_at')->nullable(false)->change();

            // Add indexes for query performance
            $table->index('starts_at', 'idx_events_starts_at');
            $table->index('ends_at', 'idx_events_ends_at');
        });

        // SQLite не поддерживает CHECK constraints в ALTER TABLE
        // Для production использовать MySQL/PostgreSQL
        if (DB::getDriverName() !== 'sqlite') {
            // Add CHECK constraint to ensure ends_at > starts_at
            DB::statement('ALTER TABLE events ADD CONSTRAINT chk_events_dates CHECK (ends_at > starts_at)');

            // Add partial index for upcoming events (PostgreSQL specific)
            if (DB::getDriverName() === 'pgsql') {
                DB::statement("CREATE INDEX idx_events_upcoming ON events(starts_at) WHERE starts_at > NOW()");
            }
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (DB::getDriverName() !== 'sqlite') {
            // Drop partial index (PostgreSQL specific)
            if (DB::getDriverName() === 'pgsql') {
                DB::statement('DROP INDEX IF EXISTS idx_events_upcoming');
            }

            // Drop CHECK constraint
            DB::statement('ALTER TABLE events DROP CONSTRAINT IF EXISTS chk_events_dates');
        }

        Schema::table('events', function (Blueprint $table) {
            // Drop indexes
            $table->dropIndex('idx_events_starts_at');
            $table->dropIndex('idx_events_ends_at');

            // Revert to nullable
            $table->string('location')->nullable()->change();
            $table->timestamp('ends_at')->nullable()->change();
        });
    }
};
