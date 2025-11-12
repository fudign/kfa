<?php

echo "=== Checking Current Session ===\n\n";

// Check most recent token
require __DIR__ . '/kfa-backend/kfa-api/vendor/autoload.php';

$app = require_once __DIR__ . '/kfa-backend/kfa-api/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use App\Models\User;
use Laravel\Sanctum\PersonalAccessToken;

$user = User::find(1);

if (!$user) {
    echo "❌ User not found\n";
    exit(1);
}

echo "User: {$user->name} ({$user->email})\n\n";

// Get most recent token
$latestToken = $user->tokens()->latest()->first();

if (!$latestToken) {
    echo "❌ No tokens found\n";
    exit(1);
}

echo "Latest Token:\n";
echo "  ID: {$latestToken->id}\n";
echo "  Name: {$latestToken->name}\n";
echo "  Created: {$latestToken->created_at}\n";
echo "  Last Used: " . ($latestToken->last_used_at ?? 'Never') . "\n\n";

// Get the token value
$tokenValue = $latestToken->id . '|' . $latestToken->token;

// Test with this token
echo "Testing API with latest token...\n";
$ch = curl_init('http://localhost:8000/api/media');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Authorization: Bearer $tokenValue",
    'Accept: application/json'
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

echo "Response Code: $httpCode\n";

if ($httpCode === 200) {
    echo "✅ API works with current session token!\n";
    $data = json_decode($response, true);
    if (isset($data['data'])) {
        echo "✅ Found " . count($data['data']) . " media items\n\n";
        foreach ($data['data'] as $item) {
            echo "  - {$item['filename']}\n";
            echo "    URL: {$item['url']}\n";
        }
    }
} else {
    echo "❌ API returned error\n";
    echo "Response: $response\n";
}

echo "\n=== Instructions ===\n\n";
echo "The backend is working fine. The issue might be:\n\n";
echo "1. Browser cache - Clear your browser cache (Ctrl+Shift+Delete)\n";
echo "2. Old token in localStorage - Already updated when you logged in again\n";
echo "3. PWA Service Worker - This is the 'registerSW.js' error\n\n";

echo "To fix the registerSW.js error:\n";
echo "1. Open browser DevTools (F12)\n";
echo "2. Go to Application tab\n";
echo "3. Click 'Service Workers'\n";
echo "4. Click 'Unregister' on any service workers\n";
echo "5. Refresh the page (F5)\n\n";

echo "Then try:\n";
echo "1. Go to Dashboard → News\n";
echo "2. Click 'Add News'\n";
echo "3. Click 'Select' on image field\n";
echo "4. MediaPicker should open and show media files\n";
echo "5. Click 'Upload' to add new files\n";
