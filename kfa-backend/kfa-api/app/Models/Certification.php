<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Carbon\Carbon;

class Certification extends Model
{
    protected $fillable = [
        'user_id',
        'certification_program_id',
        'certificate_number',
        'status',
        'application_date',
        'exam_date',
        'issued_date',
        'expiry_date',
        'exam_score',
        'cpe_hours_completed',
        'notes',
        'exam_results',
        'certificate_url',
        'qr_code_url',
        'reviewed_by',
        'reviewed_at',
    ];

    protected $casts = [
        'application_date' => 'date',
        'exam_date' => 'date',
        'issued_date' => 'date',
        'expiry_date' => 'date',
        'exam_score' => 'integer',
        'cpe_hours_completed' => 'integer',
        'exam_results' => 'array',
        'reviewed_at' => 'datetime',
    ];

    /**
     * User who owns this certification
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Certification program
     */
    public function program(): BelongsTo
    {
        return $this->belongsTo(CertificationProgram::class, 'certification_program_id');
    }

    /**
     * Reviewer
     */
    public function reviewer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }

    /**
     * Check if certification is expired
     */
    public function isExpired(): bool
    {
        return $this->expiry_date && $this->expiry_date->isPast();
    }

    /**
     * Check if certification is active
     */
    public function isActive(): bool
    {
        return $this->status === 'passed' && !$this->isExpired();
    }

    /**
     * Get days until expiry
     */
    public function getDaysUntilExpiryAttribute(): ?int
    {
        if (!$this->expiry_date) {
            return null;
        }

        return now()->diffInDays($this->expiry_date, false);
    }

    /**
     * Scope: Active certifications
     */
    public function scopeActive($query)
    {
        return $query->where('status', 'passed')
            ->where(function ($q) {
                $q->whereNull('expiry_date')
                  ->orWhere('expiry_date', '>', now());
            });
    }

    /**
     * Scope: Expired certifications
     */
    public function scopeExpired($query)
    {
        return $query->where('expiry_date', '<=', now());
    }

    /**
     * Scope: By status
     */
    public function scopeStatus($query, string $status)
    {
        return $query->where('status', $status);
    }

    /**
     * Generate certificate number
     */
    public static function generateCertificateNumber(string $programCode): string
    {
        $year = date('Y');
        $lastCert = static::where('certificate_number', 'like', "{$programCode}-{$year}-%")
            ->latest('id')
            ->first();

        $sequence = $lastCert ? intval(substr($lastCert->certificate_number, -4)) + 1 : 1;

        return sprintf('%s-%s-%04d', $programCode, $year, $sequence);
    }
}
