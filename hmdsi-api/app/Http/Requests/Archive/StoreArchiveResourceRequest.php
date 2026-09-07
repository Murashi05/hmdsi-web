<?php

namespace App\Http\Requests\Archive;

use Illuminate\Foundation\Http\FormRequest;

class StoreArchiveResourceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->canEdit() ?? false;
    }

    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:200'],
            'description' => ['nullable', 'string'],
            'category' => ['required', 'in:syllabus,exam_bank,module,org_template,other'],
            'file_url' => ['required', 'url', 'max:500'],
            'file_type' => ['nullable', 'string', 'max:10'],
            'file_size_kb' => ['nullable', 'integer'],
            'academic_year' => ['nullable', 'string', 'max:10'],
            'semester' => ['nullable', 'integer', 'in:1,2'],
            'subject' => ['nullable', 'string', 'max:100'],
            'is_published' => ['sometimes', 'boolean'],
        ];
    }
}
