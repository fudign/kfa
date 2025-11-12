<?php
/**
 * Check admin user permissions in database
 */

require __DIR__ . '/kfa-backend/kfa-api/vendor/autoload.php';

$app = require_once __DIR__ . '/kfa-backend/kfa-api/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use Illuminate\Support\Facades\DB;

echo "\n╔═══════════════════════════════════════════════════╗\n";
echo "║       Checking Admin User Permissions            ║\n";
echo "╚═══════════════════════════════════════════════════╝\n\n";

try {
    // Check if admin user exists
    $admin = DB::table('users')->where('email', 'admin@kfa.kg')->first();

    if (!$admin) {
        echo "❌ Admin user not found!\n\n";
        echo "Available users:\n";
        $users = DB::table('users')->select('id', 'email', 'name')->get();
        foreach ($users as $user) {
            echo "  - {$user->email} (ID: {$user->id})\n";
        }
        exit(1);
    }

    echo "✅ Admin user found:\n";
    echo "   ID: {$admin->id}\n";
    echo "   Email: {$admin->email}\n";
    echo "   Name: {$admin->name}\n\n";

    // Check for roles table
    $tables = DB::select("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name");
    $tableNames = array_map(fn($t) => $t->name, $tables);

    echo "📊 Available tables:\n";
    foreach ($tableNames as $table) {
        echo "   - {$table}\n";
    }
    echo "\n";

    // Check if user has role field
    $userColumns = DB::select("PRAGMA table_info(users)");
    echo "📋 User table columns:\n";
    foreach ($userColumns as $col) {
        echo "   - {$col->name} ({$col->type})\n";
    }
    echo "\n";

    // Check if roles table exists
    if (in_array('roles', $tableNames)) {
        echo "✅ Roles table exists\n";
        $roles = DB::table('roles')->get();
        echo "   Available roles:\n";
        foreach ($roles as $role) {
            echo "   - {$role->name}\n";
        }
        echo "\n";

        // Check if user has a role
        if (property_exists($admin, 'role_id') && $admin->role_id) {
            $role = DB::table('roles')->where('id', $admin->role_id)->first();
            echo "   Admin role: {$role->name}\n\n";
        }
    }

    // Check if permissions table exists
    if (in_array('permissions', $tableNames)) {
        echo "✅ Permissions table exists\n";
        $permissions = DB::table('permissions')->get();
        echo "   Total permissions: " . count($permissions) . "\n\n";
    }

    // Check for role_user or user_roles pivot table
    if (in_array('role_user', $tableNames)) {
        echo "✅ role_user pivot table exists\n";
        $userRoles = DB::table('role_user')->where('user_id', $admin->id)->get();
        echo "   Admin has " . count($userRoles) . " role(s)\n\n";
    }

} catch (Exception $e) {
    echo "\n❌ Error: " . $e->getMessage() . "\n\n";
    exit(1);
}
