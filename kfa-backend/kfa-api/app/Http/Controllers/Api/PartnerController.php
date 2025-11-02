<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\PartnerResource;
use App\Models\Partner;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Str;

class PartnerController extends Controller
{
    // Middleware applied in routes/api.php

    /**
     * Get all partners
     */
    public function index(Request $request)
    {
        $query = Partner::query();

        // Filter by status
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        // Filter by category
        if ($request->has('category')) {
            $query->where('category', $request->category);
        }

        // Filter featured
        if ($request->boolean('featured')) {
            $query->where('is_featured', true);
        }

        // Search
        if ($request->has('search')) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        $partners = $query->ordered()->paginate($request->get('per_page', 20));

        return PartnerResource::collection($partners);
    }

    /**
     * Create new partner
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'logo' => 'nullable|string',
            'website' => 'nullable|url',
            'email' => 'nullable|email',
            'phone' => 'nullable|string',
            'category' => 'required|in:platinum,gold,silver,bronze,other',
            'status' => 'required|in:active,inactive',
            'is_featured' => 'boolean',
            'display_order' => 'integer|min:0',
            'social_links' => 'nullable|array',
        ]);

        $validated['slug'] = Str::slug($validated['name']);

        $partner = Partner::create($validated);

        return response()->json([
            'message' => 'Партнер успешно добавлен',
            'data' => new PartnerResource($partner),
        ], 201);
    }

    /**
     * Get single partner
     */
    public function show(Partner $partner)
    {
        return new PartnerResource($partner);
    }

    /**
     * Update partner
     */
    public function update(Request $request, Partner $partner): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'string|max:255',
            'description' => 'nullable|string',
            'logo' => 'nullable|string',
            'website' => 'nullable|url',
            'email' => 'nullable|email',
            'phone' => 'nullable|string',
            'category' => 'in:platinum,gold,silver,bronze,other',
            'status' => 'in:active,inactive',
            'is_featured' => 'boolean',
            'display_order' => 'integer|min:0',
            'social_links' => 'nullable|array',
        ]);

        if (isset($validated['name']) && $validated['name'] !== $partner->name) {
            $validated['slug'] = Str::slug($validated['name']);
        }

        $partner->update($validated);

        return response()->json([
            'message' => 'Партнер успешно обновлен',
            'data' => new PartnerResource($partner),
        ]);
    }

    /**
     * Delete partner
     */
    public function destroy(Partner $partner): JsonResponse
    {
        $partner->delete();

        return response()->json([
            'message' => 'Партнер успешно удален',
        ]);
    }
}
