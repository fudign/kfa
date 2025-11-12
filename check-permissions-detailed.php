<?php
/**
 * Detailed permissions check
 */

require __DIR__ . '/kfa-backend/kfa-api/vendor/autoload.php';

$app = require_once __DIR__ . '/kfa-backend/kfa-api/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use Illuminate\Support\Facades\DB;

echo "\n╔═══════════════════════════════════════════════════╗\n";
echo "║       Detailed Permissions Analysis               ║\n";
echo "╚═══════════════════════════════════════════════════╝\n\n";

try {
    $admin = DB::table('users')->where('email', 'admin@kfa.kg')->first();

    // Check user's role field
    echo "👤 Admin User:\n";
    echo "   Email: {$admin->email}\n";
    echo "   Role (column): " . ($admin->role ?? 'NULL') . "\n\n";

    // Check all available permissions
    echo "📜 All Available Permissions:\n";
    $permissions = DB::table('permissions')->select('id', 'name')->get();
    foreach ($permissions as $perm) {
        echo "   [{$perm->id}] {$perm->name}\n";
    }
    echo "   Total: " . count($permissions) . "\n\n";

    // Check model_has_roles (user's assigned roles via Spatie)
    echo "🎭 User's Assigned Roles (via model_has_roles):\n";
    $userRoles = DB::table('model_has_roles')
        ->where('model_type', 'App\\Models\\User')
        ->where('model_id', $admin->id)
        ->get();

    if ($userRoles->count() > 0) {
        foreach ($userRoles as $ur) {
            $role = DB::table('roles')->where('id', $ur->role_id)->first();
            echo "   ✅ {$role->name} (ID: {$role->id})\n";
        }
    } else {
        echo "   ❌ No roles assigned via Spatie!\n";
    }
    echo "\n";

    // Check model_has_permissions (user's direct permissions)
    echo "🔑 User's Direct Permissions (via model_has_permissions):\n";
    $userPerms = DB::table('model_has_permissions')
        ->where('model_type', 'App\\Models\\User')
        ->where('model_id', $admin->id)
        ->get();

    if ($userPerms->count() > 0) {
        foreach ($userPerms as $up) {
            $perm = DB::table('permissions')->where('id', $up->permission_id)->first();
            echo "   ✅ {$perm->name}\n";
        }
    } else {
        echo "   ⚠️  No direct permissions\n";
    }
    echo "\n";

    // Check role_has_permissions for each role
    echo "🎯 Permissions for Each Role:\n";
    $roles = DB::table('roles')->get();
    foreach ($roles as $role) {
        $rolePerms = DB::table('role_has_permissions')
            ->where('role_id', $role->id)
            ->get();

        echo "   [{$role->name}]: ";
        if ($rolePerms->count() > 0) {
            echo "{$rolePerms->count()} permissions\n";
            foreach ($rolePerms as $rp) {
                $perm = DB::table('permissions')->where('id', $rp->permission_id)->first();
                echo "      - {$perm->name}\n";
            }
        } else {
            echo "❌ No permissions\n";
        }
    }
    echo "\n";

    // Summary
    echo "╔═══════════════════════════════════════════════════╗\n";
    echo "║                   SUMMARY                         ║\n";
    echo "╚═══════════════════════════════════════════════════╝\n";

    if ($userRoles->count() === 0) {
        echo "❌ PROBLEM: Admin user has NO roles assigned!\n";
        echo "   Action needed: Assign 'admin' or 'super_admin' role\n\n";
    } else {
        echo "✅ User has roles assigned\n\n";
    }

} catch (Exception $e) {
    echo "\n❌ Error: " . $e->getMessage() . "\n\n";
    exit(1);
}
