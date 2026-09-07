<?php

namespace App\Http\Requests\Aspiration;

use Illuminate\Foundation\Http\FormRequest;

class StoreAspirationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'category' => ['required', 'in:academic,facility,internal,general,other'],
            'subject' => ['required', 'string', 'max:200'],
            'message' => ['required', 'string', 'max:5000'],
            'is_anonymous' => ['sometimes', 'boolean'],
            'is_public' => ['sometimes', 'boolean'],
            'sender_name' => ['required_if:is_anonymous,false', 'nullable', 'string', 'max:100'],
            'sender_email' => ['required_if:is_anonymous,false', 'nullable', 'email', 'max:150'],
            'sender_student_id' => ['nullable', 'string', 'max:20'],
        ];
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'subject' => strip_tags((string) $this->input('subject')),
            'message' => strip_tags((string) $this->input('message')),
            'sender_name' => $this->filled('sender_name') ? strip_tags((string) $this->input('sender_name')) : null,
        ]);
    }
}
