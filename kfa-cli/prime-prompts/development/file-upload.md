# Prime Prompt: File Upload Implementation

Implement file upload functionality with validation, progress tracking, and cloud storage integration.

## Usage

```bash
kfa prime use development/file-upload "Add profile photo upload with preview"
```

## Prompt Template

I need you to implement file upload functionality:

**Context:** {CONTEXT}

Please implement the following:

### 1. Frontend Upload Component

**UI Elements:**

- File input or drag-and-drop zone
- File preview (images, documents)
- Upload progress indicator
- File size/type display
- Remove file option before upload

**Validation:**

- Check file type (MIME type)
- Validate file size limits
- Check file count limits (single vs multiple)
- Display validation errors clearly

**User Experience:**

- Show upload progress (percentage)
- Allow upload cancellation
- Display success/error messages
- Support drag and drop
- Show file thumbnails/previews

### 2. Backend Upload Handling

**File Processing:**

- Accept multipart/form-data
- Validate file on server side
- Generate unique filenames
- Sanitize file names
- Check for malicious content

**Storage:**

- Save to cloud storage (S3, Cloudinary, Supabase Storage)
- Or save locally with proper directory structure
- Store file metadata in database
- Generate signed URLs if needed

**Security:**

- Validate file types server-side
- Implement file size limits
- Scan for viruses if applicable
- Prevent path traversal attacks
- Use signed URLs for downloads

### 3. File Transformations

**Image Processing (if applicable):**

- Resize images to multiple sizes
- Generate thumbnails
- Optimize image quality
- Convert formats if needed
- Preserve EXIF data optionally

**Other Processing:**

- Extract metadata
- Generate previews for documents
- Create compressed versions
- Validate file integrity

### 4. Progress Tracking

**Upload Progress:**

- Track upload progress on client
- Show percentage completed
- Display estimated time remaining
- Handle slow connections gracefully

**Server Progress:**

- Provide progress endpoint if needed
- Support resumable uploads for large files
- Implement chunked uploads if needed

### 5. Error Handling

**Common Errors:**

- File too large
- Invalid file type
- Network errors
- Storage quota exceeded
- Upload timeout

**Error Messages:**

- Clear, user-friendly messages
- Suggest corrective actions
- Log detailed errors server-side
- Allow retry for failed uploads

### 6. Database Schema

**File Metadata:**

- File ID (UUID)
- Original filename
- File size
- MIME type
- Storage path/URL
- Uploader user ID
- Upload timestamp
- Additional metadata

### 7. API Endpoints

**Endpoints:**

- `POST /api/upload` - Upload file
- `GET /api/files/:id` - Get file metadata
- `GET /api/files/:id/download` - Download file
- `DELETE /api/files/:id` - Delete file
- `POST /api/upload/chunk` - Upload chunk (for large files)

### 8. Testing

**Tests:**

- Test successful upload
- Test file validation errors
- Test upload cancellation
- Test large file uploads
- Test multiple file uploads
- Test download functionality
- Test delete functionality

## Context Files

Review these:

- Storage configuration (S3, Cloudinary, etc.)
- Authentication system
- Database schema
- File size limits
- Allowed file types

## Expected Output

Provide:

1. Frontend upload component
2. Backend upload endpoint
3. File validation logic
4. Storage integration code
5. Database migration for file metadata
6. Progress tracking implementation
7. Tests for upload functionality
8. Documentation for configuration

## Success Criteria

- ✅ Files upload successfully
- ✅ Progress tracking works
- ✅ Validation prevents invalid files
- ✅ Files stored securely
- ✅ Metadata saved to database
- ✅ Error handling is comprehensive
- ✅ Tests cover main scenarios
- ✅ Security best practices followed
