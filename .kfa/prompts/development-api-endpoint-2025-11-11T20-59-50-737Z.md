I need to create the following API endpoint for KFA:

Create news search endpoint with filtering

Please implement following Laravel REST API best practices:

1. **Route Definition**
   - Add route in routes/api.php
   - Use proper HTTP verb (GET/POST/PUT/DELETE)
   - Use resource routing if applicable
   - Add route name for easy reference

2. **Controller**
   - Create controller in app/Http/Controllers/Api/
   - Use dependency injection
   - Implement proper validation with FormRequest
   - Handle errors with try-catch
   - Return JSON responses with proper status codes

3. **Request Validation**
   - Create FormRequest class in app/Http/Requests/
   - Add validation rules
   - Add custom error messages
   - Handle authorization

4. **Resource Transformation**
   - Create API Resource in app/Http/Resources/
   - Transform model data for API response
   - Include related data if needed
   - Add pagination support

5. **Database Query**
   - Use Eloquent ORM efficiently
   - Add eager loading to prevent N+1
   - Implement pagination
   - Add filtering and sorting

6. **Documentation**
   - Add PHPDoc comments
   - Document request/response format
   - Add example usage

7. **Testing**
   - Create feature test in tests/Feature/
   - Test success cases
   - Test validation errors
   - Test authentication/authorization

File structure:

- routes/api.php - Route definition
- app/Http/Controllers/Api/{Name}Controller.php
- app/Http/Requests/Store{Name}Request.php
- app/Http/Resources/{Name}Resource.php
- tests/Feature/{Name}ControllerTest.php
