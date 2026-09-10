<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Http\Requests\Document\StoreDocumentRequest;
use App\Http\Resources\DocumentResource;
use App\Models\Document;
use App\Models\Period;
use App\Services\DocumentService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
class DocumentController extends Controller {
 public function __construct(private DocumentService $documents) {}
 public function index(Request $request): JsonResponse { return $this->paginated($this->documents->paginate($request->only(['period_id','department_id','category','document_type','search']),$request->integer('per_page',20)),'OK',DocumentResource::class); }
 public function publicIndex(Request $request): JsonResponse { return $this->paginated($this->documents->paginate(array_merge($request->only(['period_id','department_id','category','document_type','search']),['is_published'=>true]),$request->integer('per_page',20)),'OK',DocumentResource::class); }
 public function store(StoreDocumentRequest $request): JsonResponse {
  $data=$request->validated(); $data['period_id'] ??= Period::active()->value('id'); $data['uploaded_by']=$request->user()->id;
  if(!$data['period_id']) throw ValidationException::withMessages(['period_id'=>'Belum ada periode aktif.']);
  if(isset($data['department_id']) && $data['department_id']) { $dept=\App\Models\Department::find($data['department_id']); if(!$dept || (int)$dept->period_id !== (int)$data['period_id']) throw ValidationException::withMessages(['department_id'=>'Departemen tidak sesuai periode.']); }
  $data['slug']=Str::slug($data['title']).'-'.Str::lower(Str::random(6));
  if($file=$request->file('file')) { $path=$file->store('documents/'.$data['period_id'],'public'); $data['file_url']=asset('storage/'.$path); $data['file_type']=strtolower($file->extension()); $data['file_size_kb']=max(1,(int)ceil($file->getSize()/1024)); unset($data['file']); }
  return $this->created(new DocumentResource($this->documents->create($data)));
 }
 public function update(StoreDocumentRequest $request, Document $document): JsonResponse {
  $data=$request->validated(); unset($data['period_id']);
  if(isset($data['department_id']) && $data['department_id']) { $dept=\App\Models\Department::find($data['department_id']); if(!$dept || (int)$dept->period_id !== (int)$document->period_id) throw ValidationException::withMessages(['department_id'=>'Departemen tidak sesuai periode dokumen.']); }
  if($file=$request->file('file')) { $path=$file->store('documents/'.$document->period_id,'public'); $data['file_url']=asset('storage/'.$path); $data['file_type']=strtolower($file->extension()); $data['file_size_kb']=max(1,(int)ceil($file->getSize()/1024)); unset($data['file']); }
  return $this->success(new DocumentResource($this->documents->update($document,$data)));
 }
 public function destroy(Document $document): JsonResponse { $this->documents->delete($document); return $this->success(null,'Document deleted.'); }
 public function download(Document $document): JsonResponse { abort_unless($document->is_published,404); $doc=$this->documents->incrementDownload($document); return $this->success(['file_url'=>$doc->file_url,'download_count'=>$doc->download_count]); }
}
