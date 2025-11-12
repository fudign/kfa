<?php

require __DIR__ . '/kfa-backend/kfa-api/vendor/autoload.php';

$app = require_once __DIR__ . '/kfa-backend/kfa-api/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use App\Models\User;

echo "=== Granting Media Permissions ===\n\n";

// Create permissions if they don't exist
$permissions = [
    'media.view',
    'media.upload',
    'media.delete',
];

echo "1. Creating media permissions...\n";
foreach ($permissions as $permissionName) {
    $permission = Permission::firstOrCreate(['name' => $permissionName]);
    echo "  ✅ {$permissionName}\n";
}

// Get admin role
echo "\n2. Getting admin role...\n";
$adminRole = Role::where('name', 'admin')->first();

if (!$adminRole) {
    echo "  ❌ Admin role not found! Creating it...\n";
    $adminRole = Role::create(['name' => 'admin']);
    echo "  ✅ Admin role created\n";
} else {
    echo "  ✅ Admin role found\n";
}

// Assign permissions to admin role
echo "\n3. Assigning media permissions to admin role...\n";
foreach ($permissions as $permissionName) {
    if (!$adminRole->hasPermissionTo($permissionName)) {
        $adminRole->givePermissionTo($permissionName);
        echo "  ✅ Granted {$permissionName} to admin\n";
    } else {
        echo "  ℹ️  Admin already has {$permissionName}\n";
    }
}

// Get user ID 1 (main admin)
echo "\n4. Checking user with ID 1...\n";
$user = User::find(1);

if (!$user) {
    echo "  ❌ User ID 1 not found!\n";
} else {
    echo "  ✅ User found: {$user->name} ({$user->email})\n";

    // Assign admin role if not assigned
    if (!$user->hasRole('admin')) {
        echo "  ℹ️  User doesn't have admin role, assigning...\n";
        $user->assignRole('admin');
        echo "  ✅ Admin role assigned\n";
    } else {
        echo "  ✅ User already has admin role\n";
    }

    // Direct permissions
    echo "\n5. Granting direct permissions to user...\n";
    foreach ($permissions as $permissionName) {
        if (!$user->hasPermissionTo($permissionName)) {
            $user->givePermissionTo($permissionName);
            echo "  ✅ Granted {$permissionName} directly to user\n";
        } else {
            echo "  ℹ️  User already has {$permissionName}\n";
        }
    }
}

// Show final permissions
echo "\n6. Final permissions check:\n";
if ($user) {
    echo "  Roles: " . implode(', ', $user->getRoleNames()->toArray()) . "\n";
    echo "  Permissions:\n";
    foreach ($user->getAllPermissions() as $perm) {
        echo "    - {$perm->name}\n";
    }
}

echo "\n=== Done ===\n";
echo "✅ Media permissions granted successfully!\n";
echo "User can now view, upload, and delete media files.\n";
