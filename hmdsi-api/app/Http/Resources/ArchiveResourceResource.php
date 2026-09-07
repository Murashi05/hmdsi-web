<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ArchiveResourceResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'description' => $this->description,
            'category' => $this->category,
            'file_url' => $this->file_url,
            'file_type' => $this->file_type,
            'file_size_kb' => $this->file_size_kb,
            'academic_year' => $this->academic_year,
            'semester' => $this->semester,
            'subject' => $this->subject,
            'download_count' => $this->download_count,
        ];
    }
}
