<?php

namespace App\Services;

use App\Models\NewsArticle;
use App\Repositories\NewsArticleRepository;
use Illuminate\Pagination\LengthAwarePaginator;

class NewsArticleService
{
    public function __construct(private NewsArticleRepository $articles)
    {
    }

    public function paginatePublished(array $filters, int $perPage = 9): LengthAwarePaginator
    {
        return $this->articles->paginate(
            $this->articles->publishedQuery($filters),
            $perPage
        );
    }

    public function findPublishedBySlug(string $slug): NewsArticle
    {
        $article = $this->articles->findPublishedBySlug($slug);

        abort_unless($article, 404, 'Article not found.');

        $article->incrementViewCount();

        return $article->fresh(['author', 'tags']);
    }

    public function create(array $data): NewsArticle
    {
        $tags = $data['tags'] ?? [];
        unset($data['tags']);

        /** @var NewsArticle $article */
        $article = $this->articles->create($data);
        $this->syncTags($article, $tags);

        return $article->load(['author', 'tags']);
    }

    public function update(NewsArticle $article, array $data): NewsArticle
    {
        $tags = $data['tags'] ?? null;
        unset($data['tags']);

        $article = $this->articles->update($article, $data);

        if (is_array($tags)) {
            $this->syncTags($article, $tags);
        }

        return $article->load(['author', 'tags']);
    }

    public function delete(NewsArticle $article): bool
    {
        return $this->articles->delete($article);
    }

    private function syncTags(NewsArticle $article, array $tags): void
    {
        $article->tags()->delete();

        foreach (array_filter($tags) as $tag) {
            $article->tags()->create(['tag' => $tag]);
        }
    }
}
