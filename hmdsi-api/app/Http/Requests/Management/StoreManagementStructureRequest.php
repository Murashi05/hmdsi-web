<?php

namespace App\Http\Requests\Management;

use Illuminate\Foundation\Http\FormRequest;

class StoreManagementStructureRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->canEdit() ?? false;
    }

    public function rules(): array
    {
        return [
            'period_id' => ['required', 'exists:periods,id'],
            'member_id' => ['required', 'exists:members,id'],
            'department_id' => ['required', 'exists:departments,id'],
            'role_id' => ['required', 'exists:management_roles,id'],
            'is_active' => ['sometimes', 'boolean'],
            'joined_at' => ['nullable', 'date'],
            'ended_at' => ['nullable', 'date'],
        ];
    }
}
