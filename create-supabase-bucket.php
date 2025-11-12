<?php

echo "=== Creating Supabase Bucket via API ===\n\n";

$supabaseUrl = 'https://eofneihisbhucxcydvac.supabase.co';
$serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVvZm5laWhpc2JodWN4Y3lkdmFjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2Mjg3Mjk2OSwiZXhwIjoyMDc4NDQ4OTY5fQ.wQmUve9SryzkjL9J69WEF2cOaYDzIGb6ZbTpDjuHgHo';

// Step 1: Check if bucket exists
echo "1. Checking existing buckets...\n";
$ch = curl_init("$supabaseUrl/storage/v1/bucket");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Authorization: Bearer $serviceRoleKey",
    "apikey: $serviceRoleKey",
    'Content-Type: application/json'
]);
$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

echo "Response code: $httpCode\n";
$buckets = json_decode($response, true);

if (is_array($buckets)) {
    echo "Existing buckets:\n";
    foreach ($buckets as $bucket) {
        echo "  - " . ($bucket['name'] ?? $bucket['id'] ?? 'unknown') . "\n";
    }

    // Check if media bucket exists
    $mediaExists = false;
    foreach ($buckets as $bucket) {
        if (($bucket['name'] ?? $bucket['id'] ?? '') === 'media') {
            $mediaExists = true;
            break;
        }
    }

    if ($mediaExists) {
        echo "\n✅ Bucket 'media' already exists!\n";
        echo "\n=== Done ===\n";
        exit(0);
    }
}

// Step 2: Create bucket
echo "\n2. Creating 'media' bucket...\n";
$ch = curl_init("$supabaseUrl/storage/v1/bucket");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Authorization: Bearer $serviceRoleKey",
    "apikey: $serviceRoleKey",
    'Content-Type: application/json'
]);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    'id' => 'media',
    'name' => 'media',
    'public' => true,
    'file_size_limit' => 5242880, // 5MB
    'allowed_mime_types' => [
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/gif',
        'image/webp',
        'image/svg+xml',
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ]
]));

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

echo "Response code: $httpCode\n";
echo "Response: $response\n";

if ($httpCode === 200 || $httpCode === 201) {
    echo "\n✅ Bucket 'media' created successfully!\n";
} else {
    echo "\n❌ Failed to create bucket\n";
    exit(1);
}

echo "\n=== Done ===\n";
