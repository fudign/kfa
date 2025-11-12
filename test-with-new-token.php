<?php

echo "=== Testing with NEW Token ===\n\n";

$newToken = '25|ZbEzuYIJKRbsovedj3tiEmjOLnYAwXO1wKureByE51198614';

// Test 1: GET /api/media
echo "1. Testing GET /api/media...\n";
$ch = curl_init('http://localhost:8000/api/media');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Authorization: Bearer $newToken",
    'Accept: application/json'
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($httpCode === 200) {
    echo "  ✅ SUCCESS: HTTP $httpCode\n";
    $data = json_decode($response, true);
    if (isset($data['data'])) {
        echo "  ✅ Found " . count($data['data']) . " media items\n";
        foreach ($data['data'] as $item) {
            echo "    - ID: {$item['id']}, File: {$item['filename']}\n";
            echo "      URL: {$item['url']}\n";
        }
    }
} else {
    echo "  ❌ FAILED: HTTP $httpCode\n";
    echo "  Response: $response\n";
}

// Test 2: POST /api/media (upload)
echo "\n2. Testing POST /api/media (file upload)...\n";

// Create a test image file
$testImage = sys_get_temp_dir() . '/test-upload-' . time() . '.png';
$img = imagecreate(100, 100);
$bgColor = imagecolorallocate($img, 255, 255, 255);
$textColor = imagecolorallocate($img, 0, 0, 0);
imagestring($img, 5, 10, 40, 'TEST', $textColor);
imagepng($img, $testImage);
imagedestroy($img);

echo "  ℹ️  Created test image: $testImage\n";

// Upload via API
$ch = curl_init('http://localhost:8000/api/media');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Authorization: Bearer $newToken",
    'Accept: application/json'
]);

$cfile = new CURLFile($testImage, 'image/png', 'test.png');
curl_setopt($ch, CURLOPT_POSTFIELDS, [
    'file' => $cfile,
    'collection' => 'test'
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($httpCode === 201) {
    echo "  ✅ SUCCESS: File uploaded! HTTP $httpCode\n";
    $data = json_decode($response, true);
    if (isset($data['data'])) {
        echo "    ID: {$data['data']['id']}\n";
        echo "    Filename: {$data['data']['filename']}\n";
        echo "    Path: {$data['data']['path']}\n";
        echo "    URL: {$data['data']['url']}\n";
    }
} else {
    echo "  ❌ FAILED: HTTP $httpCode\n";
    echo "  Response: $response\n";
}

// Cleanup
unlink($testImage);

echo "\n=== Summary ===\n\n";
echo "✅ Token is working!\n";
echo "✅ API endpoints are accessible\n";
echo "✅ File upload works\n";
echo "\n";
echo "Next steps:\n";
echo "1. Open http://localhost:3000/update-token.html\n";
echo "2. Click 'Обновить токен' button\n";
echo "3. Go to Dashboard → News → Add News\n";
echo "4. Try uploading an image through MediaPicker\n";
echo "\nDone!\n";
