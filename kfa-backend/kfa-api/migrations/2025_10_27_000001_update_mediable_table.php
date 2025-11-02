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
        Schema::table('mediable', function (Blueprint $table) {
            // Добавить поле type для различения типов медиа (featured, gallery, etc.)
            $table->string('type')->default('default')->after('collection');

            // Добавить поле order для сортировки изображений в галерее
            $table->integer('order')->default(0)->after('type');

            // Добавить timestamps
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('mediable', function (Blueprint $table) {
            $table->dropColumn(['type', 'order', 'created_at', 'updated_at']);
        });
    }
};
