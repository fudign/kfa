<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class Program extends Model
{
    protected $fillable = [
        'title',
        'slug',
        'description',
        'program_type',
        'status',
        'duration',
        'cpe_hours',
        'language',
        'level',
        'instructor_id',
        'instructor_name',
        'instructor_bio',
        'syllabus',
        'prerequisites',
        'target_audience',
        'starts_at',
        'ends_at',
        'schedule',
        'max_students',
        'enrolled_count',
        'enrollment_deadline',
        'requires_approval',
        'price',
        'member_price',
        'is_online',
        'location',
        'platform',
        'modules',
        'has_exam',
        'passing_score',
        'issues_certificate',
        'certificate_template',
        'image',
        'is_featured',
        'published_at',
        'created_by',
    ];

    protected $casts = [
        'starts_at' => 'datetime',
        'ends_at' => 'datetime',
        'enrollment_deadline' => 'datetime',
        'published_at' => 'datetime',
        'max_students' => 'integer',
        'enrolled_count' => 'integer',
        'passing_score' => 'integer',
        'cpe_hours' => 'decimal:2',
        'price' => 'decimal:2',
        'member_price' => 'decimal:2',
        'is_online' => 'boolean',
        'requires_approval' => 'boolean',
        'has_exam' => 'boolean',
        'issues_certificate' => 'boolean',
        'is_featured' => 'boolean',
        'syllabus' => 'array',
        'target_audience' => 'array',
        'modules' => 'array',
    ];

    // Relationships
    public function instructor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'instructor_id');
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function enrollments(): HasMany
    {
        return $this->hasMany(ProgramEnrollment::class);
    }

    // Scopes
    public function scopePublished($query)
    {
        return $query->where('status', 'published')
            ->whereNotNull('published_at')
            ->where('published_at', '<=', now());
    }

    public function scopeEnrollmentOpen($query)
    {
        return $query->where('status', 'enrollment_open');
    }

    public function scopeInProgress($query)
    {
        return $query->where('status', 'in_progress');
    }

    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }

    public function scopeOnline($query)
    {
        return $query->where('is_online', true);
    }

    public function scopeProgramType($query, string $type)
    {
        return $query->where('program_type', $type);
    }

    public function scopeLanguage($query, string $language)
    {
        return $query->where('language', $language);
    }

    // Helper methods
    public function isEnrollmentOpen(): bool
    {
        if ($this->status !== 'enrollment_open') {
            return false;
        }

        if ($this->enrollment_deadline && $this->enrollment_deadline->isPast()) {
            return false;
        }

        if ($this->max_students && $this->enrolled_count >= $this->max_students) {
            return false;
        }

        return true;
    }

    public function hasAvailableSpots(): bool
    {
        if (!$this->max_students) {
            return true;
        }

        return $this->enrolled_count < $this->max_students;
    }

    public function getAvailableSpots(): int
    {
        if (!$this->max_students) {
            return PHP_INT_MAX;
        }

        return max(0, $this->max_students - $this->enrolled_count);
    }

    // Auto-generate slug
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($program) {
            if (empty($program->slug)) {
                $program->slug = Str::slug($program->title);
            }
        });
    }
}
