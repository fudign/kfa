<?php

require __DIR__ . '/kfa-backend/kfa-api/vendor/autoload.php';

$app = require_once __DIR__ . '/kfa-backend/kfa-api/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use App\Models\Media;

echo "=== Cleaning up broken media records ===\n\n";

// Find broken records
$brokenRecords = Media::whereIn('path', ['0', 'false', false, 0])
    ->orWhere('path', 'like', 'false')
    ->get();

echo "Found " . $brokenRecords->count() . " broken records\n";

if ($brokenRecords->count() > 0) {
    foreach ($brokenRecords as $record) {
        echo "  - ID: {$record->id}, Path: '{$record->path}', Filename: {$record->filename}\n";
    }

    echo "\nDeleting...\n";
    $deleted = Media::whereIn('path', ['0', 'false', false, 0])
        ->orWhere('path', 'like', 'false')
        ->delete();

    echo "✅ Deleted $deleted broken records\n";
} else {
    echo "✅ No broken records found\n";
}

// Show remaining valid records
echo "\nRemaining valid media files:\n";
$validRecords = Media::all();
foreach ($validRecords as $record) {
    echo "  ✅ ID: {$record->id}, Path: {$record->path}, URL: {$record->url}\n";
}

echo "\n=== Done ===\n";
