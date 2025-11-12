<?php

// Test Supabase PostgreSQL Connection

$host = 'db.eofneihisbhucxcydvac.supabase.co';
$port = '5432';
$dbname = 'postgres';
$user = 'postgres';
$password = 'egD.SYGb.F5Hm3r';

echo "Testing PostgreSQL connection to Supabase...\n\n";

try {
    $dsn = "pgsql:host=$host;port=$port;dbname=$dbname";
    $pdo = new PDO($dsn, $user, $password, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]);

    echo "✓ Connection successful!\n\n";

    // Test query
    $stmt = $pdo->query("SELECT version()");
    $version = $stmt->fetchColumn();
    echo "PostgreSQL Version: $version\n\n";

    // Check existing tables
    $stmt = $pdo->query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name");
    $tables = $stmt->fetchAll(PDO::FETCH_COLUMN);

    echo "Existing tables in 'public' schema:\n";
    if (count($tables) > 0) {
        foreach ($tables as $table) {
            echo "  - $table\n";
        }
    } else {
        echo "  (no tables found - database is empty)\n";
    }

    echo "\n✓ Database connection test completed successfully!\n";

} catch (PDOException $e) {
    echo "✗ Connection failed: " . $e->getMessage() . "\n";
    exit(1);
}
