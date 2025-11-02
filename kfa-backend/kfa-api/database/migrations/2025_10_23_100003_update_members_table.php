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
        Schema::table('members', function (Blueprint $table) {
            $table->enum('status', ['active', 'inactive', 'suspended'])->default('active')->after('bio');
            $table->enum('type', ['individual', 'organization'])->default('individual')->after('status');
            $table->string('phone')->nullable()->after('email');
            $table->string('website')->nullable()->after('phone');
            $table->text('address')->nullable()->after('website');
            $table->json('social_links')->nullable()->after('address');
            $table->boolean('is_featured')->default(false)->after('social_links');
            $table->integer('display_order')->default(0)->after('is_featured');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('members', function (Blueprint $table) {
            $table->dropColumn([
                'status',
                'type',
                'phone',
                'website',
                'address',
                'social_links',
                'is_featured',
                'display_order',
            ]);
        });
    }
};