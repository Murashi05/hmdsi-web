<?php

namespace App\Repositories;

use App\Models\Document;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

class DocumentRepository
{
    public function __construct(protected Model $model)
    {
    }

    public function query(): Builder
    {
        return $this->model->newQuery();
    }

    public function find(int $id): ?Model
    {
        return $this->model->find($id);
    }

    public function findOrFail(int $id): Model
    {
        return $this->model->findOrFail($id);
    }

    public function create(array $data): Document
    {
        return $this->model->create($data);
    }

    public function update(Document $model, array $data): Document
    {
        $model->update($data);

        return $model->refresh();
    }

    public function delete(Document $model): bool
    {
        return (bool) $model->delete();
    }

    public function paginate(Builder $query, int $perPage = 12): LengthAwarePaginator
    {
        return $query->paginate($perPage);
    }

    public function byCategory(string $category, Builder $query = null): Builder
    {
        $query ??= $this->query();
        return $query->where('category', $category);
    }

    public function published(Builder $query = null): Builder
    {
        $query ??= $this->query();
        return $query->where('is_published', true);
    }
}