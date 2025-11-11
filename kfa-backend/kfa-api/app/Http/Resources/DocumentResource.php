<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DocumentResource extends JsonResource
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
            'title' => $this->title,
            'slug' => $this->slug,
            'description' => $this->description,
            'category' => $this->category,
            'file_url' => $this->file_url,
            'file_type' => $this->file_type,
            'file_size' => $this->file_size,
            'file_size_formatted' => $this->file_size_formatted,
            'download_count' => $this->download_count,
            'is_public' => $this->is_public,
            'order' => $this->order,
            'uploaded_by' => $this->uploaded_by,
            'uploader' => $this->whenLoaded('uploader', function () {
                return [
                    'id' => $this->uploader->id,
                    'name' => $this->uploader->name,
                    'email' => $this->uploader->email,
                ];
            }),
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
