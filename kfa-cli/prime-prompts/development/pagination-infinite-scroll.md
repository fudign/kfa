# Prime Prompt: Pagination & Infinite Scroll

Implement pagination or infinite scroll for large datasets with optimal performance.

## Usage

```bash
kfa prime use development/pagination-infinite-scroll "Add infinite scroll to news feed"
```

## Prompt Template

I need you to implement pagination or infinite scroll:

**Context:** {CONTEXT}

Please implement the following:

### 1. Choose Pagination Strategy

**Option A: Traditional Pagination**
- Numbered page buttons
- Previous/Next buttons
- Jump to page input
- Show total pages
- Display items X-Y of Z

**Option B: Infinite Scroll**
- Load more as user scrolls
- Show loading indicator
- "Load more" button option
- Scroll position restoration
- Handle fast scrolling

**Option C: Hybrid**
- Infinite scroll with pagination fallback
- Load more button after N auto-loads
- Combine benefits of both approaches

### 2. Frontend Implementation

**UI Components:**
- Results list/grid
- Loading skeleton/spinner
- "Load more" button (if applicable)
- Page numbers (if applicable)
- Results count display
- "Back to top" button

**State Management:**
- Track current page/offset
- Store loaded items
- Handle loading state
- Track "has more" flag
- Implement optimistic updates

**Scroll Detection (Infinite Scroll):**
- Use Intersection Observer
- Detect bottom of list reached
- Load next page automatically
- Add threshold for early loading
- Handle rapid scrolling

### 3. Backend API

**Endpoint Design:**
- `GET /api/{resource}?page=1&limit=20` - Page-based
- `GET /api/{resource}?offset=0&limit=20` - Offset-based
- `GET /api/{resource}?cursor={cursor}&limit=20` - Cursor-based (best for infinite scroll)

**Response Format:**
```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8,
    "hasNext": true,
    "hasPrev": false,
    "nextCursor": "xyz123" // for cursor-based
  }
}
```

**Pagination Types:**
- **Offset-based**: Simple but issues with updates
- **Cursor-based**: Best for real-time data
- **Keyset pagination**: Most efficient for large datasets

### 4. Performance Optimization

**Frontend:**
- Virtual scrolling for very large lists
- Implement windowing (react-window, react-virtualized)
- Cache loaded pages
- Preload next page
- Lazy load images/heavy content

**Backend:**
- Use indexes on sort/filter columns
- Limit maximum page size
- Use database pagination (LIMIT/OFFSET or cursors)
- Cache frequent queries
- Implement query optimization

### 5. User Experience

**Loading States:**
- Show skeleton loaders
- Display "Loading..." message
- Show progress for known total
- Disable interactions during load

**Error Handling:**
- Handle network errors
- Show retry button
- Display error message
- Maintain loaded content

**Scroll Position:**
- Save scroll position on navigation
- Restore position on back button
- Remember page on return
- Smooth scroll to top option

### 6. Edge Cases

**Handle:**
- Empty results (first page)
- Last page reached
- No more results
- Duplicate items prevention
- Items added during scroll
- Items deleted during scroll
- Network failures
- Very fast scrolling

### 7. Accessibility

**Keyboard Navigation:**
- Support arrow keys
- Focus management
- Skip to page navigation
- Announce new content to screen readers

**ARIA Attributes:**
- aria-label for page buttons
- aria-current for active page
- role="status" for loading
- Announce total results

### 8. Additional Features

**Nice-to-Have:**
- Remember page per session
- URL reflects current page
- Deep linking to pages
- Results per page selector
- Jump to page input
- Show loading percentage
- Estimated scroll position

### 9. Testing

**Tests:**
- Test loading first page
- Test loading subsequent pages
- Test reaching last page
- Test error scenarios
- Test scroll detection
- Test state management
- Test URL updates
- Performance test with large dataset

## Context Files

Review these:
- Existing list/grid components
- API structure
- State management approach
- UI/UX patterns
- Performance requirements

## Expected Output

Provide:
1. Pagination/scroll component
2. Backend API endpoint
3. Pagination logic
4. State management code
5. Loading states implementation
6. Error handling
7. Tests for pagination
8. Documentation for configuration

## Success Criteria

- ✅ Pagination/scroll works smoothly
- ✅ Loading states displayed correctly
- ✅ No duplicate items loaded
- ✅ Performance optimized (<100ms to append page)
- ✅ Error handling works
- ✅ Scroll position preserved
- ✅ Accessible with keyboard
- ✅ Works on mobile devices
- ✅ Tests cover main scenarios
