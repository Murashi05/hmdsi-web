<?php

namespace App\Http\Requests\Member;

use Illuminate\Foundation\Http\FormRequest;

class StoreMemberRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->canEdit() ?? false;
    }

    public function rules(): array
    {
        return [
            'full_name' => ['required', 'string', 'max:150'],
            'student_id' => ['required', 'string', 'max:20', 'unique:members,student_id'],
            'study_program' => ['sometimes', 'string', 'max:100'],
            'period_id' => ['nullable', 'integer', 'exists:periods,id'],
            'management_role_id' => ['nullable', 'integer', 'exists:management_roles,id'],
            'department_id' => ['nullable', 'integer', 'exists:departments,id'],
            'batch_year' => ['required', 'integer', 'min:2000'],
            'email' => ['nullable', 'email', 'max:150'],
            'phone' => ['nullable', 'string', 'max:30'],
            'photo_url' => ['nullable', 'url', 'max:500'],
            'linkedin_url' => ['nullable', 'url', 'max:255'],
            'instagram_handle' => ['nullable', 'string', 'max:80'],
            'bio' => ['nullable', 'string'],
        ];
    }
}
