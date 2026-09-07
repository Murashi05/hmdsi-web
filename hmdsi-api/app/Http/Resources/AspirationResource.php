<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AspirationResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'tracking_code' => $this->tracking_code,
            'category' => $this->category,
            'subject' => $this->subject,
            'message' => $this->message,
            'status' => $this->status,
            'is_anonymous' => $this->is_anonymous,
            'display_name' => $this->display_name,
            'is_public' => $this->is_public,
            'resolved_at' => optional($this->resolved_at)?->toIso8601String(),
            'created_at' => optional($this->created_at)?->toIso8601String(),
            'responses' => AspirationResponseResource::collection($this->whenLoaded('publicResponses')),
        ];
    }
}
