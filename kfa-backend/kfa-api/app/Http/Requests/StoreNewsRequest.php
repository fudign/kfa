<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreNewsRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // Authorization handled by middleware
    }

    public function rules(): array
    {
        return [
            'title' => 'required|string|max:255',
            'slug' => 'nullable|string|unique:news,slug|max:255',
            'content' => 'required|string|min:10',
            'excerpt' => 'nullable|string|max:500',
            'image' => 'nullable|string', // Устаревшее поле, сохраняем для обратной совместимости
            'published_at' => 'nullable|date',
            'status' => 'nullable|in:draft,submitted,pending,approved,rejected,published,unpublished,archived',
            'featured' => 'nullable|boolean',
            'featured_image_id' => 'nullable|exists:media,id',
            'gallery_ids' => 'nullable|array',
            'gallery_ids.*' => 'exists:media,id',
        ];
    }

    public function messages(): array
    {
        return [
            'title.required' => 'Заголовок обязателен для заполнения',
            'title.max' => 'Заголовок не должен превышать 255 символов',
            'slug.unique' => 'Такой URL уже существует',
            'slug.max' => 'URL не должен превышать 255 символов',
            'content.required' => 'Содержимое обязательно для заполнения',
            'content.min' => 'Содержимое должно содержать минимум 10 символов',
            'excerpt.max' => 'Краткое описание не должно превышать 500 символов',
            'published_at.date' => 'Некорректная дата публикации',
            'status.in' => 'Некорректный статус новости',
            'featured_image_id.exists' => 'Выбранное изображение не существует',
            'gallery_ids.array' => 'Галерея должна быть массивом',
            'gallery_ids.*.exists' => 'Одно или несколько изображений галереи не существуют',
        ];
    }

    protected function prepareForValidation()
    {
        // Автоматическая генерация slug из заголовка, если не указан
        if (!$this->slug && $this->title) {
            $this->merge([
                'slug' => \Illuminate\Support\Str::slug($this->title)
            ]);
        }

        // Установить статус по умолчанию, если не указан
        if (!$this->status) {
            $this->merge([
                'status' => 'draft'
            ]);
        }
    }
}
