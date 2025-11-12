<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\CPEActivityResource;
use App\Models\CPEActivity;
use Illuminate\Http\Request;

class CPEActivityController extends Controller
{
    /**
     * Display a listing of CPE activities.
     */
    public function index(Request $request)
    {
        $query = CPEActivity::with(['user', 'approver']);

        // Non-admin users can only see their own activities
        if (!$request->user()->isAdmin()) {
            $query->where('user_id', $request->user()->id);
        }

        // Filter by user (admin only)
        if ($request->user()->isAdmin() && $request->has('user_id')) {
            $query->where('user_id', $request->user_id);
        }

        // Filter by status
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        // Filter by category
        if ($request->has('category')) {
            $query->where('category', $request->category);
        }

        // Filter by activity type
        if ($request->has('activity_type')) {
            $query->where('activity_type', $request->activity_type);
        }

        // Filter pending approvals (admin only)
        if ($request->user()->isAdmin() && $request->has('pending') && $request->boolean('pending')) {
            $query->where('status', 'pending');
        }

        // Filter by date range
        if ($request->has('from_date')) {
            $query->where('activity_date', '>=', $request->from_date);
        }
        if ($request->has('to_date')) {
            $query->where('activity_date', '<=', $request->to_date);
        }

        // Search
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        $query->orderBy('activity_date', 'desc');

        $perPage = min($request->get('per_page', 20), 100);
        $activities = $query->paginate($perPage);

        return CPEActivityResource::collection($activities);
    }

    /**
     * Get current user's CPE activities.
     */
    public function myActivities(Request $request)
    {
        $query = CPEActivity::with(['approver'])
            ->where('user_id', $request->user()->id);

        // Filter by status
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        // Filter by date range
        if ($request->has('from_date')) {
            $query->where('activity_date', '>=', $request->from_date);
        }
        if ($request->has('to_date')) {
            $query->where('activity_date', '<=', $request->to_date);
        }

        $query->orderBy('activity_date', 'desc');

        $activities = $query->get();

        return CPEActivityResource::collection($activities);
    }

    /**
     * Submit a new CPE activity.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'category' => 'required|in:training,webinar,conference,self_study,teaching,writing,research,other',
            'hours' => 'required|numeric|min:0.5|max:100',
            'activity_date' => 'required|date|before_or_equal:today',
            'evidence' => 'nullable|string',
            'attachments' => 'nullable|array',
        ]);

        // External activities require approval
        $activity = CPEActivity::create([
            'user_id' => $request->user()->id,
            'activity_type' => 'External', // Manual submission
            'activity_id' => null,
            'title' => $validated['title'],
            'description' => $validated['description'] ?? null,
            'category' => $validated['category'],
            'hours' => $validated['hours'],
            'activity_date' => $validated['activity_date'],
            'status' => 'pending', // Requires approval
            'evidence' => $validated['evidence'] ?? null,
            'attachments' => $validated['attachments'] ?? null,
        ]);

        $activity->load(['user']);

        return response()->json([
            'message' => 'CPE activity submitted for approval',
            'activity' => new CPEActivityResource($activity),
        ], 201);
    }

    /**
     * Display the specified CPE activity.
     */
    public function show(CPEActivity $activity)
    {
        // Users can only view their own activities unless admin
        if (!request()->user()->isAdmin() && $activity->user_id !== request()->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $activity->load(['user', 'approver']);
        return new CPEActivityResource($activity);
    }

    /**
     * Update the specified CPE activity.
     */
    public function update(Request $request, CPEActivity $activity)
    {
        // Users can only edit their own pending activities
        if (!$request->user()->isAdmin() && $activity->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        if (!$request->user()->isAdmin() && $activity->status !== 'pending') {
            return response()->json([
                'message' => 'Can only edit pending activities',
            ], 422);
        }

        $validated = $request->validate([
            'title' => 'string|max:255',
            'description' => 'nullable|string',
            'category' => 'in:training,webinar,conference,self_study,teaching,writing,research,other',
            'hours' => 'numeric|min:0.5|max:100',
            'activity_date' => 'date|before_or_equal:today',
            'evidence' => 'nullable|string',
            'attachments' => 'nullable|array',
        ]);

        $activity->update($validated);
        $activity->load(['user', 'approver']);

        return new CPEActivityResource($activity);
    }

    /**
     * Approve CPE activity (admin only).
     */
    public function approve(Request $request, CPEActivity $activity)
    {
        if ($activity->status !== 'pending') {
            return response()->json([
                'message' => 'Only pending activities can be approved',
            ], 422);
        }

        $activity->update([
            'status' => 'approved',
            'approver_id' => $request->user()->id,
            'approved_at' => now(),
        ]);

        $activity->load(['user', 'approver']);

        return response()->json([
            'message' => 'CPE activity approved',
            'activity' => new CPEActivityResource($activity),
        ]);
    }

    /**
     * Reject CPE activity (admin only).
     */
    public function reject(Request $request, CPEActivity $activity)
    {
        $validated = $request->validate([
            'rejection_reason' => 'required|string|max:1000',
        ]);

        if ($activity->status !== 'pending') {
            return response()->json([
                'message' => 'Only pending activities can be rejected',
            ], 422);
        }

        $activity->update([
            'status' => 'rejected',
            'rejection_reason' => $validated['rejection_reason'],
            'approver_id' => $request->user()->id,
            'approved_at' => now(),
        ]);

        $activity->load(['user', 'approver']);

        return response()->json([
            'message' => 'CPE activity rejected',
            'activity' => new CPEActivityResource($activity),
        ]);
    }

    /**
     * Delete CPE activity.
     */
    public function destroy(Request $request, CPEActivity $activity)
    {
        // Users can only delete their own pending/rejected activities
        if (!$request->user()->isAdmin() && $activity->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        if (!$request->user()->isAdmin() && !in_array($activity->status, ['pending', 'rejected'])) {
            return response()->json([
                'message' => 'Can only delete pending or rejected activities',
            ], 422);
        }

        $activity->delete();

        return response()->json([
            'message' => 'CPE activity deleted successfully',
        ]);
    }

    /**
     * Get CPE statistics for current user.
     */
    public function myStats(Request $request)
    {
        $userId = $request->user()->id;

        // Current year stats
        $currentYear = now()->year;
        $yearStart = now()->startOfYear();

        // Total approved hours
        $totalHours = CPEActivity::getTotalHoursForUser($userId);
        $currentYearHours = CPEActivity::getTotalHoursForUser($userId, $yearStart, now());

        // By category (current year)
        $byCategory = CPEActivity::getHoursByCategory($userId, $yearStart, now());

        // By status
        $byStatus = [
            'approved' => CPEActivity::approved()->forUser($userId)->count(),
            'pending' => CPEActivity::pending()->forUser($userId)->count(),
            'rejected' => CPEActivity::rejected()->forUser($userId)->count(),
        ];

        return response()->json([
            'total_hours' => $totalHours,
            'current_year_hours' => $currentYearHours,
            'current_year' => $currentYear,
            'by_category' => $byCategory,
            'by_status' => $byStatus,
            'activities_count' => CPEActivity::forUser($userId)->count(),
        ]);
    }

    /**
     * Get CPE statistics (admin only).
     */
    public function stats(Request $request)
    {
        $query = CPEActivity::query();

        // Filter by user if provided
        if ($request->has('user_id')) {
            $query->where('user_id', $request->user_id);
        }

        // Filter by date range
        $fromDate = $request->get('from_date', now()->startOfYear());
        $toDate = $request->get('to_date', now());

        if ($fromDate && $toDate) {
            $query->whereBetween('activity_date', [$fromDate, $toDate]);
        }

        return response()->json([
            'total_activities' => (clone $query)->count(),
            'by_status' => [
                'pending' => (clone $query)->where('status', 'pending')->count(),
                'approved' => (clone $query)->where('status', 'approved')->count(),
                'rejected' => (clone $query)->where('status', 'rejected')->count(),
            ],
            'by_category' => [
                'training' => (clone $query)->approved()->where('category', 'training')->sum('hours'),
                'webinar' => (clone $query)->approved()->where('category', 'webinar')->sum('hours'),
                'conference' => (clone $query)->approved()->where('category', 'conference')->sum('hours'),
                'self_study' => (clone $query)->approved()->where('category', 'self_study')->sum('hours'),
                'teaching' => (clone $query)->approved()->where('category', 'teaching')->sum('hours'),
                'writing' => (clone $query)->approved()->where('category', 'writing')->sum('hours'),
                'research' => (clone $query)->approved()->where('category', 'research')->sum('hours'),
                'other' => (clone $query)->approved()->where('category', 'other')->sum('hours'),
            ],
            'total_approved_hours' => (clone $query)->approved()->sum('hours'),
            'average_hours_per_activity' => (clone $query)->approved()->avg('hours'),
            'date_range' => [
                'from' => $fromDate,
                'to' => $toDate,
            ],
        ]);
    }
}
