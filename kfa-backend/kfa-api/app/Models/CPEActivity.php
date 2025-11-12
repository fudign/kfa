<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class CPEActivity extends Model
{
    protected $fillable = [
        'user_id',
        'activity_type',
        'activity_id',
        'title',
        'description',
        'category',
        'hours',
        'activity_date',
        'status',
        'evidence',
        'attachments',
        'approved_by',
        'approved_at',
        'rejection_reason',
    ];

    protected $casts = [
        'activity_date' => 'date',
        'approved_at' => 'datetime',
        'hours' => 'decimal:2',
        'attachments' => 'array',
    ];

    // Relationships
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function approver(): BelongsTo
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    public function activity(): MorphTo
    {
        return $this->morphTo();
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

    public function scopeRejected($query)
    {
        return $query->where('status', 'rejected');
    }

    public function scopeStatus($query, string $status)
    {
        return $query->where('status', $status);
    }

    public function scopeCategory($query, string $category)
    {
        return $query->where('category', $category);
    }

    public function scopeActivityType($query, string $type)
    {
        return $query->where('activity_type', $type);
    }

    public function scopeForUser($query, int $userId)
    {
        return $query->where('user_id', $userId);
    }

    public function scopeDateRange($query, $from, $to)
    {
        return $query->whereBetween('activity_date', [$from, $to]);
    }

    // Helper methods
    public function isApproved(): bool
    {
        return $this->status === 'approved';
    }

    public function isPending(): bool
    {
        return $this->status === 'pending';
    }

    public function isRejected(): bool
    {
        return $this->status === 'rejected';
    }

    public function canApprove(): bool
    {
        return $this->status === 'pending';
    }

    public function approve(int $approverId = null): bool
    {
        if (!$this->canApprove()) {
            return false;
        }

        $this->status = 'approved';
        $this->approved_at = now();

        if ($approverId) {
            $this->approved_by = $approverId;
        }

        return $this->save();
    }

    public function reject(string $reason, int $approverId = null): bool
    {
        if ($this->status !== 'pending') {
            return false;
        }

        $this->status = 'rejected';
        $this->rejection_reason = $reason;

        if ($approverId) {
            $this->approved_by = $approverId;
        }

        return $this->save();
    }

    /**
     * Get total approved CPE hours for a user
     */
    public static function getTotalHoursForUser(int $userId, $fromDate = null, $toDate = null): float
    {
        $query = static::approved()->forUser($userId);

        if ($fromDate && $toDate) {
            $query->dateRange($fromDate, $toDate);
        }

        return (float) $query->sum('hours');
    }

    /**
     * Get CPE hours breakdown by category for a user
     */
    public static function getHoursByCategoryForUser(int $userId): array
    {
        return static::approved()
            ->forUser($userId)
            ->selectRaw('category, SUM(hours) as total_hours')
            ->groupBy('category')
            ->pluck('total_hours', 'category')
            ->toArray();
    }

    /**
     * Create CPE activity from event registration
     */
    public static function createFromEventRegistration(EventRegistration $registration): ?self
    {
        if (!$registration->hasAttended() || $registration->event->cpe_hours <= 0) {
            return null;
        }

        return static::create([
            'user_id' => $registration->user_id,
            'activity_type' => EventRegistration::class,
            'activity_id' => $registration->id,
            'title' => $registration->event->title,
            'description' => $registration->event->description,
            'category' => static::mapEventTypeToCategory($registration->event->event_type),
            'hours' => $registration->event->cpe_hours,
            'activity_date' => $registration->attended_at ?? now(),
            'status' => 'approved', // Auto-approve for KFA events
            'approved_at' => now(),
        ]);
    }

    /**
     * Create CPE activity from program enrollment
     */
    public static function createFromProgramEnrollment(ProgramEnrollment $enrollment): ?self
    {
        if (!$enrollment->isCompleted() || !$enrollment->passed || $enrollment->program->cpe_hours <= 0) {
            return null;
        }

        return static::create([
            'user_id' => $enrollment->user_id,
            'activity_type' => ProgramEnrollment::class,
            'activity_id' => $enrollment->id,
            'title' => $enrollment->program->title,
            'description' => $enrollment->program->description,
            'category' => 'training',
            'hours' => $enrollment->program->cpe_hours,
            'activity_date' => $enrollment->completed_at ?? now(),
            'status' => 'approved', // Auto-approve for KFA programs
            'approved_at' => now(),
        ]);
    }

    /**
     * Map event type to CPE category
     */
    private static function mapEventTypeToCategory(string $eventType): string
    {
        $mapping = [
            'webinar' => 'webinar',
            'workshop' => 'training',
            'seminar' => 'training',
            'conference' => 'conference',
            'training' => 'training',
            'exam' => 'training',
            'networking' => 'other',
        ];

        return $mapping[$eventType] ?? 'other';
    }
}
