<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CertificationResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'certificate_number' => $this->certificate_number,
            'status' => $this->status,
            'application_date' => $this->application_date?->format('Y-m-d'),
            'exam_date' => $this->exam_date?->format('Y-m-d'),
            'issued_date' => $this->issued_date?->format('Y-m-d'),
            'expiry_date' => $this->expiry_date?->format('Y-m-d'),
            'exam_score' => $this->exam_score,
            'cpe_hours_completed' => $this->cpe_hours_completed,
            'notes' => $this->when($request->user()?->isAdmin(), $this->notes),
            'exam_results' => $this->when($request->user()?->isAdmin() || $request->user()?->id === $this->user_id, $this->exam_results),
            'certificate_url' => $this->certificate_url,
            'qr_code_url' => $this->qr_code_url,
            'is_active' => $this->isActive(),
            'is_expired' => $this->isExpired(),
            'days_until_expiry' => $this->days_until_expiry,

            // Relationships
            'user' => $this->whenLoaded('user', function () {
                return [
                    'id' => $this->user->id,
                    'name' => $this->user->name,
                    'email' => $this->user->email,
                ];
            }),
            'program' => $this->whenLoaded('program', function () {
                return [
                    'id' => $this->program->id,
                    'name' => $this->program->name,
                    'code' => $this->program->code,
                    'type' => $this->program->type,
                ];
            }),
            'reviewer' => $this->whenLoaded('reviewer', function () {
                return $this->reviewer ? [
                    'id' => $this->reviewer->id,
                    'name' => $this->reviewer->name,
                ] : null;
            }),

            'reviewed_at' => $this->reviewed_at?->format('Y-m-d H:i:s'),
            'created_at' => $this->created_at?->format('Y-m-d H:i:s'),
            'updated_at' => $this->updated_at?->format('Y-m-d H:i:s'),
        ];
    }
}
