<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MemberResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $data = [
            'id' => $this->id,
            'full_name' => $this->full_name,
            'student_id' => $this->student_id,
            'study_program' => $this->study_program,
            'batch_year' => $this->batch_year,
            'photo_url' => $this->photo_url,
            'linkedin_url' => $this->linkedin_url,
            'instagram_handle' => $this->instagram_handle,
            'bio' => $this->bio,
        ];

        if ($this->relationLoaded('managementStructures')) {
            $data['management_assignments'] = $this->managementStructures->map(fn ($assignment) => [
                'id' => $assignment->id,
                'period_id' => $assignment->period_id,
                'is_active' => $assignment->is_active,
                'role' => $assignment->relationLoaded('role') ? [
                    'id' => $assignment->role->id,
                    'name' => $assignment->role->name,
                    'name_en' => $assignment->role->name_en,
                    'level' => $assignment->role->level,
                ] : null,
                'department' => $assignment->relationLoaded('department') ? [
                    'id' => $assignment->department->id,
                    'name' => $assignment->department->name,
                    'slug' => $assignment->department->slug,
                    'type' => $assignment->department->type,
                ] : null,
            ])->values();
        }

        if ($request->user()?->canEdit()) {
            $data['email'] = $this->email;
            $data['phone'] = $this->phone;
        }

        return $data;
    }
}
