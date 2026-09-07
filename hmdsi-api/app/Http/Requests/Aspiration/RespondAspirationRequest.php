<?php

namespace App\Http\Requests\Aspiration;

use Illuminate\Foundation\Http\FormRequest;

class RespondAspirationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->canEdit() ?? false;
    }

    public function rules(): array
    {
        return [
            'message' => ['required', 'string', 'max:5000'],
            'is_public' => ['sometimes', 'boolean'],
            'status' => ['sometimes', 'in:submitted,under_review,in_progress,resolved,rejected'],
        ];
    }
}
