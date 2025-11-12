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
        Schema::table('events', function (Blueprint $table) {
            // Event classification
            $table->enum('event_type', [
                'webinar',
                'workshop',
                'seminar',
                'conference',
                'training',
                'exam',
                'networking'
            ])->default('webinar')->after('description');

            $table->enum('status', [
                'draft',
                'published',
                'registration_open',
                'registration_closed',
                'ongoing',
                'completed',
                'cancelled'
            ])->default('draft')->after('event_type');

            // Educational info
            $table->decimal('cpe_hours', 5, 2)->default(0)->after('status')
                ->comment('CPE/НПО hours awarded');
            $table->string('level')->nullable()->after('cpe_hours')
                ->comment('beginner, intermediate, advanced');

            // Speaker/Instructor
            $table->foreignId('speaker_id')->nullable()->after('level')
                ->constrained('users')->nullOnDelete();
            $table->string('speaker_name')->nullable()->after('speaker_id')
                ->comment('External speaker name if not in users');
            $table->text('speaker_bio')->nullable()->after('speaker_name');

            // Pricing
            $table->decimal('price', 10, 2)->default(0)->after('speaker_bio');
            $table->decimal('member_price', 10, 2)->nullable()->after('price')
                ->comment('Discounted price for members');

            // Registration
            $table->integer('max_participants')->nullable()->after('capacity')
                ->comment('Maximum number of participants');
            $table->integer('registered_count')->default(0)->after('max_participants');
            $table->timestamp('registration_deadline')->nullable()->after('registered_count');
            $table->boolean('requires_approval')->default(false)->after('registration_deadline');

            // Online/Offline
            $table->boolean('is_online')->default(false)->after('location');
            $table->string('meeting_link')->nullable()->after('is_online');
            $table->string('meeting_password')->nullable()->after('meeting_link');

            // Materials
            $table->text('agenda')->nullable()->after('meeting_password')
                ->comment('Event agenda/schedule');
            $table->json('materials')->nullable()->after('agenda')
                ->comment('URLs to presentation slides, handouts, etc.');

            // Certificates
            $table->boolean('issues_certificate')->default(false)->after('materials')
                ->comment('Whether attendance certificate is issued');
            $table->string('certificate_template')->nullable()->after('issues_certificate');

            // Publishing
            $table->boolean('is_featured')->default(false)->after('certificate_template');
            $table->timestamp('published_at')->nullable()->after('is_featured');
            $table->foreignId('created_by')->nullable()->after('published_at')
                ->constrained('users')->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('events', function (Blueprint $table) {
            $table->dropForeign(['speaker_id']);
            $table->dropForeign(['created_by']);

            $table->dropColumn([
                'event_type',
                'status',
                'cpe_hours',
                'level',
                'speaker_id',
                'speaker_name',
                'speaker_bio',
                'price',
                'member_price',
                'max_participants',
                'registered_count',
                'registration_deadline',
                'requires_approval',
                'is_online',
                'meeting_link',
                'meeting_password',
                'agenda',
                'materials',
                'issues_certificate',
                'certificate_template',
                'is_featured',
                'published_at',
                'created_by',
            ]);
        });
    }
};
