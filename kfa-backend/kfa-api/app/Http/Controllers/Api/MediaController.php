<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\MediaResource;
use App\Models\Media;
use App\Services\MediaService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class MediaController extends Controller
{
    // Middleware applied in routes/api.php

    public function __construct(private MediaService $mediaService)
    {
    }

    /**
     * Get all media files
     */
    public function index(Request $request)
    {
        $query = Media::with('uploader:id,name');

        // Filter by type
        if ($request->has('type')) {
            $query->where('mime_type', 'like', $request->type . '%');
        }

        // Filter by collection
        if ($request->has('collection')) {
            $query->whereJsonContains('metadata->collection', $request->collection);
        }

        // Search by filename
        if ($request->has('search')) {
            $query->where('filename', 'like', '%' . $request->search . '%');
        }

        $media = $query->latest()->paginate($request->get('per_page', 20));

        return MediaResource::collection($media);
    }

    /**
     * Upload new media file
     */
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'file' => 'required|file|mimes:jpeg,jpg,png,gif,webp,svg,pdf,doc,docx|max:5120',
            'collection' => 'nullable|string',
        ]);

        try {
            $media = $this->mediaService->upload(
                $request->file('file'),
                $request->user()->id,
                $request->get('collection', 'default')
            );

            return response()->json([
                'message' => 'Файл успешно загружен',
                'data' => new MediaResource($media),
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => $e->getMessage(),
            ], 422);
        }
    }

    /**
     * Get single media file
     */
    public function show(Media $media)
    {
        $media->load('uploader:id,name');
        return new MediaResource($media);
    }

    /**
     * Delete media file
     */
    public function destroy(Media $media): JsonResponse
    {
        try {
            $this->mediaService->delete($media);

            return response()->json([
                'message' => 'Файл успешно удален',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => $e->getMessage(),
            ], 500);
        }
    }
}
