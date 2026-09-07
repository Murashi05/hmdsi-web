<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class WorkProgramResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'department_id' => $this->department_id,
            'period_id' => $this->period_id,
            'name' => $this->name,
            'slug' => $this->slug,
            'description' => $this->description,
            'objectives' => $this->objectives,
            'status' => $this->status,
            'planned_date' => optional($this->planned_date)?->toDateString(),
            'actual_date' => optional($this->actual_date)?->toDateString(),
            'planned_end_date' => optional($this->planned_end_date)?->toDateString(),
            'actual_end_date' => optional($this->actual_end_date)?->toDateString(),
            'is_highlight' => $this->is_highlight,
            'cover_image_url' => $this->cover_image_url,
            'participant_count' => $this->participant_count,
            'sort_order' => $this->sort_order,
            'tags' => $this->whenLoaded('tags', fn () => $this->tags->pluck('tag')),
            'department' => new DepartmentResource($this->whenLoaded('department')),
        ];
    }
}
