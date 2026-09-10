<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\News\StoreNewsArticleRequest;
use App\Http\Resources\NewsArticleResource;
use App\Models\NewsArticle;
use App\Services\NewsArticleService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class NewsArticleController extends Controller
{
    public function __construct(private NewsArticleService $articles)
    {
    }

    public function index(Request $request): JsonResponse
    {
        $paginator = $this->articles->paginatePublished(
            $request->only(['category', 'search', 'is_featured']),
            $request->integer('per_page', 9)
        );

        return $this->paginated($paginator, 'OK', NewsArticleResource::class);
    }

    public function adminIndex(Request $request): JsonResponse
    {
        $paginator=$this->articles->adminPaginate($request->only(['category','status']),$request->integer('per_page',20));
        return $this->paginated($paginator,'OK',NewsArticleResource::class);
    }

    public function show(string $slug): JsonResponse
    {
        return $this->success(new NewsArticleResource($this->articles->findPublishedBySlug($slug)));
    }

    public function store(StoreNewsArticleRequest $request): JsonResponse
    {
        $data = $request->validated();
        $data['author_id'] = $request->user()->id;

        return $this->created(new NewsArticleResource($this->articles->create($data)));
    }

    public function update(StoreNewsArticleRequest $request, NewsArticle $newsArticle): JsonResponse
    {
        return $this->success(new NewsArticleResource($this->articles->update($newsArticle, $request->validated())));
    }

    public function destroy(NewsArticle $newsArticle): JsonResponse
    {
        $this->articles->delete($newsArticle);

        return $this->success(null, 'Article deleted.');
    }
}
