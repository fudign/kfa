<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class NewsResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'slug' => $this->slug,
            'content' => $this->content,
            'excerpt' => $this->excerpt,
            'image' => $this->image, // Устаревшее поле, сохраняем для обратной совместимости
            'status' => $this->status,
            'featured' => $this->featured,
            'reading_time' => $this->reading_time, // Вычисляемое поле из модели
            'published_at' => $this->published_at?->toISOString(),
            'created_at' => $this->created_at->toISOString(),
            'updated_at' => $this->updated_at->toISOString(),

            // Автор
            'author' => [
                'id' => $this->author->id ?? null,
                'name' => $this->author->name ?? null,
                'email' => $this->author->email ?? null,
            ],

            // Главное изображение
            'featured_image' => $this->whenLoaded('featuredImage', function () {
                return $this->featuredImage ? new MediaResource($this->featuredImage) : null;
            }),

            // Галерея изображений
            'gallery' => $this->whenLoaded('gallery', function () {
                return MediaResource::collection($this->gallery);
            }),

            // Статусы для UI
            'is_published' => $this->isPublished(),
            'is_draft' => $this->isDraft(),
            'is_pending' => $this->isPending(),

            // Дополнительные метаданные
            'can_edit' => $this->when($request->user(), function () use ($request) {
                return $this->canBeEditedBy($request->user());
            }),
        ];
    }
}
