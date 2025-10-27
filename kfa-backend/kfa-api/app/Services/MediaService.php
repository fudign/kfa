<?php

namespace App\Services;

use App\Models\Media;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Exception;

class MediaService
{
    /**
     * Allowed mime types for upload
     */
    protected array $allowedMimeTypes = [
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/gif',
        'image/webp',
        'image/svg+xml',
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];

    /**
     * Max file size in bytes (5MB default)
     */
    protected int $maxFileSize = 5 * 1024 * 1024;

    /**
     * Thumbnail sizes
     */
    protected array $thumbnailSizes = [
        'thumbnail' => 200,
        'small' => 400,
        'medium' => 800,
        'large' => 1200,
    ];

    /**
     * Upload and process file
     */
    public function upload(UploadedFile $file, int $userId, string $collection = 'default'): Media
    {
        // Validate
        $this->validateFile($file);

        // Generate unique filename
        $filename = $this->generateFilename($file);
        $path = 'media/' . date('Y/m/d');

        // Store original file
        $fullPath = $file->storeAs($path, $filename, 'public');

        // Get dimensions for images
        [$width, $height] = $this->getImageDimensions($file);

        // Create thumbnails if image
        $thumbnails = [];
        if ($this->isImage($file->getMimeType())) {
            $thumbnails = $this->createThumbnails($file, $path, $filename);
        }

        // Create media record
        return Media::create([
            'filename' => $file->getClientOriginalName(),
            'path' => $fullPath,
            'disk' => 'public',
            'mime_type' => $file->getMimeType(),
            'size' => $file->getSize(),
            'width' => $width,
            'height' => $height,
            'metadata' => [
                'thumbnails' => $thumbnails,
                'collection' => $collection,
            ],
            'uploaded_by' => $userId,
        ]);
    }

    /**
     * Validate uploaded file
     */
    protected function validateFile(UploadedFile $file): void
    {
        // Check mime type
        if (!in_array($file->getMimeType(), $this->allowedMimeTypes)) {
            throw new Exception('Неподдерживаемый тип файла. Разрешены: JPG, PNG, WebP, SVG, GIF, PDF, DOC, DOCX');
        }

        // Check file size
        if ($file->getSize() > $this->maxFileSize) {
            $maxSizeMB = $this->maxFileSize / 1024 / 1024;
            throw new Exception("Размер файла не должен превышать {$maxSizeMB}MB");
        }

        // Check if file is valid
        if (!$file->isValid()) {
            throw new Exception('Файл поврежден или не может быть загружен');
        }
    }

    /**
     * Generate unique filename
     */
    protected function generateFilename(UploadedFile $file): string
    {
        $extension = $file->getClientOriginalExtension();
        return Str::random(40) . '.' . $extension;
    }

    /**
     * Get image dimensions
     */
    protected function getImageDimensions(UploadedFile $file): array
    {
        if (!$this->isImage($file->getMimeType())) {
            return [null, null];
        }

        if ($file->getMimeType() === 'image/svg+xml') {
            return [null, null]; // SVG doesn't have fixed dimensions
        }

        try {
            $imageSize = getimagesize($file->getRealPath());
            return [$imageSize[0], $imageSize[1]];
        } catch (Exception $e) {
            return [null, null];
        }
    }

    /**
     * Create thumbnails for images
     */
    protected function createThumbnails(UploadedFile $file, string $path, string $filename): array
    {
        if ($file->getMimeType() === 'image/svg+xml') {
            return []; // Don't create thumbnails for SVG
        }

        $thumbnails = [];

        try {
            // For now, just return empty array
            // In production, you would use Intervention Image or similar
            // to create actual thumbnails

            // Example structure:
            // $thumbnails = [
            //     'thumbnail' => 'path/to/thumbnail.jpg',
            //     'small' => 'path/to/small.jpg',
            //     'medium' => 'path/to/medium.jpg',
            //     'large' => 'path/to/large.jpg',
            // ];

        } catch (Exception $e) {
            // Log error but don't fail upload
            logger()->error('Failed to create thumbnails: ' . $e->getMessage());
        }

        return $thumbnails;
    }

    /**
     * Check if mime type is image
     */
    protected function isImage(string $mimeType): bool
    {
        return str_starts_with($mimeType, 'image/');
    }

    /**
     * Delete media and its files
     */
    public function delete(Media $media): bool
    {
        try {
            // Delete original file
            Storage::disk($media->disk)->delete($media->path);

            // Delete thumbnails
            if ($media->metadata && isset($media->metadata['thumbnails'])) {
                foreach ($media->metadata['thumbnails'] as $thumbnail) {
                    Storage::disk($media->disk)->delete($thumbnail);
                }
            }

            // Delete database record
            return $media->delete();
        } catch (Exception $e) {
            throw new Exception('Ошибка при удалении файла: ' . $e->getMessage());
        }
    }

    /**
     * Update media metadata
     */
    public function updateMetadata(Media $media, array $metadata): Media
    {
        $currentMetadata = $media->metadata ?? [];
        $media->metadata = array_merge($currentMetadata, $metadata);
        $media->save();

        return $media;
    }

    /**
     * Get media by collection
     */
    public function getByCollection(string $collection)
    {
        return Media::whereJsonContains('metadata->collection', $collection)->get();
    }
}
