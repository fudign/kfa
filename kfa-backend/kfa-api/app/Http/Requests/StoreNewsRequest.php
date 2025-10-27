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
            'slug' => 'required|string|unique:news,slug',
            'content' => 'required|string',
            'excerpt' => 'nullable|string',
            'image' => 'nullable|string',
            'published_at' => 'nullable|date',
            'status' => 'nullable|in:draft,submitted,pending,approved,rejected,published,unpublished,archived',
        ];
    }
}
