<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RolesAndPermissionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Define permissions (matching routes/api.php middleware names)
        // Using 'web' guard - Sanctum uses 'web' guard by default (see config/sanctum.php)
        $permissions = [
            // Content permissions (used in routes as content.create, content.update, content.delete)
            ['name' => 'content.create', 'display_name' => 'Создание контента', 'category' => 'content', 'guard_name' => 'web'],
            ['name' => 'content.update', 'display_name' => 'Редактирование контента', 'category' => 'content', 'guard_name' => 'web'],
            ['name' => 'content.delete', 'display_name' => 'Удаление контента', 'category' => 'content', 'guard_name' => 'web'],

            // Members permissions (used in routes as members.create, members.update, members.delete)
            ['name' => 'members.create', 'display_name' => 'Создание членов', 'category' => 'members', 'guard_name' => 'web'],
            ['name' => 'members.update', 'display_name' => 'Редактирование членов', 'category' => 'members', 'guard_name' => 'web'],
            ['name' => 'members.delete', 'display_name' => 'Удаление членов', 'category' => 'members', 'guard_name' => 'web'],

            // Partners permissions (used in routes as partners.create, partners.update, partners.delete)
            ['name' => 'partners.create', 'display_name' => 'Создание партнеров', 'category' => 'partners', 'guard_name' => 'web'],
            ['name' => 'partners.update', 'display_name' => 'Редактирование партнеров', 'category' => 'partners', 'guard_name' => 'web'],
            ['name' => 'partners.delete', 'display_name' => 'Удаление партнеров', 'category' => 'partners', 'guard_name' => 'web'],

            // Media permissions (used in routes as media.view, media.upload, media.delete)
            ['name' => 'media.view', 'display_name' => 'Просмотр медиа', 'category' => 'media', 'guard_name' => 'web'],
            ['name' => 'media.upload', 'display_name' => 'Загрузка медиа', 'category' => 'media', 'guard_name' => 'web'],
            ['name' => 'media.delete', 'display_name' => 'Удаление медиа', 'category' => 'media', 'guard_name' => 'web'],

            // Settings permissions (used in routes as settings.view, settings.update)
            ['name' => 'settings.view', 'display_name' => 'Просмотр настроек', 'category' => 'settings', 'guard_name' => 'web'],
            ['name' => 'settings.update', 'display_name' => 'Изменение настроек', 'category' => 'settings', 'guard_name' => 'web'],
        ];

        // Insert permissions
        foreach ($permissions as $permission) {
            DB::table('permissions')->insert(array_merge($permission, [
                'created_at' => now(),
                'updated_at' => now(),
            ]));
        }

        // Define roles (using 'web' guard - Sanctum uses 'web' guard by default)
        $roles = [
            [
                'name' => 'guest',
                'display_name' => 'Гость',
                'description' => 'Неавторизованный пользователь',
                'guard_name' => 'web'
            ],
            [
                'name' => 'member',
                'display_name' => 'Член КФА',
                'description' => 'Член Кыргызского Финансового Альянса',
                'guard_name' => 'web'
            ],
            [
                'name' => 'editor',
                'display_name' => 'Редактор',
                'description' => 'Редактор контента',
                'guard_name' => 'web'
            ],
            [
                'name' => 'moderator',
                'display_name' => 'Модератор',
                'description' => 'Модератор сайта',
                'guard_name' => 'web'
            ],
            [
                'name' => 'admin',
                'display_name' => 'Администратор',
                'description' => 'Администратор сайта',
                'guard_name' => 'web'
            ],
            [
                'name' => 'super_admin',
                'display_name' => 'Суперадминистратор',
                'description' => 'Суперадминистратор с полным доступом',
                'guard_name' => 'web'
            ],
        ];

        // Insert roles
        foreach ($roles as $role) {
            DB::table('roles')->insert(array_merge($role, [
                'created_at' => now(),
                'updated_at' => now(),
            ]));
        }

        // Assign permissions to roles
        $rolePermissions = [
            'member' => [
                'content.create', 'content.update', 'content.delete'
            ],
            'editor' => [
                'content.create', 'content.update', 'content.delete',
                'media.view', 'media.upload'
            ],
            'moderator' => [
                'content.create', 'content.update', 'content.delete',
                'members.create', 'members.update',
                'partners.create', 'partners.update',
                'media.view', 'media.upload', 'media.delete'
            ],
            'admin' => [
                'content.create', 'content.update', 'content.delete',
                'members.create', 'members.update', 'members.delete',
                'partners.create', 'partners.update', 'partners.delete',
                'media.view', 'media.upload', 'media.delete',
                'settings.view', 'settings.update'
            ],
            'super_admin' => array_column($permissions, 'name'), // All permissions
        ];

        foreach ($rolePermissions as $roleName => $permissionNames) {
            $role = DB::table('roles')->where('name', $roleName)->first();
            if ($role) {
                foreach ($permissionNames as $permissionName) {
                    $permission = DB::table('permissions')->where('name', $permissionName)->first();
                    if ($permission) {
                        DB::table('role_has_permissions')->insert([
                            'role_id' => $role->id,
                            'permission_id' => $permission->id,
                        ]);
                    }
                }
            }
        }

        $this->command->info('Roles and permissions seeded successfully!');
    }
}
