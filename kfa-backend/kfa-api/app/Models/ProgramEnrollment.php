<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProgramEnrollment extends Model
{
    protected $fillable = [
        'program_id',
        'user_id',
        'status',
        'amount_paid',
        'enrolled_at',
        'approved_at',
        'started_at',
        'completed_at',
        'progress',
        'exam_score',
        'passed',
        'notes',
        'answers',
        'certificate_issued',
        'certificate_issued_at',
        'certificate_url',
        'cpe_hours_earned',
    ];

    protected $casts = [
        'enrolled_at' => 'datetime',
        'approved_at' => 'datetime',
        'started_at' => 'datetime',
        'completed_at' => 'datetime',
        'certificate_issued_at' => 'datetime',
        'amount_paid' => 'decimal:2',
        'exam_score' => 'decimal:2',
        'cpe_hours_earned' => 'decimal:2',
        'progress' => 'integer',
        'passed' => 'boolean',
        'certificate_issued' => 'boolean',
        'answers' => 'array',
    ];

    // Relationships
    public function program(): BelongsTo
    {
        return $this->belongsTo(Program::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    // Scopes
    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    public function scopeApproved($query)
    {
        return $query->where('status', 'approved');
    }

    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    public function scopeCompleted($query)
    {
        return $query->where('status', 'completed');
    }

    public function scopePassed($query)
    {
        return $query->where('passed', true);
    }

    public function scopeStatus($query, string $status)
    {
        return $query->where('status', $status);
    }

    // Helper methods
    public function isApproved(): bool
    {
        return in_array($this->status, ['approved', 'active', 'completed']);
    }

    public function isActive(): bool
    {
        return $this->status === 'active';
    }

    public function isCompleted(): bool
    {
        return $this->status === 'completed';
    }

    public function canStart(): bool
    {
        return $this->status === 'approved';
    }

    public function canComplete(): bool
    {
        return $this->status === 'active' && $this->progress >= 100;
    }

    public function approve(): bool
    {
        if ($this->status !== 'pending') {
            return false;
        }

        $this->status = 'approved';
        $this->approved_at = now();
        return $this->save();
    }

    public function start(): bool
    {
        if (!$this->canStart()) {
            return false;
        }

        $this->status = 'active';
        $this->started_at = now();
        return $this->save();
    }

    public function updateProgress(int $progress): bool
    {
        if ($progress < 0 || $progress > 100) {
            return false;
        }

        $this->progress = $progress;
        return $this->save();
    }

    public function complete(float $examScore = null): bool
    {
        if ($this->status !== 'active') {
            return false;
        }

        $this->status = 'completed';
        $this->completed_at = now();
        $this->progress = 100;

        // Check if exam score provided
        if ($examScore !== null) {
            $this->exam_score = $examScore;

            // Check if passed
            if ($this->program->has_exam && $this->program->passing_score) {
                $this->passed = $examScore >= $this->program->passing_score;
            } else {
                $this->passed = true;
            }
        } else {
            $this->passed = true; // No exam required
        }

        // Award CPE hours if passed
        if ($this->passed && $this->program->cpe_hours > 0) {
            $this->cpe_hours_earned = $this->program->cpe_hours;
        }

        return $this->save();
    }

    public function fail(): bool
    {
        if ($this->status !== 'active') {
            return false;
        }

        $this->status = 'failed';
        $this->passed = false;
        return $this->save();
    }

    public function issueCertificate(string $certificateUrl = null): bool
    {
        if (!$this->isCompleted() || !$this->passed || !$this->program->issues_certificate) {
            return false;
        }

        $this->certificate_issued = true;
        $this->certificate_issued_at = now();

        if ($certificateUrl) {
            $this->certificate_url = $certificateUrl;
        }

        return $this->save();
    }

    // Auto-set enrolled_at
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($enrollment) {
            if (empty($enrollment->enrolled_at)) {
                $enrollment->enrolled_at = now();
            }
        });
    }
}
