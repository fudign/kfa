<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class AddCMSPermissionsSeeder extends Seeder
{
    /**
     * Add missing CMS permissions for admin sidebar
     */
    public function run(): void
    {
        // Define missing CMS permissions
        $newPermissions = [
            // Content (News)
            ['name' => 'content.view', 'display_name' => 'Просмотр контента (новости)', 'category' => 'content', 'guard_name' => 'web'],

            // Events
            ['name' => 'events.view', 'display_name' => 'Просмотр событий', 'category' => 'events', 'guard_name' => 'web'],
            ['name' => 'events.create', 'display_name' => 'Создание событий', 'category' => 'events', 'guard_name' => 'web'],
            ['name' => 'events.update', 'display_name' => 'Редактирование событий', 'category' => 'events', 'guard_name' => 'web'],
            ['name' => 'events.delete', 'display_name' => 'Удаление событий', 'category' => 'events', 'guard_name' => 'web'],

            // Members
            ['name' => 'members.view', 'display_name' => 'Просмотр участников', 'category' => 'members', 'guard_name' => 'web'],
            ['name' => 'members.create', 'display_name' => 'Создание участников', 'category' => 'members', 'guard_name' => 'web'],
            ['name' => 'members.update', 'display_name' => 'Редактирование участников', 'category' => 'members', 'guard_name' => 'web'],
            ['name' => 'members.delete', 'display_name' => 'Удаление участников', 'category' => 'members', 'guard_name' => 'web'],

            // Partners
            ['name' => 'partners.view', 'display_name' => 'Просмотр партнеров', 'category' => 'partners', 'guard_name' => 'web'],
            ['name' => 'partners.create', 'display_name' => 'Создание партнеров', 'category' => 'partners', 'guard_name' => 'web'],
            ['name' => 'partners.update', 'display_name' => 'Редактирование партнеров', 'category' => 'partners', 'guard_name' => 'web'],
            ['name' => 'partners.delete', 'display_name' => 'Удаление партнеров', 'category' => 'partners', 'guard_name' => 'web'],
        ];

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
                $this->command->info("Added permission: {$permission['name']}");
            } else {
                $this->command->info("Permission already exists: {$permission['name']}");
            }
        }

        // Assign all CMS permissions to admin role
        $adminRole = DB::table('roles')->where('name', 'admin')->first();

        if ($adminRole) {
            $cmsPermissions = [
                'content.view', 'content.create', 'content.update', 'content.delete',
                'events.view', 'events.create', 'events.update', 'events.delete',
                'members.view', 'members.create', 'members.update', 'members.delete',
                'partners.view', 'partners.create', 'partners.update', 'partners.delete',
                'media.view', 'media.upload', 'media.delete',
                'settings.view', 'settings.update'
            ];

            foreach ($cmsPermissions as $permissionName) {
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
                        $this->command->info("Assigned {$permissionName} to admin role");
                    }
                }
            }
        }

        $this->command->info('CMS permissions added and assigned to admin successfully!');
    }
}
