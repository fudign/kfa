<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphToMany;
use Illuminate\Support\Str;

class News extends Model
{
    protected $fillable = [
        'title',
        'slug',
        'content',
        'excerpt',
        'image',
        'published_at',
        'author_id',
        'status',
        'featured',
        'featured_image_id',
    ];

    protected $casts = [
        'published_at' => 'datetime',
        'featured' => 'boolean',
    ];

    protected $appends = [
        'reading_time',
    ];

    /**
     * Автор новости
     */
    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'author_id');
    }

    /**
     * Все медиафайлы, связанные с новостью (полиморфная связь)
     */
    public function media(): MorphToMany
    {
        return $this->morphToMany(Media::class, 'mediable')
            ->withTimestamps()
            ->withPivot('type', 'order')
            ->orderBy('order');
    }

    /**
     * Главное изображение новости
     */
    public function featuredImage(): BelongsTo
    {
        return $this->belongsTo(Media::class, 'featured_image_id');
    }

    /**
     * Изображения галереи
     */
    public function gallery()
    {
        return $this->media()
            ->wherePivot('type', 'gallery')
            ->orderBy('order');
    }

    /**
     * Добавить изображение в галерею
     */
    public function addToGallery(int $mediaId, int $order = 0): void
    {
        $this->media()->attach($mediaId, [
            'type' => 'gallery',
            'order' => $order,
        ]);
    }

    /**
     * Удалить изображение из галереи
     */
    public function removeFromGallery(int $mediaId): void
    {
        $this->media()->detach($mediaId);
    }

    /**
     * Установить главное изображение
     */
    public function setFeaturedImage(int $mediaId): void
    {
        $this->update(['featured_image_id' => $mediaId]);
    }

    /**
     * Изменить порядок изображений в галерее
     */
    public function reorderGallery(array $mediaIds): void
    {
        foreach ($mediaIds as $order => $mediaId) {
            $this->media()->updateExistingPivot($mediaId, ['order' => $order]);
        }
    }

    /**
     * Получить примерное время чтения (в минутах)
     */
    public function getReadingTimeAttribute(): int
    {
        $wordCount = str_word_count(strip_tags($this->content));
        $readingTime = ceil($wordCount / 200); // Средняя скорость чтения: 200 слов/мин

        return max(1, $readingTime);
    }

    /**
     * Автоматическая генерация slug при создании
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($news) {
            if (empty($news->slug)) {
                $news->slug = Str::slug($news->title);
            }

            // Установить статус по умолчанию
            if (empty($news->status)) {
                $news->status = 'draft';
            }
        });
    }

    // =============== SCOPES ===============

    /**
     * Только опубликованные новости
     */
    public function scopePublished(Builder $query): Builder
    {
        return $query->where('status', 'published')
            ->whereNotNull('published_at')
            ->where('published_at', '<=', now());
    }

    /**
     * Только черновики
     */
    public function scopeDraft(Builder $query): Builder
    {
        return $query->where('status', 'draft');
    }

    /**
     * Ожидают модерации
     */
    public function scopePending(Builder $query): Builder
    {
        return $query->whereIn('status', ['submitted', 'pending']);
    }

    /**
     * Избранные новости
     */
    public function scopeFeatured(Builder $query): Builder
    {
        return $query->where('featured', true);
    }

    /**
     * Фильтр по статусу
     */
    public function scopeStatus(Builder $query, string $status): Builder
    {
        return $query->where('status', $status);
    }

    /**
     * Фильтр по автору
     */
    public function scopeByAuthor(Builder $query, int $authorId): Builder
    {
        return $query->where('author_id', $authorId);
    }

    /**
     * Поиск по заголовку и контенту
     */
    public function scopeSearch(Builder $query, string $search): Builder
    {
        return $query->where(function ($q) use ($search) {
            $q->where('title', 'like', "%{$search}%")
              ->orWhere('content', 'like', "%{$search}%")
              ->orWhere('excerpt', 'like', "%{$search}%");
        });
    }

    /**
     * Последние новости
     */
    public function scopeLatest(Builder $query): Builder
    {
        return $query->orderBy('published_at', 'desc')
            ->orderBy('created_at', 'desc');
    }

    // =============== МЕТОДЫ ПРОВЕРКИ ===============

    /**
     * Проверка, опубликована ли новость
     */
    public function isPublished(): bool
    {
        return $this->status === 'published'
            && $this->published_at
            && $this->published_at->isPast();
    }

    /**
     * Проверка, является ли новость черновиком
     */
    public function isDraft(): bool
    {
        return $this->status === 'draft';
    }

    /**
     * Проверка, ожидает ли модерации
     */
    public function isPending(): bool
    {
        return in_array($this->status, ['submitted', 'pending']);
    }

    /**
     * Может ли пользователь редактировать эту новость
     */
    public function canBeEditedBy(User $user): bool
    {
        // Администратор может редактировать любые новости
        if ($user->isAdmin()) {
            return true;
        }

        // Автор может редактировать только свои черновики или отклоненные
        return $this->author_id === $user->id
            && in_array($this->status, ['draft', 'rejected']);
    }

    // =============== ДЕЙСТВИЯ ===============

    /**
     * Опубликовать новость
     */
    public function publish(): bool
    {
        return $this->update([
            'status' => 'published',
            'published_at' => $this->published_at ?? now(),
        ]);
    }

    /**
     * Снять с публикации
     */
    public function unpublish(): bool
    {
        return $this->update(['status' => 'unpublished']);
    }

    /**
     * Отправить на модерацию
     */
    public function submit(): bool
    {
        return $this->update(['status' => 'submitted']);
    }

    /**
     * Одобрить (модератор)
     */
    public function approve(): bool
    {
        return $this->update(['status' => 'approved']);
    }

    /**
     * Отклонить (модератор)
     */
    public function reject(): bool
    {
        return $this->update(['status' => 'rejected']);
    }

    /**
     * Архивировать
     */
    public function archive(): bool
    {
        return $this->update(['status' => 'archived']);
    }

    /**
     * Переключить избранное
     */
    public function toggleFeatured(): bool
    {
        return $this->update(['featured' => !$this->featured]);
    }
}
