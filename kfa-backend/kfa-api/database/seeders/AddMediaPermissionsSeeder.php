<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class AddMediaPermissionsSeeder extends Seeder
{
    /**
     * Add missing media and settings permissions
     */
    public function run(): void
    {
        // Define missing permissions
        $newPermissions = [
            // Media permissions
            ['name' => 'media.view', 'display_name' => 'Просмотр медиафайлов', 'category' => 'media', 'guard_name' => 'web'],
            ['name' => 'media.upload', 'display_name' => 'Загрузка медиафайлов', 'category' => 'media', 'guard_name' => 'web'],
            ['name' => 'media.delete', 'display_name' => 'Удаление медиафайлов', 'category' => 'media', 'guard_name' => 'web'],

            // Settings permissions
            ['name' => 'settings.view', 'display_name' => 'Просмотр настроек', 'category' => 'settings', 'guard_name' => 'web'],
            ['name' => 'settings.update', 'display_name' => 'Редактирование настроек', 'category' => 'settings', 'guard_name' => 'web'],
        ];

        $this->command->info('🔧 Adding missing permissions...');

        // Insert permissions if they don't exist
        foreach ($newPermissions as $permission) {
            $existing = DB::table('permissions')
                ->where('name', $permission['name'])
                ->where('guard_name', $permission['guard_name'])
                ->exists();

            if (!$existing) {
                DB::table('permissions')->insert(array_merge($permission, [
                    'created_at' => now(),
                    'updated_at' => now(),
                ]));
                $this->command->info("✅ Added permission: {$permission['name']}");
            } else {
                $this->command->info("ℹ️  Permission already exists: {$permission['name']}");
            }
        }

        // Assign all media and settings permissions to admin role
        $adminRole = DB::table('roles')->where('name', 'admin')->first();

        if ($adminRole) {
            $this->command->info('🔧 Assigning permissions to admin role...');

            $permissionsToAssign = [
                'media.view', 'media.upload', 'media.delete',
                'settings.view', 'settings.update'
            ];

            foreach ($permissionsToAssign as $permissionName) {
                $permission = DB::table('permissions')
                    ->where('name', $permissionName)
                    ->where('guard_name', 'web')
                    ->first();

                if ($permission) {
                    // Check if role already has this permission
                    $exists = DB::table('role_has_permissions')
                        ->where('role_id', $adminRole->id)
                        ->where('permission_id', $permission->id)
                        ->exists();

                    if (!$exists) {
                        DB::table('role_has_permissions')->insert([
                            'role_id' => $adminRole->id,
                            'permission_id' => $permission->id,
                        ]);
                        $this->command->info("✅ Assigned {$permissionName} to admin role");
                    } else {
                        $this->command->info("ℹ️  Admin already has: {$permissionName}");
                    }
                } else {
                    $this->command->warn("⚠️  Permission not found: {$permissionName}");
                }
            }
        } else {
            $this->command->error('❌ Admin role not found!');
        }

        $this->command->info('✅ Media permissions added and assigned successfully!');
        $this->command->info('');
        $this->command->info('🔄 ВАЖНО: Перелогиньтесь для обновления токена!');
        $this->command->info('   Откройте: http://localhost:3000/auth/force-logout');
    }
}
