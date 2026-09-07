<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class GalleryItemResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'file_url' => $this->file_url,
            'thumbnail_url' => $this->thumbnail_url,
            'type' => $this->type,
            'caption' => $this->caption,
            'sort_order' => $this->sort_order,
        ];
    }
}
