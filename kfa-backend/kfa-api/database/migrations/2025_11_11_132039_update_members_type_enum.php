<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Change type enum to support leadership, specialist, regular
        Schema::table('members', function (Blueprint $table) {
            $table->dropColumn('type');
        });

        Schema::table('members', function (Blueprint $table) {
            $table->string('type')->default('regular')->after('name');
            $table->integer('order')->default(0)->after('display_order');
            $table->boolean('is_active')->default(true)->after('order');
            $table->index('type');
            $table->index('is_active');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('members', function (Blueprint $table) {
            $table->dropIndex(['type']);
            $table->dropIndex(['is_active']);
            $table->dropColumn(['order', 'is_active']);
            $table->dropColumn('type');
        });

        Schema::table('members', function (Blueprint $table) {
            $table->enum('type', ['individual', 'organization'])->default('individual')->after('status');
        });
    }
};
