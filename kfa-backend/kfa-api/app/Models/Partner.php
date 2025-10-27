<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphToMany;
use Illuminate\Support\Facades\Storage;

class Partner extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'description',
        'logo',
        'website',
        'email',
        'phone',
        'category',
        'status',
        'is_featured',
        'display_order',
        'social_links',
    ];

    protected $casts = [
        'social_links' => 'array',
        'is_featured' => 'boolean',
        'display_order' => 'integer',
    ];

    protected $appends = [
        'logo_url',
    ];

    /**
     * Get partner's media files
     */
    public function media(): MorphToMany
    {
        return $this->morphToMany(Media::class, 'mediable')
            ->withPivot('collection');
    }

    /**
     * Get partner's logo
     */
    public function getLogoUrlAttribute(): ?string
    {
        if ($this->logo) {
            return Storage::disk('public')->url($this->logo);
        }
        return null;
    }

    /**
     * Scope for active partners
     */
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    /**
     * Scope for inactive partners
     */
    public function scopeInactive($query)
    {
        return $query->where('status', 'inactive');
    }

    /**
     * Scope for featured partners
     */
    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }

    /**
     * Scope by category
     */
    public function scopeByCategory($query, string $category)
    {
        return $query->where('category', $category);
    }

    /**
     * Scope ordered by display order
     */
    public function scopeOrdered($query)
    {
        return $query->orderBy('display_order')->orderBy('name');
    }

    /**
     * Get category label
     */
    public function getCategoryLabelAttribute(): string
    {
        return match($this->category) {
            'platinum' => 'Платиновый партнер',
            'gold' => 'Золотой партнер',
            'silver' => 'Серебряный партнер',
            'bronze' => 'Бронзовый партнер',
            default => 'Партнер',
        };
    }

    /**
     * Get status label
     */
    public function getStatusLabelAttribute(): string
    {
        return match($this->status) {
            'active' => 'Активен',
            'inactive' => 'Неактивен',
            default => 'Неизвестно',
        };
    }
}
