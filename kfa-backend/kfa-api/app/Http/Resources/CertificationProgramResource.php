<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CertificationProgramResource extends JsonResource
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
            'name' => $this->name,
            'slug' => $this->slug,
            'code' => $this->code,
            'type' => $this->type,
            'description' => $this->description,
            'requirements' => $this->requirements,
            'curriculum' => $this->curriculum,
            'duration_hours' => $this->duration_hours,
            'exam_fee' => $this->exam_fee,
            'certification_fee' => $this->certification_fee,
            'total_fee' => $this->exam_fee + $this->certification_fee,
            'validity_months' => $this->validity_months,
            'cpe_hours_required' => $this->cpe_hours_required,
            'is_active' => $this->is_active,
            'order' => $this->order,
            'active_certifications_count' => $this->whenLoaded('certifications', function () {
                return $this->certifications->where('status', 'passed')
                    ->filter(fn($c) => !$c->expiry_date || $c->expiry_date->isFuture())
                    ->count();
            }),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
