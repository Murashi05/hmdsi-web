<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AboutContentResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'period_id' => $this->period_id,
            'organization_history' => $this->organization_history,
            'vision' => $this->vision,
            'mission' => $this->mission,
            'values' => $this->values,
            'logo_url' => $this->logo_url,
            'logo_description' => $this->logo_description,
            'is_active' => $this->is_active,
            'period' => new PeriodResource($this->whenLoaded('period')),
        ];
    }
}
