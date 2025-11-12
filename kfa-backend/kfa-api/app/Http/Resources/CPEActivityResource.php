<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CPEActivityResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'user' => $this->whenLoaded('user', fn() => ['id' => $this->user->id, 'name' => $this->user->name]),
            'activity_type' => $this->activity_type,
            'activity_id' => $this->activity_id,
            'title' => $this->title,
            'description' => $this->description,
            'category' => $this->category,
            'hours' => $this->hours,
            'activity_date' => $this->activity_date?->toDateString(),
            'status' => $this->status,
            'evidence' => $this->evidence,
            'attachments' => $this->attachments,
            'approver' => $this->whenLoaded('approver', fn() => ['id' => $this->approver->id, 'name' => $this->approver->name]),
            'approved_at' => $this->approved_at?->toISOString(),
            'rejection_reason' => $this->when($this->status === 'rejected', $this->rejection_reason),
            'created_at' => $this->created_at->toISOString(),
            'updated_at' => $this->updated_at->toISOString(),
        ];
    }
}
