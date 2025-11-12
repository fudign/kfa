<?php

require __DIR__ . '/kfa-backend/kfa-api/vendor/autoload.php';

$app = require_once __DIR__ . '/kfa-backend/kfa-api/bootstrap/app.php';
$kernel = $app->make('Illuminate\Contracts\Http\Kernel');

use Illuminate\Http\Request;

// Create a fake authenticated request
$request = Request::create('/api/news?per_page=2', 'GET');
$request->headers->set('Accept', 'application/json');

// Get user token
$user = \App\Models\User::find(1);
if ($user) {
    $token = $user->tokens()->orderBy('created_at', 'desc')->first();
    if ($token) {
        $request->headers->set('Authorization', 'Bearer ' . $token->token);
    }
}

// Process request
$response = $kernel->handle($request);

// Get response content
$content = $response->getContent();
$data = json_decode($content, true);

echo "=== API Response Structure ===\n\n";

if (isset($data['data']) && is_array($data['data'])) {
    echo "Found " . count($data['data']) . " news items\n\n";

    foreach (array_slice($data['data'], 0, 2) as $item) {
        echo "News ID: {$item['id']}\n";
        echo "  Title: {$item['title']}\n";
        echo "  Image field: " . ($item['image'] ?? 'NULL') . "\n";

        if (isset($item['featured_image'])) {
            if ($item['featured_image'] === null) {
                echo "  featured_image: NULL\n";
            } else {
                echo "  featured_image:\n";
                echo "    - id: {$item['featured_image']['id']}\n";
                echo "    - url: {$item['featured_image']['url']}\n";
                echo "    - filename: {$item['featured_image']['filename']}\n";
            }
        } else {
            echo "  featured_image: NOT PRESENT IN RESPONSE\n";
        }

        echo "\n";
    }
} else {
    echo "Unexpected response structure:\n";
    echo json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
}
