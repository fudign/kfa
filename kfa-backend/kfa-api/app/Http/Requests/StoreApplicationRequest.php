<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreApplicationRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true; // Authorization handled by middleware
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'membershipType' => 'required|in:individual,corporate',
            'firstName' => 'required|string|max:255',
            'lastName' => 'required|string|max:255',
            'organizationName' => 'required_if:membershipType,corporate|nullable|string|max:255',
            'position' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:membership_applications,email',
            'phone' => 'required|string|max:50',
            'experience' => 'required|string',
            'motivation' => 'required|string|min:100',
            'agreeToTerms' => 'required|accepted',
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'membershipType.required' => 'Membership type is required',
            'membershipType.in' => 'Invalid membership type',
            'firstName.required' => 'First name is required',
            'lastName.required' => 'Last name is required',
            'organizationName.required_if' => 'Organization name is required for corporate membership',
            'position.required' => 'Position is required',
            'email.required' => 'Email is required',
            'email.email' => 'Invalid email format',
            'email.unique' => 'An application with this email already exists',
            'phone.required' => 'Phone number is required',
            'experience.required' => 'Experience description is required',
            'motivation.required' => 'Motivation is required',
            'motivation.min' => 'Motivation must be at least 100 characters',
            'agreeToTerms.required' => 'You must agree to the terms',
            'agreeToTerms.accepted' => 'You must agree to the terms',
        ];
    }
}
