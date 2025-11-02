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
     * Story 1.4: Add fields to programs table migration
     * - Make duration required
     * - Change level to enum (beginner, intermediate, advanced)
     * - Change syllabus to JSONB (PostgreSQL)
     * - Add indexes on level and price
     */
    public function up(): void
    {
        // First, handle the level column transformation
        // Drop the old level column
        Schema::table('programs', function (Blueprint $table) {
            $table->dropColumn('level');
        });

        // Add new enum level column
        Schema::table('programs', function (Blueprint $table) {
            $table->enum('level', ['beginner', 'intermediate', 'advanced'])
                  ->after('duration');
        });

        // Make duration required
        Schema::table('programs', function (Blueprint $table) {
            $table->string('duration')->nullable(false)->change();
        });

        // Change syllabus to JSONB for PostgreSQL (better performance and indexing)
        // SQLite хранит JSON как TEXT, изменение типа не требуется
        if (DB::getDriverName() === 'pgsql') {
            DB::statement('ALTER TABLE programs ALTER COLUMN syllabus TYPE JSONB USING syllabus::jsonb');
        }

        // Add indexes for query performance
        Schema::table('programs', function (Blueprint $table) {
            $table->index('level', 'idx_programs_level');
            $table->index('price', 'idx_programs_price');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('programs', function (Blueprint $table) {
            // Drop indexes
            $table->dropIndex('idx_programs_level');
            $table->dropIndex('idx_programs_price');

            // Revert duration to nullable
            $table->string('duration')->nullable()->change();

            // Drop enum level
            $table->dropColumn('level');
        });

        // Revert JSONB to JSON (только для PostgreSQL)
        if (DB::getDriverName() === 'pgsql') {
            DB::statement('ALTER TABLE programs ALTER COLUMN syllabus TYPE JSON USING syllabus::json');
        }

        // Add back string level column
        Schema::table('programs', function (Blueprint $table) {
            $table->string('level')->nullable()->after('duration');
        });
    }
};
