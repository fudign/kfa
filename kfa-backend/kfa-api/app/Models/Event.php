<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class Event extends Model
{
    protected $fillable = [
        'title',
        'slug',
        'description',
        'event_type',
        'status',
        'cpe_hours',
        'level',
        'speaker_id',
        'speaker_name',
        'speaker_bio',
        'price',
        'member_price',
        'location',
        'is_online',
        'meeting_link',
        'meeting_password',
        'starts_at',
        'ends_at',
        'capacity',
        'max_participants',
        'registered_count',
        'registration_deadline',
        'requires_approval',
        'image',
        'agenda',
        'materials',
        'issues_certificate',
        'certificate_template',
        'is_featured',
        'published_at',
        'created_by',
    ];

    protected $casts = [
        'starts_at' => 'datetime',
        'ends_at' => 'datetime',
        'registration_deadline' => 'datetime',
        'published_at' => 'datetime',
        'capacity' => 'integer',
        'max_participants' => 'integer',
        'registered_count' => 'integer',
        'cpe_hours' => 'decimal:2',
        'price' => 'decimal:2',
        'member_price' => 'decimal:2',
        'is_online' => 'boolean',
        'requires_approval' => 'boolean',
        'issues_certificate' => 'boolean',
        'is_featured' => 'boolean',
        'materials' => 'array',
    ];

    // Relationships
    public function speaker(): BelongsTo
    {
        return $this->belongsTo(User::class, 'speaker_id');
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function registrations(): HasMany
    {
        return $this->hasMany(EventRegistration::class);
    }

    // Scopes
    public function scopePublished($query)
    {
        return $query->where('status', 'published')
            ->whereNotNull('published_at')
            ->where('published_at', '<=', now());
    }

    public function scopeUpcoming($query)
    {
        return $query->where('starts_at', '>', now());
    }

    public function scopePast($query)
    {
        return $query->where('ends_at', '<', now());
    }

    public function scopeOngoing($query)
    {
        return $query->where('starts_at', '<=', now())
            ->where('ends_at', '>=', now());
    }

    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }

    public function scopeOnline($query)
    {
        return $query->where('is_online', true);
    }

    public function scopeEventType($query, string $type)
    {
        return $query->where('event_type', $type);
    }

    // Helper methods
    public function isRegistrationOpen(): bool
    {
        if ($this->status !== 'registration_open') {
            return false;
        }

        if ($this->registration_deadline && $this->registration_deadline->isPast()) {
            return false;
        }

        if ($this->max_participants && $this->registered_count >= $this->max_participants) {
            return false;
        }

        return true;
    }

    public function hasAvailableSpots(): bool
    {
        if (!$this->max_participants) {
            return true;
        }

        return $this->registered_count < $this->max_participants;
    }

    // Auto-generate slug
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($event) {
            if (empty($event->slug)) {
                $event->slug = Str::slug($event->title);
            }
        });
    }
}
