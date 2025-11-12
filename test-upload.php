<?php

echo "=== Testing Media Upload ===\n\n";

// Step 1: Login
echo "1. Logging in...\n";
$loginResponse = file_get_contents('http://127.0.0.1:8000/api/login', false, stream_context_create([
    'http' => [
        'method' => 'POST',
        'header' => 'Content-Type: application/json',
        'content' => json_encode([
            'email' => 'test-admin@kfa.kg',
            'password' => 'TestAdmin123!'
        ])
    ]
]));

$loginData = json_decode($loginResponse, true);
$token = $loginData['token'] ?? null;

if (!$token) {
    die("❌ Failed to get auth token\n");
}

echo "✅ Got auth token\n\n";

// Step 2: Create a test image (1x1 red pixel PNG)
echo "2. Creating test image...\n";
$imageData = base64_decode('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8DwHwAFBQIAX8jx0gAAAABJRU5ErkJggg==');
file_put_contents(__DIR__ . '/test-image.png', $imageData);
echo "✅ Created test-image.png\n\n";

// Step 3: Upload the image
echo "3. Uploading image...\n";

$boundary = '----WebKitFormBoundary' . uniqid();
$eol = "\r\n";

$data = '';
$data .= '--' . $boundary . $eol;
$data .= 'Content-Disposition: form-data; name="file"; filename="test-image.png"' . $eol;
$data .= 'Content-Type: image/png' . $eol . $eol;
$data .= $imageData . $eol;
$data .= '--' . $boundary . $eol;
$data .= 'Content-Disposition: form-data; name="collection"' . $eol . $eol;
$data .= 'test' . $eol;
$data .= '--' . $boundary . '--' . $eol;

$uploadResponse = file_get_contents('http://127.0.0.1:8000/api/media', false, stream_context_create([
    'http' => [
        'method' => 'POST',
        'header' => [
            'Authorization: Bearer ' . $token,
            'Content-Type: multipart/form-data; boundary=' . $boundary
        ],
        'content' => $data,
        'ignore_errors' => true  // Capture error responses
    ]
]));

echo "Upload Response:\n";
echo $uploadResponse . "\n\n";

$uploadData = json_decode($uploadResponse, true);

if (isset($uploadData['data'])) {
    $media = $uploadData['data'];

    echo "=== Upload Results ===\n";
    echo "ID: " . ($media['id'] ?? 'null') . "\n";
    echo "Filename: " . ($media['filename'] ?? 'null') . "\n";
    echo "Path: " . ($media['path'] ?? 'null') . "\n";
    echo "URL: " . ($media['url'] ?? 'null') . "\n";

    // Check if path is valid
    if (!empty($media['path']) && $media['path'] !== '0') {
        echo "\n✅ SUCCESS: Path is valid!\n";
        echo "✅ Images should now display correctly!\n";
    } else {
        echo "\n❌ FAILED: Path is invalid ('" . ($media['path'] ?? '') . "')\n";
    }
} else {
    echo "❌ FAILED: " . ($uploadData['message'] ?? 'Unknown error') . "\n";
}

// Cleanup
unlink(__DIR__ . '/test-image.png');
echo "\n=== Done ===\n";
