<?php

namespace App\Http\Requests\WorkProgram;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreWorkProgramRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->canEdit() ?? false;
    }

    public function rules(): array
    {
        return [
            'period_id' => ['required', 'exists:periods,id'],
            'department_id' => ['required', 'exists:departments,id'],
            'name' => ['required', 'string', 'max:200'],
            'slug' => ['sometimes', 'string', 'max:220', Rule::unique('work_programs', 'slug')->ignore($this->route('workProgram'))],
            'description' => ['nullable', 'string'],
            'objectives' => ['nullable', 'string'],
            'status' => ['required', 'in:planned,in_progress,completed,postponed,cancelled'],
            'planned_date' => ['nullable', 'date'],
            'actual_date' => ['nullable', 'date'],
            'planned_end_date' => ['nullable', 'date'],
            'actual_end_date' => ['nullable', 'date'],
            'cover_image_url' => ['nullable', 'url', 'max:500'],
            'is_highlight' => ['sometimes', 'boolean'],
            'sort_order' => ['sometimes', 'integer'],
            'tags' => ['sometimes', 'array'],
            'tags.*' => ['string', 'max:50'],
        ];
    }
}
