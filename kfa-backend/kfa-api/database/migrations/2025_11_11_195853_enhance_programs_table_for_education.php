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
        Schema::table('programs', function (Blueprint $table) {
            // Program classification
            $table->enum('program_type', [
                'course',
                'workshop_series',
                'certification_prep',
                'mentorship',
                'online_course'
            ])->default('course')->after('description');

            $table->enum('status', [
                'draft',
                'published',
                'enrollment_open',
                'enrollment_closed',
                'in_progress',
                'completed',
                'archived'
            ])->default('draft')->after('program_type');

            // Educational info
            $table->decimal('cpe_hours', 5, 2)->default(0)->after('duration')
                ->comment('Total CPE/НПО hours awarded upon completion');
            $table->string('language')->default('ru')->after('cpe_hours')
                ->comment('Course language: ru, ky, en');

            // Instructor
            $table->foreignId('instructor_id')->nullable()->after('language')
                ->constrained('users')->nullOnDelete();
            $table->string('instructor_name')->nullable()->after('instructor_id')
                ->comment('External instructor name if not in users');
            $table->text('instructor_bio')->nullable()->after('instructor_name');

            // Prerequisites
            $table->text('prerequisites')->nullable()->after('syllabus')
                ->comment('Required knowledge or certifications');
            $table->json('target_audience')->nullable()->after('prerequisites')
                ->comment('Who should take this course');

            // Schedule
            $table->timestamp('starts_at')->nullable()->after('target_audience');
            $table->timestamp('ends_at')->nullable()->after('starts_at');
            $table->string('schedule')->nullable()->after('ends_at')
                ->comment('e.g., "Every Tuesday, 18:00-20:00"');

            // Enrollment
            $table->integer('max_students')->nullable()->after('schedule');
            $table->integer('enrolled_count')->default(0)->after('max_students');
            $table->timestamp('enrollment_deadline')->nullable()->after('enrolled_count');
            $table->boolean('requires_approval')->default(false)->after('enrollment_deadline');

            // Pricing
            $table->decimal('member_price', 10, 2)->nullable()->after('price')
                ->comment('Discounted price for KFA members');

            // Format
            $table->boolean('is_online')->default(false)->after('member_price');
            $table->string('location')->nullable()->after('is_online');
            $table->string('platform')->nullable()->after('location')
                ->comment('e.g., Zoom, Moodle, custom LMS');

            // Materials & Assessment
            $table->json('modules')->nullable()->after('platform')
                ->comment('Course modules/lessons structure');
            $table->boolean('has_exam')->default(false)->after('modules');
            $table->integer('passing_score')->nullable()->after('has_exam');

            // Certificate
            $table->boolean('issues_certificate')->default(false)->after('passing_score')
                ->comment('Whether completion certificate is issued');
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
        Schema::table('programs', function (Blueprint $table) {
            $table->dropForeign(['instructor_id']);
            $table->dropForeign(['created_by']);

            $table->dropColumn([
                'program_type',
                'status',
                'cpe_hours',
                'language',
                'instructor_id',
                'instructor_name',
                'instructor_bio',
                'prerequisites',
                'target_audience',
                'starts_at',
                'ends_at',
                'schedule',
                'max_students',
                'enrolled_count',
                'enrollment_deadline',
                'requires_approval',
                'member_price',
                'is_online',
                'location',
                'platform',
                'modules',
                'has_exam',
                'passing_score',
                'issues_certificate',
                'certificate_template',
                'is_featured',
                'published_at',
                'created_by',
            ]);
        });
    }
};
