<?php

namespace App\Services;

use App\Models\Document;
use App\Repositories\DocumentRepository;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

class DocumentService
{
    public function __construct(private DocumentRepository $documents)
    {
    }

    public function list(array $filters = []): Collection
    {
        return $this->documents
            ->query()
            ->with(['period', 'department', 'uploader'])
            ->when($filters['period_id'] ?? null, fn ($q, $id) => $q->where('period_id', (int) $id))
            ->when($filters['department_id'] ?? null, fn ($q, $id) => $q->where('department_id', (int) $id))
            ->when($filters['category'] ?? null, fn ($q, $cat) => $q->where('category', $cat))
            ->when($filters['document_type'] ?? null, fn ($q, $type) => $q->where('document_type', $type))
            ->when($filters['is_published'] !== null, fn ($q, $pub) => $q->where('is_published', (bool) $pub))
            ->latest()
            ->get();
    }

    public function paginate(array $filters, int $perPage = 20): LengthAwarePaginator
    {
        $query=$this->documents->query()->with(['period','department'])
            ->when(array_key_exists('is_published',$filters),fn($q)=>$q->where('is_published',(bool)$filters['is_published']))
            ->when($filters['period_id'] ?? null,fn($q,$v)=>$q->where('period_id',(int)$v))
            ->when($filters['department_id'] ?? null,fn($q,$v)=>$q->where('department_id',(int)$v))
            ->when($filters['category'] ?? null,fn($q,$v)=>$q->where('category',$v))
            ->when($filters['document_type'] ?? null,fn($q,$v)=>$q->where('document_type',$v))
            ->when($filters['search'] ?? null,fn($q,$v)=>$q->where(fn($i)=>$i->where('title','like','%'.$v.'%')->orWhere('description','like','%'.$v.'%')))
            ->latest();
        return $this->documents->paginate($query,$perPage);
    }

    public function create(array $data): Document
    {
        return $this->documents->create($data);
    }

    public function update(Document $document, array $data): Document
    {
        return $this->documents->update($document, $data);
    }

    public function delete(Document $document): bool
    {
        return $this->documents->delete($document);
    }

    public function incrementDownload(Document $document): Document
    {
        $document->increment('download_count');
        return $document->refresh();
    }
}