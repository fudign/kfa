# Authentication Flow Prime Prompt

Implement complete authentication flow (frontend + backend).

## Usage

```bash
kfa prime use authentication-flow "Add two-factor authentication"
```

## Prompt Template

I need to implement authentication feature:

{CONTEXT}

Implement full-stack authentication following KFA architecture:

## Backend (Laravel)

1. **Routes**
   - POST /api/auth/login
   - POST /api/auth/register
   - POST /api/auth/logout
   - POST /api/auth/refresh
   - GET /api/auth/me

2. **Controller** (app/Http/Controllers/Api/AuthController.php)
   - login() - Authenticate and return token
   - register() - Create user and return token
   - logout() - Revoke token
   - refresh() - Refresh JWT token
   - me() - Return authenticated user

3. **Middleware**
   - auth:sanctum or JWT middleware
   - Rate limiting
   - CORS configuration

4. **Validation**
   - LoginRequest - email, password
   - RegisterRequest - name, email, password, password_confirmation
   - Validate email uniqueness
   - Password strength requirements

5. **Token Management**
   - Use Laravel Sanctum or JWT
   - Set token expiration
   - Handle token refresh
   - Revoke tokens on logout

## Frontend (React)

1. **Auth Context** (src/contexts/AuthContext.tsx)
   - Store user state
   - Store token
   - Login/logout/register functions
   - Check authentication status

2. **Auth Service** (src/services/auth.ts)
   - login(email, password)
   - register(userData)
   - logout()
   - getMe()
   - refreshToken()

3. **Protected Routes**
   - Create ProtectedRoute component
   - Check authentication before rendering
   - Redirect to login if not authenticated

4. **Auth Forms**
   - Login form with validation
   - Register form with validation
   - Password reset form (if applicable)

5. **Token Storage**
   - Store in httpOnly cookie (preferred)
   - Or localStorage with XSS protection
   - Include in API requests

6. **Error Handling**
   - Invalid credentials
   - Token expiration
   - Network errors
   - Show user-friendly messages

## Security

1. **Backend Security**
   - Hash passwords (bcrypt)
   - Validate and sanitize input
   - Rate limit auth endpoints
   - HTTPS only
   - CSRF protection

2. **Frontend Security**
   - Never store passwords
   - Secure token storage
   - XSS protection
   - CSRF token handling

## Testing

1. **Backend Tests**
   - Test successful login
   - Test invalid credentials
   - Test registration validation
   - Test token refresh

2. **Frontend Tests**
   - Test login flow
   - Test logout
   - Test protected routes
   - Test token expiration handling

Files to create:

- Backend:
  - app/Http/Controllers/Api/AuthController.php
  - app/Http/Requests/LoginRequest.php
  - app/Http/Requests/RegisterRequest.php
  - routes/api.php (add routes)
  - tests/Feature/AuthTest.php

- Frontend:
  - src/contexts/AuthContext.tsx
  - src/services/auth.ts
  - src/components/auth/LoginForm.tsx
  - src/components/auth/RegisterForm.tsx
  - src/components/ProtectedRoute.tsx
  - src/hooks/useAuth.ts

## Context Files

- config/auth.php - Auth configuration
- config/sanctum.php - Sanctum config
- src/services/api.ts - API client

## Expected Output

1. Complete auth backend API
2. Auth context and hooks
3. Login/register forms
4. Protected routes
5. Comprehensive tests
6. Security best practices

## Success Criteria

- Secure password handling
- Token-based authentication works
- Protected routes function
- Login/logout flows work
- All tests pass
- No security vulnerabilities
