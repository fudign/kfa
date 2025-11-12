<?php

require __DIR__ . '/kfa-backend/kfa-api/vendor/autoload.php';

$app = require_once __DIR__ . '/kfa-backend/kfa-api/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use App\Models\News;
use App\Http\Resources\NewsResource;

echo "=== Testing News API Response ===\n\n";

// Simulate what the controller does
$news = News::with(['author:id,name,email', 'featuredImage'])->paginate(2);

echo "Found {$news->count()} items (showing first 2)\n\n";

// Transform through resource (simulate API response)
foreach ($news as $item) {
    echo "News ID: {$item->id}\n";
    echo "  Title: {$item->title}\n";
    echo "  Image field (raw): " . ($item->image ?: 'NULL') . "\n";
    echo "  Featured Image ID (raw): " . ($item->featured_image_id ?: 'NULL') . "\n";

    // Check if relation is loaded
    if ($item->relationLoaded('featuredImage')) {
        echo "  featuredImage relation: LOADED\n";
        if ($item->featuredImage) {
            echo "    - Media ID: {$item->featuredImage->id}\n";
            echo "    - URL accessor: {$item->featuredImage->url}\n";
        } else {
            echo "    - Value: NULL\n";
        }
    } else {
        echo "  featuredImage relation: NOT LOADED\n";
    }

    // Now transform through NewsResource
    $resource = new NewsResource($item);
    $array = $resource->toArray(new \Illuminate\Http\Request());

    echo "\n  API Response will have:\n";
    echo "    image: " . ($array['image'] ?? 'NULL') . "\n";

    if (isset($array['featured_image'])) {
        if (is_array($array['featured_image']) && isset($array['featured_image']['url'])) {
            echo "    featured_image.url: {$array['featured_image']['url']}\n";
        } elseif ($array['featured_image'] === null) {
            echo "    featured_image: NULL\n";
        } else {
            echo "    featured_image: " . json_encode($array['featured_image']) . "\n";
        }
    } else {
        echo "    featured_image: NOT IN RESPONSE\n";
    }

    echo "\n";
    echo "  Frontend check: " . ($array['featured_image']['url'] ?? $array['image'] ?? 'NO IMAGE') . "\n";
    echo "\n---\n\n";
}
