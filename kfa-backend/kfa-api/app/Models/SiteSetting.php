<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

class SiteSetting extends Model
{
    protected $fillable = [
        'key',
        'value',
        'type',
        'category',
        'label',
        'description',
    ];

    /**
     * Cache duration in seconds (1 hour)
     */
    const CACHE_DURATION = 3600;

    /**
     * Get setting value by key
     */
    public static function get(string $key, $default = null)
    {
        return Cache::remember("setting_{$key}", self::CACHE_DURATION, function () use ($key, $default) {
            $setting = static::where('key', $key)->first();
            return $setting ? $setting->value : $default;
        });
    }

    /**
     * Set setting value
     */
    public static function set(string $key, $value): self
    {
        $setting = static::firstOrCreate(
            ['key' => $key],
            [
                'type' => 'text',
                'category' => 'general',
                'label' => $key,
            ]
        );

        $setting->value = $value;
        $setting->save();

        // Clear cache
        Cache::forget("setting_{$key}");

        return $setting;
    }

    /**
     * Get all settings by category
     */
    public static function getByCategory(string $category): array
    {
        return Cache::remember("settings_category_{$category}", self::CACHE_DURATION, function () use ($category) {
            return static::where('category', $category)
                ->get()
                ->pluck('value', 'key')
                ->toArray();
        });
    }

    /**
     * Get all settings grouped by category
     */
    public static function getAllGrouped(): array
    {
        return Cache::remember('settings_all_grouped', self::CACHE_DURATION, function () {
            return static::all()->groupBy('category')->toArray();
        });
    }

    /**
     * Get all settings as key-value array
     */
    public static function getAllAsArray(): array
    {
        return Cache::remember('settings_all_array', self::CACHE_DURATION, function () {
            return static::all()->pluck('value', 'key')->toArray();
        });
    }

    /**
     * Clear all settings cache
     */
    public static function clearCache(): void
    {
        // Get all setting keys
        $keys = static::pluck('key');

        foreach ($keys as $key) {
            Cache::forget("setting_{$key}");
        }

        // Clear category caches
        $categories = static::distinct('category')->pluck('category');
        foreach ($categories as $category) {
            Cache::forget("settings_category_{$category}");
        }

        // Clear grouped cache
        Cache::forget('settings_all_grouped');
        Cache::forget('settings_all_array');
    }

    /**
     * Update multiple settings at once
     */
    public static function updateMany(array $settings): void
    {
        foreach ($settings as $key => $value) {
            static::set($key, $value);
        }
    }

    /**
     * Get typed value (cast to appropriate type)
     */
    public function getTypedValue()
    {
        return match($this->type) {
            'boolean' => filter_var($this->value, FILTER_VALIDATE_BOOLEAN),
            'integer' => (int) $this->value,
            'float' => (float) $this->value,
            'json' => json_decode($this->value, true),
            'array' => json_decode($this->value, true),
            default => $this->value,
        };
    }

    /**
     * Scope by category
     */
    public function scopeByCategory($query, string $category)
    {
        return $query->where('category', $category);
    }

    /**
     * Scope public settings (safe to expose)
     */
    public function scopePublic($query)
    {
        $publicKeys = [
            'site_name',
            'site_description',
            'site_logo',
            'contact_email',
            'contact_phone',
            'contact_address',
            'social_facebook',
            'social_instagram',
            'social_twitter',
            'social_linkedin',
            'social_youtube',
            'social_telegram',
        ];

        return $query->whereIn('key', $publicKeys);
    }
}
