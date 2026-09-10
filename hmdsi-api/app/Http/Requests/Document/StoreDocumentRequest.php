<?php
namespace App\Http\Requests\Document;
use Illuminate\Foundation\Http\FormRequest;
class StoreDocumentRequest extends FormRequest {
 public function authorize(): bool { return $this->user()?->canEdit() ?? false; }
 public function rules(): array { return [
  'period_id'=>['nullable','integer','exists:periods,id'],'department_id'=>['nullable','integer','exists:departments,id'],
  'title'=>['required','string','max:200'],'description'=>['nullable','string'],
  'category'=>['required','in:proposal,surat,laporan,lpj,sk,dokumen_kepengurusan,kegiatan,template,other'],
  'document_type'=>['nullable','string','max:50'], 'file'=>['nullable','file','max:20480'],
  'file_url'=>['nullable','url','max:500','required_without:file'],'file_type'=>['nullable','string','max:10'],
  'file_size_kb'=>['nullable','integer','min:1'],'is_published'=>['sometimes','boolean'],
 ]; }
}
