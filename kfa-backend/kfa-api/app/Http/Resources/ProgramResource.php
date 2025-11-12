<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProgramResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'slug' => $this->slug,
            'description' => $this->description,
            'program_type' => $this->program_type,
            'status' => $this->status,
            'duration' => $this->duration,
            'cpe_hours' => $this->cpe_hours,
            'language' => $this->language,
            'level' => $this->level,

            // Instructor
            'instructor' => $this->whenLoaded('instructor', function () {
                return ['id' => $this->instructor->id, 'name' => $this->instructor->name];
            }),
            'instructor_name' => $this->instructor_name,
            'instructor_bio' => $this->instructor_bio,

            // Content
            'syllabus' => $this->syllabus,
            'prerequisites' => $this->prerequisites,
            'target_audience' => $this->target_audience,
            'modules' => $this->modules,

            // Schedule
            'starts_at' => $this->starts_at?->toISOString(),
            'ends_at' => $this->ends_at?->toISOString(),
            'schedule' => $this->schedule,
            'enrollment_deadline' => $this->enrollment_deadline?->toISOString(),

            // Enrollment
            'max_students' => $this->max_students,
            'enrolled_count' => $this->enrolled_count,
            'available_spots' => $this->getAvailableSpots(),
            'requires_approval' => $this->requires_approval,
            'is_enrollment_open' => $this->isEnrollmentOpen(),

            // Pricing
            'price' => $this->price,
            'member_price' => $this->member_price,

            // Format
            'is_online' => $this->is_online,
            'location' => $this->location,
            'platform' => $this->platform,

            // Assessment
            'has_exam' => $this->has_exam,
            'passing_score' => $this->passing_score,
            'issues_certificate' => $this->issues_certificate,

            // Meta
            'image' => $this->image,
            'is_featured' => $this->is_featured,
            'published_at' => $this->published_at?->toISOString(),
            'created_at' => $this->created_at->toISOString(),
            'updated_at' => $this->updated_at->toISOString(),
        ];
    }
}
