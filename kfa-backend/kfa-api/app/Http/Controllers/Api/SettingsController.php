<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\SiteSettingResource;
use App\Models\SiteSetting;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class SettingsController extends Controller
{
    // Middleware applied in routes/api.php

    /**
     * Get all settings
     */
    public function index(Request $request)
    {
        $query = SiteSetting::query();

        // Filter by category
        if ($request->has('category')) {
            $query->where('category', $request->category);
        }

        $settings = $query->get();

        if ($request->has('category')) {
            return SiteSettingResource::collection($settings);
        }

        // Group by category for full list
        $grouped = $settings->groupBy('category')->map(function ($categorySettings) {
            return SiteSettingResource::collection($categorySettings);
        });

        return response()->json($grouped);
    }

    /**
     * Get public settings (no auth required)
     */
    public function public(): JsonResponse
    {
        $settings = SiteSetting::public()->get()->pluck('value', 'key');

        return response()->json($settings);
    }

    /**
     * Update settings
     */
    public function update(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'settings' => 'required|array',
            'settings.*.key' => 'required|string',
            'settings.*.value' => 'nullable',
        ]);

        foreach ($validated['settings'] as $setting) {
            SiteSetting::set($setting['key'], $setting['value']);
        }

        // Clear cache
        SiteSetting::clearCache();

        return response()->json([
            'message' => 'Настройки успешно обновлены',
        ]);
    }
}
