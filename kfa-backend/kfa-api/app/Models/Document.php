<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

class Document extends Model
{
    protected $fillable = [
        'title',
        'slug',
        'description',
        'category',
        'file_url',
        'file_type',
        'file_size',
        'uploaded_by',
        'download_count',
        'is_public',
        'order',
    ];

    protected $casts = [
        'is_public' => 'boolean',
        'download_count' => 'integer',
        'file_size' => 'integer',
        'order' => 'integer',
    ];

    /**
     * Пользователь, загрузивший документ
     */
    public function uploader(): BelongsTo
    {
        return $this->belongsTo(User::class, 'uploaded_by');
    }

    /**
     * Автоматическая генерация slug при создании
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($document) {
            if (empty($document->slug)) {
                $document->slug = Str::slug($document->title);
            }
        });
    }

    /**
     * Инкрементировать счетчик загрузок
     */
    public function incrementDownloads(): void
    {
        $this->increment('download_count');
    }

    /**
     * Получить человеко-читаемый размер файла
     */
    public function getFileSizeFormattedAttribute(): string
    {
        if (!$this->file_size) {
            return 'N/A';
        }

        $units = ['B', 'KB', 'MB', 'GB'];
        $size = $this->file_size;
        $unitIndex = 0;

        while ($size >= 1024 && $unitIndex < count($units) - 1) {
            $size /= 1024;
            $unitIndex++;
        }

        return round($size, 2) . ' ' . $units[$unitIndex];
    }
}
