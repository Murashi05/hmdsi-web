<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ManagementStructureResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'is_active' => $this->is_active,
            'joined_at' => optional($this->joined_at)?->toDateString(),
            'ended_at' => optional($this->ended_at)?->toDateString(),
            'member' => new MemberResource($this->whenLoaded('member')),
            'role' => new ManagementRoleResource($this->whenLoaded('role')),
            'department' => new DepartmentResource($this->whenLoaded('department')),
        ];
    }
}
