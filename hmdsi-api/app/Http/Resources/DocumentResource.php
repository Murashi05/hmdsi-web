<?php
namespace App\Http\Resources;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
class DocumentResource extends JsonResource {
 public function toArray(Request $request): array { return [
  'id'=>$this->id,'period_id'=>$this->period_id,'department_id'=>$this->department_id,'title'=>$this->title,'slug'=>$this->slug,
  'description'=>$this->description,'file_url'=>$this->file_url,'file_type'=>$this->file_type,'file_size_kb'=>(int)$this->file_size_kb,
  'category'=>$this->category,'document_type'=>$this->document_type,'is_published'=>$this->is_published,'download_count'=>$this->download_count,
  'period'=>new PeriodResource($this->whenLoaded('period')),'department'=>new DepartmentResource($this->whenLoaded('department')),
 ]; }
}
