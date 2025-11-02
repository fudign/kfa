<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateEventRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $eventId = $this->route('event')->id;
        
        return [
            'title' => 'sometimes|required|string|max:255',
            'slug' => 'sometimes|required|string|unique:events,slug,' . $eventId,
            'description' => 'sometimes|required|string',
            'location' => 'nullable|string|max:255',
            'starts_at' => 'sometimes|required|date',
            'ends_at' => 'nullable|date|after:starts_at',
            'capacity' => 'nullable|integer|min:1',
            'image' => 'nullable|string',
        ];
    }
}
