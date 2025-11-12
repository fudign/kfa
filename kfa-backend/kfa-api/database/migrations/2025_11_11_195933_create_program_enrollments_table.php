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
        Schema::create('program_enrollments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('program_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');

            $table->enum('status', [
                'pending',
                'approved',
                'rejected',
                'active',
                'completed',
                'failed',
                'dropped',
                'cancelled'
            ])->default('pending');

            $table->decimal('amount_paid', 10, 2)->default(0);
            $table->timestamp('enrolled_at')->nullable();
            $table->timestamp('approved_at')->nullable();
            $table->timestamp('started_at')->nullable();
            $table->timestamp('completed_at')->nullable();

            $table->integer('progress')->default(0)->comment('Completion percentage 0-100');
            $table->decimal('exam_score', 5, 2)->nullable();
            $table->boolean('passed')->default(false);

            $table->text('notes')->nullable()->comment('Admin notes');
            $table->json('answers')->nullable()->comment('Enrollment form answers');

            $table->boolean('certificate_issued')->default(false);
            $table->timestamp('certificate_issued_at')->nullable();
            $table->string('certificate_url')->nullable();

            $table->decimal('cpe_hours_earned', 5, 2)->default(0);

            $table->timestamps();

            // Unique constraint: one enrollment per user per program
            $table->unique(['program_id', 'user_id']);

            // Indexes
            $table->index('status');
            $table->index('enrolled_at');
            $table->index('completed_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('program_enrollments');
    }
};
