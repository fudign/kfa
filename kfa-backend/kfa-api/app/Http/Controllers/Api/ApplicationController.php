<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreApplicationRequest;
use App\Http\Resources\ApplicationResource;
use App\Models\MembershipApplication;
use Illuminate\Http\Request;

class ApplicationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        // If user is admin, show all applications with filters
        if (auth()->user()->isAdmin()) {
            $query = MembershipApplication::with('user');

            // Filter by status
            if ($request->has('status')) {
                $query->where('status', $request->status);
            }

            // Search by user name or organization
            if ($request->has('search')) {
                $query->whereHas('user', function ($q) use ($request) {
                    $q->where('name', 'like', '%' . $request->search . '%');
                })->orWhere('organization', 'like', '%' . $request->search . '%');
            }

            $perPage = min($request->get('per_page', 15), 100);
            $applications = $query->orderBy('created_at', 'desc')->paginate($perPage);

            return ApplicationResource::collection($applications);
        }

        // Regular users only see their own applications
        $applications = MembershipApplication::where('user_id', auth()->id())->get();
        return ApplicationResource::collection($applications);
    }

    /**
     * Get all pending applications (admin only).
     */
    public function pending()
    {
        $applications = MembershipApplication::with('user')
            ->where('status', 'pending')
            ->orderBy('created_at', 'asc')
            ->get();
        return ApplicationResource::collection($applications);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreApplicationRequest $request)
    {
        $data = $request->validated();
        $data['user_id'] = auth()->id();
        $data['status'] = 'pending'; // Set default status explicitly

        $application = MembershipApplication::create($data);
        return new ApplicationResource($application);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }

    /**
     * Approve a membership application (admin only).
     */
    public function approve(MembershipApplication $application)
    {
        $application->update([
            'status' => 'approved',
            'reviewed_by' => auth()->id(),
            'reviewed_at' => now(),
        ]);

        $application->load('user', 'reviewer');
        return new ApplicationResource($application);
    }

    /**
     * Reject a membership application (admin only).
     */
    public function reject(Request $request, MembershipApplication $application)
    {
        $validated = $request->validate([
            'rejection_reason' => 'required|string|max:1000',
        ]);

        $application->update([
            'status' => 'rejected',
            'rejection_reason' => $validated['rejection_reason'],
            'reviewed_by' => auth()->id(),
            'reviewed_at' => now(),
        ]);

        $application->load('user', 'reviewer');
        return new ApplicationResource($application);
    }
}
