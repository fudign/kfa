# KFA Website - Epic Breakdown

**Author:** John (Product Manager)
**Date:** 2025-11-02
**Project Level:** 3 (Brownfield)
**Target Scale:** 15-40 stories (Level 3 range)

---

## Overview

This document provides the detailed epic breakdown for **KFA API Completion & Frontend Integration**, expanding on the high-level epic list in the [PRD](./prd-kfa-api-completion.md).

Each epic includes:
- Expanded goal and value proposition
- Complete story breakdown with user stories
- Acceptance criteria for each story
- Story sequencing and dependencies

**Epic Sequencing Principles:**
- Epic 1 establishes database foundation
- Subsequent epics build progressively, each delivering significant end-to-end value
- Stories within epics are vertically sliced and sequentially ordered
- No forward dependencies - each story builds only on previous work

**Total Story Count:** 25 stories across 6 epics

---

## Epic 1: Database Schema Completion

**Priority:** P0 (Blocker)
**Estimated Effort:** 2 story points
**Goal:** Complete all database migration field definitions to establish the data foundation for API operations. This enables all CRUD operations by ensuring tables have proper structure, indexes, and relationships.

**Why This Matters:** Without complete database schema, no API endpoints can function. This is the foundational layer that everything else depends on.

**Prerequisites:** None - this is the starting point

---

### Story 1.1: Add fields to members table migration

**As a** backend developer
**I want to** complete the members table migration with all required fields
**So that** member data can be properly stored and queried

**Acceptance Criteria:**
1. Migration file `add_fields_to_members_table.php` includes all fields: name, email, company, position, photo, bio, joined_at
2. Email field has unique constraint
3. Photo and bio fields are nullable
4. Indexes created on: email, company, joined_at
5. Migration runs successfully without errors
6. `php artisan migrate:status` shows migration as executed

**Technical Notes:**
- File location: `database/migrations/2025_11_02_000001_add_fields_to_members_table.php`
- Use `Schema::table()` to modify existing table
- Test rollback with `migrate:rollback`

**Prerequisites:** None

---

### Story 1.2: Add fields to news table migration

**As a** backend developer
**I want to** complete the news table migration with all required fields
**So that** news articles can be stored with proper metadata and relationships

**Acceptance Criteria:**
1. Migration includes fields: title, slug, content, excerpt, image, published_at, author_id
2. Slug field has unique constraint
3. Excerpt and image fields are nullable
4. Foreign key constraint on author_id references users(id) with CASCADE delete
5. Indexes created on: slug, published_at (DESC), author_id
6. Migration runs successfully

**Technical Notes:**
- Use `$table->foreignId('author_id')->constrained('users')->onDelete('cascade')`
- published_at nullable to support draft articles

**Prerequisites:** Story 1.1 complete (sequential migration execution)

---

### Story 1.3: Add fields to events table migration

**As a** backend developer
**I want to** complete the events table migration with date handling
**So that** events can be scheduled and managed properly

**Acceptance Criteria:**
1. Migration includes fields: title, slug, description, location, starts_at, ends_at, capacity, image
2. Slug field has unique constraint
3. Capacity and image are nullable
4. Check constraint ensures ends_at > starts_at
5. Indexes created on: slug, starts_at, ends_at
6. Partial index on upcoming events (starts_at > now)
7. Migration runs successfully

**Technical Notes:**
- Use `CHECK` constraint for date validation in PostgreSQL
- Consider timezone handling for starts_at/ends_at

**Prerequisites:** Story 1.2 complete

---

### Story 1.4: Add fields to programs table migration

**As a** backend developer
**I want to** complete the programs table with enum and JSON support
**So that** educational programs can store structured data

**Acceptance Criteria:**
1. Migration includes fields: title, slug, description, duration, level, price, image, syllabus
2. Level field uses enum with values: beginner, intermediate, advanced
3. Syllabus field is JSONB type (PostgreSQL)
4. Price and image are nullable
5. Indexes created on: slug, level, price
6. Migration runs successfully

**Technical Notes:**
- Use `$table->enum('level', ['beginner', 'intermediate', 'advanced'])`
- Use `$table->jsonb('syllabus')->nullable()` for PostgreSQL

**Prerequisites:** Story 1.3 complete

---

### Story 1.5: Run migrations and verify schema

**As a** backend developer
**I want to** execute all migrations and verify database structure
**So that** I can confirm the schema is correct before building API

**Acceptance Criteria:**
1. All 4 migrations execute without errors
2. Database tables inspected and verified to have correct columns
3. Indexes verified using `\d table_name` in psql
4. Foreign key relationships verified
5. Test rollback executes cleanly
6. Re-run migrations successfully
7. Seeders can insert test data into all tables

**Technical Notes:**
- Use `php artisan migrate:fresh` for clean run
- Create simple seeder to test data insertion
- Document any issues in technical decisions log

**Prerequisites:** Stories 1.1-1.4 complete

---

## Epic 2: Authentication Implementation

**Priority:** P0 (Blocker)
**Estimated Effort:** 5 story points
**Goal:** Implement complete authentication flow using Laravel Sanctum, enabling users to register, login, logout, and retrieve their profile. This is the security gateway for the entire platform.

**Why This Matters:** Without authentication, no user can access protected resources. This unlocks all member-only features.

**Prerequisites:** Epic 1 complete (database schema ready)

---

### Story 2.1: Implement register endpoint

**As a** new visitor
**I want to** register an account with email and password
**So that** I can access member-only features

**Acceptance Criteria:**
1. POST /api/register endpoint accepts: name, email, password, password_confirmation
2. RegisterRequest validation class created with rules:
   - name: required, string, max:255
   - email: required, email, unique:users
   - password: required, min:8, confirmed
3. Password hashed using bcrypt before storage
4. User created in database successfully
5. Sanctum token generated and returned
6. Response includes user data and token (201 status)
7. Validation errors return 422 with error messages
8. Duplicate email returns appropriate error

**Technical Notes:**
- File: `app/Http/Controllers/Api/AuthController.php`
- Request: `app/Http/Requests/Auth/RegisterRequest.php`
- Use `Hash::make()` for password
- Use `$user->createToken('auth_token')`

**Prerequisites:** Story 1.5 complete (database ready)

---

### Story 2.2: Implement login endpoint

**As a** registered user
**I want to** login with my credentials
**So that** I can access my account and protected resources

**Acceptance Criteria:**
1. POST /api/login endpoint accepts: email, password
2. LoginRequest validation class created
3. User retrieved by email from database
4. Password verified using Hash::check()
5. Invalid credentials return 401 with "Invalid credentials" message
6. Valid credentials return user data and token (200 status)
7. Token is Sanctum personal access token
8. Multiple logins create separate tokens

**Technical Notes:**
- Validate credentials without exposing which field is wrong (security)
- Consider rate limiting (story 2.5)

**Prerequisites:** Story 2.1 complete

---

### Story 2.3: Implement logout endpoint

**As an** authenticated user
**I want to** logout securely
**So that** my session is terminated and token is revoked

**Acceptance Criteria:**
1. POST /api/logout endpoint requires authentication
2. Endpoint protected by `auth:sanctum` middleware
3. Current access token is revoked (deleted from database)
4. Returns 200 with success message
5. Subsequent requests with revoked token return 401
6. Logout does not affect other active sessions (other tokens remain valid)

**Technical Notes:**
- Use `auth()->user()->currentAccessToken()->delete()`
- Test with multiple active sessions

**Prerequisites:** Story 2.2 complete

---

### Story 2.4: Implement get user endpoint

**As an** authenticated user
**I want to** retrieve my current user data
**So that** I can display my profile information

**Acceptance Criteria:**
1. GET /api/user endpoint requires authentication
2. Protected by `auth:sanctum` middleware
3. Returns current authenticated user data (200 status)
4. Response uses UserResource for consistent formatting
5. Invalid/missing token returns 401
6. Expired token returns 401

**Technical Notes:**
- Use `auth()->user()` to get current user
- Create `app/Http/Resources/UserResource.php` for response transformation

**Prerequisites:** Story 2.3 complete

---

### Story 2.5: Add rate limiting to auth endpoints

**As a** platform administrator
**I want to** rate limit authentication endpoints
**So that** we prevent brute force attacks and abuse

**Acceptance Criteria:**
1. Register endpoint limited to 5 requests per minute per IP
2. Login endpoint limited to 5 requests per minute per IP
3. Other API endpoints limited to 60 requests per minute for authenticated users
4. Rate limit exceeded returns 429 status with retry-after header
5. Rate limiting configured in `app/Http/Kernel.php`
6. Custom throttle group 'auth' created

**Technical Notes:**
- Use Laravel's built-in throttling: `Route::middleware(['throttle:auth'])`
- Define throttle groups in RouteServiceProvider or Kernel

**Prerequisites:** Stories 2.1-2.4 complete

---

## Epic 3: API Routes Configuration

**Priority:** P0 (Blocker)
**Estimated Effort:** 3 story points
**Goal:** Configure all 23 RESTful API routes to activate platform functionality. This connects frontend requests to backend controllers.

**Why This Matters:** Without routes, API endpoints are not accessible. This makes the API publicly available.

**Prerequisites:** Epic 2 complete (authentication ready)

---

### Story 3.1: Configure public auth routes

**As a** backend developer
**I want to** configure public authentication routes
**So that** unauthenticated users can register and login

**Acceptance Criteria:**
1. `routes/api.php` file has public routes section
2. POST /api/register route points to AuthController@register
3. POST /api/login route points to AuthController@login
4. Routes do not require authentication middleware
5. Routes have rate limiting applied (throttle:auth)
6. Routes accessible via `php artisan route:list`

**Technical Notes:**
```php
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
```

**Prerequisites:** Epic 2 complete

---

### Story 3.2: Configure protected resource routes

**As a** backend developer
**I want to** configure protected routes for all resources
**So that** authenticated users can access CRUD operations

**Acceptance Criteria:**
1. Protected routes group created with `auth:sanctum` middleware
2. Logout and user endpoints configured in protected group
3. apiResource routes created for: members, news, events, programs
4. Routes automatically map to controller methods (index, store, show, update, destroy)
5. All 23 endpoints visible in route list
6. Attempting access without token returns 401

**Technical Notes:**
```php
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);
    Route::apiResource('members', MemberController::class);
    // ... etc
});
```

**Prerequisites:** Story 3.1 complete

---

### Story 3.3: Add API route groups and middleware

**As a** backend developer
**I want to** organize routes with proper middleware stacks
**So that** the API is secure and well-structured

**Acceptance Criteria:**
1. Routes organized into logical groups (public, authenticated)
2. CORS middleware applied to all API routes
3. JSON response middleware ensures proper content-type
4. Route prefixes used appropriately (/api prefix)
5. Route naming conventions followed
6. Middleware stack documented

**Technical Notes:**
- Verify `api` middleware group in `app/Http/Kernel.php` includes CORS
- Ensure all responses return JSON

**Prerequisites:** Story 3.2 complete

---

### Story 3.4: Test all routes with Postman/Insomnia

**As a** backend developer
**I want to** manually test all API endpoints
**So that** I can verify routing is working before controller implementation

**Acceptance Criteria:**
1. Postman/Insomnia collection created with all 23 endpoints
2. Public routes (register, login) return correct responses or 500 errors (controllers not implemented yet)
3. Protected routes without token return 401
4. Protected routes with valid token return responses (or 500 if controller incomplete)
5. Route parameters work correctly (e.g., /api/members/1)
6. Collection exported and saved to repo

**Technical Notes:**
- Create `postman/kfa-api.postman_collection.json`
- Document token usage in collection variables

**Prerequisites:** Story 3.3 complete

---

## Epic 4: CRUD Operations Implementation

**Priority:** P1 (High)
**Estimated Effort:** 8 story points
**Goal:** Implement complete CRUD functionality for Members, News, Events, and Programs. This delivers core business value by enabling content management.

**Why This Matters:** This is the heart of the platform - enabling administrators to manage members, publish news, schedule events, and create educational programs.

**Prerequisites:** Epic 3 complete (routes configured)

---

### Story 4.1: Implement MemberController CRUD

**As an** administrator
**I want to** manage members through API
**So that** I can maintain the member directory

**Acceptance Criteria:**
1. MemberController implements all 5 methods: index, store, show, update, destroy
2. index() returns paginated members with search capability
3. store() creates member with validation (StoreMemberRequest)
4. show() returns single member by ID (404 if not found)
5. update() updates member fields (UpdateMemberRequest)
6. destroy() deletes member (204 response)
7. File upload handling for photo field
8. MemberResource transforms responses consistently
9. All endpoints return proper HTTP status codes

**Technical Notes:**
- Validation: email unique, name required, company required
- Store photos in `storage/app/public/members/`
- Use `Member::paginate(15)` for index

**Prerequisites:** Epic 3 complete

---

### Story 4.2: Implement NewsController CRUD

**As an** administrator
**I want to** manage news articles through API
**So that** I can keep members informed with latest updates

**Acceptance Criteria:**
1. NewsController implements all CRUD methods
2. index() returns published news for public, all news for authenticated users
3. Automatic slug generation from title using `Str::slug()`
4. Author automatically set to authenticated user on creation
5. store() handles image upload
6. News ordered by published_at DESC
7. Eager load author relationship to avoid N+1 queries
8. Validation includes: title required, content required
9. NewsResource includes author details

**Technical Notes:**
- Use `News::with('author')->paginate()`
- Store images in `storage/app/public/news/`
- published_at nullable for draft support

**Prerequisites:** Story 4.1 complete

---

### Story 4.3: Implement EventController CRUD

**As an** administrator
**I want to** manage events through API
**So that** members can discover and register for events

**Acceptance Criteria:**
1. EventController implements all CRUD methods
2. index() supports filtering by date range (?from=date&to=date)
3. Events ordered by starts_at ascending
4. Validation ensures ends_at is after starts_at
5. Capacity field optional (nullable)
6. Image upload handling
7. EventResource formats dates in ISO8601
8. Query optimization with indexes

**Technical Notes:**
- Use Carbon for date comparisons
- Consider adding `scope` for upcoming events
- Store images in `storage/app/public/events/`

**Prerequisites:** Story 4.2 complete

---

### Story 4.4: Implement ProgramController CRUD

**As an** administrator
**I want to** manage educational programs through API
**So that** members can browse and enroll in courses

**Acceptance Criteria:**
1. ProgramController implements all CRUD methods
2. index() supports filtering by level (?level=intermediate)
3. Level field validated as enum (beginner, intermediate, advanced)
4. Syllabus stored as JSON with proper validation
5. Price field stored as decimal with 2 decimals
6. Image upload handling
7. ProgramResource formats JSON fields correctly

**Technical Notes:**
- Validate syllabus structure if needed
- Price stored as `decimal(10,2)`
- Store images in `storage/app/public/programs/`

**Prerequisites:** Story 4.3 complete

---

### Story 4.5: Add validation rules for all resources

**As a** backend developer
**I want to** centralize validation logic in FormRequest classes
**So that** validation is reusable and maintainable

**Acceptance Criteria:**
1. FormRequest classes created for all resources:
   - StoreMemberRequest, UpdateMemberRequest
   - StoreNewsRequest, UpdateNewsRequest
   - StoreEventRequest, UpdateEventRequest
   - StoreProgramRequest, UpdateProgramRequest
2. Each request has comprehensive validation rules
3. Custom error messages where appropriate
4. Authorization logic in `authorize()` method
5. Validation runs before controller methods
6. 422 responses return structured error messages

**Technical Notes:**
- Location: `app/Http/Requests/{Resource}/`
- Use `sometimes` rule for update operations
- Custom messages via `messages()` method

**Prerequisites:** Stories 4.1-4.4 complete

---

### Story 4.6: Add file upload handling and storage

**As a** backend developer
**I want to** properly handle file uploads across all resources
**So that** images are securely stored and accessible

**Acceptance Criteria:**
1. File upload validation: max size, allowed types (jpeg, jpg, png, gif)
2. Files stored using Laravel's Storage facade
3. Symbolic link created from public to storage
4. File paths stored in database as relative paths
5. Old files deleted when updating
6. Files deleted when resource deleted
7. Proper error handling for upload failures

**Technical Notes:**
- Run `php artisan storage:link` for symbolic link
- Use `$request->file('image')->store('folder', 'public')`
- Max size: 2MB
- Delete old: `Storage::disk('public')->delete($old_path)`

**Prerequisites:** Story 4.5 complete

---

## Epic 5: CORS & Security

**Priority:** P0 (Blocker)
**Estimated Effort:** 2 story points
**Goal:** Configure CORS to enable frontend-backend communication and add essential security headers. Without this, the React frontend cannot make API requests.

**Why This Matters:** CORS is the bridge between frontend and backend. Without proper configuration, all API calls will fail with CORS errors.

**Prerequisites:** Epic 4 complete (API functional)

---

### Story 5.1: Configure CORS settings

**As a** backend developer
**I want to** configure CORS properly
**So that** the React frontend can communicate with the API

**Acceptance Criteria:**
1. `config/cors.php` configured with correct settings
2. Allowed origins includes: http://localhost:3000 (dev) and production domain
3. Allowed methods: all (*)
4. Allowed headers: all (*)
5. Supports credentials: true (for Sanctum)
6. Paths includes: api/*, sanctum/csrf-cookie
7. CORS middleware active in `app/Http/Kernel.php`
8. Environment variable FRONTEND_URL used for configuration

**Technical Notes:**
```php
'allowed_origins' => [
    env('FRONTEND_URL', 'http://localhost:3000'),
],
'supports_credentials' => true,
```

**Prerequisites:** Epic 4 complete

---

### Story 5.2: Test CORS from frontend

**As a** frontend developer
**I want to** verify CORS is working
**So that** I can proceed with API integration

**Acceptance Criteria:**
1. Simple fetch request from React app succeeds
2. Preflight OPTIONS requests handled correctly
3. Authorization headers accepted
4. Credentials included in requests
5. No CORS errors in browser console
6. Test from both http://localhost:3000 and actual frontend

**Technical Notes:**
- Use browser DevTools Network tab to inspect
- Check for Access-Control-Allow-Origin header in responses
- Test with and without authentication

**Prerequisites:** Story 5.1 complete

---

### Story 5.3: Add security headers

**As a** security-conscious developer
**I want to** add security headers to all responses
**So that** the API is protected from common attacks

**Acceptance Criteria:**
1. Security headers middleware created
2. Headers added:
   - X-Frame-Options: DENY
   - X-Content-Type-Options: nosniff
   - X-XSS-Protection: 1; mode=block
   - Strict-Transport-Security: max-age=31536000 (production only)
3. Middleware registered globally
4. Headers present in all API responses
5. No impact on CORS functionality

**Technical Notes:**
- Create middleware: `php artisan make:middleware SecurityHeaders`
- Register in `$middleware` array in Kernel.php

**Prerequisites:** Story 5.2 complete

---

## Epic 6: Frontend Integration

**Priority:** P0 (Blocker)
**Estimated Effort:** 5 story points
**Goal:** Create API service layer in React frontend and integrate with backend API. This connects the complete system end-to-end.

**Why This Matters:** This makes the platform usable by end users. Frontend can now display real data instead of mocks.

**Prerequisites:** Epic 5 complete (CORS working)

---

### Story 6.1: Create API service layer

**As a** frontend developer
**I want to** create a centralized API service
**So that** all API calls are consistent and maintainable

**Acceptance Criteria:**
1. File created: `kfa-website/src/services/api.ts`
2. Axios instance configured with base URL from env
3. Request interceptor adds Authorization header with token
4. Response interceptor handles 401 (redirect to login)
5. Service methods created for all endpoints:
   - authService (register, login, logout, getUser)
   - memberService (getAll, get, create, update, delete)
   - newsService (CRUD methods)
   - eventService (CRUD methods)
   - programService (CRUD methods)
6. TypeScript types defined for all requests/responses
7. Error handling with proper error types

**Technical Notes:**
- Use `import.meta.env.VITE_API_URL` for base URL
- Token stored in localStorage
- Response interceptor clears token on 401

**Prerequisites:** Epic 5 complete

---

### Story 6.2: Integrate authentication flow

**As a** user
**I want to** register and login through the UI
**So that** I can access the platform

**Acceptance Criteria:**
1. Register page calls authService.register()
2. Success stores token in localStorage
3. User redirected to dashboard after successful login
4. Login page calls authService.login()
5. Logout button calls authService.logout() and clears token
6. Auth state managed in Zustand store
7. Token persists across page refreshes
8. Protected routes check for valid token
9. User feedback for errors (toast notifications)
10. Loading states during API calls

**Technical Notes:**
- Update `src/store/authStore.ts`
- Use React Router's `Navigate` for redirects
- Clear Zustand state on logout

**Prerequisites:** Story 6.1 complete

---

### Story 6.3: Connect dashboard to API

**As a** member
**I want to** see real data in the dashboard
**So that** I have up-to-date information

**Acceptance Criteria:**
1. Dashboard fetches real news from newsService.getAll()
2. Events calendar fetches from eventService.getAll()
3. Programs list fetches from programService.getAll()
4. Member directory fetches from memberService.getAll()
5. Loading states shown during data fetch
6. Empty states when no data available
7. Error states with retry option
8. Data cached in Zustand stores
9. Auto-refresh on mount
10. Pagination works correctly

**Technical Notes:**
- Use React Query or manual useEffect
- Update stores: newsStore, eventStore, programStore, memberStore

**Prerequisites:** Story 6.2 complete

---

### Story 6.4: Add error handling and user feedback

**As a** user
**I want to** receive clear feedback on actions
**So that** I understand what's happening

**Acceptance Criteria:**
1. Toast/notification library integrated (e.g., react-hot-toast)
2. Success messages shown for: create, update, delete operations
3. Error messages shown for API failures
4. Network errors handled gracefully
5. Validation errors displayed on forms
6. 401 errors auto-redirect to login
7. 404 errors show "Not found" message
8. Loading spinners during operations
9. Disabled buttons during submission
10. Optimistic updates where appropriate

**Technical Notes:**
- Install react-hot-toast or similar
- Create reusable error handler function
- Show validation errors per-field

**Prerequisites:** Story 6.3 complete

---

### Story 6.5: Update stores to use real data

**As a** frontend developer
**I want to** replace mock data with API calls
**So that** the application uses real backend data

**Acceptance Criteria:**
1. All Zustand stores updated to fetch from API
2. Mock data removed from stores
3. Store actions call API service methods
4. Optimistic updates implemented for better UX
5. Error states handled in stores
6. Loading states tracked in stores
7. Pagination state managed
8. Filters/search state managed
9. Store persistence works with real data
10. All components render correctly with real data

**Technical Notes:**
- Update: authStore, memberStore, newsStore, eventStore, programStore
- Keep persistence for auth state only
- Test with empty database and populated database

**Prerequisites:** Story 6.4 complete

---

## Story Guidelines Reference

**Story Format:**

```
**Story [EPIC.N]: [Story Title]**

As a [user type],
I want [goal/desire],
So that [benefit/value].

**Acceptance Criteria:**
1. [Specific testable criterion]
2. [Another specific criterion]
3. [etc.]

**Prerequisites:** [Dependencies on previous stories, if any]
```

**Story Requirements:**

- **Vertical slices** - Complete, testable functionality delivery
- **Sequential ordering** - Logical progression within epic
- **No forward dependencies** - Only depend on previous work
- **AI-agent sized** - Completable in 2-4 hour focused session
- **Value-focused** - Integrate technical enablers into value-delivering stories

---

**For implementation:** Use the `create-story` workflow to generate individual story implementation plans from this epic breakdown.

---

**Document Status:** Complete
**Total Stories:** 25 stories
**Total Epics:** 6 epics
**Estimated Total Effort:** 25 story points
**Based on:** PRD v1.1 (docs/prd-kfa-api-completion.md)
**Date:** 2025-11-02
