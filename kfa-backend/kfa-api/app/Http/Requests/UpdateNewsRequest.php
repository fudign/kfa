<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateNewsRequest extends FormRequest
{
    public function authorize(): bool
    {
        $news = $this->route('news');
        $user = auth()->user();

        // User must be the author OR an admin
        return $news->author_id === $user->id || $user->isAdmin();
    }

    public function rules(): array
    {
        $newsId = $this->route('news')->id;
        
        return [
            'title' => 'sometimes|required|string|max:255',
            'slug' => 'sometimes|required|string|unique:news,slug,' . $newsId,
            'content' => 'sometimes|required|string',
            'excerpt' => 'nullable|string',
            'image' => 'nullable|string',
            'published_at' => 'nullable|date',
            'status' => 'sometimes|in:draft,submitted,pending,approved,rejected,published,unpublished,archived',
        ];
    }
}
