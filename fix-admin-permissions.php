<?php
/**
 * Fix admin permissions by assigning all permissions to admin roles
 */

require __DIR__ . '/kfa-backend/kfa-api/vendor/autoload.php';

$app = require_once __DIR__ . '/kfa-backend/kfa-api/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use Illuminate\Support\Facades\DB;

echo "\n╔═══════════════════════════════════════════════════╗\n";
echo "║       Fixing Admin Permissions                    ║\n";
echo "╚═══════════════════════════════════════════════════╝\n\n";

try {
    // Get all permissions
    $permissions = DB::table('permissions')->select('id', 'name')->get();
    echo "📜 Found {$permissions->count()} permissions\n\n";

    // Get super_admin and admin roles
    $superAdminRole = DB::table('roles')->where('name', 'super_admin')->first();
    $adminRole = DB::table('roles')->where('name', 'admin')->first();

    if (!$superAdminRole || !$adminRole) {
        echo "❌ Roles not found!\n";
        exit(1);
    }

    echo "🎭 Assigning permissions to roles...\n\n";

    // Clear existing permissions first
    DB::table('role_has_permissions')->where('role_id', $superAdminRole->id)->delete();
    DB::table('role_has_permissions')->where('role_id', $adminRole->id)->delete();
    echo "   ✅ Cleared old permissions\n";

    // Assign ALL permissions to super_admin
    foreach ($permissions as $perm) {
        DB::table('role_has_permissions')->insert([
            'permission_id' => $perm->id,
            'role_id' => $superAdminRole->id,
        ]);
    }
    echo "   ✅ Assigned {$permissions->count()} permissions to super_admin\n";

    // Assign ALL permissions to admin (same as super_admin for now)
    foreach ($permissions as $perm) {
        DB::table('role_has_permissions')->insert([
            'permission_id' => $perm->id,
            'role_id' => $adminRole->id,
        ]);
    }
    echo "   ✅ Assigned {$permissions->count()} permissions to admin\n\n";

    // Verify
    $superAdminPerms = DB::table('role_has_permissions')
        ->where('role_id', $superAdminRole->id)
        ->count();
    $adminPerms = DB::table('role_has_permissions')
        ->where('role_id', $adminRole->id)
        ->count();

    echo "╔═══════════════════════════════════════════════════╗\n";
    echo "║                   VERIFICATION                    ║\n";
    echo "╚═══════════════════════════════════════════════════╝\n\n";

    echo "✅ super_admin role: {$superAdminPerms} permissions\n";
    echo "✅ admin role: {$adminPerms} permissions\n\n";

    // Show which permissions are now assigned
    echo "📋 Permissions assigned:\n";
    foreach ($permissions as $perm) {
        echo "   ✅ {$perm->name}\n";
    }

    echo "\n╔═══════════════════════════════════════════════════╗\n";
    echo "║                   SUCCESS ✅                      ║\n";
    echo "╚═══════════════════════════════════════════════════╝\n\n";

    echo "✅ Admin user (admin@kfa.kg) now has FULL access to:\n";
    echo "   - Content management (news, events, programs)\n";
    echo "   - Media management (view, upload, delete)\n";
    echo "   - Settings (view, update)\n";
    echo "   - Members management\n";
    echo "   - Partners management\n\n";

    echo "🔗 Test it now:\n";
    echo "   1. Go to: http://localhost:3001/auth/login\n";
    echo "   2. Login: admin@kfa.kg / password\n";
    echo "   3. Try: Dashboard → Управление контентом → Новости\n";
    echo "   4. Try: Dashboard → Управление контентом → События\n";
    echo "   5. Try: Dashboard → Управление контентом → Медиафайлы\n";
    echo "   6. Try: Dashboard → Управление контентом → Настройки\n\n";

} catch (Exception $e) {
    echo "\n❌ Error: " . $e->getMessage() . "\n\n";
    exit(1);
}
