<?php

require __DIR__ . '/kfa-backend/kfa-api/vendor/autoload.php';

use Illuminate\Support\Facades\Storage;

$app = require_once __DIR__ . '/kfa-backend/kfa-api/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

echo "=== Testing Supabase Storage Directly ===\n\n";

$disk = Storage::disk('supabase');

// Test 1: Try to write a file
echo "1. Testing write...\n";
$testPath = 'test-folder/test.txt';
$testContent = 'Hello Supabase!';

try {
    $result = $disk->put($testPath, $testContent);
    echo "✅ Write result: " . ($result ? 'true' : 'false') . "\n";
} catch (Exception $e) {
    echo "❌ Write failed: " . $e->getMessage() . "\n";
}

// Test 2: Check if file exists
echo "\n2. Testing fileExists...\n";
try {
    $exists = $disk->exists($testPath);
    echo ($exists ? "✅" : "❌") . " File exists: " . ($exists ? 'true' : 'false') . "\n";
} catch (Exception $e) {
    echo "❌ Exists check failed: " . $e->getMessage() . "\n";
}

// Test 3: Try to read it back
echo "\n3. Testing read...\n";
try {
    $content = $disk->get($testPath);
    echo "✅ Read content: " . $content . "\n";
} catch (Exception $e) {
    echo "❌ Read failed: " . $e->getMessage() . "\n";
}

// Test 4: Get URL
echo "\n4. Testing URL generation...\n";
try {
    $url = $disk->url($testPath);
    echo "✅ URL: " . $url . "\n";
} catch (Exception $e) {
    echo "❌ URL failed: " . $e->getMessage() . "\n";
}

// Test 5: Clean up
echo "\n5. Cleaning up...\n";
try {
    $disk->delete($testPath);
    echo "✅ Deleted test file\n";
} catch (Exception $e) {
    echo "❌ Delete failed: " . $e->getMessage() . "\n";
}

echo "\n=== Done ===\n";
