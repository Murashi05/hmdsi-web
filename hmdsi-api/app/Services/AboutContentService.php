<?php

namespace App\Services;

use App\Models\AboutContent;
use App\Repositories\AboutContentRepository;

class AboutContentService
{
    public function __construct(private AboutContentRepository $contents)
    {
    }

    public function active(): ?AboutContent
    {
        return $this->contents->findActive();
    }

    public function update(AboutContent $content, array $data): AboutContent
    {
        return $this->contents->update($content, $data);
    }

    public function create(array $data): AboutContent
    {
        return $this->contents->create($data);
    }
}
