<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreMemberRequest;
use App\Http\Requests\UpdateMemberRequest;
use App\Http\Resources\MemberResource;
use App\Models\Member;
use Illuminate\Http\Request;

class MemberController extends Controller
{
    public function index(Request $request)
    {
        $query = Member::query();

        // Filter by type
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
        }

        // Search
        if ($request->has('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%')
                  ->orWhere('email', 'like', '%' . $request->search . '%')
                  ->orWhere('company', 'like', '%' . $request->search . '%');
            });
        }

        // Sort
        $query->orderBy('order')->orderBy('name');

        // Pagination
        $perPage = min($request->get('per_page', 15), 100);
        $members = $query->paginate($perPage);

        return MemberResource::collection($members);
    }

    public function store(StoreMemberRequest $request)
    {
        $member = Member::create($request->validated());
        return new MemberResource($member);
    }

    public function show(Member $member)
    {
        return new MemberResource($member);
    }

    public function update(UpdateMemberRequest $request, Member $member)
    {
        $member->update($request->validated());
        return new MemberResource($member);
    }

    public function destroy(Member $member)
    {
        $member->delete();
        return response()->json(['message' => 'Member deleted successfully']);
    }
}
