<?php

require __DIR__ . '/kfa-backend/kfa-api/vendor/autoload.php';

$app = require_once __DIR__ . '/kfa-backend/kfa-api/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use App\Models\User;
use Laravel\Sanctum\PersonalAccessToken;

echo "=== All Tokens in Database ===\n\n";

$user = User::find(1);

if (!$user) {
    echo "❌ User not found\n";
    exit(1);
}

echo "User: {$user->name} ({$user->email})\n\n";

$tokens = $user->tokens()->orderBy('created_at', 'desc')->get();

echo "Total tokens: {$tokens->count()}\n\n";

foreach ($tokens as $token) {
    echo "Token ID: {$token->id}\n";
    echo "  Name: {$token->name}\n";
    echo "  Created: {$token->created_at}\n";
    echo "  Last Used: " . ($token->last_used_at ?? 'Never') . "\n";
    echo "  Abilities: " . json_encode($token->abilities) . "\n";
    echo "\n";
}

echo "=== Note ===\n";
echo "When you logged in again, Laravel should have created a new token.\n";
echo "The plaintext token is stored in your browser's localStorage.\n";
echo "\n";
echo "To check in browser:\n";
echo "1. Open http://localhost:3000\n";
echo "2. Press F12 (DevTools)\n";
echo "3. Go to Console tab\n";
echo "4. Type: localStorage.getItem('auth_token')\n";
echo "5. That's the current token in your browser\n";
