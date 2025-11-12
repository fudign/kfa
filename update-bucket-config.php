<?php

echo "=== Updating Bucket Configuration ===\n\n";

$supabaseUrl = 'https://eofneihisbhucxcydvac.supabase.co';
$serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVvZm5laWhpc2JodWN4Y3lkdmFjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2Mjg3Mjk2OSwiZXhwIjoyMDc4NDQ4OTY5fQ.wQmUve9SryzkjL9J69WEF2cOaYDzIGb6ZbTpDjuHgHo';

// Get current bucket config
echo "1. Getting current bucket config...\n";
$ch = curl_init("$supabaseUrl/storage/v1/bucket/media");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Authorization: Bearer $serviceRoleKey",
    "apikey: $serviceRoleKey",
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

echo "Response code: $httpCode\n";
echo "Current config: $response\n\n";

// Update bucket to be fully public
echo "2. Updating bucket to be public...\n";
$ch = curl_init("$supabaseUrl/storage/v1/bucket/media");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'PUT');
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Authorization: Bearer $serviceRoleKey",
    "apikey: $serviceRoleKey",
    'Content-Type: application/json'
]);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    'id' => 'media',
    'public' => true,
    'file_size_limit' => 5242880, // 5MB
    'allowed_mime_types' => null, // Allow all
]));

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

echo "Response code: $httpCode\n";
echo "Response: $response\n\n";

if ($httpCode >= 200 && $httpCode < 300) {
    echo "✅ Bucket updated successfully!\n";
} else {
    echo "⚠️  Update may have failed\n";
}

echo "\n=== Testing Upload ===\n\n";

// Test upload
require __DIR__ . '/kfa-backend/kfa-api/vendor/autoload.php';

$app = require_once __DIR__ . '/kfa-backend/kfa-api/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use Illuminate\Support\Facades\Storage;

$disk = Storage::disk('supabase');
$testPath = date('Y/m/d') . '/test-' . time() . '.txt';
$testContent = 'Test after bucket update';

try {
    echo "Attempting upload to: $testPath\n";
    $result = $disk->put($testPath, $testContent);
    echo "Result: " . ($result ? 'true' : 'false') . "\n";

    if ($result) {
        echo "\n✅ SUCCESS! Upload works!\n";
        echo "URL: " . $disk->url($testPath) . "\n";

        // Verify file exists
        if ($disk->exists($testPath)) {
            echo "✅ File verified to exist\n";

            // Read it back
            $content = $disk->get($testPath);
            echo "✅ Content read back: $content\n";

            // Clean up
            $disk->delete($testPath);
            echo "✅ Test file cleaned up\n";
        }
    } else {
        echo "\n❌ Upload still returns false\n";

        // Let's try a more direct approach - check adapter error
        echo "\nTrying raw adapter write...\n";
        $adapter = $disk->getAdapter();

        try {
            $adapter->write($testPath, $testContent, new \League\Flysystem\Config());
            echo "✅ Raw adapter write succeeded!\n";

            // Now check if Laravel saved it
            echo "Checking if file exists...\n";
            if ($adapter->fileExists($testPath)) {
                echo "✅ File exists in Supabase!\n";
                $url = $adapter->getPublicUrl($testPath, []);
                echo "URL: $url\n";

                // Clean up
                $adapter->delete($testPath);
                echo "✅ Cleaned up\n";
            }
        } catch (Exception $e) {
            echo "❌ Raw write error: " . $e->getMessage() . "\n";
        }
    }
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
    echo "Stack trace:\n" . $e->getTraceAsString() . "\n";
}

echo "\n=== Done ===\n";
