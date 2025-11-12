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
        Schema::create('certification_programs', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('code', 50)->unique(); // e.g., "KFA-BM", "KFA-FA"
            $table->enum('type', ['basic', 'specialized'])->default('basic');
            $table->text('description')->nullable();
            $table->text('requirements')->nullable();
            $table->json('curriculum')->nullable(); // JSON структура программы
            $table->integer('duration_hours')->nullable(); // Длительность в часах
            $table->decimal('exam_fee', 10, 2)->default(0); // Стоимость экзамена
            $table->decimal('certification_fee', 10, 2)->default(0); // Стоимость сертификации
            $table->integer('validity_months')->default(36); // Срок действия (36 месяцев = 3 года)
            $table->integer('cpe_hours_required')->default(0); // Требуемые часы НПО
            $table->boolean('is_active')->default(true);
            $table->integer('order')->default(0);
            $table->timestamps();

            $table->index(['type', 'is_active']);
            $table->index('order');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('certification_programs');
    }
};
