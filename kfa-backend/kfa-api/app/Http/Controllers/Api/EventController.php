<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\EventResource;
use App\Http\Resources\EventRegistrationResource;
use App\Models\Event;
use App\Models\EventRegistration;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class EventController extends Controller
{
    /**
     * Display a listing of events.
     */
    public function index(Request $request)
    {
        $query = Event::with(['speaker', 'creator']);

        // Filter by status
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        // Filter by event type
        if ($request->has('event_type')) {
            $query->where('event_type', $request->event_type);
        }

        // Only published events for non-admin users
        if (!$request->user() || !$request->user()->isAdmin()) {
            $query->published();
        }

        // Filter by date range
        if ($request->has('from_date')) {
            $query->where('starts_at', '>=', $request->from_date);
        }
        if ($request->has('to_date')) {
            $query->where('starts_at', '<=', $request->to_date);
        }

        // Filter by online/offline
        if ($request->has('is_online')) {
            $query->where('is_online', $request->boolean('is_online'));
        }

        // Filter by registration status
        if ($request->has('registration_open') && $request->boolean('registration_open')) {
            $query->where('status', 'registration_open')
                ->where(function ($q) {
                    $q->whereNull('registration_deadline')
                      ->orWhere('registration_deadline', '>', now());
                });
        }

        // Search
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%")
                  ->orWhere('speaker_name', 'like', "%{$search}%");
            });
        }

        // Sort
        $sortBy = $request->get('sort_by', 'starts_at');
        $sortOrder = $request->get('sort_order', 'asc');
        $query->orderBy($sortBy, $sortOrder);

        $perPage = min($request->get('per_page', 20), 100);
        $events = $query->paginate($perPage);

        return EventResource::collection($events);
    }

    /**
     * Get upcoming events (public).
     */
    public function upcoming(Request $request)
    {
        $query = Event::with(['speaker'])
            ->published()
            ->where('starts_at', '>', now())
            ->orderBy('starts_at', 'asc');

        $limit = min($request->get('limit', 10), 50);
        $events = $query->limit($limit)->get();

        return EventResource::collection($events);
    }

    /**
     * Get featured events (public).
     */
    public function featured(Request $request)
    {
        $query = Event::with(['speaker'])
            ->published()
            ->where('is_featured', true)
            ->where('starts_at', '>', now())
            ->orderBy('starts_at', 'asc');

        $limit = min($request->get('limit', 5), 20);
        $events = $query->limit($limit)->get();

        return EventResource::collection($events);
    }

    /**
     * Store a newly created event (admin only).
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:events,slug',
            'description' => 'required|string',
            'event_type' => 'required|in:webinar,workshop,seminar,conference,training,exam,networking',
            'status' => 'in:draft,published,registration_open,registration_closed,ongoing,completed,cancelled',
            'cpe_hours' => 'nullable|numeric|min:0|max:100',
            'level' => 'nullable|in:beginner,intermediate,advanced,expert',
            'speaker_id' => 'nullable|exists:users,id',
            'speaker_name' => 'nullable|string|max:255',
            'speaker_bio' => 'nullable|string',
            'price' => 'nullable|numeric|min:0',
            'member_price' => 'nullable|numeric|min:0',
            'location' => 'nullable|string|max:255',
            'is_online' => 'boolean',
            'meeting_link' => 'nullable|string|max:500',
            'meeting_password' => 'nullable|string|max:100',
            'starts_at' => 'required|date',
            'ends_at' => 'required|date|after:starts_at',
            'capacity' => 'nullable|string|max:255',
            'max_participants' => 'nullable|integer|min:1',
            'registration_deadline' => 'nullable|date',
            'requires_approval' => 'boolean',
            'image' => 'nullable|string|max:500',
            'agenda' => 'nullable|array',
            'materials' => 'nullable|array',
            'issues_certificate' => 'boolean',
            'certificate_template' => 'nullable|string',
            'is_featured' => 'boolean',
            'published_at' => 'nullable|date',
        ]);

        // Generate slug if not provided
        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['title']);

            // Ensure unique slug
            $baseSlug = $validated['slug'];
            $counter = 1;
            while (Event::where('slug', $validated['slug'])->exists()) {
                $validated['slug'] = $baseSlug . '-' . $counter++;
            }
        }

        // Set created_by
        $validated['created_by'] = $request->user()->id;

        // Auto-set published_at if status is published
        if (isset($validated['status']) && in_array($validated['status'], ['published', 'registration_open']) && empty($validated['published_at'])) {
            $validated['published_at'] = now();
        }

        $event = Event::create($validated);
        $event->load(['speaker', 'creator']);

        return new EventResource($event);
    }

    /**
     * Display the specified event.
     */
    public function show($id)
    {
        $event = Event::with(['speaker', 'creator', 'registrations'])->findOrFail($id);

        // If not published, only allow admin or creator to view
        if ($event->status === 'draft') {
            $user = request()->user();
            if (!$user || (!$user->isAdmin() && $user->id !== $event->created_by)) {
                return response()->json(['message' => 'Event not found'], 404);
            }
        }

        return new EventResource($event);
    }

    /**
     * Update the specified event (admin only).
     */
    public function update(Request $request, Event $event)
    {
        $validated = $request->validate([
            'title' => 'string|max:255',
            'slug' => 'string|max:255|unique:events,slug,' . $event->id,
            'description' => 'string',
            'event_type' => 'in:webinar,workshop,seminar,conference,training,exam,networking',
            'status' => 'in:draft,published,registration_open,registration_closed,ongoing,completed,cancelled',
            'cpe_hours' => 'nullable|numeric|min:0|max:100',
            'level' => 'nullable|in:beginner,intermediate,advanced,expert',
            'speaker_id' => 'nullable|exists:users,id',
            'speaker_name' => 'nullable|string|max:255',
            'speaker_bio' => 'nullable|string',
            'price' => 'nullable|numeric|min:0',
            'member_price' => 'nullable|numeric|min:0',
            'location' => 'nullable|string|max:255',
            'is_online' => 'boolean',
            'meeting_link' => 'nullable|string|max:500',
            'meeting_password' => 'nullable|string|max:100',
            'starts_at' => 'date',
            'ends_at' => 'date|after:starts_at',
            'capacity' => 'nullable|string|max:255',
            'max_participants' => 'nullable|integer|min:1',
            'registration_deadline' => 'nullable|date',
            'requires_approval' => 'boolean',
            'image' => 'nullable|string|max:500',
            'agenda' => 'nullable|array',
            'materials' => 'nullable|array',
            'issues_certificate' => 'boolean',
            'certificate_template' => 'nullable|string',
            'is_featured' => 'boolean',
            'published_at' => 'nullable|date',
        ]);

        // Auto-set published_at if status changed to published
        if (isset($validated['status']) && in_array($validated['status'], ['published', 'registration_open']) && !$event->published_at) {
            $validated['published_at'] = now();
        }

        $event->update($validated);
        $event->load(['speaker', 'creator']);

        return new EventResource($event);
    }

    /**
     * Remove the specified event (admin only).
     */
    public function destroy(Event $event)
    {
        // Prevent deletion if there are registrations
        if ($event->registrations()->count() > 0) {
            return response()->json([
                'message' => 'Cannot delete event with existing registrations. Please cancel the event instead.',
            ], 422);
        }

        $event->delete();

        return response()->json([
            'message' => 'Event deleted successfully',
        ]);
    }

    /**
     * Register for an event.
     */
    public function register(Request $request, Event $event)
    {
        // Check if registration is open
        if (!$event->isRegistrationOpen()) {
            return response()->json([
                'message' => 'Registration is not open for this event',
            ], 422);
        }

        // Check if user already registered
        $existing = EventRegistration::where('event_id', $event->id)
            ->where('user_id', $request->user()->id)
            ->first();

        if ($existing) {
            return response()->json([
                'message' => 'You are already registered for this event',
                'registration' => new EventRegistrationResource($existing),
            ], 422);
        }

        $validated = $request->validate([
            'answers' => 'nullable|array',
        ]);

        // Determine price (member vs non-member)
        $user = $request->user();
        $isMember = $user->member()->exists();
        $price = $isMember && $event->member_price !== null ? $event->member_price : $event->price;

        // Create registration
        $registration = EventRegistration::create([
            'event_id' => $event->id,
            'user_id' => $user->id,
            'status' => $event->requires_approval ? 'pending' : 'approved',
            'amount_paid' => $price,
            'registered_at' => now(),
            'approved_at' => $event->requires_approval ? null : now(),
            'answers' => $validated['answers'] ?? null,
        ]);

        // Increment registered count
        $event->increment('registered_count');

        $registration->load(['event', 'user']);

        return response()->json([
            'message' => 'Successfully registered for event',
            'registration' => new EventRegistrationResource($registration),
        ], 201);
    }

    /**
     * Get current user's event registrations.
     */
    public function myRegistrations(Request $request)
    {
        $query = EventRegistration::with(['event'])
            ->where('user_id', $request->user()->id);

        // Filter by status
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        // Filter by upcoming/past
        if ($request->has('upcoming') && $request->boolean('upcoming')) {
            $query->whereHas('event', function ($q) {
                $q->where('starts_at', '>', now());
            });
        }

        $query->orderBy('created_at', 'desc');

        $registrations = $query->get();

        return EventRegistrationResource::collection($registrations);
    }

    /**
     * Cancel registration.
     */
    public function cancelRegistration(Request $request, EventRegistration $registration)
    {
        // Check ownership
        if ($registration->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Check if event hasn't started
        if ($registration->event->starts_at <= now()) {
            return response()->json([
                'message' => 'Cannot cancel registration for event that has started',
            ], 422);
        }

        $registration->update(['status' => 'cancelled']);

        // Decrement registered count
        $registration->event->decrement('registered_count');

        return response()->json([
            'message' => 'Registration cancelled successfully',
        ]);
    }
}
