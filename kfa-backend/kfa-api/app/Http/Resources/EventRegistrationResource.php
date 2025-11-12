<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class EventRegistrationResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'event' => $this->whenLoaded('event', fn() => new EventResource($this->event)),
            'user' => $this->whenLoaded('user', fn() => ['id' => $this->user->id, 'name' => $this->user->name, 'email' => $this->user->email]),
            'status' => $this->status,
            'amount_paid' => $this->amount_paid,
            'registered_at' => $this->registered_at?->toISOString(),
            'approved_at' => $this->approved_at?->toISOString(),
            'attended_at' => $this->attended_at?->toISOString(),
            'notes' => $this->when($request->user()?->isAdmin(), $this->notes),
            'answers' => $this->answers,
            'certificate_issued' => $this->certificate_issued,
            'certificate_issued_at' => $this->certificate_issued_at?->toISOString(),
            'cpe_hours_earned' => $this->cpe_hours_earned,
            'created_at' => $this->created_at->toISOString(),
            'updated_at' => $this->updated_at->toISOString(),
        ];
    }
}
