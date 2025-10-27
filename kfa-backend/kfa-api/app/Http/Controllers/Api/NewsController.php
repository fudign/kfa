<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreNewsRequest;
use App\Http\Requests\UpdateNewsRequest;
use App\Http\Resources\NewsResource;
use App\Models\News;

class NewsController extends Controller
{
    public function index()
    {
        $news = News::orderBy('published_at', 'desc')->get();
        return NewsResource::collection($news);
    }

    public function store(StoreNewsRequest $request)
    {
        $data = $request->validated();
        $data['author_id'] = auth()->id();

        $news = News::create($data);
        return new NewsResource($news);
    }

    public function show(News $news)
    {
        return new NewsResource($news);
    }

    public function update(UpdateNewsRequest $request, News $news)
    {
        // Authorization handled by UpdateNewsRequest::authorize()
        $news->update($request->validated());
        return new NewsResource($news);
    }

    public function destroy(News $news)
    {
        $user = auth()->user();

        // Check ownership: user must be the author OR an admin
        if ($news->author_id !== $user->id && !$user->isAdmin()) {
            return response()->json([
                'message' => 'You do not have permission to delete this news article.'
            ], 403);
        }

        $news->delete();
        return response()->json(['message' => 'News deleted successfully']);
    }

    // Moderation methods (admin only - enforced by route middleware)

    public function approve(News $news)
    {
        $news->update(['status' => 'published']);
        return new NewsResource($news);
    }

    public function reject(News $news)
    {
        $news->update(['status' => 'rejected']);
        return new NewsResource($news);
    }

    public function feature(News $news)
    {
        $news->update(['featured' => true]);
        return new NewsResource($news);
    }

    public function unpublish(News $news)
    {
        $news->update(['status' => 'unpublished']);
        return new NewsResource($news);
    }

    public function archive(News $news)
    {
        $news->update(['status' => 'archived']);
        return new NewsResource($news);
    }
}
