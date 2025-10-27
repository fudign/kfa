<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphToMany;
use Illuminate\Support\Facades\Storage;

class Media extends Model
{
    protected $table = 'media';

    protected $fillable = [
        'filename',
        'path',
        'disk',
        'mime_type',
        'size',
        'width',
        'height',
        'metadata',
        'uploaded_by',
    ];

    protected $casts = [
        'metadata' => 'array',
        'size' => 'integer',
        'width' => 'integer',
        'height' => 'integer',
    ];

    protected $appends = [
        'url',
        'thumbnail_url',
        'human_size',
    ];

    /**
     * Get the user who uploaded the media
     */
    public function uploader(): BelongsTo
    {
        return $this->belongsTo(User::class, 'uploaded_by');
    }

    /**
     * News где это медиа используется как главное изображение
     */
    public function featuredInNews(): HasMany
    {
        return $this->hasMany(News::class, 'featured_image_id');
    }

    /**
     * Get the full URL of the media file
     */
    public function getUrlAttribute(): string
    {
        return Storage::disk($this->disk)->url($this->path);
    }

    /**
     * Get the thumbnail URL
     */
    public function getThumbnailUrlAttribute(): ?string
    {
        if ($this->metadata && isset($this->metadata['thumbnails']['thumbnail'])) {
            return Storage::disk($this->disk)->url($this->metadata['thumbnails']['thumbnail']);
        }
        return $this->url;
    }

    /**
     * Get human-readable file size
     */
    public function getHumanSizeAttribute(): string
    {
        $units = ['B', 'KB', 'MB', 'GB'];
        $size = $this->size;
        $unit = 0;

        while ($size >= 1024 && $unit < count($units) - 1) {
            $size /= 1024;
            $unit++;
        }

        return round($size, 2) . ' ' . $units[$unit];
    }

    /**
     * Check if media is an image
     */
    public function isImage(): bool
    {
        return str_starts_with($this->mime_type, 'image/');
    }

    /**
     * Check if media is SVG
     */
    public function isSvg(): bool
    {
        return $this->mime_type === 'image/svg+xml';
    }

    /**
     * Check if media is PDF
     */
    public function isPdf(): bool
    {
        return $this->mime_type === 'application/pdf';
    }

    /**
     * Check if media is document
     */
    public function isDocument(): bool
    {
        return in_array($this->mime_type, [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        ]);
    }

    /**
     * Get thumbnail for specific size
     */
    public function getThumbnail(string $size = 'medium'): ?string
    {
        if ($this->metadata && isset($this->metadata['thumbnails'][$size])) {
            return Storage::disk($this->disk)->url($this->metadata['thumbnails'][$size]);
        }
        return $this->url;
    }

    /**
     * Получить все размеры миниатюр
     */
    public function getAllThumbnails(): array
    {
        if (!$this->metadata || !isset($this->metadata['thumbnails'])) {
            return [];
        }

        $thumbnails = [];
        foreach ($this->metadata['thumbnails'] as $size => $path) {
            $thumbnails[$size] = Storage::disk($this->disk)->url($path);
        }

        return $thumbnails;
    }

    /**
     * Проверить, используется ли медиафайл
     */
    public function isInUse(): bool
    {
        // Проверить, используется ли в качестве главного изображения в новостях
        if ($this->featuredInNews()->exists()) {
            return true;
        }

        // Можно добавить проверки для других моделей
        // если они будут использовать этот медиафайл

        return false;
    }
}
