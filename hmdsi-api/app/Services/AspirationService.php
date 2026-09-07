<?php

namespace App\Services;

use App\Models\Aspiration;
use App\Models\AspirationResponse;
use App\Models\User;
use App\Repositories\AspirationRepository;
use Illuminate\Pagination\LengthAwarePaginator;

class AspirationService
{
    public function __construct(private AspirationRepository $aspirations)
    {
    }

    public function submit(array $data): Aspiration
    {
        if (! empty($data['is_anonymous'])) {
            $data['sender_name'] = null;
            $data['sender_email'] = null;
            $data['sender_student_id'] = null;
        }

        $data['status'] = Aspiration::STATUS_SUBMITTED;

        return $this->aspirations->create($data);
    }

    public function track(string $code): Aspiration
    {
        $aspiration = $this->aspirations->findByTrackingCode($code);

        abort_unless($aspiration, 404, 'Tracking code not found.');

        return $aspiration;
    }

    public function publicPaginate(array $filters, int $perPage = 10): LengthAwarePaginator
    {
        return $this->aspirations->paginate(
            $this->aspirations->publicQuery($filters),
            $perPage
        );
    }

    public function adminPaginate(array $filters, int $perPage = 15): LengthAwarePaginator
    {
        $query = $this->aspirations->query()
            ->with('responses')
            ->when($filters['category'] ?? null, fn ($q, $c) => $q->byCategory($c))
            ->when($filters['status'] ?? null, fn ($q, $s) => $q->byStatus($s))
            ->latest();

        return $this->aspirations->paginate($query, $perPage);
    }

    public function stats(): array
    {
        $counts = $this->aspirations->statusCounts();

        return [
            'submitted' => (int) ($counts[Aspiration::STATUS_SUBMITTED] ?? 0),
            'under_review' => (int) ($counts[Aspiration::STATUS_UNDER_REVIEW] ?? 0),
            'in_progress' => (int) ($counts[Aspiration::STATUS_IN_PROGRESS] ?? 0),
            'resolved' => (int) ($counts[Aspiration::STATUS_RESOLVED] ?? 0),
            'rejected' => (int) ($counts[Aspiration::STATUS_REJECTED] ?? 0),
            'total' => array_sum($counts),
        ];
    }

    public function updateStatus(Aspiration $aspiration, string $status): Aspiration
    {
        $payload = ['status' => $status];

        if ($status === Aspiration::STATUS_RESOLVED) {
            $payload['resolved_at'] = now();
        }

        return $this->aspirations->update($aspiration, $payload);
    }

    public function respond(Aspiration $aspiration, User $user, string $message, bool $isPublic = true): AspirationResponse
    {
        return $aspiration->responses()->create([
            'responded_by' => $user->id,
            'message' => $message,
            'is_public' => $isPublic,
        ]);
    }
}
