<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProgramResource;
use App\Http\Resources\ProgramEnrollmentResource;
use App\Models\Program;
use App\Models\ProgramEnrollment;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ProgramController extends Controller
{
    /**
     * Display a listing of programs.
     */
    public function index(Request $request)
    {
        $query = Program::with(['instructor', 'creator']);

        // Filter by status
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        // Filter by program type
        if ($request->has('program_type')) {
            $query->where('program_type', $request->program_type);
        }

        // Only published programs for non-admin users
        if (!$request->user() || !$request->user()->isAdmin()) {
            $query->published();
        }

        // Filter by level
        if ($request->has('level')) {
            $query->where('level', $request->level);
        }

        // Filter by language
        if ($request->has('language')) {
            $query->where('language', $request->language);
        }

        // Filter by online/offline
        if ($request->has('is_online')) {
            $query->where('is_online', $request->boolean('is_online'));
        }

        // Filter by enrollment status
        if ($request->has('enrollment_open') && $request->boolean('enrollment_open')) {
            $query->where('status', 'enrollment_open')
                ->where(function ($q) {
                    $q->whereNull('enrollment_deadline')
                      ->orWhere('enrollment_deadline', '>', now());
                });
        }

        // Search
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%")
                  ->orWhere('instructor_name', 'like', "%{$search}%");
            });
        }

        // Sort
        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        $perPage = min($request->get('per_page', 20), 100);
        $programs = $query->paginate($perPage);

        return ProgramResource::collection($programs);
    }

    /**
     * Get upcoming programs (public).
     */
    public function upcoming(Request $request)
    {
        $query = Program::with(['instructor'])
            ->published()
            ->where('starts_at', '>', now())
            ->orderBy('starts_at', 'asc');

        $limit = min($request->get('limit', 10), 50);
        $programs = $query->limit($limit)->get();

        return ProgramResource::collection($programs);
    }

    /**
     * Get featured programs (public).
     */
    public function featured(Request $request)
    {
        $query = Program::with(['instructor'])
            ->published()
            ->where('is_featured', true)
            ->orderBy('starts_at', 'asc');

        $limit = min($request->get('limit', 5), 20);
        $programs = $query->limit($limit)->get();

        return ProgramResource::collection($programs);
    }

    /**
     * Store a newly created program (admin only).
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:programs,slug',
            'description' => 'required|string',
            'program_type' => 'required|in:course,workshop_series,certification_prep,mentorship,online_course',
            'status' => 'in:draft,published,enrollment_open,enrollment_closed,ongoing,completed,cancelled',
            'duration' => 'nullable|string|max:100',
            'cpe_hours' => 'nullable|numeric|min:0|max:100',
            'language' => 'nullable|string|max:50',
            'level' => 'nullable|in:beginner,intermediate,advanced,expert',
            'instructor_id' => 'nullable|exists:users,id',
            'instructor_name' => 'nullable|string|max:255',
            'instructor_bio' => 'nullable|string',
            'syllabus' => 'nullable|string',
            'prerequisites' => 'nullable|string',
            'target_audience' => 'nullable|string',
            'starts_at' => 'nullable|date',
            'ends_at' => 'nullable|date|after:starts_at',
            'schedule' => 'nullable|string',
            'max_students' => 'nullable|integer|min:1',
            'enrollment_deadline' => 'nullable|date',
            'requires_approval' => 'boolean',
            'price' => 'nullable|numeric|min:0',
            'member_price' => 'nullable|numeric|min:0',
            'is_online' => 'boolean',
            'location' => 'nullable|string|max:255',
            'platform' => 'nullable|string|max:100',
            'modules' => 'nullable|array',
            'has_exam' => 'boolean',
            'passing_score' => 'nullable|integer|min:0|max:100',
            'issues_certificate' => 'boolean',
            'certificate_template' => 'nullable|string',
            'image' => 'nullable|string|max:500',
            'is_featured' => 'boolean',
            'published_at' => 'nullable|date',
        ]);

        // Generate slug if not provided
        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['title']);

            // Ensure unique slug
            $baseSlug = $validated['slug'];
            $counter = 1;
            while (Program::where('slug', $validated['slug'])->exists()) {
                $validated['slug'] = $baseSlug . '-' . $counter++;
            }
        }

        // Set created_by
        $validated['created_by'] = $request->user()->id;

        // Auto-set published_at if status is published
        if (isset($validated['status']) && in_array($validated['status'], ['published', 'enrollment_open']) && empty($validated['published_at'])) {
            $validated['published_at'] = now();
        }

        $program = Program::create($validated);
        $program->load(['instructor', 'creator']);

        return new ProgramResource($program);
    }

    /**
     * Display the specified program.
     */
    public function show($id)
    {
        $program = Program::with(['instructor', 'creator', 'enrollments'])->findOrFail($id);

        // If not published, only allow admin or creator to view
        if ($program->status === 'draft') {
            $user = request()->user();
            if (!$user || (!$user->isAdmin() && $user->id !== $program->created_by)) {
                return response()->json(['message' => 'Program not found'], 404);
            }
        }

        return new ProgramResource($program);
    }

    /**
     * Update the specified program (admin only).
     */
    public function update(Request $request, Program $program)
    {
        $validated = $request->validate([
            'title' => 'string|max:255',
            'slug' => 'string|max:255|unique:programs,slug,' . $program->id,
            'description' => 'string',
            'program_type' => 'in:course,workshop_series,certification_prep,mentorship,online_course',
            'status' => 'in:draft,published,enrollment_open,enrollment_closed,ongoing,completed,cancelled',
            'duration' => 'nullable|string|max:100',
            'cpe_hours' => 'nullable|numeric|min:0|max:100',
            'language' => 'nullable|string|max:50',
            'level' => 'nullable|in:beginner,intermediate,advanced,expert',
            'instructor_id' => 'nullable|exists:users,id',
            'instructor_name' => 'nullable|string|max:255',
            'instructor_bio' => 'nullable|string',
            'syllabus' => 'nullable|string',
            'prerequisites' => 'nullable|string',
            'target_audience' => 'nullable|string',
            'starts_at' => 'nullable|date',
            'ends_at' => 'nullable|date|after:starts_at',
            'schedule' => 'nullable|string',
            'max_students' => 'nullable|integer|min:1',
            'enrollment_deadline' => 'nullable|date',
            'requires_approval' => 'boolean',
            'price' => 'nullable|numeric|min:0',
            'member_price' => 'nullable|numeric|min:0',
            'is_online' => 'boolean',
            'location' => 'nullable|string|max:255',
            'platform' => 'nullable|string|max:100',
            'modules' => 'nullable|array',
            'has_exam' => 'boolean',
            'passing_score' => 'nullable|integer|min:0|max:100',
            'issues_certificate' => 'boolean',
            'certificate_template' => 'nullable|string',
            'image' => 'nullable|string|max:500',
            'is_featured' => 'boolean',
            'published_at' => 'nullable|date',
        ]);

        // Auto-set published_at if status changed to published
        if (isset($validated['status']) && in_array($validated['status'], ['published', 'enrollment_open']) && !$program->published_at) {
            $validated['published_at'] = now();
        }

        $program->update($validated);
        $program->load(['instructor', 'creator']);

        return new ProgramResource($program);
    }

    /**
     * Remove the specified program (admin only).
     */
    public function destroy(Program $program)
    {
        // Prevent deletion if there are enrollments
        if ($program->enrollments()->count() > 0) {
            return response()->json([
                'message' => 'Cannot delete program with existing enrollments. Please cancel the program instead.',
            ], 422);
        }

        $program->delete();

        return response()->json([
            'message' => 'Program deleted successfully',
        ]);
    }

    /**
     * Enroll in a program.
     */
    public function enroll(Request $request, Program $program)
    {
        // Check if enrollment is open
        if (!$program->isEnrollmentOpen()) {
            return response()->json([
                'message' => 'Enrollment is not open for this program',
            ], 422);
        }

        // Check if user already enrolled
        $existing = ProgramEnrollment::where('program_id', $program->id)
            ->where('user_id', $request->user()->id)
            ->first();

        if ($existing) {
            return response()->json([
                'message' => 'You are already enrolled in this program',
                'enrollment' => new ProgramEnrollmentResource($existing),
            ], 422);
        }

        $validated = $request->validate([
            'answers' => 'nullable|array',
        ]);

        // Determine price (member vs non-member)
        $user = $request->user();
        $isMember = $user->member()->exists();
        $price = $isMember && $program->member_price !== null ? $program->member_price : $program->price;

        // Create enrollment
        $enrollment = ProgramEnrollment::create([
            'program_id' => $program->id,
            'user_id' => $user->id,
            'status' => $program->requires_approval ? 'pending' : 'approved',
            'amount_paid' => $price,
            'enrolled_at' => now(),
            'approved_at' => $program->requires_approval ? null : now(),
            'answers' => $validated['answers'] ?? null,
        ]);

        // Increment enrolled count
        $program->increment('enrolled_count');

        $enrollment->load(['program', 'user']);

        return response()->json([
            'message' => 'Successfully enrolled in program',
            'enrollment' => new ProgramEnrollmentResource($enrollment),
        ], 201);
    }

    /**
     * Get current user's program enrollments.
     */
    public function myEnrollments(Request $request)
    {
        $query = ProgramEnrollment::with(['program'])
            ->where('user_id', $request->user()->id);

        // Filter by status
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        // Filter by active
        if ($request->has('active') && $request->boolean('active')) {
            $query->whereIn('status', ['approved', 'active']);
        }

        $query->orderBy('created_at', 'desc');

        $enrollments = $query->get();

        return ProgramEnrollmentResource::collection($enrollments);
    }

    /**
     * Drop enrollment (cancel).
     */
    public function dropEnrollment(Request $request, ProgramEnrollment $enrollment)
    {
        // Check ownership
        if ($enrollment->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Check if program hasn't completed
        if (in_array($enrollment->status, ['completed', 'failed'])) {
            return response()->json([
                'message' => 'Cannot drop completed or failed enrollment',
            ], 422);
        }

        $enrollment->update(['status' => 'dropped']);

        // Decrement enrolled count
        $enrollment->program->decrement('enrolled_count');

        return response()->json([
            'message' => 'Enrollment dropped successfully',
        ]);
    }
}

