<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\CertificationResource;
use App\Models\Certification;
use App\Models\CertificationProgram;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CertificationController extends Controller
{
    /**
     * Display a listing of certifications (admin).
     */
    public function index(Request $request)
    {
        $query = Certification::with(['user', 'program', 'reviewer']);

        // Filter by status
        if ($request->has('status')) {
            $query->status($request->status);
        }

        // Filter by program
        if ($request->has('program_id')) {
            $query->where('certification_program_id', $request->program_id);
        }

        // Filter by user
        if ($request->has('user_id')) {
            $query->where('user_id', $request->user_id);
        }

        // Filter active/expired
        if ($request->has('is_active') && $request->boolean('is_active')) {
            $query->active();
        }

        if ($request->has('is_expired') && $request->boolean('is_expired')) {
            $query->expired();
        }

        // Search
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('certificate_number', 'like', "%{$search}%")
                  ->orWhereHas('user', function ($uq) use ($search) {
                      $uq->where('name', 'like', "%{$search}%")
                         ->orWhere('email', 'like', "%{$search}%");
                  });
            });
        }

        // Sort
        $query->orderBy('created_at', 'desc');

        $perPage = min($request->get('per_page', 20), 100);
        $certifications = $query->paginate($perPage);

        return CertificationResource::collection($certifications);
    }

    /**
     * Get current user's certifications.
     */
    public function myCertifications(Request $request)
    {
        $certifications = Certification::with(['program', 'reviewer'])
            ->where('user_id', $request->user()->id)
            ->orderBy('created_at', 'desc')
            ->get();

        return CertificationResource::collection($certifications);
    }

    /**
     * Apply for certification.
     */
    public function apply(Request $request)
    {
        $validated = $request->validate([
            'certification_program_id' => 'required|exists:certification_programs,id',
            'notes' => 'nullable|string|max:1000',
        ]);

        // Check if user already has pending/active certification for this program
        $existing = Certification::where('user_id', $request->user()->id)
            ->where('certification_program_id', $validated['certification_program_id'])
            ->whereIn('status', ['pending', 'in_progress', 'passed'])
            ->first();

        if ($existing) {
            return response()->json([
                'message' => 'You already have an active or pending certification for this program',
                'existing_certification' => new CertificationResource($existing),
            ], 422);
        }

        // Get program to generate certificate number
        $program = CertificationProgram::findOrFail($validated['certification_program_id']);

        // Create certification application
        $certification = Certification::create([
            'user_id' => $request->user()->id,
            'certification_program_id' => $validated['certification_program_id'],
            'certificate_number' => Certification::generateCertificateNumber($program->code),
            'status' => 'pending',
            'application_date' => now(),
            'notes' => $validated['notes'] ?? null,
        ]);

        $certification->load(['program', 'user']);

        return new CertificationResource($certification);
    }

    /**
     * Display the specified certification.
     */
    public function show(Certification $certification)
    {
        $certification->load(['user', 'program', 'reviewer']);
        return new CertificationResource($certification);
    }

    /**
     * Store a newly created certification (admin only).
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'certification_program_id' => 'required|exists:certification_programs,id',
            'status' => 'required|in:pending,in_progress,passed,failed,expired,revoked',
            'application_date' => 'nullable|date',
            'exam_date' => 'nullable|date',
            'exam_score' => 'nullable|integer|min:0|max:100',
            'notes' => 'nullable|string',
        ]);

        $program = CertificationProgram::findOrFail($validated['certification_program_id']);

        $certification = Certification::create(array_merge($validated, [
            'certificate_number' => Certification::generateCertificateNumber($program->code),
        ]));

        $certification->load(['user', 'program']);

        return new CertificationResource($certification);
    }

    /**
     * Update the specified certification (admin only).
     */
    public function update(Request $request, Certification $certification)
    {
        $validated = $request->validate([
            'status' => 'in:pending,in_progress,passed,failed,expired,revoked',
            'exam_date' => 'nullable|date',
            'exam_score' => 'nullable|integer|min:0|max:100',
            'exam_results' => 'nullable|array',
            'cpe_hours_completed' => 'nullable|integer|min:0',
            'notes' => 'nullable|string',
        ]);

        $certification->update($validated);
        $certification->load(['user', 'program', 'reviewer']);

        return new CertificationResource($certification);
    }

    /**
     * Remove the specified certification (admin only).
     */
    public function destroy(Certification $certification)
    {
        // Only allow deletion of pending/failed certifications
        if (in_array($certification->status, ['passed', 'in_progress'])) {
            return response()->json([
                'message' => 'Cannot delete active or passed certifications. Please revoke instead.',
            ], 422);
        }

        $certification->delete();

        return response()->json([
            'message' => 'Certification deleted successfully',
        ]);
    }

    /**
     * Approve certification application (admin only).
     */
    public function approve(Request $request, Certification $certification)
    {
        if ($certification->status !== 'pending') {
            return response()->json([
                'message' => 'Only pending certifications can be approved',
            ], 422);
        }

        $certification->update([
            'status' => 'in_progress',
            'reviewed_by' => $request->user()->id,
            'reviewed_at' => now(),
        ]);

        $certification->load(['user', 'program', 'reviewer']);

        return new CertificationResource($certification);
    }

    /**
     * Reject certification application (admin only).
     */
    public function reject(Request $request, Certification $certification)
    {
        $validated = $request->validate([
            'notes' => 'required|string|max:1000',
        ]);

        if ($certification->status !== 'pending') {
            return response()->json([
                'message' => 'Only pending certifications can be rejected',
            ], 422);
        }

        $certification->update([
            'status' => 'failed',
            'notes' => $validated['notes'],
            'reviewed_by' => $request->user()->id,
            'reviewed_at' => now(),
        ]);

        $certification->load(['user', 'program', 'reviewer']);

        return new CertificationResource($certification);
    }

    /**
     * Issue certification after exam passed (admin only).
     */
    public function issue(Request $request, Certification $certification)
    {
        $validated = $request->validate([
            'exam_score' => 'required|integer|min:0|max:100',
            'exam_results' => 'nullable|array',
            'exam_date' => 'required|date',
        ]);

        if ($certification->status !== 'in_progress') {
            return response()->json([
                'message' => 'Only in-progress certifications can be issued',
            ], 422);
        }

        // Calculate expiry date based on program validity
        $expiryDate = now()->addMonths($certification->program->validity_months);

        $certification->update([
            'status' => 'passed',
            'exam_score' => $validated['exam_score'],
            'exam_results' => $validated['exam_results'] ?? null,
            'exam_date' => $validated['exam_date'],
            'issued_date' => now(),
            'expiry_date' => $expiryDate,
            'reviewed_by' => $request->user()->id,
            'reviewed_at' => now(),
        ]);

        $certification->load(['user', 'program', 'reviewer']);

        return new CertificationResource($certification);
    }

    /**
     * Revoke certification (admin only).
     */
    public function revoke(Request $request, Certification $certification)
    {
        $validated = $request->validate([
            'notes' => 'required|string|max:1000',
        ]);

        if ($certification->status !== 'passed') {
            return response()->json([
                'message' => 'Only passed certifications can be revoked',
            ], 422);
        }

        $certification->update([
            'status' => 'revoked',
            'notes' => ($certification->notes ?? '') . "\n\nRevoked: " . $validated['notes'],
            'reviewed_by' => $request->user()->id,
            'reviewed_at' => now(),
        ]);

        $certification->load(['user', 'program', 'reviewer']);

        return new CertificationResource($certification);
    }

    /**
     * Verify certification by certificate number (public).
     */
    public function verify($certificateNumber)
    {
        $certification = Certification::with(['user', 'program'])
            ->where('certificate_number', $certificateNumber)
            ->first();

        if (!$certification) {
            return response()->json([
                'valid' => false,
                'message' => 'Certificate not found',
            ], 404);
        }

        return response()->json([
            'valid' => $certification->isActive(),
            'certificate' => [
                'number' => $certification->certificate_number,
                'status' => $certification->status,
                'holder' => $certification->user->name,
                'program' => $certification->program->name,
                'issued_date' => $certification->issued_date?->format('Y-m-d'),
                'expiry_date' => $certification->expiry_date?->format('Y-m-d'),
                'is_expired' => $certification->isExpired(),
            ],
        ]);
    }

    /**
     * Public registry of certified specialists.
     */
    public function registry(Request $request)
    {
        $query = Certification::with(['user', 'program'])
            ->active()
            ->where('status', 'passed');

        // Filter by program
        if ($request->has('program_id')) {
            $query->where('certification_program_id', $request->program_id);
        }

        // Search by name
        if ($request->has('search')) {
            $search = $request->search;
            $query->whereHas('user', function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%");
            });
        }

        $perPage = min($request->get('per_page', 20), 50);
        $certifications = $query->paginate($perPage);

        return CertificationResource::collection($certifications);
    }

    /**
     * Get certification statistics (admin only).
     */
    public function stats()
    {
        return response()->json([
            'total_certifications' => Certification::count(),
            'by_status' => [
                'pending' => Certification::where('status', 'pending')->count(),
                'in_progress' => Certification::where('status', 'in_progress')->count(),
                'passed' => Certification::where('status', 'passed')->count(),
                'failed' => Certification::where('status', 'failed')->count(),
                'expired' => Certification::expired()->count(),
                'revoked' => Certification::where('status', 'revoked')->count(),
            ],
            'active_certifications' => Certification::active()->count(),
            'by_program' => DB::table('certifications')
                ->join('certification_programs', 'certifications.certification_program_id', '=', 'certification_programs.id')
                ->select('certification_programs.name', 'certification_programs.code', DB::raw('count(*) as count'))
                ->where('certifications.status', 'passed')
                ->groupBy('certification_programs.id', 'certification_programs.name', 'certification_programs.code')
                ->get(),
        ]);
    }
}
