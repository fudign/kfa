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
        Schema::create('event_registrations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('event_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');

            $table->enum('status', [
                'pending',
                'approved',
                'rejected',
                'cancelled',
                'attended',
                'no_show'
            ])->default('pending');

            $table->decimal('amount_paid', 10, 2)->default(0);
            $table->timestamp('registered_at')->nullable();
            $table->timestamp('approved_at')->nullable();
            $table->timestamp('attended_at')->nullable();

            $table->text('notes')->nullable()->comment('Admin notes or rejection reason');
            $table->json('answers')->nullable()->comment('Registration form answers');

            $table->boolean('certificate_issued')->default(false);
            $table->timestamp('certificate_issued_at')->nullable();

            $table->decimal('cpe_hours_earned', 5, 2)->default(0);

            $table->timestamps();

            // Unique constraint: one registration per user per event
            $table->unique(['event_id', 'user_id']);

            // Indexes
            $table->index('status');
            $table->index('registered_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('event_registrations');
    }
};
