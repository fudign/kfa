<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;

class Member extends Model
{
    protected $fillable = [
        'name',
        'type',
        'email',
        'phone',
        'company',
        'position',
        'photo',
        'bio',
        'order',
        'is_active',
        'joined_at',
    ];

    protected $casts = [
        'joined_at' => 'datetime',
        'is_active' => 'boolean',
        'order' => 'integer',
    ];

    /**
     * Только активные участники
     */
    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true);
    }

    /**
     * Фильтр по типу
     */
    public function scopeType(Builder $query, string $type): Builder
    {
        return $query->where('type', $type);
    }

    /**
     * Руководство КФА
     */
    public function scopeLeadership(Builder $query): Builder
    {
        return $query->where('type', 'leadership')
            ->orderBy('order');
    }

    /**
     * Специалисты
     */
    public function scopeSpecialists(Builder $query): Builder
    {
        return $query->where('type', 'specialist')
            ->orderBy('order');
    }

    /**
     * Обычные участники
     */
    public function scopeRegular(Builder $query): Builder
    {
        return $query->where('type', 'regular')
            ->orderBy('name');
    }
}
