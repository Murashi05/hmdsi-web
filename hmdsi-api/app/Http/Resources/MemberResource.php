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
            'photo_url' => $this->photo,
            'linkedin_url' => $this->linkedin_url,
            'instagram_handle' => $this->instagram_handle,
            'bio' => $this->bio,
        ];

        if ($request->user()?->canEdit()) {
            $data['email'] = $this->email;
            $data['phone'] = $this->phone;
        }

        return $data;
    }
}
