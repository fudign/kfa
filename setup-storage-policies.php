<?php

echo "=== Setting up Supabase Storage Policies ===\n\n";

$supabaseUrl = 'https://eofneihisbhucxcydvac.supabase.co';
$serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVvZm5laWhpc2JodWN4Y3lkdmFjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2Mjg3Mjk2OSwiZXhwIjoyMDc4NDQ4OTY5fQ.wQmUve9SryzkjL9J69WEF2cOaYDzIGb6ZbTpDjuHgHo';

// SQL policies to create
$policies = [
    // Policy 1: Public read access
    [
        'name' => 'Public read access for media bucket',
        'sql' => "
            CREATE POLICY IF NOT EXISTS \"Public Access\"
            ON storage.objects FOR SELECT
            TO public
            USING (bucket_id = 'media');
        "
    ],

    // Policy 2: Service role full access
    [
        'name' => 'Service role full access',
        'sql' => "
            CREATE POLICY IF NOT EXISTS \"Service Role Full Access\"
            ON storage.objects FOR ALL
            TO service_role
            USING (bucket_id = 'media');
        "
    ],

    // Policy 3: Authenticated upload
    [
        'name' => 'Authenticated users can upload',
        'sql' => "
            CREATE POLICY IF NOT EXISTS \"Authenticated Upload\"
            ON storage.objects FOR INSERT
            TO authenticated
            WITH CHECK (bucket_id = 'media');
        "
    ],

    // Policy 4: Authenticated update
    [
        'name' => 'Authenticated users can update',
        'sql' => "
            CREATE POLICY IF NOT EXISTS \"Authenticated Update\"
            ON storage.objects FOR UPDATE
            TO authenticated
            USING (bucket_id = 'media');
        "
    ],

    // Policy 5: Authenticated delete
    [
        'name' => 'Authenticated users can delete',
        'sql' => "
            CREATE POLICY IF NOT EXISTS \"Authenticated Delete\"
            ON storage.objects FOR DELETE
            TO authenticated
            USING (bucket_id = 'media');
        "
    ],
];

// Execute each policy via REST API
foreach ($policies as $index => $policy) {
    $num = $index + 1;
    echo "$num. Creating policy: {$policy['name']}...\n";

    $ch = curl_init("$supabaseUrl/rest/v1/rpc/exec_sql");
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        "Authorization: Bearer $serviceRoleKey",
        "apikey: $serviceRoleKey",
        'Content-Type: application/json',
        'Prefer: return=minimal'
    ]);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
        'query' => $policy['sql']
    ]));

    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($httpCode >= 200 && $httpCode < 300) {
        echo "   ✅ Success\n";
    } else {
        echo "   ⚠️  Response code: $httpCode\n";
        echo "   Response: $response\n";
    }
}

echo "\n=== Policies Setup Complete ===\n";
echo "\nNow testing file upload...\n\n";

// Test upload
require __DIR__ . '/kfa-backend/kfa-api/vendor/autoload.php';

$app = require_once __DIR__ . '/kfa-backend/kfa-api/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use Illuminate\Support\Facades\Storage;

$disk = Storage::disk('supabase');

echo "Testing upload to Supabase...\n";
$testPath = date('Y/m/d') . '/test-' . time() . '.txt';
$testContent = 'Test upload after policy setup';

try {
    $result = $disk->put($testPath, $testContent);
    echo "Upload result: " . ($result ? 'true' : 'false') . "\n";

    if ($result) {
        echo "✅ SUCCESS: File uploaded!\n";
        echo "Path: $testPath\n";
        echo "URL: " . $disk->url($testPath) . "\n";

        // Clean up
        $disk->delete($testPath);
        echo "Test file cleaned up.\n";
    } else {
        echo "❌ Upload still returns false\n";
        echo "This might be a permissions issue with the bucket itself.\n";
    }
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
}

echo "\n=== Done ===\n";
