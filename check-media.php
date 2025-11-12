<?php

require __DIR__ . '/kfa-backend/kfa-api/vendor/autoload.php';

$app = require_once __DIR__ . '/kfa-backend/kfa-api/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use App\Models\Media;

echo "=== Current Media Records ===\n\n";

$media = Media::all();

if ($media->count() === 0) {
    echo "❌ No media records found in database\n";
} else {
    echo "Found {$media->count()} media records:\n\n";

    foreach ($media as $m) {
        echo "ID: {$m->id}\n";
        echo "  Filename: {$m->filename}\n";
        echo "  Path: {$m->path}\n";
        echo "  URL: {$m->url}\n";
        echo "  Disk: {$m->disk}\n";
        echo "  MIME: {$m->mime_type}\n";
        echo "  Size: {$m->size} bytes\n";
        echo "\n";
    }
}

echo "=== Testing API Endpoint ===\n\n";

// Test the media list API
$ch = curl_init('http://localhost:8000/api/media');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiZmQ4NDMxOWMzNjA3NzA0ZTc2NDNmY2Q4YTY1YjFkNTBlMmVjY2UyODUyMzY3NTk3MGI5MWFlNzE1ZDEzMDI1YzA1NmQ4MTBlNzBhZjdlNjMiLCJpYXQiOjE3MzE0Mzk5OTkuNzAyNDYxLCJuYmYiOjE3MzE0Mzk5OTkuNzAyNDY0LCJleHAiOjE3NjI5NzU5OTkuNjk2NzQxLCJzdWIiOiIxIiwic2NvcGVzIjpbXX0.mGXKlcGYVH5TG_fhzRiP8Uc4wVdUVaWLh3fzsAJvlO4uSY1KEI9kfQPv5m5WCbp8nyFmWS-KSU7W6fLGBY_pMxRh0fLbIXYKBL3T9pXL8WJJ6YvFi23SDdW0oOqrJ8Mmt6Vqt_sGtMqPq0dxMATVRuYjyF3HrcxC33Z-CpYPTFl_3xB4qUYNhP6K3UGGHZpJKl8WbJo_zVHxPZIg_-6KJY2wYN8rqKVEPnLLR8ej6kHlRq1TXNKhWkK2lDX9xAEJJ_m0SnJqgKqP4VEO1sMh9eAx8kHHkkl-w_M7VPh8KX0LcqJOaI4PLPnEQl_8xQ0ILUL8LZx9LpL8c1_bWQ',
    'Accept: application/json'
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

echo "API Response Code: $httpCode\n";

if ($httpCode === 200) {
    echo "✅ API works!\n";
    echo "Response:\n";
    $data = json_decode($response, true);
    if (isset($data['data'])) {
        echo "  Found " . count($data['data']) . " items in API response\n";
        foreach ($data['data'] as $item) {
            echo "  - ID: {$item['id']}, File: {$item['filename']}, URL: {$item['url']}\n";
        }
    } else {
        echo "  Response: $response\n";
    }
} else {
    echo "❌ API returned error\n";
    echo "Response: $response\n";
}

echo "\n=== Done ===\n";
