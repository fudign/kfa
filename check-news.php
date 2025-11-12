<?php

require __DIR__ . '/kfa-backend/kfa-api/vendor/autoload.php';

$app = require_once __DIR__ . '/kfa-backend/kfa-api/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use App\Models\News;

echo "=== News in Database ===\n\n";

$news = News::with(['featuredImage', 'author'])->get();

if ($news->count() === 0) {
    echo "❌ No news found in database\n";
} else {
    echo "Found {$news->count()} news items:\n\n";

    foreach ($news as $item) {
        echo "ID: {$item->id}\n";
        echo "  Title: {$item->title}\n";
        echo "  Slug: {$item->slug}\n";
        echo "  Image (field): " . ($item->image ?: 'NULL') . "\n";
        echo "  Featured Image ID: " . ($item->featured_image_id ?: 'NULL') . "\n";

        if ($item->featuredImage) {
            echo "  Featured Image:\n";
            echo "    - Media ID: {$item->featuredImage->id}\n";
            echo "    - Filename: {$item->featuredImage->filename}\n";
            echo "    - Path: {$item->featuredImage->path}\n";
            echo "    - URL: {$item->featuredImage->url}\n";
        } else {
            echo "  Featured Image: NULL (не прикреплено)\n";
        }

        echo "  Status: {$item->status}\n";
        echo "  Created: {$item->created_at}\n";
        echo "\n";
    }
}

echo "=== Issue Analysis ===\n\n";
echo "If images don't show in the list, check:\n\n";
echo "1. Does the news have 'image' field OR 'featured_image_id'?\n";
echo "2. If featured_image_id is set, does the media exist?\n";
echo "3. Is the image URL accessible?\n\n";

echo "Frontend code checks: item.featured_image?.url || item.image\n";
echo "So either 'image' field must have URL, or 'featured_image' relation must be loaded.\n";
