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
        Schema::create('certifications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('certification_program_id')->constrained()->onDelete('cascade');
            $table->string('certificate_number')->unique(); // Номер сертификата
            $table->enum('status', ['pending', 'in_progress', 'passed', 'failed', 'expired', 'revoked'])->default('pending');
            $table->date('application_date')->nullable();
            $table->date('exam_date')->nullable();
            $table->date('issued_date')->nullable();
            $table->date('expiry_date')->nullable();
            $table->integer('exam_score')->nullable(); // Балл экзамена (%)
            $table->integer('cpe_hours_completed')->default(0); // Часы НПО выполнено
            $table->text('notes')->nullable();
            $table->json('exam_results')->nullable(); // Детальные результаты экзамена
            $table->string('certificate_url')->nullable(); // PDF сертификата
            $table->string('qr_code_url')->nullable(); // QR код для верификации
            $table->foreignId('reviewed_by')->nullable()->constrained('users');
            $table->timestamp('reviewed_at')->nullable();
            $table->timestamps();

            $table->index(['user_id', 'status']);
            $table->index(['certification_program_id', 'status']);
            $table->index('expiry_date');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('certifications');
    }
};
