# Prime Prompt: REST API CRUD Operations

Create complete CRUD (Create, Read, Update, Delete) API endpoints with validation, error handling, and tests.

## Usage

```bash
kfa prime use development/rest-api-crud "Create CRUD API for products"
```

## Prompt Template

I need you to create a complete REST API CRUD implementation:

**Context:** {CONTEXT}

Please implement the following:

### 1. API Endpoints

Create these standard REST endpoints:
- `POST /api/{resource}` - Create new item
- `GET /api/{resource}` - List all items (with pagination)
- `GET /api/{resource}/:id` - Get single item
- `PUT /api/{resource}/:id` - Update item (full update)
- `PATCH /api/{resource}/:id` - Update item (partial update)
- `DELETE /api/{resource}/:id` - Delete item

### 2. Request Validation
- Validate request body using Zod or similar
- Validate path parameters (IDs)
- Validate query parameters (pagination, filters)
- Return 400 with detailed error messages for invalid requests

### 3. Response Format
- Use consistent response structure
- Include proper HTTP status codes:
  - 200: Success (GET, PUT, PATCH)
  - 201: Created (POST)
  - 204: No Content (DELETE)
  - 400: Bad Request
  - 404: Not Found
  - 500: Server Error
- Include pagination metadata for list endpoints

### 4. Error Handling
- Catch and handle database errors
- Handle duplicate key errors (409 Conflict)
- Handle not found errors (404)
- Log errors with context
- Return user-friendly error messages

### 5. Database Layer
- Create repository/service layer
- Use transactions where appropriate
- Implement proper error handling
- Include database migrations if needed

### 6. Middleware
- Add request logging
- Add error handling middleware
- Add validation middleware
- Add authentication if required

### 7. Tests
- Unit tests for business logic
- Integration tests for endpoints
- Test success cases
- Test error cases
- Test validation
- Test pagination

### 8. Documentation
- Add OpenAPI/Swagger documentation
- Document request/response schemas
- Include example requests
- Document error responses

## Context Files

Review these for patterns:
- Backend API structure
- Database models
- Validation patterns
- Error handling conventions
- Testing setup

## Expected Output

Provide:
1. Route handlers (routes/{resource}.ts or similar)
2. Controller logic (controllers/{Resource}Controller.ts)
3. Service layer (services/{Resource}Service.ts)
4. Validation schemas (schemas/{resource}.ts)
5. Database migrations (if needed)
6. Test files (tests/{resource}.test.ts)
7. API documentation (updated swagger/openapi)

## Success Criteria

- ✅ All CRUD operations work correctly
- ✅ Validation prevents invalid data
- ✅ Errors are handled gracefully
- ✅ Responses follow consistent format
- ✅ Pagination works for list endpoints
- ✅ Tests achieve >80% coverage
- ✅ API is documented
- ✅ No security vulnerabilities (SQL injection, etc.)
