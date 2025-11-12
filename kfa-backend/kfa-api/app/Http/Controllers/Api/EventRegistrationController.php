<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\EventRegistrationResource;
use App\Models\CPEActivity;
use App\Models\EventRegistration;
use Illuminate\Http\Request;

class EventRegistrationController extends Controller
{
    /**
     * Display a listing of registrations (admin only).
     */
    public function index(Request $request)
    {
        $query = EventRegistration::with(['event', 'user']);

        // Filter by event
        if ($request->has('event_id')) {
            $query->where('event_id', $request->event_id);
        }

        // Filter by user
        if ($request->has('user_id')) {
            $query->where('user_id', $request->user_id);
        }

        // Filter by status
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        // Filter pending approvals
        if ($request->has('pending') && $request->boolean('pending')) {
            $query->where('status', 'pending');
        }

        // Search
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->whereHas('user', function ($uq) use ($search) {
                    $uq->where('name', 'like', "%{$search}%")
                       ->orWhere('email', 'like', "%{$search}%");
                })
                ->orWhereHas('event', function ($eq) use ($search) {
                    $eq->where('title', 'like', "%{$search}%");
                });
            });
        }

        $query->orderBy('created_at', 'desc');

        $perPage = min($request->get('per_page', 20), 100);
        $registrations = $query->paginate($perPage);

        return EventRegistrationResource::collection($registrations);
    }

    /**
     * Display the specified registration.
     */
    public function show(EventRegistration $registration)
    {
        $registration->load(['event', 'user']);
        return new EventRegistrationResource($registration);
    }

    /**
     * Update the specified registration (admin only).
     */
    public function update(Request $request, EventRegistration $registration)
    {
        $validated = $request->validate([
            'status' => 'in:pending,approved,rejected,cancelled,attended,no_show',
            'amount_paid' => 'nullable|numeric|min:0',
            'notes' => 'nullable|string',
            'answers' => 'nullable|array',
        ]);

        $registration->update($validated);
        $registration->load(['event', 'user']);

        return new EventRegistrationResource($registration);
    }

    /**
     * Approve registration (admin only).
     */
    public function approve(EventRegistration $registration)
    {
        if (!$registration->canApprove()) {
            return response()->json([
                'message' => 'Registration cannot be approved. Current status: ' . $registration->status,
            ], 422);
        }

        $registration->approve();
        $registration->load(['event', 'user']);

        return response()->json([
            'message' => 'Registration approved successfully',
            'registration' => new EventRegistrationResource($registration),
        ]);
    }

    /**
     * Reject registration (admin only).
     */
    public function reject(Request $request, EventRegistration $registration)
    {
        $validated = $request->validate([
            'notes' => 'required|string|max:1000',
        ]);

        if (!$registration->canReject()) {
            return response()->json([
                'message' => 'Registration cannot be rejected. Current status: ' . $registration->status,
            ], 422);
        }

        $registration->reject($validated['notes']);
        $registration->load(['event', 'user']);

        return response()->json([
            'message' => 'Registration rejected',
            'registration' => new EventRegistrationResource($registration),
        ]);
    }

    /**
     * Mark attendance (admin only).
     */
    public function markAttended(EventRegistration $registration)
    {
        if (!$registration->canMarkAttendance()) {
            return response()->json([
                'message' => 'Cannot mark attendance. Current status: ' . $registration->status,
            ], 422);
        }

        $registration->markAttended();

        // Auto-create CPE activity if event has CPE hours
        if ($registration->event->cpe_hours > 0) {
            CPEActivity::createFromEventRegistration($registration);
        }

        $registration->load(['event', 'user']);

        return response()->json([
            'message' => 'Attendance marked successfully',
            'registration' => new EventRegistrationResource($registration),
            'cpe_hours_earned' => $registration->cpe_hours_earned,
        ]);
    }

    /**
     * Mark no-show (admin only).
     */
    public function markNoShow(EventRegistration $registration)
    {
        if ($registration->status !== 'approved') {
            return response()->json([
                'message' => 'Only approved registrations can be marked as no-show',
            ], 422);
        }

        $registration->update(['status' => 'no_show']);
        $registration->load(['event', 'user']);

        return response()->json([
            'message' => 'Registration marked as no-show',
            'registration' => new EventRegistrationResource($registration),
        ]);
    }

    /**
     * Issue certificate for registration (admin only).
     */
    public function issueCertificate(EventRegistration $registration)
    {
        if (!$registration->hasAttended()) {
            return response()->json([
                'message' => 'Can only issue certificate for attended registrations',
            ], 422);
        }

        if ($registration->certificate_issued) {
            return response()->json([
                'message' => 'Certificate already issued',
                'registration' => new EventRegistrationResource($registration),
            ], 422);
        }

        // TODO: Generate actual certificate (integrate with certificate service)
        $registration->update([
            'certificate_issued' => true,
            'certificate_issued_at' => now(),
        ]);

        $registration->load(['event', 'user']);

        return response()->json([
            'message' => 'Certificate issued successfully',
            'registration' => new EventRegistrationResource($registration),
        ]);
    }

    /**
     * Delete registration (admin only).
     */
    public function destroy(EventRegistration $registration)
    {
        // Only allow deletion of cancelled/rejected registrations
        if (in_array($registration->status, ['approved', 'attended'])) {
            return response()->json([
                'message' => 'Cannot delete approved or attended registrations. Please cancel instead.',
            ], 422);
        }

        $registration->delete();

        return response()->json([
            'message' => 'Registration deleted successfully',
        ]);
    }

    /**
     * Get registration statistics (admin only).
     */
    public function stats(Request $request)
    {
        $query = EventRegistration::query();

        // Filter by event if provided
        if ($request->has('event_id')) {
            $query->where('event_id', $request->event_id);
        }

        return response()->json([
            'total_registrations' => (clone $query)->count(),
            'by_status' => [
                'pending' => (clone $query)->where('status', 'pending')->count(),
                'approved' => (clone $query)->where('status', 'approved')->count(),
                'rejected' => (clone $query)->where('status', 'rejected')->count(),
                'cancelled' => (clone $query)->where('status', 'cancelled')->count(),
                'attended' => (clone $query)->where('status', 'attended')->count(),
                'no_show' => (clone $query)->where('status', 'no_show')->count(),
            ],
            'certificates_issued' => (clone $query)->where('certificate_issued', true)->count(),
            'total_cpe_hours_earned' => (clone $query)->sum('cpe_hours_earned'),
        ]);
    }
}
