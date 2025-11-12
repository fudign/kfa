<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProgramEnrollmentResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'program' => $this->whenLoaded('program', fn() => new ProgramResource($this->program)),
            'user' => $this->whenLoaded('user', fn() => ['id' => $this->user->id, 'name' => $this->user->name, 'email' => $this->user->email]),
            'status' => $this->status,
            'amount_paid' => $this->amount_paid,
            'enrolled_at' => $this->enrolled_at?->toISOString(),
            'approved_at' => $this->approved_at?->toISOString(),
            'started_at' => $this->started_at?->toISOString(),
            'completed_at' => $this->completed_at?->toISOString(),
            'progress' => $this->progress,
            'exam_score' => $this->exam_score,
            'passed' => $this->passed,
            'notes' => $this->when($request->user()?->isAdmin(), $this->notes),
            'answers' => $this->answers,
            'certificate_issued' => $this->certificate_issued,
            'certificate_issued_at' => $this->certificate_issued_at?->toISOString(),
            'certificate_url' => $this->certificate_url,
            'cpe_hours_earned' => $this->cpe_hours_earned,
            'created_at' => $this->created_at->toISOString(),
            'updated_at' => $this->updated_at->toISOString(),
        ];
    }
}
