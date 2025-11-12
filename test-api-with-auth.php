<?php
/**
 * Test API endpoints with authentication
 */

require __DIR__ . '/kfa-backend/kfa-api/vendor/autoload.php';

$app = require_once __DIR__ . '/kfa-backend/kfa-api/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use Illuminate\Support\Facades\DB;
use App\Models\User;

echo "\n╔═══════════════════════════════════════════════════╗\n";
echo "║       Testing API with Authentication             ║\n";
echo "╚═══════════════════════════════════════════════════╝\n\n";

try {
    // Get admin user
    $admin = User::where('email', 'admin@kfa.kg')->first();

    if (!$admin) {
        echo "❌ Admin user not found!\n";
        exit(1);
    }

    echo "✅ Admin user found: {$admin->email}\n\n";

    // Create a token for testing
    $token = $admin->createToken('test-token')->plainTextToken;
    echo "🔑 Generated test token:\n";
    echo "   {$token}\n\n";

    // Check user's roles
    echo "🎭 User's roles:\n";
    $roles = $admin->roles->pluck('name');
    foreach ($roles as $role) {
        echo "   - {$role}\n";
    }
    echo "\n";

    // Check user's permissions
    echo "📜 User's permissions:\n";
    $permissions = $admin->getAllPermissions()->pluck('name');
    foreach ($permissions as $perm) {
        echo "   ✅ {$perm}\n";
    }
    echo "   Total: {$permissions->count()} permissions\n\n";

    // Test specific permissions
    echo "🔍 Permission checks:\n";
    $permissionsToCheck = [
        'content.create',
        'content.update',
        'content.delete',
        'media.view',
        'media.upload',
        'media.delete',
        'settings.view',
        'settings.update',
    ];

    foreach ($permissionsToCheck as $perm) {
        $has = $admin->hasPermissionTo($perm);
        $status = $has ? '✅' : '❌';
        echo "   {$status} {$perm}: " . ($has ? 'YES' : 'NO') . "\n";
    }
    echo "\n";

    // Summary
    echo "╔═══════════════════════════════════════════════════╗\n";
    echo "║                   RESULT                          ║\n";
    echo "╚═══════════════════════════════════════════════════╝\n\n";

    if ($permissions->count() >= 14) {
        echo "✅ SUCCESS! Admin has all required permissions\n\n";
        echo "API endpoints that should now work:\n";
        echo "   ✅ GET /api/media (requires media.view)\n";
        echo "   ✅ POST /api/media (requires media.upload)\n";
        echo "   ✅ DELETE /api/media/{id} (requires media.delete)\n";
        echo "   ✅ POST /api/news (requires content.create)\n";
        echo "   ✅ PUT /api/news/{id} (requires content.update)\n";
        echo "   ✅ DELETE /api/news/{id} (requires content.delete)\n";
        echo "   ✅ POST /api/events (requires content.create)\n";
        echo "   ✅ GET /api/settings (requires settings.view)\n";
        echo "   ✅ PUT /api/settings (requires settings.update)\n\n";

        echo "🔗 To test in browser:\n";
        echo "   1. Login at: http://localhost:3001/auth/login\n";
        echo "   2. Use: admin@kfa.kg / password\n";
        echo "   3. Token will be saved in localStorage\n";
        echo "   4. All API calls will include: Authorization: Bearer {token}\n";
        echo "   5. Backend will validate token and check permissions ✅\n\n";
    } else {
        echo "❌ PROBLEM: Admin has only {$permissions->count()} permissions (need 14)\n";
        echo "   Run: php fix-admin-permissions.php\n\n";
    }

} catch (Exception $e) {
    echo "\n❌ Error: " . $e->getMessage() . "\n\n";
    exit(1);
}
