<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\CertificationProgramResource;
use App\Models\CertificationProgram;
use Illuminate\Http\Request;

class CertificationProgramController extends Controller
{
    /**
     * Display a listing of certification programs.
     */
    public function index(Request $request)
    {
        $query = CertificationProgram::query();

        // Filter by type (basic/specialized)
        if ($request->has('type')) {
            $query->type($request->type);
        }

        // Filter by active status
        if ($request->has('is_active')) {
            if ($request->boolean('is_active')) {
                $query->active();
            } else {
                $query->where('is_active', false);
            }
        } else {
            // By default, show only active programs
            $query->active();
        }

        // Search
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('code', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        // Sort by order and name
        $query->orderBy('order')->orderBy('name');

        // Load certifications count
        $query->withCount('certifications');

        $perPage = min($request->get('per_page', 20), 100);
        $programs = $query->paginate($perPage);

        return CertificationProgramResource::collection($programs);
    }

    /**
     * Store a newly created certification program.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:50|unique:certification_programs',
            'type' => 'required|in:basic,specialized',
            'description' => 'nullable|string',
            'requirements' => 'nullable|string',
            'curriculum' => 'nullable|array',
            'duration_hours' => 'nullable|integer|min:0',
            'exam_fee' => 'nullable|numeric|min:0',
            'certification_fee' => 'nullable|numeric|min:0',
            'validity_months' => 'integer|min:1',
            'cpe_hours_required' => 'integer|min:0',
            'is_active' => 'boolean',
            'order' => 'integer',
        ]);

        $program = CertificationProgram::create($validated);

        return new CertificationProgramResource($program);
    }

    /**
     * Display the specified certification program.
     */
    public function show(CertificationProgram $certificationProgram)
    {
        $certificationProgram->loadCount('certifications');
        return new CertificationProgramResource($certificationProgram);
    }

    /**
     * Update the specified certification program.
     */
    public function update(Request $request, CertificationProgram $certificationProgram)
    {
        $validated = $request->validate([
            'name' => 'string|max:255',
            'code' => 'string|max:50|unique:certification_programs,code,' . $certificationProgram->id,
            'type' => 'in:basic,specialized',
            'description' => 'nullable|string',
            'requirements' => 'nullable|string',
            'curriculum' => 'nullable|array',
            'duration_hours' => 'nullable|integer|min:0',
            'exam_fee' => 'nullable|numeric|min:0',
            'certification_fee' => 'nullable|numeric|min:0',
            'validity_months' => 'integer|min:1',
            'cpe_hours_required' => 'integer|min:0',
            'is_active' => 'boolean',
            'order' => 'integer',
        ]);

        $certificationProgram->update($validated);
        $certificationProgram->loadCount('certifications');

        return new CertificationProgramResource($certificationProgram);
    }

    /**
     * Remove the specified certification program.
     */
    public function destroy(CertificationProgram $certificationProgram)
    {
        // Check if there are active certifications
        $activeCerts = $certificationProgram->certifications()
            ->whereIn('status', ['passed', 'in_progress'])
            ->count();

        if ($activeCerts > 0) {
            return response()->json([
                'message' => 'Cannot delete program with active certifications',
                'active_certifications' => $activeCerts,
            ], 422);
        }

        $certificationProgram->delete();

        return response()->json([
            'message' => 'Certification program deleted successfully',
        ]);
    }
}
