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
     * Story 1.2: Add fields to news table migration
     * - Add indexes on published_at (DESC) and author_id
     * - Update foreign key to CASCADE delete
     */
    public function up(): void
    {
        Schema::table('news', function (Blueprint $table) {
            // Add indexes for better query performance
            // Note: slug already has unique index
            $table->index('author_id', 'idx_news_author_id');
        });

        // Add index on published_at DESC using raw SQL for better performance
        DB::statement('CREATE INDEX idx_news_published_at_desc ON news (published_at DESC)');

        // Update foreign key constraint to CASCADE delete
        // First drop the existing constraint
        Schema::table('news', function (Blueprint $table) {
            $table->dropForeign(['author_id']);
        });

        // Then add new constraint with CASCADE
        Schema::table('news', function (Blueprint $table) {
            $table->foreign('author_id')
                  ->references('id')
                  ->on('users')
                  ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Drop the DESC index
        DB::statement('DROP INDEX IF EXISTS idx_news_published_at_desc');

        Schema::table('news', function (Blueprint $table) {
            // Drop the author_id index
            $table->dropIndex('idx_news_author_id');

            // Drop CASCADE constraint
            $table->dropForeign(['author_id']);

            // Restore original SET NULL constraint
            $table->foreign('author_id')
                  ->references('id')
                  ->on('users')
                  ->onDelete('set null');
        });
    }
};
