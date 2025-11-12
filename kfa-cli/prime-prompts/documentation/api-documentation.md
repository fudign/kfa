# API Documentation Prime Prompt

Document REST API endpoints comprehensively.

## Usage

```bash
kfa prime use api-documentation "Document news API endpoints"
```

## Prompt Template

Document API endpoints: {CONTEXT}

## Documentation Format

For each endpoint include:

1. **Endpoint Details**
   - HTTP method
   - URL path
   - Description
   - Authentication required?

2. **Request**
   - Headers
   - Query parameters
   - Body parameters
   - Parameter types
   - Required/optional

3. **Response**
   - Status codes
   - Response body schema
   - Example responses
   - Error responses

4. **Examples**
   - cURL examples
   - JavaScript fetch
   - Success example
   - Error example

5. **Notes**
   - Rate limiting
   - Pagination
   - Filtering
   - Sorting

## Example Format

```markdown
## GET /api/news

Get list of news articles.

### Authentication
Required: Yes (Bearer token)

### Query Parameters
- page (integer, optional): Page number, default 1
- limit (integer, optional): Items per page, default 10
- category (string, optional): Filter by category

### Response 200
{
  "data": [...],
  "pagination": {...}
}

### Example
curl -H "Authorization: Bearer TOKEN" https://api.kfa.kg/api/news?page=1
```

## Expected Output

Complete API documentation in docs/api/

## Success Criteria

- All endpoints documented
- Examples work
- Clear and accurate
