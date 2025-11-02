<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * Story 1.1: Add fields to members table migration
     * - Make email unique and required
     * - Make company and position required
     * - Make joined_at required
     * - Add indexes on email, company, joined_at
     */
    public function up(): void
    {
        Schema::table('members', function (Blueprint $table) {
            // Make email not nullable and unique
            $table->string('email')->nullable(false)->unique()->change();

            // Make company and position required
            $table->string('company')->nullable(false)->change();
            $table->string('position')->nullable(false)->change();

            // Make joined_at required
            $table->timestamp('joined_at')->nullable(false)->change();

            // Add indexes for better query performance
            $table->index('company', 'idx_members_company');
            $table->index('joined_at', 'idx_members_joined_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('members', function (Blueprint $table) {
            // Drop indexes
            $table->dropIndex('idx_members_company');
            $table->dropIndex('idx_members_joined_at');

            // Revert to nullable
            $table->string('email')->nullable()->change();
            $table->string('company')->nullable()->change();
            $table->string('position')->nullable()->change();
            $table->timestamp('joined_at')->nullable()->change();

            // Note: unique constraint on email will be automatically dropped when making it nullable
            $table->dropUnique(['email']);
        });
    }
};
