<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProgramRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $programId = $this->route('program')->id;
        
        return [
            'title' => 'sometimes|required|string|max:255',
            'slug' => 'sometimes|required|string|unique:programs,slug,' . $programId,
            'description' => 'sometimes|required|string',
            'duration' => 'nullable|string|max:255',
            'level' => 'nullable|string|max:255',
            'price' => 'nullable|numeric|min:0',
            'image' => 'nullable|string',
            'syllabus' => 'nullable|array',
        ];
    }
}
