# Media Tools

Lightweight media management utilities. Output JSON for easy processing.

## Tools

### optimize-images.js

Optimize images for web (resize, compress).

```bash
node media/optimize-images.js --input=path/to/images [--quality=80]
```

Output: Optimization results JSON

### upload-to-supabase.js

Upload files to Supabase storage bucket.

```bash
node media/upload-to-supabase.js --file=path --bucket=media
```

Output: Upload result + public URL JSON

### list-media.js

List files in Supabase bucket.

```bash
node media/list-media.js --bucket=media
```

Output: File list JSON

### delete-media.js

Delete file from Supabase bucket.

```bash
node media/delete-media.js --file=path --bucket=media
```

Output: Deletion result JSON

## Examples

```bash
# Upload file to Supabase
node media/upload-to-supabase.js --file=image.jpg --bucket=media > upload.json

# List all media files
node media/list-media.js --bucket=media > media-list.json

# Delete file
node media/delete-media.js --file=old-image.jpg --bucket=media > delete.json
```
