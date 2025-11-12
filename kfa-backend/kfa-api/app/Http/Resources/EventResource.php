<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class EventResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'slug' => $this->slug,
            'description' => $this->description,
            'event_type' => $this->event_type,
            'type' => $this->event_type, // Alias for frontend compatibility
            'status' => $this->status,
            'cpe_hours' => $this->cpe_hours,
            'level' => $this->level,

            // Speaker info
            'speaker' => $this->whenLoaded('speaker', function () {
                return [
                    'id' => $this->speaker->id,
                    'name' => $this->speaker->name,
                ];
            }),
            'speaker_name' => $this->speaker_name,
            'speaker_bio' => $this->speaker_bio,
            'instructor' => $this->speaker_name, // Alias for frontend compatibility
            'instructor_name' => $this->speaker_name, // Additional alias

            // Pricing
            'price' => $this->price,
            'member_price' => $this->member_price,

            // Location & format
            'is_online' => $this->is_online,
            'location' => $this->location,
            'meeting_link' => $this->when($this->is_online && $request->user(), $this->meeting_link),
            'meeting_password' => $this->when($this->is_online && $request->user(), $this->meeting_password),

            // Schedule
            'starts_at' => $this->starts_at?->toISOString(),
            'ends_at' => $this->ends_at?->toISOString(),
            'registration_deadline' => $this->registration_deadline?->toISOString(),
            'date' => $this->starts_at?->toDateString(), // Alias: just the date part
            'start_time' => $this->starts_at?->format('H:i'), // Alias: just the time part
            'end_time' => $this->ends_at?->format('H:i'), // Alias: just the time part

            // Registration info
            'max_participants' => $this->max_participants,
            'registered_count' => $this->registered_count,
            'available_spots' => $this->hasAvailableSpots() ?
                ($this->max_participants ? $this->max_participants - $this->registered_count : null) : 0,
            'capacity' => $this->max_participants, // Alias for frontend compatibility
            'seats_available' => $this->hasAvailableSpots() ?
                ($this->max_participants ? $this->max_participants - $this->registered_count : null) : 0, // Alias
            'requires_approval' => $this->requires_approval,
            'is_registration_open' => $this->isRegistrationOpen(),

            // Materials
            'agenda' => $this->agenda,
            'materials' => $this->materials,
            'issues_certificate' => $this->issues_certificate,

            // Admin fields
            'certificate_template' => $this->when($request->user()?->isAdmin(), $this->certificate_template),
            'created_by' => $this->when($request->user()?->isAdmin(), $this->created_by),

            // Meta
            'image' => $this->image,
            'is_featured' => $this->is_featured,
            'published_at' => $this->published_at?->toISOString(),
            'created_at' => $this->created_at->toISOString(),
            'updated_at' => $this->updated_at->toISOString(),
        ];
    }
}
