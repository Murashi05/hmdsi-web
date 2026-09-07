<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class GalleryEventResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'period_id' => $this->period_id,
            'title' => $this->title,
            'slug' => $this->slug,
            'description' => $this->description,
            'event_date' => optional($this->event_date)?->toDateString(),
            'cover_image_url' => $this->cover,
            'is_published' => $this->is_published,
            'items_count' => $this->whenCounted('items'),
            'items' => GalleryItemResource::collection($this->whenLoaded('items')),
        ];
    }
}
