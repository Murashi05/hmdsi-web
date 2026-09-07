<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DepartmentResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'period_id' => $this->period_id,
            'name' => $this->name,
            'name_en' => $this->name_en,
            'slug' => $this->slug,
            'type' => $this->type,
            'description' => $this->description,
            'icon' => $this->icon,
            'sort_order' => $this->sort_order,
        ];
    }
}
