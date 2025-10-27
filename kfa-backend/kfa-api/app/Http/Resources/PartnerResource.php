<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PartnerResource extends JsonResource
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
            'description' => $this->description,
            'logo' => $this->logo,
            'website' => $this->website,
            'email' => $this->email,
            'phone' => $this->phone,

            // Category and status
            'category' => $this->category,
            'category_label' => $this->category_label,
            'status' => $this->status,
            'status_label' => $this->status_label,

            // Display settings
            'is_featured' => $this->is_featured,
            'display_order' => $this->display_order,

            // Social links
            'social_links' => $this->social_links,

            // Timestamps
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
