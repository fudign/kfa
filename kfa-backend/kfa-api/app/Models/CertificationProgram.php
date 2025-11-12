<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class CertificationProgram extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'code',
        'type',
        'description',
        'requirements',
        'curriculum',
        'duration_hours',
        'exam_fee',
        'certification_fee',
        'validity_months',
        'cpe_hours_required',
        'is_active',
        'order',
    ];

    protected $casts = [
        'curriculum' => 'array',
        'duration_hours' => 'integer',
        'exam_fee' => 'decimal:2',
        'certification_fee' => 'decimal:2',
        'validity_months' => 'integer',
        'cpe_hours_required' => 'integer',
        'is_active' => 'boolean',
        'order' => 'integer',
    ];

    /**
     * Auto-generate slug when creating
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($program) {
            if (empty($program->slug)) {
                $program->slug = Str::slug($program->name);
            }
        });
    }

    /**
     * Certifications for this program
     */
    public function certifications(): HasMany
    {
        return $this->hasMany(Certification::class);
    }

    /**
     * Active certifications count
     */
    public function getActiveCertificationsCountAttribute(): int
    {
        return $this->certifications()
            ->whereIn('status', ['passed', 'in_progress'])
            ->where('expiry_date', '>', now())
            ->count();
    }

    /**
     * Scope: Only active programs
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope: By type
     */
    public function scopeType($query, string $type)
    {
        return $query->where('type', $type);
    }
}
