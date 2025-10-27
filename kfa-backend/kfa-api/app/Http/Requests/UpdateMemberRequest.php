<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateMemberRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $memberId = $this->route('member')->id;
        
        return [
            'name' => 'sometimes|required|string|max:255',
            'email' => 'sometimes|required|email|unique:members,email,' . $memberId,
            'company' => 'nullable|string|max:255',
            'position' => 'nullable|string|max:255',
            'photo' => 'nullable|string',
            'bio' => 'nullable|string',
            'joined_at' => 'nullable|date',
        ];
    }
}
