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
        Schema::create('cpe_activities', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');

            // Polymorphic relationship - activity can be from event, program, or certification
            $table->string('activity_type')->comment('Event, Program, Certification, SelfStudy, Conference');
            $table->unsignedBigInteger('activity_id')->nullable()
                ->comment('ID of event_registration, program_enrollment, etc.');

            $table->string('title')->comment('Activity name');
            $table->text('description')->nullable();

            $table->enum('category', [
                'training',
                'webinar',
                'conference',
                'self_study',
                'teaching',
                'writing',
                'research',
                'other'
            ])->default('training');

            $table->decimal('hours', 5, 2)->default(0)->comment('CPE hours claimed/earned');

            $table->date('activity_date')->comment('When activity took place');

            $table->enum('status', [
                'pending',
                'approved',
                'rejected'
            ])->default('approved')->comment('Auto-approved for KFA events');

            $table->text('evidence')->nullable()->comment('Documentation/proof');
            $table->json('attachments')->nullable()->comment('Supporting documents URLs');

            $table->foreignId('approved_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('approved_at')->nullable();

            $table->text('rejection_reason')->nullable();

            $table->timestamps();

            // Indexes
            $table->index('user_id');
            $table->index('activity_type');
            $table->index('activity_date');
            $table->index('status');
            $table->index(['activity_type', 'activity_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cpe_activities');
    }
};
