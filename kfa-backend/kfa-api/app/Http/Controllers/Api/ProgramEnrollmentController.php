<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProgramEnrollmentResource;
use App\Models\CPEActivity;
use App\Models\ProgramEnrollment;
use Illuminate\Http\Request;

class ProgramEnrollmentController extends Controller
{
    /**
     * Display a listing of enrollments (admin only).
     */
    public function index(Request $request)
    {
        $query = ProgramEnrollment::with(['program', 'user']);

        // Filter by program
        if ($request->has('program_id')) {
            $query->where('program_id', $request->program_id);
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

        // Filter active enrollments
        if ($request->has('active') && $request->boolean('active')) {
            $query->whereIn('status', ['approved', 'active']);
        }

        // Search
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->whereHas('user', function ($uq) use ($search) {
                    $uq->where('name', 'like', "%{$search}%")
                       ->orWhere('email', 'like', "%{$search}%");
                })
                ->orWhereHas('program', function ($pq) use ($search) {
                    $pq->where('title', 'like', "%{$search}%");
                });
            });
        }

        $query->orderBy('created_at', 'desc');

        $perPage = min($request->get('per_page', 20), 100);
        $enrollments = $query->paginate($perPage);

        return ProgramEnrollmentResource::collection($enrollments);
    }

    /**
     * Display the specified enrollment.
     */
    public function show(ProgramEnrollment $enrollment)
    {
        $enrollment->load(['program', 'user']);
        return new ProgramEnrollmentResource($enrollment);
    }

    /**
     * Update the specified enrollment (admin only).
     */
    public function update(Request $request, ProgramEnrollment $enrollment)
    {
        $validated = $request->validate([
            'status' => 'in:pending,approved,rejected,active,completed,failed,dropped,cancelled',
            'amount_paid' => 'nullable|numeric|min:0',
            'progress' => 'nullable|integer|min:0|max:100',
            'exam_score' => 'nullable|numeric|min:0|max:100',
            'passed' => 'nullable|boolean',
            'notes' => 'nullable|string',
            'answers' => 'nullable|array',
        ]);

        $enrollment->update($validated);
        $enrollment->load(['program', 'user']);

        return new ProgramEnrollmentResource($enrollment);
    }

    /**
     * Approve enrollment (admin only).
     */
    public function approve(ProgramEnrollment $enrollment)
    {
        if (!$enrollment->canApprove()) {
            return response()->json([
                'message' => 'Enrollment cannot be approved. Current status: ' . $enrollment->status,
            ], 422);
        }

        $enrollment->approve();
        $enrollment->load(['program', 'user']);

        return response()->json([
            'message' => 'Enrollment approved successfully',
            'enrollment' => new ProgramEnrollmentResource($enrollment),
        ]);
    }

    /**
     * Reject enrollment (admin only).
     */
    public function reject(Request $request, ProgramEnrollment $enrollment)
    {
        $validated = $request->validate([
            'notes' => 'required|string|max:1000',
        ]);

        if (!$enrollment->canReject()) {
            return response()->json([
                'message' => 'Enrollment cannot be rejected. Current status: ' . $enrollment->status,
            ], 422);
        }

        $enrollment->reject($validated['notes']);
        $enrollment->load(['program', 'user']);

        return response()->json([
            'message' => 'Enrollment rejected',
            'enrollment' => new ProgramEnrollmentResource($enrollment),
        ]);
    }

    /**
     * Start enrollment (activate).
     */
    public function start(ProgramEnrollment $enrollment)
    {
        if (!$enrollment->canStart()) {
            return response()->json([
                'message' => 'Enrollment cannot be started. Current status: ' . $enrollment->status,
            ], 422);
        }

        $enrollment->start();
        $enrollment->load(['program', 'user']);

        return response()->json([
            'message' => 'Enrollment started successfully',
            'enrollment' => new ProgramEnrollmentResource($enrollment),
        ]);
    }

    /**
     * Update progress.
     */
    public function updateProgress(Request $request, ProgramEnrollment $enrollment)
    {
        $validated = $request->validate([
            'progress' => 'required|integer|min:0|max:100',
        ]);

        if (!$enrollment->updateProgress($validated['progress'])) {
            return response()->json([
                'message' => 'Failed to update progress. Enrollment must be active.',
            ], 422);
        }

        $enrollment->load(['program', 'user']);

        return response()->json([
            'message' => 'Progress updated successfully',
            'enrollment' => new ProgramEnrollmentResource($enrollment),
        ]);
    }

    /**
     * Complete enrollment.
     */
    public function complete(Request $request, ProgramEnrollment $enrollment)
    {
        $validated = $request->validate([
            'exam_score' => 'nullable|numeric|min:0|max:100',
        ]);

        if (!$enrollment->canComplete()) {
            return response()->json([
                'message' => 'Enrollment cannot be completed. Check status and progress.',
                'current_status' => $enrollment->status,
                'current_progress' => $enrollment->progress,
            ], 422);
        }

        $examScore = $validated['exam_score'] ?? null;
        $enrollment->complete($examScore);

        // Auto-create CPE activity if passed and has CPE hours
        if ($enrollment->passed && $enrollment->program->cpe_hours > 0) {
            CPEActivity::createFromProgramEnrollment($enrollment);
        }

        $enrollment->load(['program', 'user']);

        return response()->json([
            'message' => 'Enrollment completed successfully',
            'enrollment' => new ProgramEnrollmentResource($enrollment),
            'passed' => $enrollment->passed,
            'cpe_hours_earned' => $enrollment->cpe_hours_earned,
        ]);
    }

    /**
     * Fail enrollment.
     */
    public function fail(Request $request, ProgramEnrollment $enrollment)
    {
        $validated = $request->validate([
            'exam_score' => 'nullable|numeric|min:0|max:100',
            'notes' => 'nullable|string',
        ]);

        if ($enrollment->status !== 'active') {
            return response()->json([
                'message' => 'Only active enrollments can be marked as failed',
            ], 422);
        }

        $enrollment->update([
            'status' => 'failed',
            'exam_score' => $validated['exam_score'] ?? null,
            'notes' => $validated['notes'] ?? null,
            'passed' => false,
        ]);

        $enrollment->load(['program', 'user']);

        return response()->json([
            'message' => 'Enrollment marked as failed',
            'enrollment' => new ProgramEnrollmentResource($enrollment),
        ]);
    }

    /**
     * Issue certificate for enrollment (admin only).
     */
    public function issueCertificate(ProgramEnrollment $enrollment)
    {
        if ($enrollment->status !== 'completed' || !$enrollment->passed) {
            return response()->json([
                'message' => 'Can only issue certificate for completed and passed enrollments',
            ], 422);
        }

        if ($enrollment->certificate_issued) {
            return response()->json([
                'message' => 'Certificate already issued',
                'enrollment' => new ProgramEnrollmentResource($enrollment),
            ], 422);
        }

        // TODO: Generate actual certificate URL (integrate with certificate service)
        $certificateUrl = '/certificates/programs/' . $enrollment->id . '/certificate.pdf';

        $enrollment->update([
            'certificate_issued' => true,
            'certificate_issued_at' => now(),
            'certificate_url' => $certificateUrl,
        ]);

        $enrollment->load(['program', 'user']);

        return response()->json([
            'message' => 'Certificate issued successfully',
            'enrollment' => new ProgramEnrollmentResource($enrollment),
        ]);
    }

    /**
     * Delete enrollment (admin only).
     */
    public function destroy(ProgramEnrollment $enrollment)
    {
        // Only allow deletion of cancelled/rejected/dropped enrollments
        if (in_array($enrollment->status, ['active', 'completed'])) {
            return response()->json([
                'message' => 'Cannot delete active or completed enrollments. Please drop or cancel instead.',
            ], 422);
        }

        $enrollment->delete();

        return response()->json([
            'message' => 'Enrollment deleted successfully',
        ]);
    }

    /**
     * Get enrollment statistics (admin only).
     */
    public function stats(Request $request)
    {
        $query = ProgramEnrollment::query();

        // Filter by program if provided
        if ($request->has('program_id')) {
            $query->where('program_id', $request->program_id);
        }

        return response()->json([
            'total_enrollments' => (clone $query)->count(),
            'by_status' => [
                'pending' => (clone $query)->where('status', 'pending')->count(),
                'approved' => (clone $query)->where('status', 'approved')->count(),
                'rejected' => (clone $query)->where('status', 'rejected')->count(),
                'active' => (clone $query)->where('status', 'active')->count(),
                'completed' => (clone $query)->where('status', 'completed')->count(),
                'failed' => (clone $query)->where('status', 'failed')->count(),
                'dropped' => (clone $query)->where('status', 'dropped')->count(),
                'cancelled' => (clone $query)->where('status', 'cancelled')->count(),
            ],
            'completion_rate' => [
                'completed' => (clone $query)->where('status', 'completed')->count(),
                'total_started' => (clone $query)->whereIn('status', ['active', 'completed', 'failed'])->count(),
            ],
            'pass_rate' => [
                'passed' => (clone $query)->where('passed', true)->count(),
                'completed' => (clone $query)->where('status', 'completed')->count(),
            ],
            'certificates_issued' => (clone $query)->where('certificate_issued', true)->count(),
            'total_cpe_hours_earned' => (clone $query)->sum('cpe_hours_earned'),
            'average_progress' => (clone $query)->whereIn('status', ['active', 'completed'])->avg('progress'),
        ]);
    }
}
