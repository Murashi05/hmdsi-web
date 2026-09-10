<?php

namespace App\Http\Requests\Gallery;

use Illuminate\Foundation\Http\FormRequest;

class StoreGalleryEventRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->canEdit() ?? false;
    }

    public function rules(): array
    {
        return [
            'period_id' => ['nullable', 'exists:periods,id'],
            'title' => ['required', 'string', 'max:200'],
            'slug' => ['sometimes', 'string', 'max:220'],
            'description' => ['nullable', 'string'],
            'event_date' => ['nullable', 'date'],
            'cover_image_url' => ['nullable', 'url', 'max:500'],
            'is_published' => ['sometimes', 'boolean'],
            'sort_order' => ['sometimes', 'integer'],
        ];
    }
}
