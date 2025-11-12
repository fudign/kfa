<?php

namespace App\Http\Controllers;

use App\Models\MembershipApplication;
use App\Http\Requests\StoreApplicationRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ApplicationController extends Controller
{
    /**
     * Display a listing of the resource (admin only).
     */
    public function index()
    {
        $applications = MembershipApplication::orderBy('created_at', 'desc')
            ->paginate(20);

        return response()->json($applications);
    }

    /**
     * Store a newly created membership application (public endpoint).
     */
    public function store(StoreApplicationRequest $request): JsonResponse
    {
        try {
            // Get validated data
            $validated = $request->validated();

            // Map camelCase to snake_case for database
            $application = MembershipApplication::create([
                'membership_type' => $validated['membershipType'],
                'first_name' => $validated['firstName'],
                'last_name' => $validated['lastName'],
                'organization_name' => $validated['organizationName'] ?? null,
                'position' => $validated['position'],
                'email' => $validated['email'],
                'phone' => $validated['phone'],
                'experience' => $validated['experience'],
                'motivation' => $validated['motivation'],
                'status' => 'pending', // Default status
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Your membership application has been submitted successfully! We will review it and contact you soon.',
                'data' => [
                    'id' => $application->id,
                    'status' => $application->status,
                    'createdAt' => $application->created_at->toISOString(),
                ],
            ], 201);

        } catch (\Exception $e) {
            \Log::error('Membership application submission failed', [
                'error' => $e->getMessage(),
                'request' => $request->all(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'An error occurred while submitting your application. Please try again later.',
                'error' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $application = MembershipApplication::findOrFail($id);
        return response()->json($application);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $application = MembershipApplication::findOrFail($id);

        $application->update($request->validate([
            'status' => 'sometimes|in:pending,approved,rejected',
        ]));

        return response()->json([
            'success' => true,
            'data' => $application,
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $application = MembershipApplication::findOrFail($id);
        $application->delete();

        return response()->json([
            'success' => true,
            'message' => 'Application deleted successfully',
        ]);
    }

    /**
     * Get pending applications (admin only).
     */
    public function pending()
    {
        $applications = MembershipApplication::where('status', 'pending')
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return response()->json($applications);
    }

    /**
     * Approve an application (admin only).
     */
    public function approve(string $id)
    {
        $application = MembershipApplication::findOrFail($id);

        if ($application->status !== 'pending') {
            return response()->json([
                'success' => false,
                'message' => 'Only pending applications can be approved',
            ], 400);
        }

        $application->update(['status' => 'approved']);

        // TODO: Send approval email to applicant
        // TODO: Create user account and member record

        return response()->json([
            'success' => true,
            'message' => 'Application approved successfully',
            'data' => $application,
        ]);
    }

    /**
     * Reject an application (admin only).
     */
    public function reject(Request $request, string $id)
    {
        $application = MembershipApplication::findOrFail($id);

        if ($application->status !== 'pending') {
            return response()->json([
                'success' => false,
                'message' => 'Only pending applications can be rejected',
            ], 400);
        }

        $validated = $request->validate([
            'reason' => 'nullable|string|max:500',
        ]);

        $application->update([
            'status' => 'rejected',
            'rejection_reason' => $validated['reason'] ?? null,
        ]);

        // TODO: Send rejection email to applicant with reason

        return response()->json([
            'success' => true,
            'message' => 'Application rejected successfully',
            'data' => $application,
        ]);
    }

    /**
     * Get current user's applications.
     */
    public function my(Request $request)
    {
        $user = $request->user();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized',
            ], 401);
        }

        $applications = MembershipApplication::where('email', $user->email)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $applications,
        ]);
    }
}
