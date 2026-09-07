<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AspirationResponseResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'message' => $this->message,
            'is_public' => $this->is_public,
            'created_at' => optional($this->created_at)?->toIso8601String(),
            'responded_by' => $this->whenLoaded('respondedBy', fn () => [
                'id' => $this->respondedBy->id,
                'name' => $this->respondedBy->name,
            ]),
        ];
    }
}
