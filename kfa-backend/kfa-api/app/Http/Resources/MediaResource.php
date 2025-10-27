<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MediaResource extends JsonResource
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
            'filename' => $this->filename,
            'path' => $this->path,
            'disk' => $this->disk,
            'mime_type' => $this->mime_type,
            'size' => $this->size,
            'human_size' => $this->human_size,
            'width' => $this->width,
            'height' => $this->height,
            'metadata' => $this->metadata,

            // URLs
            'url' => $this->url,
            'thumbnail_url' => $this->thumbnail_url,

            // Type helpers
            'is_image' => $this->isImage(),
            'is_pdf' => $this->isPdf(),
            'is_document' => $this->isDocument(),

            // Uploader information
            'uploader' => new UserResource($this->whenLoaded('uploader')),
            'uploaded_by' => $this->uploaded_by,

            // Timestamps
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
