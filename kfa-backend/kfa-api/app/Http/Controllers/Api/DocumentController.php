<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\DocumentResource;
use App\Models\Document;
use Illuminate\Http\Request;

class DocumentController extends Controller
{
    /**
     * Display a listing of documents.
     */
    public function index(Request $request)
    {
        $query = Document::with('uploader:id,name,email');

        // Filter by category
        if ($request->has('category')) {
            $query->where('category', $request->category);
        }

        // Filter by public/private
        if ($request->has('is_public')) {
            $query->where('is_public', $request->boolean('is_public'));
        }

        // Search
        if ($request->has('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('title', 'like', '%' . $request->search . '%')
                  ->orWhere('description', 'like', '%' . $request->search . '%');
            });
        }

        // Sort by order and created_at
        $query->orderBy('order')->orderBy('created_at', 'desc');

        $perPage = min($request->get('per_page', 15), 100);
        $documents = $query->paginate($perPage);

        return DocumentResource::collection($documents);
    }

    /**
     * Store a newly created document.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:documents',
            'description' => 'nullable|string',
            'category' => 'nullable|string|max:255',
            'file_url' => 'required|url',
            'file_type' => 'nullable|string|max:100',
            'file_size' => 'nullable|integer',
            'is_public' => 'boolean',
            'order' => 'integer',
        ]);

        $validated['uploaded_by'] = auth()->id();

        $document = Document::create($validated);
        $document->load('uploader');

        return new DocumentResource($document);
    }

    /**
     * Display the specified document.
     */
    public function show(Document $document)
    {
        $document->load('uploader');
        return new DocumentResource($document);
    }

    /**
     * Update the specified resource.
     */
    public function update(Request $request, Document $document)
    {
        $validated = $request->validate([
            'title' => 'string|max:255',
            'slug' => 'string|max:255|unique:documents,slug,' . $document->id,
            'description' => 'nullable|string',
            'category' => 'nullable|string|max:255',
            'file_url' => 'url',
            'file_type' => 'nullable|string|max:100',
            'file_size' => 'nullable|integer',
            'is_public' => 'boolean',
            'order' => 'integer',
        ]);

        $document->update($validated);
        $document->load('uploader');

        return new DocumentResource($document);
    }

    /**
     * Remove the specified resource.
     */
    public function destroy(Document $document)
    {
        $document->delete();
        return response()->json(['message' => 'Document deleted successfully']);
    }

    /**
     * Track document download.
     */
    public function download(Document $document)
    {
        $document->incrementDownloads();
        return response()->json([
            'url' => $document->file_url,
            'download_count' => $document->download_count
        ]);
    }
}
