<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EventRegistration extends Model
{
    protected $fillable = [
        'event_id',
        'user_id',
        'status',
        'amount_paid',
        'registered_at',
        'approved_at',
        'attended_at',
        'notes',
        'answers',
        'certificate_issued',
        'certificate_issued_at',
        'cpe_hours_earned',
    ];

    protected $casts = [
        'registered_at' => 'datetime',
        'approved_at' => 'datetime',
        'attended_at' => 'datetime',
        'certificate_issued_at' => 'datetime',
        'amount_paid' => 'decimal:2',
        'cpe_hours_earned' => 'decimal:2',
        'certificate_issued' => 'boolean',
        'answers' => 'array',
    ];

    // Relationships
    public function event(): BelongsTo
    {
        return $this->belongsTo(Event::class);
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

    public function scopeAttended($query)
    {
        return $query->where('status', 'attended');
    }

    public function scopeNoShow($query)
    {
        return $query->where('status', 'no_show');
    }

    public function scopeStatus($query, string $status)
    {
        return $query->where('status', $status);
    }

    // Helper methods
    public function isApproved(): bool
    {
        return in_array($this->status, ['approved', 'attended']);
    }

    public function hasAttended(): bool
    {
        return $this->status === 'attended';
    }

    public function canMarkAttendance(): bool
    {
        return $this->status === 'approved';
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

    public function markAttended(): bool
    {
        if (!$this->canMarkAttendance()) {
            return false;
        }

        $this->status = 'attended';
        $this->attended_at = now();

        // Award CPE hours from event
        if ($this->event && $this->event->cpe_hours > 0) {
            $this->cpe_hours_earned = $this->event->cpe_hours;
        }

        return $this->save();
    }

    public function issueCertificate(): bool
    {
        if (!$this->hasAttended() || !$this->event->issues_certificate) {
            return false;
        }

        $this->certificate_issued = true;
        $this->certificate_issued_at = now();
        return $this->save();
    }

    // Auto-set registered_at
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($registration) {
            if (empty($registration->registered_at)) {
                $registration->registered_at = now();
            }
        });
    }
}
