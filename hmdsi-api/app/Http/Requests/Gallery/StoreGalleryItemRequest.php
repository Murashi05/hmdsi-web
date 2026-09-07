<?php

namespace App\Http\Requests\Gallery;

use Illuminate\Foundation\Http\FormRequest;

class StoreGalleryItemRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->canEdit() ?? false;
    }

    public function rules(): array
    {
        return [
            'file_url' => ['required', 'url', 'max:500'],
            'thumbnail_url' => ['nullable', 'url', 'max:500'],
            'type' => ['required', 'in:photo,video'],
            'caption' => ['nullable', 'string', 'max:255'],
            'cloudinary_public_id' => ['nullable', 'string', 'max:255'],
            'sort_order' => ['sometimes', 'integer'],
        ];
    }
}
