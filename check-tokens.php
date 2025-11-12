<?php

require __DIR__ . '/kfa-backend/kfa-api/vendor/autoload.php';

$app = require_once __DIR__ . '/kfa-backend/kfa-api/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use App\Models\User;
use Laravel\Sanctum\PersonalAccessToken;

echo "=== Checking Tokens ===\n\n";

// Get user ID 1
$user = User::find(1);

if (!$user) {
    echo "❌ User ID 1 not found!\n";
    exit(1);
}

echo "User: {$user->name} ({$user->email})\n\n";

// Check existing tokens
echo "1. Existing tokens:\n";
$tokens = $user->tokens;

if ($tokens->count() === 0) {
    echo "  ℹ️  No tokens found\n";
} else {
    foreach ($tokens as $token) {
        $isExpired = $token->expires_at && $token->expires_at < now();
        $status = $isExpired ? "❌ EXPIRED" : "✅ VALID";
        echo "  $status ID: {$token->id}, Name: {$token->name}, Created: {$token->created_at}\n";
    }
}

// Create a new token
echo "\n2. Creating new long-lived token...\n";

// Delete old tokens first
echo "  ℹ️  Deleting old tokens...\n";
$user->tokens()->delete();

// Create new token that expires in 1 year
$tokenResult = $user->createToken('api-token', ['*'], now()->addYear());
$newToken = $tokenResult->plainTextToken;

echo "  ✅ New token created!\n";
echo "\n";
echo "════════════════════════════════════════════════════════\n";
echo "NEW TOKEN (save this):\n";
echo $newToken . "\n";
echo "════════════════════════════════════════════════════════\n";
echo "\n";

// Test the token
echo "3. Testing the token...\n";
$ch = curl_init('http://localhost:8000/api/media');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Authorization: Bearer $newToken",
    'Accept: application/json'
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

echo "  Response code: $httpCode\n";

if ($httpCode === 200) {
    echo "  ✅ Token works! API returned 200 OK\n";
    $data = json_decode($response, true);
    if (isset($data['data'])) {
        echo "  ℹ️  Found " . count($data['data']) . " media items\n";
    }
} else {
    echo "  ❌ Token test failed\n";
    echo "  Response: $response\n";
}

echo "\n=== Done ===\n";
echo "\nTo use this token in the frontend:\n";
echo "1. Open browser console on http://localhost:3000\n";
echo "2. Run: localStorage.setItem('auth_token', '$newToken')\n";
echo "3. Refresh the page\n";
