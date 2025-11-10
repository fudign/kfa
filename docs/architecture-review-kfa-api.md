# Architecture Review & Technical Specification

## KFA API Completion Project

**Document Version**: 1.0
**Date**: 2025-11-02
**Architect**: BMM Architect Agent
**Project**: KFA Web Platform
**Review Type**: Brownfield Integration

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Current Architecture Analysis](#2-current-architecture-analysis)
3. [Integration Architecture](#3-integration-architecture)
4. [Technical Specifications](#4-technical-specifications)
5. [Security Architecture](#5-security-architecture)
6. [Data Architecture](#6-data-architecture)
7. [API Design](#7-api-design)
8. [Implementation Guidelines](#8-implementation-guidelines)
9. [Quality Attributes](#9-quality-attributes)
10. [Architectural Decision Records (ADRs)](#10-architectural-decision-records-adrs)

---

## 1. Executive Summary

### 1.1 Architecture Goals

- Complete API layer without disrupting existing frontend
- Implement secure authentication using Laravel Sanctum
- Enable CRUD operations for Members, News, Events, Programs
- Maintain clean architecture principles
- Ensure scalability and maintainability

### 1.2 Key Architectural Decisions

1. **Sanctum over Passport** - SPA authentication, simpler setup
2. **Repository Pattern** - Future-proof for testing and swapping data sources
3. **Service Layer** - Business logic separation from controllers
4. **Resource Transformers** - Consistent API responses
5. **FormRequest Validation** - Dedicated validation classes

### 1.3 Architecture Compliance

- ✅ RESTful API design principles
- ✅ Laravel best practices and conventions
- ✅ SOLID principles
- ✅ Clean architecture layers
- ✅ Security-first approach

---

## 2. Current Architecture Analysis

### 2.1 System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        Client Layer                          │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  React 18.3.1 + TypeScript 5.4.2                      │  │
│  │  - Vite 5.2.0 (Build Tool)                            │  │
│  │  - TailwindCSS 3.4.1 (Styling)                        │  │
│  │  - Zustand 4.5.2 (State Management)                   │  │
│  │  - React Router v6 (Routing)                          │  │
│  │  - react-i18next (Internationalization)               │  │
│  └───────────────────────────────────────────────────────┘  │
│                         ↓ HTTP/REST                          │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│                    Application Layer                         │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  Laravel 11.46.1 (Port 80)                            │  │
│  │  ┌─────────────────────────────────────────────────┐  │  │
│  │  │  Controllers (HTTP Entry Points)                │  │  │
│  │  │  - AuthController                                │  │  │
│  │  │  - MemberController                              │  │  │
│  │  │  - NewsController                                │  │  │
│  │  │  - EventController                               │  │  │
│  │  │  - ProgramController                             │  │  │
│  │  └─────────────────────────────────────────────────┘  │  │
│  │  ┌─────────────────────────────────────────────────┐  │  │
│  │  │  Service Layer (Business Logic)                 │  │  │
│  │  │  - AuthService                                   │  │  │
│  │  │  - MemberService                                 │  │  │
│  │  │  - NewsService                                   │  │  │
│  │  │  - EventService                                  │  │  │
│  │  │  - ProgramService                                │  │  │
│  │  └─────────────────────────────────────────────────┘  │  │
│  │  ┌─────────────────────────────────────────────────┐  │  │
│  │  │  Models (Domain Entities)                       │  │  │
│  │  │  - User                                          │  │  │
│  │  │  - Member                                        │  │  │
│  │  │  - News                                          │  │  │
│  │  │  - Event                                         │  │  │
│  │  │  - Program                                       │  │  │
│  │  └─────────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────┘  │
│                         ↓ Eloquent ORM                       │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│                     Data Layer                               │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  PostgreSQL 15 (Port 5432)                            │  │
│  │  - users                                               │  │
│  │  - members                                             │  │
│  │  - news                                                │  │
│  │  - events                                              │  │
│  │  - programs                                            │  │
│  │  - personal_access_tokens (Sanctum)                   │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                   Infrastructure Layer                       │
│  - Redis (Cache & Sessions) - Port 6379                     │
│  - Mailpit (Email Testing) - Port 8025                      │
│  - Docker Compose (Container Orchestration)                 │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 Existing Components Assessment

#### ✅ Strengths

1. **Modern Tech Stack** - Latest stable versions of all frameworks
2. **Containerization** - Docker Compose for consistent environments
3. **TypeScript Frontend** - Type safety and better DX
4. **State Management** - Zustand with persistence
5. **Internationalization** - Multi-language support ready

#### ⚠️ Weaknesses

1. **No API Implementation** - Controllers are empty shells
2. **Missing Authentication** - No Sanctum integration
3. **No CORS Config** - Frontend cannot communicate with backend
4. **Incomplete Migrations** - Tables lack necessary columns
5. **No Validation** - No request validation classes
6. **No Tests** - Zero test coverage

#### 🎯 Opportunities

1. Implement repository pattern for testability
2. Add service layer for reusable business logic
3. Create API resources for consistent responses
4. Add comprehensive request validation
5. Implement caching strategy

#### 🚨 Threats

1. Security vulnerabilities if validation not thorough
2. Performance issues without proper indexing
3. CORS misconfiguration could block frontend
4. Token management issues without proper handling

---

## 3. Integration Architecture

### 3.1 Authentication Flow

```
┌──────────────────────────────────────────────────────────────┐
│                    Registration Flow                          │
└──────────────────────────────────────────────────────────────┘

React App                Laravel API              PostgreSQL
    │                        │                         │
    ├─POST /api/register────>│                         │
    │  {name, email, pass}   │                         │
    │                        ├─Validate Input          │
    │                        │                         │
    │                        ├─INSERT users───────────>│
    │                        │                         │
    │                        │<────User Created────────┤
    │                        │                         │
    │                        ├─Create Token            │
    │                        │                         │
    │<───{user, token}───────┤                         │
    │                        │                         │
    ├─Store token           │                         │
    │  localStorage          │                         │
    │                        │                         │

┌──────────────────────────────────────────────────────────────┐
│                       Login Flow                              │
└──────────────────────────────────────────────────────────────┘

React App                Laravel API              PostgreSQL
    │                        │                         │
    ├─POST /api/login───────>│                         │
    │  {email, password}     │                         │
    │                        ├─Validate Credentials───>│
    │                        │                         │
    │                        │<────User Found──────────┤
    │                        │                         │
    │                        ├─Create Token            │
    │                        │ (Sanctum)               │
    │                        │                         │
    │<───{user, token}───────┤                         │
    │                        │                         │
    ├─Store token           │                         │
    │  localStorage          │                         │
    │                        │                         │

┌──────────────────────────────────────────────────────────────┐
│                   Authenticated Request                       │
└──────────────────────────────────────────────────────────────┘

React App                Laravel API              PostgreSQL
    │                        │                         │
    ├─GET /api/news─────────>│                         │
    │  Header:                │                         │
    │  Authorization:         │                         │
    │  Bearer {token}         │                         │
    │                        ├─Verify Token            │
    │                        │ (Sanctum middleware)    │
    │                        │                         │
    │                        ├─SELECT news────────────>│
    │                        │                         │
    │                        │<────Results─────────────┤
    │                        │                         │
    │                        ├─Transform to Resource   │
    │                        │                         │
    │<───{data: [...]}───────┤                         │
    │                        │                         │
```

### 3.2 CRUD Operation Pattern

```
┌──────────────────────────────────────────────────────────────┐
│                   Standard CRUD Flow                          │
└──────────────────────────────────────────────────────────────┘

Request → Middleware → Controller → Service → Repository → Model → DB

1. Request arrives with data
2. Middleware validates authentication (Sanctum)
3. Controller receives request
4. FormRequest validates input
5. Service layer processes business logic
6. Repository handles data access
7. Model interacts with database
8. Response transformed via Resource
9. JSON returned to client
```

---

## 4. Technical Specifications

### 4.1 Directory Structure

```
kfa-backend/kfa-api/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   └── Api/
│   │   │       ├── AuthController.php
│   │   │       ├── MemberController.php
│   │   │       ├── NewsController.php
│   │   │       ├── EventController.php
│   │   │       └── ProgramController.php
│   │   ├── Middleware/
│   │   │   └── EnsureTokenIsValid.php
│   │   ├── Requests/                      # NEW
│   │   │   ├── Auth/
│   │   │   │   ├── RegisterRequest.php
│   │   │   │   └── LoginRequest.php
│   │   │   ├── Member/
│   │   │   │   ├── StoreMemberRequest.php
│   │   │   │   └── UpdateMemberRequest.php
│   │   │   ├── News/
│   │   │   │   ├── StoreNewsRequest.php
│   │   │   │   └── UpdateNewsRequest.php
│   │   │   ├── Event/
│   │   │   │   ├── StoreEventRequest.php
│   │   │   │   └── UpdateEventRequest.php
│   │   │   └── Program/
│   │   │       ├── StoreProgramRequest.php
│   │   │       └── UpdateProgramRequest.php
│   │   └── Resources/                     # NEW
│   │       ├── UserResource.php
│   │       ├── MemberResource.php
│   │       ├── NewsResource.php
│   │       ├── EventResource.php
│   │       └── ProgramResource.php
│   ├── Models/
│   │   ├── User.php
│   │   ├── Member.php
│   │   ├── News.php
│   │   ├── Event.php
│   │   └── Program.php
│   ├── Services/                          # NEW
│   │   ├── AuthService.php
│   │   ├── MemberService.php
│   │   ├── NewsService.php
│   │   ├── EventService.php
│   │   └── ProgramService.php
│   └── Repositories/                      # NEW (Optional for now)
├── config/
│   ├── cors.php
│   └── sanctum.php
├── database/
│   └── migrations/
│       ├── 2025_11_02_000001_add_fields_to_members_table.php
│       ├── 2025_11_02_000002_add_fields_to_news_table.php
│       ├── 2025_11_02_000003_add_fields_to_events_table.php
│       └── 2025_11_02_000004_add_fields_to_programs_table.php
└── routes/
    └── api.php
```

### 4.2 Layer Responsibilities

#### Controllers Layer

**Responsibility**: HTTP request/response handling
**Should**:

- Receive HTTP requests
- Delegate to services
- Return HTTP responses
- Handle exceptions

**Should NOT**:

- Contain business logic
- Directly query database
- Validate complex rules (use FormRequests)

#### Service Layer

**Responsibility**: Business logic execution
**Should**:

- Implement business rules
- Coordinate between multiple models
- Handle transactions
- Process complex operations

**Should NOT**:

- Handle HTTP concerns
- Directly return HTTP responses

#### Model Layer

**Responsibility**: Data representation
**Should**:

- Define relationships
- Define casts and accessors
- Define scopes
- Handle model events

**Should NOT**:

- Contain business logic
- Handle HTTP requests

---

## 5. Security Architecture

### 5.1 Authentication Security

```php
// Laravel Sanctum Token-Based Auth

┌──────────────────────────────────────────────────────────┐
│  Security Measures                                        │
├──────────────────────────────────────────────────────────┤
│  1. Token Generation                                      │
│     - Cryptographically secure random tokens             │
│     - SHA-256 hashing                                     │
│     - Stored in personal_access_tokens table             │
│                                                           │
│  2. Token Validation                                      │
│     - Middleware: auth:sanctum                           │
│     - Automatic token verification                        │
│     - Revocation support                                  │
│                                                           │
│  3. Password Security                                     │
│     - Bcrypt hashing (cost factor: 10)                   │
│     - Minimum 8 characters                                │
│     - No password stored in plain text                    │
│                                                           │
│  4. Rate Limiting                                         │
│     - Login: 5 attempts per minute                        │
│     - Register: 5 attempts per minute                     │
│     - API calls: 60 requests per minute (authenticated)  │
│                                                           │
│  5. CORS Protection                                       │
│     - Whitelist allowed origins                           │
│     - Credentials support enabled                         │
│     - Preflight request handling                          │
└──────────────────────────────────────────────────────────┘
```

### 5.2 Input Validation Security

```php
// Multi-Layer Validation

┌──────────────────────────────────────────────────────────┐
│  Layer 1: FormRequest Validation                         │
├──────────────────────────────────────────────────────────┤
│  - Type checking                                          │
│  - Format validation                                      │
│  - Required fields                                        │
│  - Custom rules                                           │
└──────────────────────────────────────────────────────────┘
                          ↓
┌──────────────────────────────────────────────────────────┐
│  Layer 2: Database Constraints                            │
├──────────────────────────────────────────────────────────┤
│  - Unique constraints                                     │
│  - Foreign key constraints                                │
│  - NOT NULL constraints                                   │
│  - Check constraints                                      │
└──────────────────────────────────────────────────────────┘
                          ↓
┌──────────────────────────────────────────────────────────┐
│  Layer 3: Business Logic Validation                       │
├──────────────────────────────────────────────────────────┤
│  - Authorization checks                                   │
│  - State validation                                       │
│  - Cross-field validation                                 │
└──────────────────────────────────────────────────────────┘
```

### 5.3 Security Best Practices

```php
// 1. SQL Injection Prevention
- Use Eloquent ORM (parameterized queries)
- Never concatenate user input in queries
- Use query builder bindings

// 2. XSS Prevention
- API returns JSON (not HTML)
- React escapes by default
- Use Resources for output transformation

// 3. CSRF Prevention
- Sanctum handles CSRF for SPAs
- Token-based authentication

// 4. Mass Assignment Protection
- Define $fillable or $guarded in models
- Use FormRequests for input filtering

// 5. Authorization
- Policy classes for resource access
- Gate definitions for abilities
- Middleware for route protection
```

---

## 6. Data Architecture

### 6.1 Database Schema

#### Users Table

```sql
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    email_verified_at TIMESTAMP NULL,
    password VARCHAR(255) NOT NULL,
    remember_token VARCHAR(100) NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_users_email ON users(email);
```

#### Members Table

```sql
CREATE TABLE members (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    company VARCHAR(255) NOT NULL,
    position VARCHAR(255) NOT NULL,
    photo VARCHAR(255) NULL,
    bio TEXT NULL,
    joined_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_members_email ON members(email);
CREATE INDEX idx_members_company ON members(company);
CREATE INDEX idx_members_joined_at ON members(joined_at);
```

#### News Table

```sql
CREATE TABLE news (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    content TEXT NOT NULL,
    excerpt TEXT NULL,
    image VARCHAR(255) NULL,
    published_at TIMESTAMP NULL,
    author_id BIGINT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_news_author FOREIGN KEY (author_id)
        REFERENCES users(id) ON DELETE CASCADE
);

-- Indexes
CREATE INDEX idx_news_slug ON news(slug);
CREATE INDEX idx_news_published_at ON news(published_at);
CREATE INDEX idx_news_author_id ON news(author_id);
CREATE INDEX idx_news_published_at_desc ON news(published_at DESC);
```

#### Events Table

```sql
CREATE TABLE events (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT NOT NULL,
    location VARCHAR(255) NOT NULL,
    starts_at TIMESTAMP NOT NULL,
    ends_at TIMESTAMP NOT NULL,
    capacity INTEGER NULL,
    image VARCHAR(255) NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT chk_events_dates CHECK (ends_at > starts_at)
);

-- Indexes
CREATE INDEX idx_events_slug ON events(slug);
CREATE INDEX idx_events_starts_at ON events(starts_at);
CREATE INDEX idx_events_ends_at ON events(ends_at);
CREATE INDEX idx_events_upcoming ON events(starts_at) WHERE starts_at > CURRENT_TIMESTAMP;
```

#### Programs Table

```sql
CREATE TABLE programs (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT NOT NULL,
    duration VARCHAR(255) NOT NULL,
    level VARCHAR(50) NOT NULL CHECK (level IN ('beginner', 'intermediate', 'advanced')),
    price DECIMAL(10, 2) NULL,
    image VARCHAR(255) NULL,
    syllabus JSONB NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_programs_slug ON programs(slug);
CREATE INDEX idx_programs_level ON programs(level);
CREATE INDEX idx_programs_price ON programs(price);
```

### 6.2 Relationships

```
┌─────────────┐
│    User     │
└──────┬──────┘
       │
       │ has many
       ▼
┌─────────────┐
│    News     │
│  (author)   │
└─────────────┘

Eloquent Definitions:

User Model:
    public function news() {
        return $this->hasMany(News::class, 'author_id');
    }

News Model:
    public function author() {
        return $this->belongsTo(User::class, 'author_id');
    }
```

---

## 7. API Design

### 7.1 RESTful Conventions

```
Resource: Members

GET    /api/members          -> index()   List all members
POST   /api/members          -> store()   Create new member
GET    /api/members/{id}     -> show()    Show single member
PUT    /api/members/{id}     -> update()  Update member
DELETE /api/members/{id}     -> destroy() Delete member
```

### 7.2 Response Format Standards

```json
// Success Response (200, 201)
{
  "data": {
    "id": 1,
    "name": "string",
    "email": "string",
    "created_at": "ISO8601 timestamp",
    "updated_at": "ISO8601 timestamp"
  }
}

// Collection Response (200)
{
  "data": [
    {...},
    {...}
  ],
  "links": {
    "first": "url",
    "last": "url",
    "prev": "url",
    "next": "url"
  },
  "meta": {
    "current_page": 1,
    "from": 1,
    "last_page": 5,
    "per_page": 15,
    "to": 15,
    "total": 75
  }
}

// Error Response (4xx, 5xx)
{
  "message": "Error description",
  "errors": {
    "field_name": [
      "Validation error message"
    ]
  }
}

// Validation Error (422)
{
  "message": "The given data was invalid.",
  "errors": {
    "email": [
      "The email has already been taken."
    ],
    "password": [
      "The password must be at least 8 characters."
    ]
  }
}
```

### 7.3 HTTP Status Codes

```
200 OK                  - Successful GET, PUT, PATCH
201 Created             - Successful POST
204 No Content          - Successful DELETE
400 Bad Request         - Invalid request format
401 Unauthorized        - Authentication required
403 Forbidden           - Insufficient permissions
404 Not Found           - Resource not found
422 Unprocessable Entity - Validation failed
429 Too Many Requests   - Rate limit exceeded
500 Internal Server Error - Server error
```

---

## 8. Implementation Guidelines

### 8.1 Epic 1: Database Schema

**File**: `database/migrations/2025_11_02_000001_add_fields_to_members_table.php`

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('members', function (Blueprint $table) {
            $table->string('name');
            $table->string('email')->unique();
            $table->string('company');
            $table->string('position');
            $table->string('photo')->nullable();
            $table->text('bio')->nullable();
            $table->timestamp('joined_at');

            // Indexes
            $table->index('email');
            $table->index('company');
            $table->index('joined_at');
        });
    }

    public function down(): void
    {
        Schema::table('members', function (Blueprint $table) {
            $table->dropIndex(['email']);
            $table->dropIndex(['company']);
            $table->dropIndex(['joined_at']);

            $table->dropColumn([
                'name', 'email', 'company', 'position',
                'photo', 'bio', 'joined_at'
            ]);
        });
    }
};
```

### 8.2 Epic 2: Authentication

**File**: `app/Http/Controllers/Api/AuthController.php`

```php
<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\RegisterRequest;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function register(RegisterRequest $request): JsonResponse
    {
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'user' => new UserResource($user),
            'token' => $token,
        ], 201);
    }

    public function login(LoginRequest $request): JsonResponse
    {
        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'Invalid credentials'
            ], 401);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'user' => new UserResource($user),
            'token' => $token,
        ]);
    }

    public function logout(): JsonResponse
    {
        auth()->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logged out successfully'
        ]);
    }

    public function user(): JsonResponse
    {
        return response()->json([
            'user' => new UserResource(auth()->user())
        ]);
    }
}
```

**File**: `app/Http/Requests/Auth/RegisterRequest.php`

```php
<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;

class RegisterRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ];
    }
}
```

### 8.3 Epic 3: API Routes

**File**: `routes/api.php`

```php
<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\MemberController;
use App\Http\Controllers\Api\NewsController;
use App\Http\Controllers\Api\EventController;
use App\Http\Controllers\Api\ProgramController;
use Illuminate\Support\Facades\Route;

// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    // Auth
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);

    // Resources
    Route::apiResource('members', MemberController::class);
    Route::apiResource('news', NewsController::class);
    Route::apiResource('events', EventController::class);
    Route::apiResource('programs', ProgramController::class);
});

// Rate limiting
Route::middleware(['throttle:auth'])->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
});
```

### 8.4 Epic 4: CRUD Implementation

**File**: `app/Http/Controllers/Api/NewsController.php`

```php
<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\News\StoreNewsRequest;
use App\Http\Requests\News\UpdateNewsRequest;
use App\Http\Resources\NewsResource;
use App\Models\News;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Str;

class NewsController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        $news = News::with('author')
            ->when(!auth()->check(), function ($query) {
                $query->whereNotNull('published_at');
            })
            ->orderBy('published_at', 'desc')
            ->paginate(15);

        return NewsResource::collection($news);
    }

    public function store(StoreNewsRequest $request): JsonResponse
    {
        $data = $request->validated();
        $data['slug'] = Str::slug($data['title']);
        $data['author_id'] = auth()->id();

        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('news', 'public');
        }

        $news = News::create($data);

        return response()->json([
            'data' => new NewsResource($news->load('author'))
        ], 201);
    }

    public function show(News $news): JsonResponse
    {
        return response()->json([
            'data' => new NewsResource($news->load('author'))
        ]);
    }

    public function update(UpdateNewsRequest $request, News $news): JsonResponse
    {
        $data = $request->validated();

        if ($request->has('title')) {
            $data['slug'] = Str::slug($data['title']);
        }

        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('news', 'public');
        }

        $news->update($data);

        return response()->json([
            'data' => new NewsResource($news->load('author'))
        ]);
    }

    public function destroy(News $news): JsonResponse
    {
        $news->delete();

        return response()->json(null, 204);
    }
}
```

### 8.5 Epic 5: CORS Configuration

**File**: `config/cors.php`

```php
<?php

return [
    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'],

    'allowed_origins' => [
        env('FRONTEND_URL', 'http://localhost:3000'),
    ],

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => true,
];
```

### 8.6 Epic 6: Frontend Integration

**File**: `kfa-website/src/services/api.ts`

```typescript
import axios, { AxiosInstance } from 'axios';

const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  },
);

export const authService = {
  register: (data: { name: string; email: string; password: string; password_confirmation: string }) => api.post('/register', data),

  login: (data: { email: string; password: string }) => api.post('/login', data),

  logout: () => api.post('/logout'),

  getUser: () => api.get('/user'),
};

export const memberService = {
  getAll: (params?: any) => api.get('/members', { params }),
  get: (id: number) => api.get(`/members/${id}`),
  create: (data: any) => api.post('/members', data),
  update: (id: number, data: any) => api.put(`/members/${id}`, data),
  delete: (id: number) => api.delete(`/members/${id}`),
};

export const newsService = {
  getAll: (params?: any) => api.get('/news', { params }),
  get: (id: number) => api.get(`/news/${id}`),
  create: (data: any) => api.post('/news', data),
  update: (id: number, data: any) => api.put(`/news/${id}`, data),
  delete: (id: number) => api.delete(`/news/${id}`),
};

export const eventService = {
  getAll: (params?: any) => api.get('/events', { params }),
  get: (id: number) => api.get(`/events/${id}`),
  create: (data: any) => api.post('/events', data),
  update: (id: number, data: any) => api.put(`/events/${id}`, data),
  delete: (id: number) => api.delete(`/events/${id}`),
};

export const programService = {
  getAll: (params?: any) => api.get('/programs', { params }),
  get: (id: number) => api.get(`/programs/${id}`),
  create: (data: any) => api.post('/programs', data),
  update: (id: number, data: any) => api.put(`/programs/${id}`, data),
  delete: (id: number) => api.delete(`/programs/${id}`),
};

export default api;
```

---

## 9. Quality Attributes

### 9.1 Performance Targets

```
┌──────────────────────────────────────────────────────────┐
│  Performance Metrics                                      │
├──────────────────────────────────────────────────────────┤
│  API Response Time (95th percentile)                     │
│  - GET requests: < 200ms                                 │
│  - POST/PUT requests: < 300ms                            │
│  - DELETE requests: < 150ms                              │
│                                                           │
│  Database Query Performance                               │
│  - Simple queries: < 50ms                                │
│  - Join queries: < 100ms                                 │
│  - Aggregation queries: < 200ms                          │
│                                                           │
│  Throughput                                               │
│  - Concurrent users: 100+                                │
│  - Requests per second: 200+                             │
└──────────────────────────────────────────────────────────┘
```

### 9.2 Scalability Strategy

```
Horizontal Scaling:
- Laravel app: Multiple containers behind load balancer
- Database: PostgreSQL read replicas
- Cache: Redis Cluster

Vertical Scaling:
- Optimize database queries
- Add indexes strategically
- Implement query caching
```

### 9.3 Maintainability

```
Code Organization:
- Clear separation of concerns
- Consistent naming conventions
- PSR-12 coding standards
- Comprehensive comments

Testing:
- Unit tests for services
- Feature tests for endpoints
- Integration tests for workflows

Documentation:
- API documentation (OpenAPI)
- Code comments
- README files
```

---

## 10. Architectural Decision Records (ADRs)

### ADR-001: Choose Sanctum over Passport

**Status**: Accepted
**Date**: 2025-11-02

**Context**:
Laravel provides two authentication systems: Passport (OAuth2) and Sanctum (token-based).

**Decision**:
Use Sanctum for authentication.

**Rationale**:

- SPA-focused (perfect for React frontend)
- Simpler setup and configuration
- No OAuth2 complexity needed
- Better performance (no token introspection)
- Official Laravel recommendation for SPAs

**Consequences**:

- Simpler implementation
- Better performance
- Easier to maintain

* No OAuth2 support (not needed for current scope)

---

### ADR-002: Implement Service Layer

**Status**: Accepted
**Date**: 2025-11-02

**Context**:
Controllers can become bloated with business logic.

**Decision**:
Introduce Service layer for business logic.

**Rationale**:

- Separation of concerns
- Reusable business logic
- Easier testing
- Cleaner controllers

**Consequences**:

- Better code organization
- Improved testability
- Reusable logic

* Slightly more files to manage

---

### ADR-003: Use API Resources for Responses

**Status**: Accepted
**Date**: 2025-11-02

**Context**:
Need consistent, transformable API responses.

**Decision**:
Use Laravel API Resources for all responses.

**Rationale**:

- Consistent response format
- Easy to modify output structure
- Hide sensitive data
- Versioning support

**Consequences**:

- Consistent API responses
- Easy to version
- Better security

* Additional abstraction layer

---

### ADR-004: PostgreSQL over MySQL

**Status**: Already Implemented
**Date**: 2025-11-02

**Context**:
Project already using PostgreSQL.

**Decision**:
Continue with PostgreSQL.

**Rationale**:

- Already configured
- Better JSON support (for program syllabus)
- More robust ACID compliance
- Better concurrency handling

**Consequences**:

- Advanced features
- Better performance for complex queries

* Slightly different SQL syntax

---

## Conclusion

This architecture review and technical specification provides a comprehensive blueprint for completing the KFA API project. The design follows Laravel best practices, implements clean architecture principles, and ensures security, scalability, and maintainability.

**Key Takeaways**:

1. ✅ Use Sanctum for simple, secure SPA authentication
2. ✅ Implement service layer for business logic
3. ✅ Use API Resources for consistent responses
4. ✅ Follow RESTful conventions
5. ✅ Implement comprehensive validation
6. ✅ Configure CORS properly
7. ✅ Add strategic database indexes
8. ✅ Use FormRequests for validation
9. ✅ Follow security best practices
10. ✅ Maintain clean code organization

**Next Phase**: Implementation (Stories and Development)

---

**Document Version**: 1.0
**Last Updated**: 2025-11-02
**Architect**: BMM Architect Agent
**Status**: Approved for Implementation
