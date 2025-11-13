# Prime Prompt: Search Functionality Implementation

Implement comprehensive search functionality with filters, sorting, and optimized queries.

## Usage

```bash
kfa prime use development/search-functionality "Add product search with filters"
```

## Prompt Template

I need you to implement search functionality:

**Context:** {CONTEXT}

Please implement the following:

### 1. Search UI

**Search Input:**

- Search bar with clear/reset button
- Search suggestions/autocomplete
- Search history (optional)
- Search shortcuts (keyboard)

**Results Display:**

- Results list with highlights
- Empty state for no results
- Loading state during search
- Results count display
- Pagination or infinite scroll

**Filters & Sorting:**

- Filter chips/tags
- Multi-select filters
- Date range filters
- Price range sliders
- Sort options (relevance, date, price, etc.)

### 2. Backend Search Logic

**Search Query:**

- Full-text search implementation
- Fuzzy matching for typos
- Partial word matching
- Search multiple fields
- Weighted search (relevance scoring)

**Database Queries:**

- Use full-text search (PostgreSQL, ElasticSearch, etc.)
- Optimize with indexes
- Limit result set for performance
- Use query pagination
- Implement search result caching

**Filters:**

- Category filters
- Tag/label filters
- Date range filters
- Numeric range filters
- Boolean filters
- Combine filters with AND/OR logic

### 3. Search Algorithm

**Text Matching:**

- Case-insensitive search
- Remove special characters
- Handle multiple languages if needed
- Stemming/lemmatization
- Synonym handling

**Ranking:**

- Rank by relevance score
- Boost exact matches
- Consider field weights
- Factor in recency
- Include popularity metrics

### 4. Performance Optimization

**Database Optimization:**

- Create search indexes
- Use materialized views if needed
- Implement query caching
- Limit query complexity
- Use database-specific features (TRGM, etc.)

**Frontend Optimization:**

- Debounce search input
- Implement request cancellation
- Cache search results
- Lazy load results
- Virtual scrolling for large results

### 5. Search Features

**Advanced Features:**

- Search suggestions (autocomplete)
- "Did you mean?" for typos
- Related searches
- Search history
- Recent searches
- Saved searches/filters

**Highlighting:**

- Highlight matching terms
- Show snippets with context
- Truncate long results
- Multiple highlight colors for multiple terms

### 6. API Endpoints

**Endpoints:**

- `GET /api/search?q={query}` - Basic search
- `GET /api/search?q={query}&filters={...}` - Search with filters
- `GET /api/search/suggestions?q={query}` - Autocomplete
- `GET /api/search/history` - User search history

**Query Parameters:**

- `q` - Search query
- `page` - Pagination
- `limit` - Results per page
- `sort` - Sort order
- `filters` - JSON or query string filters
- `fields` - Fields to search

### 7. Error Handling

**Errors:**

- Handle invalid queries
- Handle timeout errors
- Handle no results gracefully
- Handle malformed filters
- Log search errors

**User Feedback:**

- Show clear error messages
- Suggest query refinement
- Provide search tips
- Show example queries

### 8. Analytics

**Track Metrics:**

- Popular search terms
- Zero-result searches
- Search-to-click rate
- Average position of clicked results
- Filter usage statistics

### 9. Testing

**Tests:**

- Test basic search
- Test search with filters
- Test sorting
- Test pagination
- Test edge cases (special characters, very long queries)
- Test performance with large datasets
- Test autocomplete
- Test empty results

## Context Files

Review these:

- Database schema
- Existing search implementation
- Filter structure
- Performance requirements
- Available search libraries

## Expected Output

Provide:

1. Search UI component
2. Backend search endpoint
3. Search query builder
4. Filter implementation
5. Database migrations (indexes)
6. Search result caching
7. Tests for search functionality
8. Documentation for search features

## Success Criteria

- ✅ Search returns relevant results
- ✅ Search is fast (<500ms for typical queries)
- ✅ Filters work correctly
- ✅ Sorting works as expected
- ✅ Pagination/infinite scroll works
- ✅ Autocomplete provides suggestions
- ✅ Error handling is comprehensive
- ✅ Tests cover main scenarios
- ✅ Search is indexed properly
