<?php

require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

echo "Testing Laravel database connection to Supabase...\n\n";

try {
    $pdo = DB::connection()->getPdo();
    echo "✓ Laravel DB connection successful!\n\n";

    // Test query
    $result = DB::select('SELECT version()');
    echo "PostgreSQL Version: " . $result[0]->version . "\n\n";

    // Check tables
    $tables = DB::select("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name");

    echo "Existing tables in 'public' schema:\n";
    if (count($tables) > 0) {
        foreach ($tables as $table) {
            echo "  - " . $table->table_name . "\n";
        }
    } else {
        echo "  (no tables found - database is empty)\n";
    }

    echo "\n✓ Database is ready for migrations!\n";

} catch (Exception $e) {
    echo "✗ Connection failed: " . $e->getMessage() . "\n";
    echo "\nError details:\n";
    echo "  Code: " . $e->getCode() . "\n";
    if ($e->getPrevious()) {
        echo "  Previous: " . $e->getPrevious()->getMessage() . "\n";
    }
    exit(1);
}
